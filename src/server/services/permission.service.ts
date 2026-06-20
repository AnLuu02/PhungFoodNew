import { Prisma, PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { PermissionInput } from '~/shared/schema/permission.schema';
export const getOnePermissionService = async (
  db: PrismaClient,
  input: { id: string; include?: Prisma.PermissionInclude }
) => {
  const { id, include } = input;
  return await db.permission.findUnique({
    where: { id },
    include: { ...(include ?? {}), roles: true }
  });
};

export const findPermissionService = async (
  db: PrismaClient,
  input: { page: number; limit: number; s?: string; include?: Prisma.PermissionInclude }
) => {
  const { page, limit, s } = input;
  const searchQuery = s?.trim();
  const where: Prisma.PermissionWhereInput = {
    OR: [
      { id: { contains: searchQuery, mode: 'insensitive' } },
      { name: { contains: searchQuery, mode: 'insensitive' } },
      { viName: { contains: searchQuery, mode: 'insensitive' } },
      { description: { contains: searchQuery, mode: 'insensitive' } }
    ]
  };
  const [totalPermissions, totalPermissionsQuery, permissions] = await db.$transaction([
    db.permission.count(),
    db.permission.count({
      where
    }),
    db.permission.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where,
      include: {
        ...(input?.include ?? {}),
        roles: {
          select: {
            id: true,
            name: true,
            viName: true
          }
        }
      }
    })
  ]);

  const totalPages = Math.ceil(
    searchQuery ? (totalPermissionsQuery === 0 ? 1 : totalPermissionsQuery / limit) : totalPermissions / limit
  );

  return {
    permissions,
    pagination: {
      hasNext: Boolean(totalPages > page),
      totalPages
    }
  };
};

export const createManyPermissionService = async (db: PrismaClient, input: { data: PermissionInput[] }) => {
  const existing = await db.permission.findMany({
    where: {
      name: { in: input.data.map(item => item.name) }
    }
  });

  const existingSet = new Set(existing.map(item => item.name));
  const newData = input.data.filter(item => !existingSet.has(item.name));

  if (newData.length === 0) {
    throw new TRPCError({ code: 'CONFLICT', message: 'Tất cả quyền đều đã tồn tại.' });
  }

  const permissions = await db.permission.createMany({
    data: newData
  });

  return newData;
};

export const upsertPermissionService = async (db: PrismaClient, input: PermissionInput) => {
  try {
    const { id, ...data } = input;
    const result = await db.$transaction(async tx => {
      const oldData = id ? await tx.permission.findUnique({ where: { id } }) : null;
      const newData = await tx.permission.upsert({
        where: { id: id || '' },
        create: data,
        update: data
      });
      return { oldData, newData };
    });

    return {
      metaData: {
        before: result.oldData ?? {},
        after: result.newData
      }
    };
  } catch {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'Quyền đã tồn tại. Không cần thêm nữa.'
    });
  }
};
export const deletePermissionService = async (db: PrismaClient, input: { id: string }) => {
  const deleted = await db.permission.delete({
    where: { id: input.id || '' }
  });
  return {
    metaData: {
      before: deleted ?? {},
      after: {}
    }
  };
};
export const getAllPermissionService = async (
  db: PrismaClient,
  input?: {
    include?: Prisma.PermissionInclude;
  }
) => {
  let permissions = await db.permission.findMany({
    include: {
      ...(input?.include ? input.include : {}),
      roles: true
    }
  });
  return permissions;
};
export const updateUserPermissionsService = async (
  db: PrismaClient,
  input: {
    userId: string;
    permissionId: string;
    granted: boolean;
  }[]
) => {
  const results = await db.$transaction(async tx => {
    const changes = [];

    for (const item of input) {
      const where = {
        userId_permissionId: { userId: item.userId, permissionId: item.permissionId }
      };
      const oldData = await tx.userPermission.findUnique({ where });
      const newData = await tx.userPermission.upsert({
        where,
        update: { granted: item.granted },
        create: { userId: item.userId, permissionId: item.permissionId, granted: item.granted }
      });

      changes.push({ oldData, newData });
    }

    return changes;
  });
  return results?.map(u => ({
    metaData: {
      before: u?.oldData ?? {},
      after: u?.newData ?? {}
    }
  }));
};
