import { PrismaClient } from '@prisma/client';
import { withRedisCache } from '~/lib/CacheConfig/withRedisCache';
import dayjs from '~/lib/dayjs';
import { moneyToNumber } from '~/lib/FuncHandler/Format';
import { UserRole } from '~/shared/constants/user.constants';
import { Period } from '~/shared/types';
import { getAllActivitiesService } from './activityLogger.service';
import {
  findProductService,
  getAllProductService,
  getFilterProductService,
  getOneProductService
} from './product.service';
import { getOneBannerService } from './restaurant.banner.service';
import { getOneActiveClientService } from './restaurant.service';
import {
  getDistributionProductsService,
  getOverviewRevenueService,
  getRevenueByCategoryService,
  getRevenueOrderStatusService,
  getTopProductsService,
  getTopUsersService
} from './revenue.service';
import { findReviewService } from './review.service';
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
            favouriteFoods: true,
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
        favouriteFoods: true
      }
    })
  ]);

  const pick = (fn: (p: any) => boolean) =>
    products
      .map(p => ({ ...p, price: moneyToNumber(p.price), discount: moneyToNumber(p.discount) }))
      .filter(fn)
      .slice(0, 10)
      .map(p => ({ ...p, discount: moneyToNumber(p.discount), price: moneyToNumber(p.price) }));

  const byMaterial = (tag: string) => pick(p => p.materials?.some((m: any) => m.tag === tag));

  const category = (tag: string) =>
    subCategories
      .filter(sc => sc.category?.tag === tag)
      .slice(0, 10)
      .map(s => ({
        ...s,
        products: s.products.map(p => ({ ...p, discount: moneyToNumber(p.discount), price: moneyToNumber(p.price) }))
      }));
  return {
    banner,
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
    key: input.slug
  });

  if (!product) return null;

  const [dataRelatedProducts, dataHintProducts, dataVouchers] = await Promise.allSettled([
    getFilterProductService(db, {
      keys: product?.subCategory?.tag ? [product?.subCategory?.tag] : [],
      ...(product?.id ? { excludes: [product?.id] } : {})
    }),
    getFilterProductService(db, {
      keys: product?.subCategory?.categoryId ? [product?.subCategory?.categoryId] : [],
      ...(product?.id ? { excludes: [product?.id] } : {})
    }),
    getVoucherAppliedAllService(db)
  ]);

  const results = {
    product: { ...product, price: moneyToNumber(product.price), discount: moneyToNumber(product.discount) },
    dataRelatedProducts: dataRelatedProducts?.status === 'fulfilled' ? dataRelatedProducts.value : [],
    dataHintProducts: dataHintProducts?.status === 'fulfilled' ? dataHintProducts.value : [],
    dataVouchers: dataVouchers?.status === 'fulfilled' ? dataVouchers.value : []
  };
  return results;
};
export const getInitAdminPageService = async (db: PrismaClient) => {
  const results: any = await Promise.allSettled([
    getAllProductService(db, { userRole: UserRole.ADMIN }),
    getOverviewRevenueService(db, { period: '_all' }),
    getAllActivitiesService(db, {
      limit: 10,
      filters: {
        dateFrom: undefined,
        dateTo: undefined
      }
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
export const getInitReportPageService = async (
  db: PrismaClient,
  input: { startTime?: number; endTime?: number; period: Period }
) => {
  const { startTime, endTime } = input;
  const queryOverview = { startTime, endTime, period: 'custom' as Period };
  const [
    overview,
    topUsers,
    revenueByCategories,
    topProducts,
    revenueByOrderStatus,
    distributionProducts,
    recentActivitiesApp
  ] = await Promise.all([
    getOverviewRevenueService(db, queryOverview),
    getTopUsersService(db, queryOverview),
    getRevenueByCategoryService(db, queryOverview),
    getTopProductsService(db, queryOverview),
    getRevenueOrderStatusService(db, queryOverview),
    getDistributionProductsService(db, queryOverview),
    getAllActivitiesService(db, {
      limit: 10,
      filters: {
        dateFrom: dayjs(queryOverview?.startTime).toDate(),
        dateTo: dayjs(queryOverview?.endTime).toDate()
      }
    })
  ]);

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

export const getInitAboutUs = async (db: PrismaClient) => {
  const [restaurant, productBestSaler, topReviews] = await Promise.all([
    withRedisCache('restaurant:getOneActiveClient', () => getOneActiveClientService(db), 60 * 60 * 24),
    findProductService(db, {
      limit: 3,
      page: 1,
      loai: 'san-pham-ban-chay',
      userRole: UserRole.CUSTOMER,
      sort: [],
      'nguyen-lieu': []
    }),
    findReviewService(db, {
      page: 1,
      limit: 3,
      sort: ['rating-desc'],
      options: {
        distinct: ['userId']
      }
    })
  ]);

  return {
    restaurant,
    productBestSaler,
    topReviews
  };
};
