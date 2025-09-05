import { z } from 'zod';
import { withRedisCache } from '~/lib/cache/withRedisCache';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { createCaller } from '../root';

export const layoutRouter = createTRPCRouter({
  getDataHomePage: publicProcedure.query(async ({ ctx }) => {
    const caller = createCaller(ctx);
    return await withRedisCache(
      'get-data-home-page',
      async () => {
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
        };
      },
      60 * 60 * 24
    );
  }),
  getDataProductDetail: publicProcedure
    .input(z.object({ slug: z.string(), userId: z.string().optional() }))

    .query(async ({ ctx, input }) => {
      const caller = createCaller(ctx);
      const product = await caller.Product.getOne({
        s: input?.slug || '',
        hasCategory: true,
        hasCategoryChild: true
      });

      if (!product) return null;

      const [dataRelatedProducts, dataHintProducts, dataVouchers] = await Promise.allSettled([
        caller.Product.getFilter({ s: product?.subCategory?.tag || '' }),
        caller.Product.getFilter({ s: product?.subCategory?.category?.tag || '' }),
        caller.Voucher.getVoucherForUser({ userId: input.userId || '' })
      ]);

      const results: any = {
        product,
        dataRelatedProducts: dataRelatedProducts?.status === 'fulfilled' ? dataRelatedProducts.value : [],
        dataHintProducts: dataHintProducts?.status === 'fulfilled' ? dataHintProducts.value : [],
        dataVouchers: dataVouchers?.status === 'fulfilled' ? dataVouchers.value : []
      };
      return results;
    }),
  getDataAdminDashboard: publicProcedure.input(z.object({ period: z.any() })).query(async ({ ctx }) => {
    const caller = createCaller(ctx);
    const results: any = await Promise.allSettled([
      caller.Category.getAll(),
      caller.Payment.getAll(),
      caller.User.getAll(),
      caller.Order.getAll(),
      caller.Material.getAll(),
      caller.Product.getAll({ userRole: 'ADMIN' }),
      caller.Voucher.getAll(),
      caller.Review.getAll(),
      caller.SubCategory.getAll(),
      caller.Image.getAll(),
      caller.RolePermission.getAllRole()
    ]);

    return results.map((item: any) => item.status === 'fulfilled' && item.value);
  }),
  getDataAboutUs: publicProcedure.query(async ({ ctx }) => {
    const caller = createCaller(ctx);
    const results: any = await Promise.allSettled([
      caller.Product.find({ bestSaler: true, take: 4, skip: 0 }),
      caller.Product.find({ s: 'mien-tay', take: 4, skip: 0 }),
      caller.Product.find({ s: 'mien-bac', take: 4, skip: 0 }),
      caller.Product.find({ s: 'mien-trung', take: 4, skip: 0 }),
      caller.Product.find({ s: 'mien-nam', take: 4, skip: 0 })
    ]);

    return results;
  })
});
