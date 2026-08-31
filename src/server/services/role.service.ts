import { Prisma, PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { UserRole } from '~/shared/constants/user.constants';
import { RoleInput } from '~/shared/schema/role.schema';

export const findRoleService = async (
  db: PrismaClient,
  input: { page: number; limit: number; s?: string; include?: Prisma.RoleInclude }
) => {
  const { page, limit, s, include } = input;
  const searchQuery = s?.trim();

  const where: Prisma.RoleWhereInput = {
    OR: [
      { name: { contains: searchQuery, mode: 'insensitive' } },
      { id: { contains: searchQuery, mode: 'insensitive' } },
      { viName: { contains: searchQuery, mode: 'insensitive' } },
      {
        permissions: {
          some: {
            OR: [
              { id: { contains: searchQuery, mode: 'insensitive' } },
              { name: { contains: searchQuery, mode: 'insensitive' } },
              { viName: { contains: searchQuery, mode: 'insensitive' } },
              { description: { contains: searchQuery, mode: 'insensitive' } }
            ]
          }
        }
      }
    ]
  };
  const [totalRoles, totalRolesQuery, roles] = await db.$transaction([
    db.role.count(),
    db.role.count({
      where
    }),
    db.role.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where,
      orderBy: {
        createdAt: 'desc'
      },
      include: { ...(include ?? {}), permissions: true }
    })
  ]);

  const totalPages = Math.ceil(
    searchQuery ? (totalRolesQuery === 0 ? 1 : totalRolesQuery / limit) : totalRoles / limit
  );

  return {
    roles,
    pagination: {
      hasNext: Boolean(totalPages > page),
      totalPages
    }
  };
};
export const getAllRoleService = async (db: PrismaClient) => {
  let roles = await db.role.findMany({
    include: {
      permissions: true,
      users: {
        include: {
          role: true
        }
      }
    }
  });
  return roles;
};

export const getOneRoleService = async (db: PrismaClient, input: { id: string; include?: Prisma.RoleInclude }) => {
  try {
    return await db.role.findUnique({
      where: { id: input.id },
      include: { ...(input.include ?? {}), permissions: true }
    });
  } catch {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Không tìm thấy vai trò.'
    });
  }
};

export const createManyRoleService = async (db: PrismaClient, input: { data: RoleInput[] }) => {
  const existing = await db.role.findMany({
    where: {
      name: { in: input.data.map(item => item.name) }
    }
  });

  const existedMap = new Map(existing.map(item => [item.name, item]));
  const newData = input.data.filter(item => !existedMap.has(item.name));

  if (newData.length === 0) {
    throw new TRPCError({ code: 'CONFLICT', message: 'Tất cả vai trò đều đã tồn tại.' });
  }
  return await Promise.all(
    newData.map(async item => {
      const role = await db.role.create({
        data: {
          name: item.name,
          viName: item.viName,
          permissions: {
            connect: item.permissionPayload.map(({ id }) => ({ id }))
          }
        }
      });
      return role;
    })
  );
};

export const upsertRoleService = async (db: PrismaClient, input: RoleInput) => {
  const { id, permissionPayload, ...data } = input;
  try {
    const isDeletedAll = permissionPayload.length === 0;
    const isSetDefault = input.default;
    if (isSetDefault && input.name === UserRole.ADMIN) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Không thể thiết lập mặc định cho trường Admin.'
      });
    }
    const result = await db.$transaction(async tx => {
      const oldData = id ? await tx.role.findUnique({ where: { id } }) : null;

      const connectIds = [];
      const disconnectIds = [];

      if (!isDeletedAll) {
        for (const { type, id } of permissionPayload) {
          if (type === 'added') connectIds.push({ id });
          else if (type === 'deleted') disconnectIds.push({ id });
        }
      }

      if (isSetDefault && !oldData?.default) {
        await tx.role.updateMany({
          data: {
            default: false
          }
        });
      }

      const newData = await tx.role.upsert({
        where: { id: input.id || '' },
        create: {
          ...data,
          permissions: { connect: connectIds }
        },
        update: {
          ...data,
          permissions: isDeletedAll
            ? { set: [] }
            : {
                connect: connectIds,
                disconnect: disconnectIds
              }
        }
      });

      return { oldData, newData };
    });
    return {
      metaData: {
        before: result.oldData ?? {},
        after: result.newData ?? {}
      }
    };
  } catch {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'Vai trò đã tồn tại rồi. Không cần thêm nữa đâu.'
    });
  }
};

export const deleteRoleService = async (db: PrismaClient, input: { id: string }) => {
  const deleted = await db.role.delete({
    where: { id: input.id }
  });
  return {
    metaData: {
      before: deleted ?? {},
      after: {}
    }
  };
};
