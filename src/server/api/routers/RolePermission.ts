import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { activityLogger, createTRPCRouter, publicProcedure, requirePermission } from '~/server/api/trpc';
import {
  createManyPermissionService,
  deletePermissionService,
  findPermissionService,
  getAllPermissionService,
  getOnePermissionService,
  updateUserPermissionsService,
  upsertPermissionService
} from '~/server/services/permission.service';
import {
  createManyRoleService,
  deleteRoleService,
  findRoleService,
  getAllRoleService,
  getOneRoleService,
  upsertRoleService
} from '~/server/services/role.service';
import { basePermissionSchema } from '~/shared/schema/permission.schema';
import { baseRoleSchema } from '~/shared/schema/role.schema';

export const rolePermissionRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(5),
        s: z.string().optional(),
        include: z.custom<Prisma.RoleInclude>().optional()
      })
    )
    .query(async ({ ctx, input }) => await findRoleService(ctx.db, input)),

  getAllRole: publicProcedure
    .input(
      z
        .object({
          include: z.custom<Prisma.RoleInclude>().optional()
        })
        .optional()
    )
    .query(async ({ ctx, input }) => await getAllRoleService(ctx.db, input)),
  getOne: publicProcedure
    .input(z.object({ id: z.string(), include: z.custom<Prisma.RoleInclude>().optional() }))
    .query(async ({ ctx, input }) => await getOneRoleService(ctx.db, input)),
  getOnePermission: publicProcedure
    .input(z.object({ id: z.string(), include: z.custom<Prisma.PermissionInclude>().optional() }))
    .query(async ({ ctx, input }) => await getOnePermissionService(ctx.db, input)),
  upsertRole: publicProcedure
    .use(requirePermission(undefined, { requiredAdmin: true }))
    .use(activityLogger)
    .input(baseRoleSchema)
    .mutation(async ({ ctx, input }) => await upsertRoleService(ctx.db, input)),
  createManyRole: publicProcedure
    .use(requirePermission(undefined, { requiredAdmin: true }))
    .use(activityLogger)
    .input(
      z.object({
        data: z.array(baseRoleSchema)
      })
    )
    .mutation(async ({ ctx, input }) => await createManyRoleService(ctx.db, input)),
  deleteRole: publicProcedure
    .use(requirePermission(undefined, { requiredAdmin: true }))
    .use(activityLogger)
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => await deleteRoleService(ctx.db, input)),

  findPermission: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(5),
        s: z.string().optional(),
        include: z.custom<Prisma.PermissionInclude>().optional()
      })
    )
    .query(async ({ ctx, input }) => await findPermissionService(ctx.db, input)),
  createManyPermission: publicProcedure
    .use(requirePermission(undefined, { requiredAdmin: true }))
    .use(activityLogger)
    .input(
      z.object({
        data: z.array(basePermissionSchema)
      })
    )
    .mutation(async ({ ctx, input }) => await createManyPermissionService(ctx.db, input)),

  upsertPermission: publicProcedure
    .use(requirePermission(undefined, { requiredAdmin: true }))
    .use(activityLogger)
    .input(basePermissionSchema)
    .mutation(async ({ ctx, input }) => await upsertPermissionService(ctx.db, input)),
  deletePermission: publicProcedure
    .use(requirePermission(undefined, { requiredAdmin: true }))
    .use(activityLogger)
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => await deletePermissionService(ctx.db, input)),
  getAllPermission: publicProcedure
    .input(
      z
        .object({
          include: z.custom<Prisma.PermissionInclude>().optional()
        })
        .optional()
    )
    .query(async ({ ctx, input }) => await getAllPermissionService(ctx.db, input)),
  updateUserPermissions: publicProcedure
    .use(requirePermission(undefined, { requiredAdmin: true }))
    .use(activityLogger)
    .input(z.array(z.object({ userId: z.string(), permissionId: z.string(), granted: z.boolean() })))
    .mutation(async ({ ctx, input }) => await updateUserPermissionsService(ctx.db, input))
});
