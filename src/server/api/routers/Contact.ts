import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { ResponseTRPC } from '~/types/ResponseFetcher';
export const contactRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        s: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { skip, take, s } = input;

      const startPageItem = skip > 0 ? (skip - 1) * take : 0;
      const [totalContacts, totalContactsQuery, contacts] = await ctx.db.$transaction([
        ctx.db.contact.count(),
        ctx.db.contact.count({
          where: {
            OR: [
              {
                fullName: { contains: s?.trim(), mode: 'insensitive' }
              },
              {
                email: { contains: s?.trim(), mode: 'insensitive' }
              },
              {
                message: { contains: s?.trim(), mode: 'insensitive' }
              },
              {
                phone: { contains: s?.trim(), mode: 'insensitive' }
              },
              {
                subject: { contains: s?.trim(), mode: 'insensitive' }
              }
            ]
          }
        }),
        ctx.db.contact.findMany({
          skip: startPageItem,
          take,
          where: {
            OR: [
              {
                fullName: { contains: s?.trim(), mode: 'insensitive' }
              },
              {
                email: { contains: s?.trim(), mode: 'insensitive' }
              },
              {
                message: { contains: s?.trim(), mode: 'insensitive' }
              },
              {
                phone: { contains: s?.trim(), mode: 'insensitive' }
              },
              {
                subject: { contains: s?.trim(), mode: 'insensitive' }
              }
            ]
          }
        })
      ]);
      const totalPages = Math.ceil(
        Object.entries(input)?.length > 2
          ? totalContactsQuery == 0
            ? 1
            : totalContactsQuery / take
          : totalContacts / take
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
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      const contact = await ctx.db.contact.delete({
        where: { id: input.id }
      });

      return {
        code: 'OK',
        message: 'Xóa phiếu liên hệ của khách thành công.',
        data: contact
      };
    }),

  getOne: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const contact = await ctx.db.contact.findFirst({
        where: { id }
      });

      return contact;
    }),

  create: publicProcedure
    .input(
      z.object({
        fullName: z.string(),
        responded: z.boolean().default(false),
        type: z.enum(['COLLABORATION', 'OTHER', 'SUPPORT', 'FEEDBACK']).default('COLLABORATION'),
        email: z.string(),
        phone: z.string(),
        subject: z.string().optional(),
        message: z.string()
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      const contact = await ctx.db.contact.create({
        data: input
      });
      return {
        code: 'OK',
        message: 'Tạo phiếu liên hệ của khách thành công.',
        data: contact
      };
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.contact.findMany({});
  }),

  update: publicProcedure
    .input(
      z.object({
        where: z.record(z.any()),
        data: z.record(z.any())
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      const contact = await ctx.db.contact.update({
        where: input.where as Prisma.ContactWhereUniqueInput,
        data: input.data as Prisma.ContactUpdateInput
      });
      return { code: 'OK', message: 'Cập nhật phiếu liên hệ của khách thành công.', data: contact };
    })
});
