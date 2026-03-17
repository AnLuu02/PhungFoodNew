import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

import { getServerAuthSession } from '../auth';
import { db } from '../db';

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await getServerAuthSession();
  return {
    db,
    session,
    ...opts
  };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null
      }
    };
  }
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Bạn cần đăng nhập để thực hiện thao tác này'
    });
  }
  return next({
    ctx: {
      ...ctx,
      session: { ...ctx.session, user: ctx.session.user }
    }
  });
});

export const requirePermission = (
  required?: string | string[],
  options?: { requireAll?: boolean; requiredAdmin?: boolean }
) =>
  t.middleware(async ({ ctx, next }) => {
    const user = ctx.session?.user;
    if (options?.requiredAdmin && (user?.role === 'ADMIN' || user?.email === process.env.NEXT_PUBLIC_EMAIL_ADMIN)) {
      return next({ ctx: { ...ctx, user } });
    }
    const userPerms = user && user?.permissions ? user?.permissions : [];
    const reqList = Array.isArray(required) ? required : [required];
    const hasAll = reqList.every(p => userPerms.includes(p));
    const hasSome = reqList.some(p => userPerms.includes(p));
    if (options?.requireAll ? !hasAll : !hasSome)
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Bạn không có quyền thực hiện thao tác này. Liên hệ Admin để được hỗ trợ.'
      });

    return next({ ctx: { ...ctx, user } });
  });
