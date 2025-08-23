import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc';
import { categoryRouter } from './routers/Category';
import { deliveryRouter } from './routers/Delivery';
import { favouriteFoodRouter } from './routers/FavouriteFood';
import { imageRouter } from './routers/Images';
import { layoutRouter } from './routers/Layout';
import { materialRouter } from './routers/Material';
import { newsRouter } from './routers/news';
import { notificationRouter } from './routers/Notification';
import { orderRouter } from './routers/Order';
import { paymentRouter } from './routers/Payment';
import { productRouter } from './routers/Product';
import { restaurantRouter } from './routers/Restaurant';
import { revenueRouter } from './routers/Revenue';
import { reviewRouter } from './routers/Review';
import { rolePermissionRouter } from './routers/RolePermission';
import { subCategoryRouter } from './routers/SubCategory';
import { userRouter } from './routers/User';
import { voucherRouter } from './routers/Voucher';

export const appRouter = createTRPCRouter({
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
  Image: imageRouter,
  News: newsRouter,
  Material: materialRouter,
  RolePermission: rolePermissionRouter,
  Restaurant: restaurantRouter,
  Notification: notificationRouter,
  Layout: layoutRouter
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
