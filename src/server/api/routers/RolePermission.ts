import { z } from 'zod';
import { seedPermissions, seedRoles } from '~/lib/data-test/seed';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

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
    if (!roles?.length) {
      await ctx.db.role.createMany({
        data: seedRoles
      });
      roles = await ctx.db.role.findMany({
        include: { permissions: true }
      });
    }
    return roles;
  }),
  getOne: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    return await ctx.db.role.findUnique({
      where: { id: input.id },
      include: { permissions: true }
    });
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
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.role.create({
        data: {
          name: input.name,
          permissions: {
            connect: input.permissionIds.map(id => ({ id }))
          }
        }
      });
    }),
  createManyRole: publicProcedure
    .input(
      z.object({
        data: z.array(
          z.object({
            name: z.string().min(1, 'Name is required'),
            permissionIds: z.array(z.string())
          })
        )
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.role.findMany({
        where: {
          name: { in: input.data.map(item => item.name) }
        }
      });

      const existingSet = new Set(existing.map(item => item.name));
      const newData = input.data.filter(item => !existingSet.has(item.name));

      if (newData.length === 0) {
        return { success: false, message: 'Tất cả vai trò đều đã tồn tại.' };
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
        success: true,
        message: `Đã thêm ${permissions.length} vai trò mới.`,
        record: newData
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
    .mutation(async ({ ctx, input }) => {
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
        success: true,
        message: 'Role updated successfully'
      };
    }),

  deleteRole: publicProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const role = await ctx.db.role.delete({
      where: { id: input.id }
    });
    return {
      success: true,
      message: 'Xóa vai trò thành công',
      record: role
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

  createPermission: publicProcedure.input(z.object({ name: z.string() })).mutation(async ({ ctx, input }) => {
    return await ctx.db.permission.create({
      data: { name: input.name }
    });
  }),
  createManyPermission: publicProcedure
    .input(
      z.object({
        data: z.array(
          z.object({
            name: z.string().min(1, 'Name is required')
          })
        )
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.permission.findMany({
        where: {
          name: { in: input.data.map(item => item.name) }
        }
      });

      const existingSet = new Set(existing.map(item => item.name));
      const newData = input.data.filter(item => !existingSet.has(item.name));

      if (newData.length === 0) {
        return { success: false, message: 'Tất cả quyền đều đã tồn tại.' };
      }

      const permissions = await ctx.db.permission.createMany({
        data: newData
      });

      return {
        success: true,
        message: `Đã thêm ${permissions.count} quyền mới.`,
        record: newData
      };
    }),

  updatePermission: publicProcedure
    .input(
      z.object({
        permissionId: z.string(),
        name: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const role = await ctx.db.permission.update({
        where: { id: input.permissionId },
        data: {
          name: input.name
        }
      });
      if (!role) {
        throw new Error('Role not found');
      }
      return {
        success: true,
        message: 'Role updated successfully'
      };
    }),
  deletePermission: publicProcedure.input(z.object({ permisssionId: z.string() })).mutation(async ({ ctx, input }) => {
    return await ctx.db.permission.delete({
      where: { id: input.permisssionId }
    });
  }),
  getAllPermission: publicProcedure.query(async ({ ctx }) => {
    let permissions = await ctx.db.permission.findMany({
      include: { roles: true }
    });
    if (!permissions?.length) {
      await ctx.db.permission.createMany({
        data: seedPermissions
      });
      permissions = await ctx.db.permission.findMany({
        include: { roles: true }
      });
    }
    return permissions;
  })
});
