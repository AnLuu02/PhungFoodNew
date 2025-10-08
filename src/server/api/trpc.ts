import { initTRPC, TRPCError } from '@trpc/server';
import { getServerSession } from 'next-auth';
import superjson from 'superjson';
import { ZodError } from 'zod';

import { db } from '~/server/db';

export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    db,
    ...opts
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
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

export const requirePermission = (
  required?: string | string[],
  options?: { requireAll?: boolean; requiredAdmin?: boolean }
) =>
  t.middleware(async ({ ctx, next }) => {
    const { authOptions } = await import('~/app/api/auth/[...nextauth]/options');
    const session = await getServerSession(authOptions);
    const user = session?.user ?? null;

    if (!user) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Bạn chưa đăng nhập.' });

    if (options?.requiredAdmin && user.role === 'ADMIN') {
      return next({ ctx: { ...ctx, user } });
    }

    const userPerms = user.permissions ?? [];
    const reqList = Array.isArray(required) ? required : [required];

    const hasAll = reqList.every(p => userPerms.includes(p));
    const hasSome = reqList.some(p => userPerms.includes(p));

    if (options?.requireAll ? !hasAll : !hasSome)
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Bạn không có quyền thực hiện thao tác này.' });

    return next({ ctx: { ...ctx, user } });
  });
