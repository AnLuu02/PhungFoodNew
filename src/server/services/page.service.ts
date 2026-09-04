import { PrismaClient } from '@prisma/client';
import { Session } from 'next-auth';
import { withRedisCache } from '~/lib/CacheConfig/withRedisCache';
import dayjs from '~/lib/dayjs';
import { moneyToNumber } from '~/lib/FuncHandler/Format';
import { RESTAURANT_KEY } from '~/shared/constants/redis-keys';
import { UserRole } from '~/shared/constants/user.constants';
import { Period } from '~/shared/types';
import { getAllActivitiesService } from './activityLogger.service';
import { getCategoriesWithRelationBasicService } from './category.service';
import { findProductService, getFilterProductService, getOneProductService } from './product.service';
import { getOneBannerService } from './restaurant.banner.service';
import { getBaseRestaurantActiveClientService } from './restaurant.service';
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

export const getInitPageService = async (db: PrismaClient, session: Session | null) => {
  const [banners, categories] = await Promise.all([
    getOneBannerService(db, session),
    getCategoriesWithRelationBasicService(db)
  ]);

  return {
    banners,
    categories
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
    withRedisCache(RESTAURANT_KEY.active, () => getBaseRestaurantActiveClientService(db), 60 * 60 * 24),
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
