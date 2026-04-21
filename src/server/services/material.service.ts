import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { ManageTagVi } from '~/lib/FuncHandler/CreateTag-vi';
import { MaterialInput } from '~/shared/schema/material.schema';

export const findMaterialService = async (db: PrismaClient, input: { skip: number; take: number; s?: string }) => {
  const { skip, take, s } = input;

  const startPageItem = skip > 0 ? (skip - 1) * take : 0;
  const [totalMaterials, totalMaterialsQuery, materials] = await db.$transaction([
    db.material.count(),
    db.material.count({
      where: {
        OR: [
          {
            name: { contains: s?.trim(), mode: 'insensitive' }
          },
          {
            tag: { contains: s?.trim(), mode: 'insensitive' }
          },
          {
            description: { contains: s?.trim(), mode: 'insensitive' }
          },
          {
            category: {
              contains: s?.trim(),
              mode: 'insensitive'
            }
          }
        ]
      }
    }),
    db.material.findMany({
      skip: startPageItem,
      take,
      where: {
        OR: [
          {
            name: { contains: s?.trim(), mode: 'insensitive' }
          },
          {
            tag: { contains: s?.trim(), mode: 'insensitive' }
          },
          {
            description: { contains: s?.trim(), mode: 'insensitive' }
          },
          {
            category: {
              contains: s?.trim(),
              mode: 'insensitive'
            }
          }
        ]
      },
      include: {
        products: true
      }
    })
  ]);
  const totalPages = Math.ceil(
    s?.trim() ? (totalMaterialsQuery == 0 ? 1 : totalMaterialsQuery / take) : totalMaterials / take
  );
  const currentPage = skip ? Math.floor(skip / take + 1) : 1;

  return {
    materials,
    pagination: {
      currentPage,
      totalPages
    }
  };
};
export const createManyMaterialService = async (db: PrismaClient, input: { data: MaterialInput[] }) => {
  const existingTags = await db.material.findMany({
    where: {
      tag: { in: input.data.map(item => item.tag || '') }
    },
    select: { tag: true }
  });

  const existingTagSet = new Set(existingTags.map(item => item.tag));
  const newData = input.data.filter(item => !existingTagSet.has(item.tag || ''));

  if (newData.length === 0) {
    throw new TRPCError({ code: 'CONFLICT', message: 'Tất cả nguyên liệu đều đã tồn tại.' });
  }

  const materials = await db.material.createMany({
    data: newData.map(item => ({ ...item, tag: item.tag || '' }))
  });

  if (newData?.length > 0) {
    for (const material of newData) {
      await ManageTagVi('upsert', { oldTag: undefined, newTag: material.tag, newName: material.name });
    }
  }

  return newData;
};

export const deleteMaterialService = async (db: PrismaClient, input: { id: string }) => {
  const deleted = await db.material.delete({
    where: { id: input.id }
  });
  if (deleted) {
    ManageTagVi('delete', { oldTag: deleted.tag });
  }
  return {
    metaData: {
      before: deleted ?? {},
      after: {}
    }
  };
};

export const getOneMaterialService = async (db: PrismaClient, input: { s: string }) => {
  const searchQuery = input?.s?.trim();
  const material = await db.material.findFirst({
    where: {
      OR: [{ id: { equals: searchQuery } }, { name: { equals: searchQuery } }, { tag: { equals: searchQuery } }]
    }
  });

  return material;
};
export const getAllMaterialService = async (db: PrismaClient) => {
  const material = await db.material.findMany({
    include: {
      products: true
    }
  });

  return material;
};

export const upsertMaterialService = async (db: PrismaClient, input: MaterialInput) => {
  const [existedTag, existed] = await db.$transaction([
    db.material.findFirst({
      where: {
        tag: input.tag || ''
      }
    }),
    db.material.findUnique({
      where: {
        id: input.id || ''
      }
    })
  ]);

  if (!existedTag || (existedTag && existedTag?.id == input?.id)) {
    const { id, ...data } = input;
    const upserted = await db.material.upsert({
      where: { id: input?.id || '' },
      create: { ...data, tag: data.tag || '' },
      update: data
    });

    if (upserted?.tag) {
      ManageTagVi('upsert', {
        oldTag: existed?.tag,
        newTag: upserted.tag,
        newName: upserted.name
      });
    }
    return {
      metaData: {
        before: existed ?? {},
        after: upserted
      }
    };
  }

  throw new TRPCError({
    code: 'CONFLICT',
    message: 'Nguyên liệu đã có trong kho. '
  });
};
