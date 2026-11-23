import { activityRouter } from '~/server/modules/activity/activity.router';
import { categoryRouter } from '~/server/modules/category/category.router';
import { contactRouter } from '~/server/modules/contact/contact.router';
import { deliveryRouter } from '~/server/modules/delivery/delivery.router';
import { favouriteFoodRouter } from '~/server/modules/favourite-food/favourite-food.router';
import { imagesRouter } from '~/server/modules/image/image.router';
import { invoiceRouter } from '~/server/modules/invoice/invoice.router';
import { materialRouter } from '~/server/modules/material/material.router';
import { newsRouter } from '~/server/modules/news/news.router';
import { notificationRouter } from '~/server/modules/notification/notification.router';
import { notificationTemplateRouter } from '~/server/modules/notification/notification-template.router';
import { orderRouter } from '~/server/modules/order/order.router';
import { pageRouter } from '~/server/modules/page/page.router';
import { paymentRouter } from '~/server/modules/payment/payment.router';
import { productRouter } from '~/server/modules/product/product.router';
import { restaurantRouter } from '~/server/modules/restaurant/restaurant.router';
import { revenueRouter } from '~/server/modules/revenue/revenue.router';
import { reviewRouter } from '~/server/modules/review/review.router';
import { rolePermissionRouter } from '~/server/modules/role-permission/role-permission.router';
import { searchRouter } from '~/server/modules/search/search.router';
import { subCategoryRouter } from '~/server/modules/sub-category/sub-category.router';
import { userRouter } from '~/server/modules/user/user.router';
import { voucherRouter } from '~/server/modules/voucher/voucher.router';
import { voucherUsageRouter } from '~/server/modules/voucher-usage/voucher-usage.router';
import { createCallerFactory, createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  Page: pageRouter,
  Invoice: invoiceRouter,
  Search: searchRouter,
  Category: categoryRouter,
  SubCategory: subCategoryRouter,
  Delivery: deliveryRouter,
  User: userRouter,
  Payment: paymentRouter,
  Product: productRouter,
  Review: reviewRouter,
  Contact: contactRouter,
  Order: orderRouter,
  Revenue: revenueRouter,
  FavouriteFood: favouriteFoodRouter,
  Voucher: voucherRouter,
  VoucherUsage: voucherUsageRouter,
  News: newsRouter,
  Material: materialRouter,
  RolePermission: rolePermissionRouter,
  Restaurant: restaurantRouter,
  Notification: notificationRouter,
  NotificationTemplate: notificationTemplateRouter,
  Images: imagesRouter,
  Activity: activityRouter
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
