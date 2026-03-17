import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { PermissionInput } from '~/shared/schema/permission.schema';
export const getOnePermissionService = async (db: PrismaClient, input: { id: string }) => {
  return await db.permission.findUnique({
    where: { id: input.id },
    include: { roles: true }
  });
};

export const findPermissionService = async (db: PrismaClient, input: { skip: number; take: number; s?: string }) => {
  const { skip, take, s } = input;

  const startPageItem = skip > 0 ? (skip - 1) * take : 0;

  const [totalPermissions, totalPermissionsQuery, permissions] = await db.$transaction([
    db.permission.count(),
    db.permission.count({
      where: {
        OR: [
          { id: { contains: s?.trim(), mode: 'insensitive' } },
          { name: { contains: s?.trim(), mode: 'insensitive' } },
          { viName: { contains: s?.trim(), mode: 'insensitive' } },
          { description: { contains: s?.trim(), mode: 'insensitive' } }
        ]
      }
    }),
    db.permission.findMany({
      skip: startPageItem,
      take,
      where: {
        OR: [
          { id: { contains: s?.trim(), mode: 'insensitive' } },
          { name: { contains: s?.trim(), mode: 'insensitive' } },
          { viName: { contains: s?.trim(), mode: 'insensitive' } },
          { description: { contains: s?.trim(), mode: 'insensitive' } }
        ]
      },
      include: {
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
    s?.trim() ? (totalPermissionsQuery === 0 ? 1 : totalPermissionsQuery / take) : totalPermissions / take
  );
  const currentPage = skip ? Math.floor(skip / take + 1) : 1;

  return {
    permissions,
    pagination: {
      currentPage,
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
    const role = await db.permission.upsert({
      where: { id: id || '' },
      create: data,
      update: data
    });

    return role;
  } catch {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'Quyền đã tồn tại. Không cần thêm nữa.'
    });
  }
};
export const deletePermissionService = async (db: PrismaClient, input: any) => {
  const permission = await db.permission.delete({
    where: { id: input.id || '' }
  });
  return permission;
};
export const getAllPermissionService = async (db: PrismaClient) => {
  let permissions = await db.permission.findMany({
    include: { roles: true }
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
  const userPermissions = await db.$transaction(
    input.map(item =>
      db.userPermission.upsert({
        where: { userId_permissionId: { userId: item.userId, permissionId: item.permissionId } },
        update: { granted: item.granted },
        create: { userId: item.userId, permissionId: item.permissionId, granted: item.granted }
      })
    )
  );

  return userPermissions;
};
