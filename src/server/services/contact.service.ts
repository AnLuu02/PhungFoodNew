import { PrismaClient } from '@prisma/client';
import { ContactInput } from '~/shared/schema/contact.schema';

export const findContactService = async (db: PrismaClient, input: { skip: number; take: number; s?: string }) => {
  const { skip, take, s } = input;
  const searchQuery = s?.trim();
  const startPageItem = skip > 0 ? (skip - 1) * take : 0;
  const [totalContacts, totalContactsQuery, contacts] = await db.$transaction([
    db.contact.count(),
    db.contact.count({
      where: {
        OR: [
          {
            fullName: { contains: searchQuery, mode: 'insensitive' }
          },
          {
            email: { contains: searchQuery, mode: 'insensitive' }
          },
          {
            message: { contains: searchQuery, mode: 'insensitive' }
          },
          {
            phone: { contains: searchQuery, mode: 'insensitive' }
          },
          {
            subject: { contains: searchQuery, mode: 'insensitive' }
          }
        ]
      }
    }),
    db.contact.findMany({
      skip: startPageItem,
      take,
      where: {
        OR: [
          {
            fullName: { contains: searchQuery, mode: 'insensitive' }
          },
          {
            email: { contains: searchQuery, mode: 'insensitive' }
          },
          {
            message: { contains: searchQuery, mode: 'insensitive' }
          },
          {
            phone: { contains: searchQuery, mode: 'insensitive' }
          },
          {
            subject: { contains: searchQuery, mode: 'insensitive' }
          }
        ]
      }
    })
  ]);
  const totalPages = Math.ceil(
    Object.entries(input)?.length > 2 ? (totalContactsQuery == 0 ? 1 : totalContactsQuery / take) : totalContacts / take
  );
  const currentPage = skip ? Math.floor(skip / take + 1) : 1;

  return {
    contacts,
    totalData: Object.entries(input)?.length > 2 ? totalContactsQuery : totalContacts,
    pagination: {
      currentPage,
      totalPages
    }
  };
};

export const deleteContactService = async (db: PrismaClient, input: { id: string }) => {
  const contact = await db.contact.delete({
    where: { id: input.id }
  });
  return {
    metaData: {
      before: contact ?? {},
      after: {}
    }
  };
};

export const getAllContactService = async (db: PrismaClient) => {
  return await db.contact.findMany({});
};

export const upsertContactService = async (db: PrismaClient, input: ContactInput) => {
  const { id, ...data } = input;
  const result = await db.$transaction(async tx => {
    const oldData = id
      ? await tx.contact.findUnique({
          where: { id }
        })
      : null;
    const newData = await tx.contact.upsert({
      where: { id: id || 'NON_EXISTENT_ID' },
      create: data,
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
