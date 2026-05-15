import { ImageType, PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import cloudinary from '~/lib/Cloudinary/cloudinary';
import { ImageFromDb } from '~/shared/schema/image.schema';

export const checkExistingImageService = async (db: PrismaClient, input: { publicId: string }) => {
  const existingImage = await db.image.findUnique({
    where: { publicId: input.publicId }
  });

  return {
    exists: !!existingImage,
    image: existingImage ?? null
  };
};

export const deleteImageService = async (db: PrismaClient, input: { publicId: string }) => {
  const { publicId } = input;
  if (!publicId) throw new TRPCError({ code: 'NOT_FOUND', message: 'Không có ảnh phù hợp.' });
  const deleted = await db.image.delete({
    where: {
      publicId: input.publicId
    }
  });
  if (deleted?.publicId) {
    cloudinary.uploader
      .destroy(deleted?.publicId)
      .catch(() => console.error('Xóa ảnh khỏi cloudinary không thành công. Hãy kiểm tra lại.'));
  }
  return {
    metaData: {
      before: deleted ?? {},
      after: {}
    }
  };
};

export const upsertImageService = async (db: PrismaClient, input: ImageFromDb) => {
  const { id, ...data } = input;
  const result = await db.$transaction(async tx => {
    const oldData = id ? await tx.image.findUnique({ where: { id } }) : null;
    const newData = await tx.image.upsert({
      where: {
        id: id || 'Default_image_id'
      },
      create: {
        ...data,
        url: data?.url || '',
        type: ImageType.OTHER
      },
      update: data
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

export const bulkUpsertImageService = async (db: PrismaClient, input: ImageFromDb[]) => {
  if (!input || input?.length <= 0)
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Giá trị đầu vào không hợp lệ.' });
  return await db.$transaction(
    input.map(({ id, ...rest }, index) =>
      db.image.upsert({
        where: {
          id: id || 'default_id_image' + index
        },
        create: {
          ...rest,
          url: rest?.url || '',
          type: ImageType.OTHER
        },
        update: rest
      })
    )
  );
};
