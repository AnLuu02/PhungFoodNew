import { PrismaClient } from '@prisma/client';
import { DeliveryInput } from '~/shared/schema/delivery.schema';

export const upsertDeliveryService = async (db: PrismaClient, input: DeliveryInput) => {
  const { id, ...data } = input;

  const result = await db.$transaction(async tx => {
    const oldData = id ? await tx.delivery.findUnique({ where: { id } }) : null;
    const newData = await tx.delivery.upsert({
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
    return { oldData, newData };
  });
  return {
    metaData: {
      before: result.oldData ?? {},
      after: result.newData
    }
  };
};
