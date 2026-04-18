import { TokenType } from '@prisma/client';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure, requirePermission } from '~/server/api/trpc';
import {
  createUserService,
  deleteUserService,
  findUserService,
  getFilterUserService,
  getNotGuestService,
  getOneUserService,
  getSellerService,
  resetPasswordService,
  updateUserCustomService,
  upsertUserService,
  verifyEmailService,
  verifyOtpService
} from '~/server/services/user.service';
import { userInputSchema } from '~/shared/schema/user.schema';

export const userRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        s: z.string().optional(),
        sort: z.array(z.string()).optional(),
        filter: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => await findUserService(ctx.db, input)),
  create: publicProcedure.input(userInputSchema).mutation(async ({ ctx, input }) => {
    const user = await createUserService(ctx.db, input, ctx.session);
    return user;
  }),

  upsert: publicProcedure
    .use(requirePermission('update:user'))
    .input(userInputSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await upsertUserService(ctx.db, input);
      return user;
    }),
  updateCustom: publicProcedure
    .input(
      z.object({
        where: z.record(z.any()),
        data: z.record(z.any())
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await updateUserCustomService(ctx.db, input);
      return user;
    }),
  delete: publicProcedure
    .use(requirePermission('delete:user'))
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => await deleteUserService(ctx.db, input)),
  getFilter: publicProcedure
    .input(
      z.object({
        s: z.string()
      })
    )
    .query(async ({ ctx, input }) => await getFilterUserService(ctx.db, input)),
  getSaler: publicProcedure.query(async ({ ctx }) => await getSellerService(ctx.db)),
  getOne: publicProcedure
    .input(
      z.object({
        s: z.string().optional(),
        hasOrders: z.boolean().optional()
      })
    )
    .query(async ({ ctx, input }) => await getOneUserService(ctx.db, input)),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findMany({ include: { role: true } });
    return user;
  }),
  getNotGuest: publicProcedure.query(async ({ ctx }) => await getNotGuestService(ctx.db)),
  verifyEmail: publicProcedure
    .input(
      z.object({ email: z.string().email(), timeExpiredMinutes: z.number().default(3), type: z.nativeEnum(TokenType) })
    )
    .mutation(async ({ ctx, input }) => await verifyEmailService(ctx.db, input)),

  resetPassword: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        token: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => await resetPasswordService(ctx.db, input)),

  verifyOtp: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        otp: z.string().length(6).optional(),
        token: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => await verifyOtpService(ctx.db, input))
});
