import { Prisma } from '@prisma/client';
import { z } from 'zod';
import {
  activityLogger,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  requirePermission
} from '~/server/api/trpc';
import { basePermissionSchema } from '~/shared/schema/permission.schema';
import { baseRoleSchema } from '~/shared/schema/role.schema';
import {
  createManyPermissionService,
  deletePermissionService,
  findPermissionService,
  getAllPermissionService,
  getOnePermissionService,
  updateUserPermissionsService,
  upsertPermissionService
} from './permission.service';
import {
  createManyRoleService,
  deleteRoleService,
  findRoleService,
  getAllRoleService,
  getOneRoleService,
  upsertRoleService
} from './role.service';

const adminRoleRouter = createTRPCRouter({
  getRoleSummary: protectedProcedure.query(async ({ ctx }) => {
    const [total, byRole] = await ctx.db.$transaction([
      ctx.db.role.count(),
      ctx.db.role.groupBy({
        by: ['name'],
        orderBy: { name: 'asc' },
        _count: { _all: true }
      })
    ]);
    return {
      total,
      byRole: byRole.map(b => ({
        role: b.name,
        count: b._count && typeof b._count === 'object' ? (b._count?._all ?? 0) : 0
      }))
    };
  })
});

export const rolePermissionRouter = createTRPCRouter({
  admin: adminRoleRouter,

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

  getAllRole: publicProcedure.query(async ({ ctx }) => await getAllRoleService(ctx.db)),
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
