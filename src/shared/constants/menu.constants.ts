export const priceRanges = [
  {
    minPrice: 0,
    maxPrice: 50000,
    label: 'Dưới 50.000đ'
  },
  {
    minPrice: 50000,
    maxPrice: 100000,
    label: 'Từ 50.000đ - 100.000đ'
  },
  {
    minPrice: 100000,
    maxPrice: 200000,
    label: 'Từ 100.000đ - 200.000đ'
  },
  {
    minPrice: 200000,
    maxPrice: 500000,
    label: 'Từ 300.000đ - 500.000đ'
  }
];
export const dataSort = [
  {
    name: 'Mới nhất',
    tag: 'updatedAt-desc'
  },
  {
    name: 'Giá từ thấp đến cao',
    tag: 'price-asc'
  },
  {
    name: 'Giá từ cao đến thấp',
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
    name: 'Đánh giá cao',
    tag: 'rating-desc'
  },
  {
    name: 'Bán chạy',
    tag: 'soldQuantity-desc'
  }
];
