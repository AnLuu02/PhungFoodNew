import { PrismaClient } from '@prisma/client';
import { CreateTagVi } from '~/lib/FuncHandler/CreateTag-vi';
import { ResponseTRPC } from '~/types/ResponseFetcher';

export async function findMaterial(db: PrismaClient, input: { skip: number; take: number; s?: string }) {
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
}
export async function createMaterial(db: PrismaClient, input: any): Promise<ResponseTRPC> {
  const existingMaterial = await db.material.findMany({
    where: {
      tag: input.tag
    }
  });

  if (!existingMaterial?.length) {
    const material = await db.material.create({
      data: {
        name: input.name,
        tag: input.tag,
        description: input.description,
        category: input.category
      }
    });
    if (material?.tag) {
      await CreateTagVi({ old: [], new: material });
    }
    return {
      code: 'OK',
      message: 'Tạo nguyên liệu thành công.',
      data: material
    };
  }
  return {
    code: 'CONFLICT',
    message: 'Nguyên liệu đã tồn tại. ',
    data: existingMaterial
  };
}
export function updateMaterial() {}
export function deleteMaterial(db: PrismaClient, id: string): ResponseTRPC {
  return {
    code: 'OK',
    message: 'Xóa nguyên liệu thành công.',
    data: db.material.delete({
      where: { id }
    })
  };
}
export function getFilterMaterial() {}
export function getAllMaterial() {}
export function getOneMaterial() {}
