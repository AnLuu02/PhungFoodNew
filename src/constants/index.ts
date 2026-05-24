import { UserLevel } from '@prisma/client';

export const EMPTY_STRING = '';
export const VND_SYMBOL = '₫';
export const USD_SYMBOL = '$';

export const HEIGHT_HEADER = 110;
export const HEIGHT_HEADER_AND_BREADCRUMB = HEIGHT_HEADER + 100;
export const TOP_POSITION_STICKY = 70;
export const breakpoints = {
  xs: 576,
  sm: 768,
  md: 992,
  lg: 1200,
  xl: 1408
};

export const categoryMaterials = {
  'thit-tuoi': 'Thịt tươi',
  'hai-san': 'Hải sản',
  'rau-cu': 'Rau củ',
  'cac-loai-nam': 'Các loại nấm',
  'thuc-pham-che-bien': 'Thực phẩm chế biến',
  'san-pham-tu-trung': 'Sản phẩm từ trứng',
  'gia-vi': 'Gia vị',
  'gia-vi-tuoi': 'Gia vị tươi',
  'tinh-bot': 'Tinh bột',
  'trai-cay': 'Trái cây',
  'cac-loai-hat': 'Các loại hạt',
  'dau-&-che-pham': 'Đậu & chế phẩm'
};

export const infoUserLevel = [
  {
    value: 0,
    key: UserLevel.BRONZE,
    minPoint: 0,
    maxPoint: 499,
    viName: 'ĐỒNG',
    enName: 'BRONZE',
    color: '#3F2627',
    thumbnail: 'rank_dong.png',
    nextLevel: UserLevel.SILVER
  },
  {
    value: 1,
    key: UserLevel.SILVER,
    minPoint: 500,
    maxPoint: 999,
    viName: 'BẠC',
    enName: 'SILVER',
    color: '#64707A',
    thumbnail: 'rank_bac.png',
    nextLevel: UserLevel.GOLD
  },
  {
    value: 2,
    key: UserLevel.GOLD,
    minPoint: 1000,
    maxPoint: 1999,
    viName: 'VÀNG',
    enName: 'GOLD',
    color: '#523917',
    thumbnail: 'rank_vang.png',
    nextLevel: UserLevel.PLATINUM
  },
  {
    value: 3,
    key: UserLevel.PLATINUM,
    minPoint: 2000,
    maxPoint: 4999,
    viName: 'BẠCH KIM',
    enName: 'PLATINUM',
    color: '#4183A7',
    thumbnail: 'rank_bk.png',
    nextLevel: UserLevel.DIAMOND
  },
  {
    value: 4,
    key: UserLevel.DIAMOND,
    minPoint: 5000,
    maxPoint: 9999,
    viName: 'KIM CƯƠNG',
    enName: 'DIAMOND',
    color: '#5F77C3',
    thumbnail: 'rank_kc.png',
    nextLevel: UserLevel.DIAMOND
  }
];

export const getInfoLevelUser = (key: UserLevel) => {
  switch (key) {
    case UserLevel.BRONZE:
      return infoUserLevel[0] as any;
    case UserLevel.SILVER:
      return infoUserLevel[1] as any;
    case UserLevel.GOLD:
      return infoUserLevel[2] as any;
    case UserLevel.PLATINUM:
      return infoUserLevel[3] as any;
    case UserLevel.DIAMOND:
      return infoUserLevel[4] as any;
    default:
      return infoUserLevel[0] as any;
  }
};
