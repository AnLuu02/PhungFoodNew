import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

import { getServerAuthSession } from '../auth';
import { db } from '../db';
import { logActivity } from '../services/activityLogger.service';

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
    const isSuperAdmin = user?.email === process.env.NEXT_PUBLIC_EMAIL_ADMIN;
    if (options?.requiredAdmin && (user?.role === 'ADMIN' || isSuperAdmin)) {
      return next({ ctx: { ...ctx, user } });
    }
    const userPerms = user && user?.permissions ? user?.permissions : [];
    const reqList = Array.isArray(required) ? required : [required];
    const hasAll = reqList.every(p => userPerms.includes(p));
    const hasSome = reqList.some(p => userPerms.includes(p));
    if ((options?.requireAll ? !hasAll : !hasSome) && !isSuperAdmin)
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Bạn không có quyền thực hiện thao tác này. Liên hệ Admin để được hỗ trợ.'
      });

    return next({ ctx: { ...ctx, user } });
  });

export const activityLogger = t.middleware(async opts => {
  const result = await opts.next();

  if (result.ok && opts.type === 'mutation') {
    const user = opts.ctx.session?.user;
    const path = opts.path;
    const input = opts.input;
    const responseData = result.data as any;
    try {
      const logsToProcess = Array.isArray(responseData) ? responseData : [responseData];
      if (logsToProcess && logsToProcess?.length > 0) {
        Promise.all(
          logsToProcess
            .map(async item => {
              const logContent = item?.metaData || {
                before: {},
                after: item?.metaData
              };
              const action =
                logContent?.before?.id === logContent?.after?.id?.id ? 'update' : !logContent?.before ? 'create' : path;
              const entityId = logContent?.before?.id || logContent?.after?.id || (input as any)?.id;
              return entityId
                ? logActivity({
                    action,
                    entityType: path?.split('.')?.[0]?.toLowerCase() || 'OTHER',
                    entityId: logContent?.before?.id || logContent?.after?.id || (input as any)?.id,
                    userId: user?.id,
                    metadata: {
                      before: logContent.before ?? {},
                      after: logContent.after ?? {}
                    }
                  })
                : undefined;
            })
            .filter(Boolean)
        );
      }
    } catch (err) {
      console.error('Không thể lưu activity log:', err);
    }
  }

  return result;
});
