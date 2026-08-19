import { ImageType } from '@prisma/client';
import { ImageFromDb } from '~/shared/schema/image.schema';
import { getOptimizedUrl, OptimizeOptions } from '../Cloudinary/client';

export const getImageProduct = (data: any, key: ImageType) => {
  const images = data ?? [];
  const size = images.length;

  if (size === 1) {
    return images[0]?.image?.url;
  } else {
    const image = data?.find((p: any) => p?.type === key);
    if (image && image?.image?.url) {
      return image?.image?.url;
    }
  }

  return '/images/jpg/empty-300x240.jpg';
};

export const getImageUrl = (data: { type: ImageType; url: string }[], key: ImageType) => {
  const image = data.find(p => p.type === key);
  if (image && image?.url) {
    return image?.url;
  }
  return '/images/jpg/empty-300x240.jpg';
};

export const getInjectedImageUrl = (
  imagesData: ImageFromDb[] | null | undefined,
  type: ImageType | string,
  options: OptimizeOptions = {}
): string => {
  const image = imagesData?.find(img => img.type === type);
  if (!image || !image.url) {
    return '/images/jpg/empty-300x240.jpg';
  }

  const originUrl = image.url;

  if (!originUrl.includes('cloudinary.com')) {
    return originUrl;
  }

  return getOptimizedUrl(originUrl, options);
};
