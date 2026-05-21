import { Prisma, PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
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
export const getAllRoleService = async (db: PrismaClient, input?: { include?: Prisma.RoleInclude }) => {
  let roles = await db.role.findMany({
    include: {
      ...(input?.include ?? {}),
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

  const existingSet = new Set(existing.map(item => item.name));
  const newData = input.data.filter(item => !existingSet.has(item.name));

  if (newData.length === 0) {
    throw new TRPCError({ code: 'CONFLICT', message: 'Tất cả vai trò đều đã tồn tại.' });
  }
  const permissions = await Promise.all(
    newData.map(async item => {
      const role = await db.role.create({
        data: {
          name: item.name,
          viName: item.viName,
          permissions: {
            connect: item.permissionIds.map(id => ({ id }))
          }
        }
      });
      return role;
    })
  );

  return newData;
};

export const upsertRoleService = async (db: PrismaClient, input: RoleInput) => {
  const { id, permissionIds, ...data } = input;
  try {
    const result = await db.$transaction(async tx => {
      const oldData = id ? await tx.role.findUnique({ where: { id } }) : null;
      const newData = await db.role.upsert({
        where: { id: input.id || '' },
        create: {
          ...data,
          permissions: {
            connect: permissionIds.map(id => ({ id }))
          }
        },
        update: {
          ...data,
          permissions: {
            connect: permissionIds.map(id => ({ id })),
            disconnect: (
              await db.permission.findMany({
                where: {
                  roles: {
                    some: { id: input.id || '' }
                  },
                  id: {
                    notIn: permissionIds
                  }
                },
                select: { id: true }
              })
            ).map(p => ({ id: p.id }))
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
export const deleteRoleService = async (db: PrismaClient, input: any) => {
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
