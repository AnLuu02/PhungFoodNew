import { z } from 'zod';
import { UserRole } from '~/constants';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { getFilterProduct, getOneProduct } from '~/server/services/product.service';
import { getRecentActivityApp } from '~/server/services/recentActivity.service';
import {
  getDistributionProducts,
  getOverview,
  getRevenueByCategory,
  getRevenueOrderStatus,
  getTopProducts,
  getTopUsers
} from '~/server/services/revenue.service';
import { getVoucherAppliedAllVoucher } from '~/server/services/voucher.service';
import { createCaller } from '../root';

export const pageRouter = createTRPCRouter({
  getInit: publicProcedure.query(async ({ ctx }) => {
    const caller = createCaller(ctx);
    const categories = ['an-vat-trang-mieng', 'mon-chinh', 'mon-chay', 'do-uong'];
    const productFilters = [
      { key: 'discount', value: true },
      { key: 'bestSaler', value: true },
      { key: 'newProduct', value: true },
      { key: 'hotProduct', value: true }
    ];
    const materials = ['thit-tuoi', 'hai-san', 'rau-cu', 'cac-loai-nam'];

    const promises = [
      caller.Restaurant.getOneBanner({ isActive: true }),
      ...categories.map(category => caller.SubCategory.find({ skip: 0, take: 10, s: category })),
      ...productFilters.map(filter => caller.Product.find({ skip: 0, take: 10, [filter.key]: filter.value })),
      ...materials.map(material => caller.Product.find({ skip: 0, take: 10, s: material }))
      // caller.News.fetchNews({ skip: 0, take: 10 })
    ];

    const results: any = await Promise.allSettled(promises);
    const getValue = (idx: number, fallback: any = []) =>
      results[idx].status === 'fulfilled' ? results[idx].value : fallback;

    const banner = getValue(0, {});
    const anVat = getValue(1);
    const monChinh = getValue(2);
    const monChay = getValue(3);
    const thucUong = getValue(4);
    const productDiscount = getValue(5);
    const productBestSaler = getValue(6);
    const productNew = getValue(7);
    const productHot = getValue(8);
    const thitTuoi = getValue(9);
    const haiSan = getValue(10);
    const rauCu = getValue(11);
    const cacLoaiNam = getValue(12);
    // const news = getValue(13);

    return {
      banner: banner || {},
      category: {
        anVat: anVat?.subCategories || [],
        monChinh: monChinh?.subCategories || [],
        monChay: monChay?.subCategories || [],
        thucUong: thucUong?.subCategories || []
      },
      materials: {
        thitTuoi: thitTuoi || [],
        haiSan: haiSan || [],
        rauCu: rauCu || [],
        cacLoaiNam: cacLoaiNam || []
      },
      productDiscount: productDiscount || [],
      productBestSaler: productBestSaler || [],
      productNew: productNew || [],
      productHot: productHot || []
      // news
    };
  }),
  getInitProductDetail: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ ctx, input }) => {
    const product = await getOneProduct(ctx.db, { s: input.slug });

    if (!product) return null;

    const [dataRelatedProducts, dataHintProducts, dataVouchers] = await Promise.allSettled([
      getFilterProduct(ctx.db, { s: product?.subCategory?.tag || '' }),
      getFilterProduct(ctx.db, { s: product?.subCategory?.category?.tag || '' }),
      getVoucherAppliedAllVoucher(ctx.db)
    ]);

    const results = {
      product,
      dataRelatedProducts: dataRelatedProducts?.status === 'fulfilled' ? dataRelatedProducts.value : [],
      dataHintProducts: dataHintProducts?.status === 'fulfilled' ? dataHintProducts.value : [],
      dataVouchers: dataVouchers?.status === 'fulfilled' ? dataVouchers.value : []
    };
    return results;
  }),
  getInitAdmin: publicProcedure.query(async ({ ctx }) => {
    const caller = createCaller(ctx);
    const results: any = await Promise.allSettled([
      caller.Product.getAll({ userRole: UserRole.ADMIN }),
      caller.Revenue.getOverview({}),
      caller.RecentActivity.getRecentActivityApp({})
    ]);

    const [products, revenue, recentActivities] = results.map((item: any) =>
      item.status === 'fulfilled' ? item.value : []
    );
    return {
      products,
      revenue,
      recentActivities
    };
  }),
  getInitReport: publicProcedure
    .input(
      z.object({
        startTime: z.number().optional(),
        endTime: z.number().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { startTime, endTime } = input;
      const queryOverview = { startTime, endTime };
      const results = await Promise.allSettled([
        getOverview(ctx.db, queryOverview),
        getTopUsers(ctx.db, queryOverview),
        getRevenueByCategory(ctx.db, queryOverview),
        getTopProducts(ctx.db, queryOverview),
        getRevenueOrderStatus(ctx.db, queryOverview),
        getDistributionProducts(ctx.db, queryOverview),
        getRecentActivityApp(ctx.db, queryOverview)
      ]);

      const [
        overview,
        topUsers,
        revenueByCategories,
        topProducts,
        revenueByOrderStatus,
        distributionProducts,
        recentActivitiesApp
      ] = results.map((item: any) => (item.status === 'fulfilled' ? item.value : Array.isArray(item.value) ? [] : {}));
      return {
        overview,
        topUsers,
        revenueByCategories,
        topProducts,
        revenueByOrderStatus,
        distributionProducts,
        recentActivitiesApp
      };
    })
});
