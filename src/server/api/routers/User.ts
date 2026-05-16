import { Prisma, TokenType } from '@prisma/client';
import { z } from 'zod';
import { activityLogger, createTRPCRouter, publicProcedure, requirePermission } from '~/server/api/trpc';
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
        filter: z.string().optional(),
        include: z.custom<Prisma.UserInclude>().optional()
      })
    )
    .query(async ({ ctx, input }) => await findUserService(ctx.db, input)),
  create: publicProcedure
    .use(activityLogger)
    .input(userInputSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await createUserService(ctx.db, input, ctx.session);
      return user;
    }),

  upsert: publicProcedure
    .use(requirePermission('update:user'))
    .use(activityLogger)
    .input(userInputSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await upsertUserService(ctx.db, input);
      return user;
    }),
  updateCustom: publicProcedure
    .use(activityLogger)
    .input(
      z.object({
        where: z.custom<Prisma.UserWhereUniqueInput>(),
        data: z.custom<Prisma.UserUpdateInput>()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await updateUserCustomService(ctx.db, input);
      return user;
    }),
  delete: publicProcedure
    .use(requirePermission('delete:user'))
    .use(activityLogger)
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => await deleteUserService(ctx.db, input)),
  getFilter: publicProcedure
    .input(
      z.object({
        s: z.string(),
        include: z.custom<Prisma.UserInclude>().optional()
      })
    )
    .query(async ({ ctx, input }) => await getFilterUserService(ctx.db, input)),
  getSaler: publicProcedure
    .input(
      z
        .object({
          include: z.custom<Prisma.UserInclude>().optional()
        })
        .optional()
    )
    .query(async ({ ctx }) => await getSellerService(ctx.db)),
  getOne: publicProcedure
    .input(
      z.object({
        key: z.string(),
        include: z.custom<Prisma.UserInclude>().optional()
      })
    )
    .query(async ({ ctx, input }) => await getOneUserService(ctx.db, input)),
  getAll: publicProcedure
    .input(z.object({ include: z.custom<Prisma.UserInclude>().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findMany({
        include: {
          ...(input?.include ?? {}),
          role: true
        }
      });
      return user;
    }),
  getNotGuest: publicProcedure
    .input(z.object({ include: z.custom<Prisma.UserInclude>().optional() }).optional())
    .query(async ({ ctx, input }) => await getNotGuestService(ctx.db, input)),
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
