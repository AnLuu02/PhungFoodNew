import { TRPCError } from '@trpc/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '~/app/api/auth/[...nextauth]/options';
import { publicProcedure } from '../api/trpc';

export const checkPermission = (permission: string) =>
  publicProcedure.use(async ({ ctx, next }) => {
    const user = await getServerSession(authOptions);
    if (!user?.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You must be logged in' });
    }

    const userWithRole = await ctx.db.user.findUnique({
      where: { email: user.user?.email || '' },
      include: {
        role: {
          include: { permissions: true }
        }
      }
    });

    const hasPermission = userWithRole?.role?.permissions.some(p => p.name === permission);
    if (!hasPermission) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'You do not have permission' });
    }

    return next();
  });
