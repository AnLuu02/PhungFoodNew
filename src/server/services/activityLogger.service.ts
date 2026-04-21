import { Prisma, PrismaClient } from '@prisma/client';
import { db } from '../db';

export interface ActivityLogInput {
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  metadata?: {
    before?: Record<string, any>;
    after?: Record<string, any>;
    changes?: string[];
  };
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
}

let queue: ActivityLogInput[] = [];
let isProcessing = false;
const BATCH_SIZE = 10;
const FLUSH_INTERVAL = 5000;

export const calculateDiff = (
  before: Record<string, any>,
  after: Record<string, any>
): { changes: string[]; diff: Record<string, { before: any; after: any }> } => {
  const changes: string[] = [];
  const diff: Record<string, { before: any; after: any }> = {};

  const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);

  for (const key of allKeys) {
    if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
      changes.push(key);
      diff[key] = {
        before: before[key],
        after: after[key]
      };
    }
  }

  return { changes, diff };
};

export const flush = async (): Promise<void> => {
  if (isProcessing || queue.length === 0) return;

  isProcessing = true;
  const batch = queue.splice(0, BATCH_SIZE);

  try {
    await db.activityLog.createMany({
      data: batch.map(log => ({
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        userId: log.userId,
        metadata: log.metadata || {},
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        sessionId: log.sessionId
      })),
      skipDuplicates: true
    });
  } catch (error) {
    console.error('[ActivityLogger] Batch insert failed:', error);
    queue.unshift(...batch);
  } finally {
    isProcessing = false;
  }
};

export const logActivity = async (input: ActivityLogInput): Promise<void> => {
  const { metadata, ...data } = input;
  const { changes } = calculateDiff(metadata?.before ?? {}, metadata?.after ?? {});

  queue.push({
    ...data,
    metadata: {
      before: { ...metadata?.before },
      after: { ...metadata?.after },
      changes
    }
  });

  if (queue.length >= BATCH_SIZE) {
    flush().catch(err => {
      console.error('[ActivityLogger] Flush error:', err.message);
    });
  }
};

export const flushAll = async (): Promise<void> => {
  while (queue.length > 0) {
    await flush();
  }
};

if (typeof window === 'undefined') {
  setInterval(() => {
    flush();
  }, FLUSH_INTERVAL);
}

export const getAllActivitiesService = async (
  db: PrismaClient,
  input: {
    cursor?: string | null;
    limit: number;
    filters?: {
      entityType?: string;
      action?: string;
      userId?: string;
      dateFrom?: Date;
      dateTo?: Date;
      search?: string;
    };
  }
) => {
  const { cursor, limit, filters } = input;

  const where: Prisma.ActivityLogWhereInput = {
    ...(filters?.entityType && { entityType: filters.entityType }),
    ...(filters?.action && { action: { contains: filters.action, mode: 'insensitive' } }),
    ...(filters?.userId && { userId: filters.userId }),
    ...(filters?.dateFrom &&
      filters?.dateTo && {
        createdAt: {
          gte: filters.dateFrom,
          lte: filters.dateTo
        }
      }),
    ...(filters?.search
      ? {
          OR: [
            {
              user: {
                name: {
                  contains: filters?.search,
                  mode: 'insensitive'
                }
              }
            }
          ]
        }
      : {})
  };

  const logs = await db.activityLog.findMany({
    where,
    include: {
      user: {
        select: { id: true, name: true, email: true, imageForEntity: { select: { image: true } } }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
    ...(cursor && { skip: 1, cursor: { id: cursor } })
  });

  const hasMore = logs.length > limit;
  const items = logs.slice(0, limit);

  return {
    items,
    nextCursor: hasMore ? items[items.length - 1]?.id : null,
    hasMore
  };
};
