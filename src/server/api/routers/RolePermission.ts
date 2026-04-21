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
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        s: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => await findRoleService(ctx.db, input)),

  getAllRole: publicProcedure.query(async ({ ctx }) => await getAllRoleService(ctx.db)),
  getOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => await getOneRoleService(ctx.db, input)),
  getOnePermission: publicProcedure
    .input(z.object({ id: z.string() }))
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
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        s: z.string().optional()
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
  getAllPermission: publicProcedure.query(async ({ ctx }) => await getAllPermissionService(ctx.db)),
  //user permision
  updateUserPermissions: publicProcedure
    .use(requirePermission(undefined, { requiredAdmin: true }))
    .use(activityLogger)
    .input(z.array(z.object({ userId: z.string(), permissionId: z.string(), granted: z.boolean() })))
    .mutation(async ({ ctx, input }) => await updateUserPermissionsService(ctx.db, input))
});
