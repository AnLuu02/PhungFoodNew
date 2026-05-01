import { PrismaClient } from '@prisma/client';
import { UserRole } from '~/shared/constants/user';
import { getAllActivitiesService } from './activityLogger.service';
import { getAllProductService, getFilterProductService, getOneProductService } from './product.service';
import { getOneBannerService } from './restaurant.banner.service';
import {
  getDistributionProductsService,
  getOverviewRevenueService,
  getRevenueByCategoryService,
  getRevenueOrderStatusService,
  getTopProductsService,
  getTopUsersService
} from './revenue.service';
import { getVoucherAppliedAllService } from './voucher.service';

export const getInitPageService = async (db: PrismaClient) => {
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  const categoryTags = ['danh-muc-an-vat-trang-mieng', 'danh-muc-mon-chinh', 'danh-muc-mon-chay', 'danh-muc-do-uong'];
  const materialsTags = ['thit-tuoi', 'hai-san', 'rau-cu', 'cac-loai-nam'];
  const productConditions = [
    { discount: { gt: 0 } },
    { soldQuantity: { gt: 20 } },
    { updatedAt: { gte: last7Days } },
    { rating: { gte: 4 } },
    ...materialsTags.map(m => {
      return { materials: { some: { tag: m } } };
    })
  ];

  const [banner, subCategories, products] = await Promise.all([
    getOneBannerService(db, { isActive: true }),

    db.subCategory.findMany({
      where: {
        category: { tag: { in: categoryTags } }
      },
      include: {
        category: true,
        imageForEntity: {
          select: {
            altText: true,
            image: {
              select: {
                publicId: true,
                url: true
              }
            }
          }
        },
        products: {
          where: {
            isActive: true
          },
          include: {
            favouriteFood: true,
            imageForEntities: { include: { image: true } }
          }
        }
      }
    }),

    db.product.findMany({
      where: {
        isActive: true,
        OR: productConditions
      },
      take: 200,
      include: {
        imageForEntities: { include: { image: true } },
        materials: true,
        subCategory: { include: { category: true } },
        review: true,
        favouriteFood: true
      }
    })
  ]);

  const pick = (fn: (p: any) => boolean) => products.filter(fn).slice(0, 10);

  const byMaterial = (tag: string) => pick(p => p.materials?.some((m: any) => m.tag === tag));

  const category = (tag: string) => subCategories.filter(sc => sc.category?.tag === tag).slice(0, 10);

  return {
    banner: banner || {},

    category: {
      anVat: category('danh-muc-an-vat-trang-mieng'),
      monChinh: category('danh-muc-mon-chinh'),
      monChay: category('danh-muc-mon-chay'),
      thucUong: category('danh-muc-do-uong')
    },

    materials: {
      thitTuoi: { products: byMaterial('thit-tuoi') },
      haiSan: { products: byMaterial('hai-san') },
      rauCu: { products: byMaterial('rau-cu') },
      cacLoaiNam: { products: byMaterial('cac-loai-nam') }
    },

    productDiscount: { products: pick(p => p.discount > 0) },
    productBestSaler: { products: pick(p => p.soldQuantity > 20) },
    productNew: { products: pick(p => new Date(p.updatedAt) >= last7Days) },
    productHot: { products: pick(p => p.rating >= 4) }
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
    getAllActivitiesService(db, {
      limit: 10
      // filters: {
      //   dateFrom: dayjs(queryOverview?.startTime).toDate(),
      //   dateTo: dayjs(queryOverview?.endTime).toDate()
      // }
    })
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
    getAllActivitiesService(db, {
      limit: 10
      // filters: {
      //   dateFrom: dayjs(queryOverview?.startTime).toDate(),
      //   dateTo: dayjs(queryOverview?.endTime).toDate()
      // }
    })
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
