import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { DeliveryInput } from '~/shared/schema/delivery.schema';

export const upsertDeliveryService = async (db: PrismaClient, input: DeliveryInput) => {
  const existingDelivery = await db.delivery.findFirst({
    where: {
      id: input.id
    }
  });

  if (!existingDelivery || (existingDelivery && existingDelivery?.id == input?.id)) {
    const { id, ...data } = input;
    const delivery = await db.delivery.upsert({
      where: { id: id || '' },
      create: {
        ...data,
        address: data.address
          ? {
              create: {
                ...data.address,
                id: undefined
              }
            }
          : undefined
      },
      update: {
        ...data,
        address: {
          upsert: {
            where: {
              id: data?.address?.id || ''
            },
            create: {
              ...data?.address,
              id: undefined,
              type: 'DELIVERY'
            },
            update: {
              ...data.address,
              id: data?.address?.id || '',
              type: 'DELIVERY'
            }
          }
        }
      }
    });
    return delivery;
  }

  throw new TRPCError({
    code: 'CONFLICT',
    message: 'Danh mục đã tồn tại. Hãy thử lại.'
  });
};
