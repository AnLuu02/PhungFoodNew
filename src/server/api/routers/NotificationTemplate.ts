import { NotificationType } from '@prisma/client';
import { z } from 'zod';
import { notificationTemplateSchema } from '~/lib/ZodSchema/schema';
import { activityLogger, createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { ResponseTRPC } from '~/types/ResponseFetcher';

export const notificationTemplateRouter = createTRPCRouter({
  create: publicProcedure
    .use(activityLogger)
    .input(notificationTemplateSchema)
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.db.notificationTemplate.create({ data: input });
      return { code: 'OK', message: 'Tạo template thành công.', data };
    }),

  getAll: publicProcedure.query(async ({ ctx }): Promise<ResponseTRPC> => {
    const data = await ctx.db.notificationTemplate.findMany({ orderBy: { createdAt: 'desc' } });
    if (data.length === 0) {
      const seedTemplates = [
        {
          name: 'system_announcement',
          title: 'Thông báo hệ thống',
          message: 'Xin chào {{userName}}, hệ thống vừa được cập nhật với những cải tiến mới. Hãy kiểm tra ngay!',
          category: 'Hệ thống',
          type: NotificationType.SYSTEM,
          variables: ['userName']
        },
        {
          name: 'order_status_update',
          title: 'Cập nhật trạng thái đơn hàng',
          message: 'Đơn hàng #{{orderId}} của bạn hiện đang ở trạng thái "{{orderStatus}}".',
          category: 'Đơn hàng',
          type: NotificationType.ORDER,
          variables: ['orderId', 'orderStatus']
        },
        {
          name: 'promotion_offer',
          title: 'Ưu đãi đặc biệt dành cho bạn 🎁',
          message: 'Xin chào {{userName}}, bạn nhận được ưu đãi {{discountPercent}}% cho đơn hàng tiếp theo!',
          category: 'Khuyến mãi',
          type: NotificationType.PROMOTION,
          variables: ['userName', 'discountPercent']
        },
        {
          name: 'user_login_detected',
          title: 'Hoạt động đăng nhập mới',
          message: 'Chúng tôi phát hiện đăng nhập từ thiết bị {{deviceName}} lúc {{loginTime}}.',
          category: 'Hoạt động người dùng',
          variables: ['deviceName', 'loginTime'],
          type: NotificationType.USER_ACTIVITY
        },
        {
          name: 'password_changed',
          title: 'Mật khẩu đã được thay đổi',
          message:
            'Tài khoản của bạn vừa được thay đổi mật khẩu lúc {{changeTime}}. Nếu không phải bạn, hãy liên hệ hỗ trợ ngay.',
          category: 'Bảo mật',
          variables: ['changeTime'],
          type: NotificationType.SECURITY
        },
        {
          name: 'support_ticket_reply',
          title: 'Phản hồi từ bộ phận hỗ trợ',
          message: 'Yêu cầu hỗ trợ #{{ticketId}} của bạn đã được phản hồi. Hãy kiểm tra chi tiết.',
          category: 'Hỗ trợ',
          variables: ['ticketId'],
          type: NotificationType.SUPPORT
        },
        {
          name: 'event_reminder',
          title: 'Nhắc nhở sự kiện sắp diễn ra',
          message: 'Sự kiện "{{eventName}}" của bạn sẽ bắt đầu vào {{eventTime}}.',
          category: 'Nhắc nhở',
          variables: ['eventName', 'eventTime'],
          type: NotificationType.REMINDER
        }
      ];

      const created = await ctx.db.notificationTemplate.createMany({
        data: seedTemplates
      });

      return {
        code: 'OK',
        message: `Đã tạo ${created.count} template mẫu.`,
        data: seedTemplates
      };
    }

    return { code: 'OK', message: 'Lấy danh sách template thành công.', data: data || [] };
  }),

  update: publicProcedure
    .use(activityLogger)
    .input(z.object({ id: z.string(), data: notificationTemplateSchema.partial() }))
    .mutation(async ({ ctx, input }) => {
      const updated = await ctx.db.notificationTemplate.update({ where: { id: input.id }, data: input.data });
      return { code: 'OK', message: 'Cập nhật template thành công.', data: updated };
    }),

  delete: publicProcedure
    .use(activityLogger)
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.notificationTemplate.delete({ where: { id: input } });
      return { code: 'OK', message: 'Xóa template thành công.' };
    })
});
