import { ImageType } from '@prisma/client';
import { ImageServerInput } from '~/shared/schema/image.schema';
import { getOptimizedUrl, OptimizeOptions } from '../Cloudinary/client';

export const getImageUrl = (data: { type: ImageType; url: string }[], key: ImageType) => {
  const image = data.find(p => p.type === key);
  if (image && image?.url) {
    return image?.url;
  }
  return '/images/jpg/empty-300x240.jpg';
};

export const getInjectedImageUrl = (
  imagesData: ImageServerInput[] | null | undefined,
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
