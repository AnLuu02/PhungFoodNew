import { Prisma, PrismaClient } from '@prisma/client';
import { ContactInput } from '~/shared/schema/contact.schema';

export const findContactService = async (db: PrismaClient, input: { page: number; limit: number; s?: string }) => {
  const { page, limit, s } = input;
  const searchQuery = s?.trim();
  const where: Prisma.ContactWhereInput = {
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
  };
  const [totalContacts, totalContactsQuery, contacts] = await db.$transaction([
    db.contact.count(),
    db.contact.count({
      where
    }),
    db.contact.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where,
      orderBy: {
        createdAt: 'desc'
      }
    })
  ]);
  const totalPages = Math.ceil(
    Object.entries(input)?.length > 2
      ? totalContactsQuery == 0
        ? 1
        : totalContactsQuery / limit
      : totalContacts / limit
  );

  return {
    contacts,
    totalData: Object.entries(input)?.length > 2 ? totalContactsQuery : totalContacts,
    pagination: {
      hasNext: Boolean(totalPages > page),
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
