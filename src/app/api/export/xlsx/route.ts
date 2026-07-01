import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import {
  getCategoriesData,
  getContactData,
  getMaterialData,
  getOrderData,
  getProductData,
  getReviewData,
  getSubCategoriesData,
  getUserData,
  getVoucherData
} from '~/lib/FuncHandler/Export/export-data';
import { moneyToNumber } from '~/lib/FuncHandler/Format';
import { getServerAuthSession } from '~/server/auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const limit = searchParams.get('limit');
  const page = searchParams.get('page');
  const s = searchParams.get('s') ?? undefined;

  try {
    const session = await getServerAuthSession();
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    let exportData: any[] = [];
    let sheetName = 'Data';
    let filename = `Export_${type}_${Date.now()}.xlsx`;

    switch (type) {
      case 'products':
        exportData = await getProductData({ limit: moneyToNumber(limit), page: moneyToNumber(page), s });
        sheetName = 'Mặc hàng';
        break;
      case 'materials':
        exportData = await getMaterialData({ limit: moneyToNumber(limit), page: moneyToNumber(page), s });
        sheetName = 'Nguyên liệu';
        break;
      case 'contacts':
        exportData = await getContactData({ limit: moneyToNumber(limit), page: moneyToNumber(page), s });
        sheetName = 'Liên hệ / hợp tác';
        break;
      case 'categories':
        exportData = await getCategoriesData({ limit: moneyToNumber(limit), page: moneyToNumber(page), s });
        sheetName = 'Danh Mục';
        break;
      case 'subCategories':
        exportData = await getSubCategoriesData({ limit: moneyToNumber(limit), page: moneyToNumber(page), s });
        sheetName = 'Danh Mục Con';
        break;
      case 'reviews':
        exportData = await getReviewData({ limit: moneyToNumber(limit), page: moneyToNumber(page), s });
        sheetName = 'Đánh giá';
        break;
      case 'vouchers':
        exportData = await getVoucherData({ limit: moneyToNumber(limit), page: moneyToNumber(page), s });
        sheetName = 'Mã giảm giá';
        break;
      case 'orders':
        exportData = await getOrderData({ limit: moneyToNumber(limit), page: moneyToNumber(page), s });
        sheetName = 'Đơn hàng';
        break;
      case 'users':
        exportData = await getUserData({ limit: moneyToNumber(limit), page: moneyToNumber(page), s });
        sheetName = 'Người dùng';
        break;
      default:
        return new NextResponse('Loại dữ liệu export không hợp lệ', { status: 400 });
    }

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    console.error(`Lỗi export ${type}:`, error);
    return new NextResponse('Lỗi máy chủ nội bộ', { status: 500 });
  }
}
