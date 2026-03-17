import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { RoleInput } from '~/shared/schema/role.schema';

export const findRoleService = async (db: PrismaClient, input: { skip: number; take: number; s?: string }) => {
  const { skip, take, s } = input;

  const startPageItem = skip > 0 ? (skip - 1) * take : 0;

  const [totalRoles, totalRolesQuery, roles] = await db.$transaction([
    db.role.count(),
    db.role.count({
      where: {
        OR: [
          { name: { contains: s?.trim(), mode: 'insensitive' } },
          { id: { contains: s?.trim(), mode: 'insensitive' } },
          { viName: { contains: s?.trim(), mode: 'insensitive' } },
          {
            permissions: {
              some: {
                OR: [
                  { id: { contains: s?.trim(), mode: 'insensitive' } },
                  { name: { contains: s?.trim(), mode: 'insensitive' } },
                  { viName: { contains: s?.trim(), mode: 'insensitive' } },
                  { description: { contains: s?.trim(), mode: 'insensitive' } }
                ]
              }
            }
          }
        ]
      }
    }),
    db.role.findMany({
      skip: startPageItem,
      take,
      where: {
        OR: [
          { name: { contains: s?.trim(), mode: 'insensitive' } },
          { id: { contains: s?.trim(), mode: 'insensitive' } },
          { viName: { contains: s?.trim(), mode: 'insensitive' } },
          {
            permissions: {
              some: {
                OR: [
                  { id: { contains: s?.trim(), mode: 'insensitive' } },
                  { name: { contains: s?.trim(), mode: 'insensitive' } },
                  { viName: { contains: s?.trim(), mode: 'insensitive' } },
                  { description: { contains: s?.trim(), mode: 'insensitive' } }
                ]
              }
            }
          }
        ]
      },
      include: {
        permissions: true
      }
    })
  ]);

  const totalPages = Math.ceil(s?.trim() ? (totalRolesQuery === 0 ? 1 : totalRolesQuery / take) : totalRoles / take);
  const currentPage = skip ? Math.floor(skip / take + 1) : 1;

  return {
    roles,
    pagination: {
      currentPage,
      totalPages
    }
  };
};
export const getAllRoleService = async (db: PrismaClient) => {
  let roles = await db.role.findMany({
    include: {
      permissions: true,
      users: {
        include: { role: true }
      }
    }
  });
  return roles;
};
export const getOneRoleService = async (db: PrismaClient, input: { id: string }) => {
  try {
    return await db.role.findUnique({
      where: { id: input.id },
      include: { permissions: true }
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
    return await db.role.upsert({
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
  } catch {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'Vai trò đã tồn tại rồi. Không cần thêm nữa đâu.'
    });
  }
};
export const deleteRoleService = async (db: PrismaClient, input: any) => {
  const role = await db.role.delete({
    where: { id: input.id }
  });
  return role;
};
