import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { formatPriceLocaleVi } from '~/app/lib/utils/format/formatPrice';

export const generatePDF = async (invoiceData: any): Promise<Buffer> => {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const fontPath = path.join(process.cwd(), 'public', 'fonts', 'my-font-mergeblack.ttf');
  let customFont;
  if (fs.existsSync(fontPath)) {
    const fontBytes = fs.readFileSync(fontPath);
    customFont = await pdfDoc.embedFont(fontBytes);
  } else {
    customFont = await pdfDoc.embedStandardFont(StandardFonts.Helvetica);
  }

  const logoPath = path.join(process.cwd(), 'public', 'logo', 'logo_phungfood_1.png');
  let logoImage;
  if (fs.existsSync(logoPath)) {
    const logoBytes = fs.readFileSync(logoPath);
    logoImage = await pdfDoc.embedPng(logoBytes);
  }

  const page = pdfDoc.addPage([600, 800]);
  const { width, height } = page.getSize();

  let y = height - 50;

  if (logoImage) {
    page.drawImage(logoImage, { x: 180, y: y - 60, width: 240, height: 80 });
    y -= 80;
  }
  page.drawText('Đầu lộ Tân Thành, khóm 9, phường 6, Cà Mau', { x: 140, y: y - 20, size: 14, font: customFont });
  page.drawText('webp/hotline: 0937842680', { x: 230, y: y - 40, size: 14, font: customFont });
  page.drawText('https://www.phungfood.vn', { x: 190, y: y - 60, size: 14, font: customFont });
  y -= 90;

  page.drawText('HÓA ĐƠN BÁN HÀNG', { x: 200, y: y, size: 24, font: customFont });
  y -= 40;

  page.drawText(`Thu Ngân: An Luu`, { x: 50, y: y, size: 14, font: customFont });
  page.drawText(`Seller: An Luu`, { x: 50, y: y - 20, size: 14, font: customFont });
  page.drawText(`Khách Hàng: ${invoiceData?.user?.name || 'Khách lẻ'}`, {
    x: 50,
    y: y - 40,
    size: 14,
    font: customFont
  });
  y -= 80;

  const headers = ['STT', 'Sản phẩm', 'SL', 'Giá', 'Giảm', 'Tổng'];
  const columnWidths = [30, 200, 40, 80, 80, 80];
  const xStart = 50;

  page.drawRectangle({
    x: xStart,
    y: y - 5,
    width: columnWidths.reduce((a, b) => a + b, 0),
    height: 25,
    borderWidth: 1,
    borderColor: rgb(0, 0, 0)
  });

  headers.forEach((header, index) => {
    page.drawText(header, {
      x: xStart + columnWidths.slice(0, index).reduce((a, b) => a + b, 0) + 5,
      y: y,
      size: 12,
      font: customFont
    });
  });
  let xPos = xStart;
  columnWidths.forEach(width => {
    xPos += width;
    page.drawLine({
      start: { x: xPos, y: y + 20 },
      end: { x: xPos, y: y - invoiceData?.orderItems?.length * 25 },
      thickness: 1,
      color: rgb(0, 0, 0)
    });
  });

  y -= 25;

  invoiceData?.orderItems?.forEach((item: any, index: number) => {
    const values = [
      `${index + 1}`,
      item?.product?.name || 'SP Không xác định',
      `${item?.quantity || 1}`,
      formatPriceLocaleVi(item?.price || 0),
      formatPriceLocaleVi(item?.product?.discount || 0),
      formatPriceLocaleVi(
        (item?.price || 0) * (item?.quantity || 0) - (item?.product?.discount || 0) * (item?.quantity || 0)
      )
    ];

    page.drawRectangle({
      x: xStart,
      y: y - 5,
      width: columnWidths.reduce((a, b) => a + b, 0),
      height: 25,
      borderWidth: 1,
      borderColor: rgb(0, 0, 0)
    });

    values.forEach((value, colIndex) => {
      page.drawText(value, {
        x: xStart + columnWidths.slice(0, colIndex).reduce((a, b) => a + b, 0) + 5,
        y: y,
        size: 12,
        font: customFont
      });
    });
    xPos = xStart;
    columnWidths.forEach(width => {
      xPos += width;
      page.drawLine({
        start: { x: xPos, y: y + 20 },
        end: { x: xPos, y: y - 5 },
        thickness: 1,
        color: rgb(0, 0, 0)
      });
    });

    y -= 25;
  });

  y -= 20;
  page.drawText(`Tổng hóa đơn: ${invoiceData?.total || 0} VND`, { x: 50, y: y, size: 14, font: customFont });
  y -= 20;
  page.drawText(`Giảm giá: -${invoiceData?.discount || 0} VND`, { x: 50, y: y, size: 14, font: customFont });
  y -= 20;
  page.drawText(`Thuế (10%): -${invoiceData?.tax || 0} VND`, { x: 50, y: y, size: 14, font: customFont });
  y -= 20;
  page.drawText(`Giá cuối: ${invoiceData?.finalTotal || 0} VND`, {
    x: 50,
    y: y,
    size: 16,
    font: customFont,
    color: rgb(1, 0, 0)
  });

  y -= 40;
  page.drawText('CẢM ƠN QUÝ KHÁCH ĐÃ TIN TƯỞNG PHUNGFOOD!', { x: 100, y: y, size: 14, font: customFont });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
};
