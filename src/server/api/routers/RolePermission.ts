import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const rolePermissionRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        query: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { skip, take, query } = input;

      const startPageItem = skip > 0 ? (skip - 1) * take : 0;

      const [totalRoles, totalRolesQuery, roles] = await ctx.db.$transaction([
        ctx.db.role.count(),
        ctx.db.role.count({
          where: {
            name: { contains: query?.trim(), mode: 'insensitive' }
          }
        }),
        ctx.db.role.findMany({
          skip: startPageItem,
          take,
          where: {
            name: { contains: query?.trim(), mode: 'insensitive' }
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
        query?.trim() ? (totalRolesQuery === 0 ? 1 : totalRolesQuery / take) : totalRoles / take
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

  getRoles: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.role.findMany({
      include: { permissions: true }
    });
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

  deleteRole: publicProcedure.input(z.object({ roleId: z.string() })).mutation(async ({ ctx, input }) => {
    return await ctx.db.role.delete({
      where: { id: input.roleId }
    });
  }),

  findPermission: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        query: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { skip, take, query } = input;

      const startPageItem = skip > 0 ? (skip - 1) * take : 0;

      const [totalPermissions, totalPermissionsQuery, permissions] = await ctx.db.$transaction([
        ctx.db.permission.count(),
        ctx.db.permission.count({
          where: {
            name: { contains: query?.trim(), mode: 'insensitive' }
          }
        }),
        ctx.db.permission.findMany({
          skip: startPageItem,
          take,
          where: {
            name: { contains: query?.trim(), mode: 'insensitive' }
          },
          include: {
            roles: true
          }
        })
      ]);

      const totalPages = Math.ceil(
        query?.trim() ? (totalPermissionsQuery === 0 ? 1 : totalPermissionsQuery / take) : totalPermissions / take
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
  })
});
