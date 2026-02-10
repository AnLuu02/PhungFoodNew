import { PrismaClient } from '@prisma/client';
import { ResponseTRPC } from '~/types/ResponseFetcher';

export async function createDelivery(db: PrismaClient, input: any): Promise<ResponseTRPC> {
  const delivery = await db.delivery.create({
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone,
      note: input.note,
      address: {
        create: {
          ...input.address
        } as any
      },
      order: {
        connect: {
          id: input.orderId
        }
      }
    },
    include: {
      address: true
    }
  });

  return {
    code: 'OK',
    message: 'Tạo giao hàng thành công.',
    data: delivery
  };
}

export async function updateDelivery(db: PrismaClient, input: any): Promise<ResponseTRPC> {
  const existingDelivery = await db.delivery.findFirst({
    where: { id: input.id }
  });

  if (!existingDelivery) {
    return {
      code: 'NOT_FOUND',
      message: 'Không tìm thấy thông tin giao hàng.',
      data: []
    };
  }

  const delivery = await db.delivery.update({
    where: { id: input.id },
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone,
      note: input.note,
      address: {
        update: {
          ...input.address
        } as any
      },
      order: {
        connect: {
          id: input.orderId
        }
      }
    }
  });

  return {
    code: 'OK',
    message: 'Cập nhật giao hàng thành công.',
    data: delivery
  };
}
