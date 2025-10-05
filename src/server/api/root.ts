import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc';
import { categoryRouter } from './routers/Category';
import { deliveryRouter } from './routers/Delivery';
import { favouriteFoodRouter } from './routers/FavouriteFood';
import { invoiceRouter } from './routers/Invoice';
import { materialRouter } from './routers/Material';
import { newsRouter } from './routers/news';
import { notificationRouter } from './routers/Notification';
import { orderRouter } from './routers/Order';
import { pageRouter } from './routers/Page';
import { paymentRouter } from './routers/Payment';
import { productRouter } from './routers/Product';
import { recentActivityRouter } from './routers/RecentActivity';
import { restaurantRouter } from './routers/Restaurant';
import { revenueRouter } from './routers/Revenue';
import { reviewRouter } from './routers/Review';
import { rolePermissionRouter } from './routers/RolePermission';
import { searchRouter } from './routers/Search';
import { subCategoryRouter } from './routers/SubCategory';
import { userRouter } from './routers/User';
import { voucherRouter } from './routers/Voucher';

export const appRouter = createTRPCRouter({
  Page: pageRouter,
  Invoice: invoiceRouter,
  Search: searchRouter,
  RecentActivity: recentActivityRouter,
  Category: categoryRouter,
  SubCategory: subCategoryRouter,
  Delivery: deliveryRouter,
  User: userRouter,
  Payment: paymentRouter,
  Product: productRouter,
  Review: reviewRouter,
  Order: orderRouter,
  Revenue: revenueRouter,
  FavouriteFood: favouriteFoodRouter,
  Voucher: voucherRouter,
  News: newsRouter,
  Material: materialRouter,
  RolePermission: rolePermissionRouter,
  Restaurant: restaurantRouter,
  Notification: notificationRouter
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
