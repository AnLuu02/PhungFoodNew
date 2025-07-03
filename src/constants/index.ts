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
  SUPER_ADMIN: 'SUPER_ADMIN',
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
