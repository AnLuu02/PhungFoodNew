import { ReadonlyURLSearchParams } from 'next/navigation';
import tags from '~/constants/tags-vi';

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

type QueryData = Record<string, string | undefined>;
export function getTagFromQuery(query: ReadonlyURLSearchParams | QueryData, tags: Record<string, string>): string {
  const s: QueryData = query instanceof ReadonlyURLSearchParams ? Object.fromEntries(query.entries()) : query;
  const { loai, 'danh-muc': danhMuc, 'loai-san-pham': loaiSanPham } = s;
  if (loai && tags[loai]) return tags[loai];
  if (danhMuc && loaiSanPham && tags[loaiSanPham]) return tags[loaiSanPham];
  if (danhMuc && tags[danhMuc]) return tags[danhMuc];
  if (loai || (danhMuc && loaiSanPham)) return 'Loại sản phẩm';
  if (danhMuc) return 'Danh mục sản phẩm';
  return 'Tất cả';
}
export function getViTag(tag: any) {
  if (tags?.[tag]) {
    return tags?.[tag];
  }
  return tag;
}
