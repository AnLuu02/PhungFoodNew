import { LocalUserLevel } from '~/lib/zod/EnumType';

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
export const UserRole = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  CUSTOMER: 'CUSTOMER'
};

export const categoriesMaterial = [
  {
    value: 'thit-tuoi',
    label: 'Thịt tươi'
  },
  {
    value: 'hai-san',
    label: 'Hải sản'
  },
  {
    value: 'rau-cu',
    label: 'Rau củ'
  },
  {
    value: 'cac-loai-nam',
    label: 'Các loại nấm'
  },
  {
    value: 'thuc-pham-chay',
    label: 'Thực phẩm chay'
  }
];

export const dataSort = [
  {
    name: 'Giá từ thấp đến cao',
    tag: 'price-asc'
  },
  {
    name: 'Giá từ cao đến thấp',
    tag: 'price-desc'
  },
  {
    name: 'Tên A-Z',
    tag: 'name-asc'
  },
  {
    name: 'Tên Z-A',
    tag: 'name-desc'
  },

  {
    name: 'Mới nhất',
    tag: 'new'
  },
  {
    name: 'Cũ nhất',
    tag: 'old'
  },
  {
    name: 'Bán chạy',
    tag: 'best-seller'
  }
];

export const priceRanges = [
  {
    value: [0, 50000],
    label: 'Dưới 50.000đ'
  },
  {
    value: [50000, 100000],
    label: 'Từ 50.000đ - 100.000đ'
  },
  {
    value: [100000, 200000],
    label: 'Từ 100.000đ - 200.000đ'
  },
  {
    value: [200000, 500000],
    label: 'Từ 300.000đ - 500.000đ'
  }
];

export const infoUserLevel = [
  {
    value: 0,
    key: LocalUserLevel.BRONZE,
    minPoint: 0,
    maxPoint: 499,
    viName: 'ĐỒNG',
    enName: 'BRONZE',
    color: '#3F2627',
    thumbnail: 'rank_dong.png',
    nextLevel: LocalUserLevel.SILVER
  },
  {
    value: 1,
    key: LocalUserLevel.SILVER,
    minPoint: 500,
    maxPoint: 999,
    viName: 'BẠC',
    enName: 'SILVER',
    color: '#64707A',
    thumbnail: 'rank_bac.png',
    nextLevel: LocalUserLevel.GOLD
  },
  {
    value: 2,
    key: LocalUserLevel.GOLD,
    minPoint: 1000,
    maxPoint: 1999,
    viName: 'VÀNG',
    enName: 'GOLD',
    color: '#523917',
    thumbnail: 'rank_vang.png',
    nextLevel: LocalUserLevel.PLATINUM
  },
  {
    value: 3,
    key: LocalUserLevel.PLATINUM,
    minPoint: 2000,
    maxPoint: 4999,
    viName: 'BẠCH KIM',
    enName: 'PLATINUM',
    color: '#4183A7',
    thumbnail: 'rank_bk.png',
    nextLevel: LocalUserLevel.DIAMOND
  },
  {
    value: 4,
    key: LocalUserLevel.DIAMOND,
    minPoint: 5000,
    maxPoint: 9999,
    viName: 'KIM CƯƠNG',
    enName: 'DIAMOND',
    color: '#5F77C3',
    thumbnail: 'rank_kc.png',
    nextLevel: LocalUserLevel.DIAMOND
  }
];

export const getInfoLevelUser = (key: LocalUserLevel) => {
  switch (key) {
    case LocalUserLevel.BRONZE:
      return infoUserLevel[0] as any;
    case LocalUserLevel.SILVER:
      return infoUserLevel[1] as any;
    case LocalUserLevel.GOLD:
      return infoUserLevel[2] as any;
    case LocalUserLevel.PLATINUM:
      return infoUserLevel[3] as any;
    case LocalUserLevel.DIAMOND:
      return infoUserLevel[4] as any;
    default:
      return infoUserLevel[0] as any;
  }
};
