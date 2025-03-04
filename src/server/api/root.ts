import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc';
import { categoryRouter } from './routers/Category';
import { deliveryRouter } from './routers/Delivery';
import { favouriteFoodRouter } from './routers/FavouriteFood';
import { imageRouter } from './routers/Images';
import { materialRouter } from './routers/Material';
import { orderRouter } from './routers/Order';
import { paymentRouter } from './routers/Payment';
import { productRouter } from './routers/Product';
import { revenueRouter } from './routers/Revenue';
import { reviewRouter } from './routers/Review';
import { subCategoryRouter } from './routers/SubCategory';
import { userRouter } from './routers/User';
import { voucherRouter } from './routers/Voucher';
import { newsRouter } from './routers/news';

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
  news: newsRouter,
  Material: materialRouter
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
