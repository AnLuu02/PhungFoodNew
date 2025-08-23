import { LocalImageType } from '../zod/EnumType';

export const getImageProduct = (data: any, key: LocalImageType) => {
  const image = data?.find((p: any) => p.type === key);
  if (image && image?.url) {
    return image?.url;
  } else {
    return '/images/jpg/empty-300x240.jpg';
  }
};
