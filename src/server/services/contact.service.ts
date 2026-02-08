import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { ResponseTRPC } from '~/types/ResponseFetcher';

export async function findContacts(
  db: PrismaClient<
    {
      log: 'error'[];
    },
    'error',
    DefaultArgs
  >,
  input: { skip: number; take: number; s?: string }
) {
  const { skip, take, s } = input;
  const startPageItem = skip > 0 ? (skip - 1) * take : 0;

  const where = s
    ? {
        OR: [
          { fullName: { contains: s.trim(), mode: 'insensitive' } },
          { email: { contains: s.trim(), mode: 'insensitive' } },
          { message: { contains: s.trim(), mode: 'insensitive' } },
          { phone: { contains: s.trim(), mode: 'insensitive' } },
          { subject: { contains: s.trim(), mode: 'insensitive' } }
        ]
      }
    : undefined;

  const [total, totalQuery, contacts] = await db.$transaction([
    db.contact.count(),
    db.contact.count({ where: where as any }),
    db.contact.findMany({
      skip: startPageItem,
      take,
      where: where as any
    })
  ]);

  const isSearching = !!s;
  const totalData = isSearching ? totalQuery : total;
  const totalPages = Math.ceil(totalData === 0 ? 1 : totalData / take);
  const currentPage = skip ? Math.floor(skip / take + 1) : 1;

  return {
    contacts,
    totalData,
    pagination: {
      currentPage,
      totalPages
    }
  };
}

export const getAllContacts = (
  db: PrismaClient<
    {
      log: 'error'[];
    },
    'error',
    DefaultArgs
  >
) => {
  return db.contact.findMany({});
};

export const getOneContact = (
  db: PrismaClient<
    {
      log: 'error'[];
    },
    'error',
    DefaultArgs
  >,
  id: string
) => {
  return db.contact.findFirst({ where: { id } });
};

export async function createContact(
  db: PrismaClient<
    {
      log: 'error'[];
    },
    'error',
    DefaultArgs
  >,
  input: any
): Promise<ResponseTRPC> {
  const contact = await db.contact.create({ data: input });

  return {
    code: 'OK',
    message: 'Tạo phiếu liên hệ của khách thành công.',
    data: contact
  };
}

export async function updateContact(
  db: PrismaClient<
    {
      log: 'error'[];
    },
    'error',
    DefaultArgs
  >,
  where: Prisma.ContactWhereUniqueInput,
  data: Prisma.ContactUpdateInput
): Promise<ResponseTRPC> {
  const contact = await db.contact.update({ where, data });

  return {
    code: 'OK',
    message: 'Cập nhật phiếu liên hệ của khách thành công.',
    data: contact
  };
}

export async function deleteContact(
  db: PrismaClient<
    {
      log: 'error'[];
    },
    'error',
    DefaultArgs
  >,
  id: string
): Promise<ResponseTRPC> {
  const contact = await db.contact.delete({ where: { id } });

  return {
    code: 'OK',
    message: 'Xóa phiếu liên hệ của khách thành công.',
    data: contact
  };
}
