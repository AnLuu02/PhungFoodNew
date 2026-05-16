import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { activityLogger, createTRPCRouter, publicProcedure, requirePermission } from '~/server/api/trpc';
import {
  createManyMaterialService,
  deleteMaterialService,
  findMaterialService,
  getAllMaterialService,
  getOneMaterialService,
  upsertMaterialService
} from '~/server/services/material.service';
import { baseMaterialSchema } from '~/shared/schema/material.schema';

export const materialRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        s: z.string().optional(),
        include: z.custom<Prisma.MaterialInclude>().optional()
      })
    )
    .query(async ({ ctx, input }) => await findMaterialService(ctx.db, input)),
  createMany: publicProcedure
    .input(
      z.object({
        data: z.array(baseMaterialSchema)
      })
    )
    .mutation(async ({ ctx, input }) => await createManyMaterialService(ctx.db, input)),

  delete: publicProcedure
    .use(requirePermission('delete:material'))
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => await deleteMaterialService(ctx.db, input)),

  getOne: publicProcedure
    .input(
      z.object({
        key: z.string(),
        include: z.custom<Prisma.MaterialInclude>().optional()
      })
    )
    .query(async ({ ctx, input }) => await getOneMaterialService(ctx.db, input)),
  getAll: publicProcedure
    .input(
      z
        .object({
          include: z.custom<Prisma.MaterialInclude>().optional()
        })
        .optional()
    )
    .query(async ({ ctx, input }) => await getAllMaterialService(ctx.db, input)),
  upsert: publicProcedure
    .use(requirePermission('update:material'))
    .use(requirePermission('create:material'))
    .use(activityLogger)
    .input(baseMaterialSchema)
    .mutation(async ({ ctx, input }) => await upsertMaterialService(ctx.db, input))
});
