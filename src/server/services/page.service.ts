import { PrismaClient } from '@prisma/client';
import { UserRole } from '~/shared/constants/user';
import {
  findProductService,
  getAllProductService,
  getFilterProductService,
  getOneProductService
} from './product.service';
import { getRecentActivityAppService } from './recentActivity.service';
import { getOneBannerService } from './restaurant.banner.service';
import {
  getDistributionProductsService,
  getOverviewRevenueService,
  getRevenueByCategoryService,
  getRevenueOrderStatusService,
  getTopProductsService,
  getTopUsersService
} from './revenue.service';
import { findSubCategoryService } from './subCategory.service';
import { getVoucherAppliedAllService } from './voucher.service';

export const getInitPageService = async (db: PrismaClient) => {
  const categories = ['danh-muc-an-vat-trang-mieng', 'danh-muc-mon-chinh', 'danh-muc-mon-chay', 'danh-muc-do-uong'];
  const productFilters = [
    { key: 'discount', value: true },
    { key: 'bestSaler', value: true },
    { key: 'newProduct', value: true },
    { key: 'hotProduct', value: true }
  ];
  const materials = ['thit-tuoi', 'hai-san', 'rau-cu', 'cac-loai-nam'];

  const promises = [
    getOneBannerService(db, { isActive: true }),
    ...categories.map(category => findSubCategoryService(db, { skip: 0, take: 10, s: category })),
    ...productFilters.map(filter => findProductService(db, { skip: 0, take: 10, [filter.key]: filter.value })),
    ...materials.map(material => findProductService(db, { skip: 0, take: 10, s: material }))
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
};
export const getInitProductDetailPageService = async (db: PrismaClient, input: { slug: string }) => {
  const product = await getOneProductService(db, {
    s: input?.slug || '',
    hasCategory: true,
    hasCategoryChild: true
  });

  if (!product) return null;

  const [dataRelatedProducts, dataHintProducts, dataVouchers] = await Promise.allSettled([
    getFilterProductService(db, { s: product?.subCategory?.tag || '' }),
    getFilterProductService(db, { s: product?.subCategory?.category?.tag || '' }),
    getVoucherAppliedAllService(db)
  ]);

  const results: any = {
    product,
    dataRelatedProducts: dataRelatedProducts?.status === 'fulfilled' ? dataRelatedProducts.value : [],
    dataHintProducts: dataHintProducts?.status === 'fulfilled' ? dataHintProducts.value : [],
    dataVouchers: dataVouchers?.status === 'fulfilled' ? dataVouchers.value : []
  };
  return results;
};
export const getInitAdminPageService = async (db: PrismaClient) => {
  const results: any = await Promise.allSettled([
    getAllProductService(db, { userRole: UserRole.ADMIN }),
    getOverviewRevenueService(db, {}),
    getRecentActivityAppService(db, {})
  ]);

  const [products, revenue, recentActivities] = results.map((item: any) =>
    item.status === 'fulfilled' ? item.value : []
  );
  return {
    products,
    revenue,
    recentActivities
  };
};
export const getInitReportPageService = async (db: PrismaClient, input: { startTime?: number; endTime?: number }) => {
  const { startTime, endTime } = input;
  const queryOverview = { startTime, endTime };
  const results: any = await Promise.allSettled([
    getOverviewRevenueService(db, queryOverview),
    getTopUsersService(db, queryOverview),
    getRevenueByCategoryService(db, queryOverview),
    getTopProductsService(db, queryOverview),
    getRevenueOrderStatusService(db, queryOverview),
    getDistributionProductsService(db, queryOverview),
    getRecentActivityAppService(db, queryOverview)
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
};
