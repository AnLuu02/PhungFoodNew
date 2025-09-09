import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { ResponseTRPC } from '~/types/ResponseFetcher';
type RoleWithPermissions = Prisma.RoleGetPayload<{
  include: { permissions: true };
}>;
export const rolePermissionRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        s: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { skip, take, s } = input;

      const startPageItem = skip > 0 ? (skip - 1) * take : 0;

      const [totalRoles, totalRolesQuery, roles] = await ctx.db.$transaction([
        ctx.db.role.count(),
        ctx.db.role.count({
          where: {
            name: { contains: s?.trim(), mode: 'insensitive' }
          }
        }),
        ctx.db.role.findMany({
          skip: startPageItem,
          take,
          where: {
            name: { contains: s?.trim(), mode: 'insensitive' }
          },
          include: {
            permissions: {
              select: {
                id: true,
                name: true
              }
            }
          }
        })
      ]);

      const totalPages = Math.ceil(
        s?.trim() ? (totalRolesQuery === 0 ? 1 : totalRolesQuery / take) : totalRoles / take
      );
      const currentPage = skip ? Math.floor(skip / take + 1) : 1;

      return {
        roles,
        pagination: {
          currentPage,
          totalPages
        }
      };
    }),

  getAllRole: publicProcedure.query(async ({ ctx }) => {
    let roles = await ctx.db.role.findMany({
      include: { permissions: true }
    });
    return roles satisfies RoleWithPermissions[];
  }),
  getOne: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    let role = await ctx.db.role.findUnique({
      where: { id: input.id },
      include: { permissions: true }
    });
    if (!role) {
      throw new Error('Role not found');
    }
    return role satisfies RoleWithPermissions;
  }),
  getOnePermission: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    return await ctx.db.permission.findUnique({
      where: { id: input.id },
      include: { roles: true }
    });
  }),
  createRole: publicProcedure
    .input(
      z.object({
        name: z.string(),
        permissionIds: z.array(z.string())
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      const role = await ctx.db.role.create({
        data: {
          name: input.name,
          permissions: {
            connect: input.permissionIds.map(id => ({ id }))
          }
        }
      });
      return {
        code: 'OK',
        message: 'Tạo vai trò thanh cong.',
        data: role
      };
    }),
  createManyRole: publicProcedure
    .input(
      z.object({
        data: z.array(
          z.object({
            name: z.string().min(1, 'Tên vai trò không được để trống'),
            permissionIds: z.array(z.string())
          })
        )
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      const existing = await ctx.db.role.findMany({
        where: {
          name: { in: input.data.map(item => item.name) }
        }
      });

      const existingSet = new Set(existing.map(item => item.name));
      const newData = input.data.filter(item => !existingSet.has(item.name));

      if (newData.length === 0) {
        return { code: 'CONFLICT', message: 'Tất cả vai trò đều đã tồn tại.', data: [] };
      }
      const permissions = await Promise.all(
        newData.map(async item => {
          const role = await ctx.db.role.create({
            data: {
              name: item.name,
              permissions: {
                connect: item.permissionIds.map(id => ({ id }))
              }
            }
          });
          return role;
        })
      );

      return {
        code: 'OK',
        message: `Đã thêm ${permissions.length} vai trò mới.`,
        data: newData
      };
    }),
  updateRole: publicProcedure
    .input(
      z.object({
        roleId: z.string(),
        name: z.string(),
        permissionIds: z.array(z.string())
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      const role = await ctx.db.role.update({
        where: { id: input.roleId },
        data: {
          name: input.name,
          permissions: {
            set: input.permissionIds.map(id => ({ id }))
          }
        }
      });
      if (!role) {
        throw new Error('Role not found');
      }
      return {
        code: 'OK',
        message: 'Cập nhật thành công.',
        data: role
      };
    }),

  deleteRole: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      const role = await ctx.db.role.delete({
        where: { id: input.id }
      });
      return {
        code: 'OK',
        message: 'Xóa vai trò thành công',
        data: role
      };
    }),

  findPermission: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        s: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { skip, take, s } = input;

      const startPageItem = skip > 0 ? (skip - 1) * take : 0;

      const [totalPermissions, totalPermissionsQuery, permissions] = await ctx.db.$transaction([
        ctx.db.permission.count(),
        ctx.db.permission.count({
          where: {
            OR: [
              { id: { contains: s?.trim(), mode: 'insensitive' } },
              { name: { contains: s?.trim(), mode: 'insensitive' } }
            ]
          }
        }),
        ctx.db.permission.findMany({
          skip: startPageItem,
          take,
          where: {
            OR: [
              { id: { contains: s?.trim(), mode: 'insensitive' } },
              { name: { contains: s?.trim(), mode: 'insensitive' } }
            ]
          },
          include: {
            roles: true
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
    }),

  getPermissions: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.permission.findMany();
  }),

  createPermission: publicProcedure
    .input(z.object({ name: z.string(), description: z.string().optional() }))
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      const permission = await ctx.db.permission.create({
        data: { name: input.name, description: input.description }
      });
      return {
        code: 'OK',
        message: 'Tạo quyen thanh cong.',
        data: permission
      };
    }),
  createManyPermission: publicProcedure
    .input(
      z.object({
        data: z.array(
          z.object({
            name: z.string().min(1, 'Tên vai trò không được để trống'),
            description: z.string().optional()
          })
        )
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      const existing = await ctx.db.permission.findMany({
        where: {
          name: { in: input.data.map(item => item.name) }
        }
      });

      const existingSet = new Set(existing.map(item => item.name));
      const newData = input.data.filter(item => !existingSet.has(item.name));

      if (newData.length === 0) {
        return { code: 'CONFLICT', message: 'Tất cả quyền đều đã tồn tại.', data: [] };
      }

      const permissions = await ctx.db.permission.createMany({
        data: newData
      });

      return {
        code: 'OK',
        message: `Đã thêm ${permissions.count} quyền mới.`,
        data: newData
      };
    }),

  updatePermission: publicProcedure
    .input(
      z.object({
        permissionId: z.string(),
        name: z.string(),
        description: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      const role = await ctx.db.permission.update({
        where: { id: input.permissionId },
        data: {
          name: input.name,
          description: input.description
        }
      });
      if (!role) {
        throw new Error('Role not found');
      }
      return {
        code: 'OK',
        message: 'Cập nhật thành công.',
        data: role
      };
    }),
  deletePermission: publicProcedure
    .input(z.object({ permisssionId: z.string() }))
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      const permission = await ctx.db.permission.delete({
        where: { id: input.permisssionId }
      });
      return {
        code: 'OK',
        message: 'Xóa quyen thanh cong.',
        data: permission
      };
    }),
  getAllPermission: publicProcedure.query(async ({ ctx }) => {
    let permissions = await ctx.db.permission.findMany({
      include: { roles: true }
    });
    return permissions;
  })
});
