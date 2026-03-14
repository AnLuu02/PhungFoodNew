import { z } from 'zod';
import { createTRPCRouter, publicProcedure, requirePermission } from '~/server/api/trpc';
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
        s: z.string().optional()
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
        s: z.string()
      })
    )
    .query(async ({ ctx, input }) => await getOneMaterialService(ctx.db, input)),
  getAll: publicProcedure.query(async ({ ctx }) => await getAllMaterialService(ctx.db)),
  upsert: publicProcedure
    .use(requirePermission('update:material'))
    .use(requirePermission('create:material'))
    .input(baseMaterialSchema)
    .mutation(async ({ ctx, input }) => await upsertMaterialService(ctx.db, input))
});
