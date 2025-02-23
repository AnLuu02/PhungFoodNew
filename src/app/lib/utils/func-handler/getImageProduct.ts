import { ImageType } from '@prisma/client';

export const getImageProduct = (data: any, key: ImageType) => {
  const image = data?.find((p: any) => p.type === key);
  if (image && image?.url) {
    return image?.url;
  } else {
    return '/images/jpg/empty-300x240.jpg';
  }
};
