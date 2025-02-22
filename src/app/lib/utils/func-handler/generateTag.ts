import tags from '../constants/tags-vi';

export const createTag = (input: string): string => {
  return input
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/-$/, '');
};

export function getTagFromQuery(queryString: any) {
  const query = Object.fromEntries(new URLSearchParams(queryString));
  const { loai, 'danh-muc': danhMuc, 'loai-san-pham': loaiSanPham } = query;
  if (loai) {
    return tags?.[loai] || tags?.loai || 'Loại sản phẩm';
  }

  if (danhMuc && loaiSanPham) {
    return tags?.[loaiSanPham] || tags?.loaiSanPham || 'Loại sản phẩm';
  }

  if (danhMuc) {
    return tags?.[danhMuc] || tags?.danhMuc || 'Danh mục sản phẩm';
  }

  return 'Tất cả';
}
