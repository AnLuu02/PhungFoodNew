import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { formatDateViVN, formatPriceLocaleVi } from './Format';

interface ReportData {
  revenuePeriod: any;

  totalUsers: any;
  totalOrders: any;
  totalFinalRevenue: any;
  recentUsers: any;
  recentOrders: any;
  revenueByCategory: any;
  topUsers: any;
}

export const generateReportPDF = async (reportData: ReportData): Promise<Buffer> => {
  try {
    const pdfDoc = await PDFDocument.create();
    pdfDoc?.registerFontkit(fontkit);

    let customFont;
    try {
      const fontPath = path.join(process.cwd(), 'public', 'fonts', 'Roboto-VariableFont_wdth,wght.ttf');
      if (fs.existsSync(fontPath)) {
        const fontBytes = fs.readFileSync(fontPath);
        customFont = await pdfDoc?.embedFont(fontBytes);
      } else {
        customFont = await pdfDoc?.embedFont(StandardFonts.Helvetica);
      }
    } catch {
      customFont = await pdfDoc?.embedFont(StandardFonts.Helvetica);
    }

    let logoImage;
    try {
      const logoPath = path.join(process.cwd(), 'public', 'logo', 'logo_phungfood_1.png');
      if (fs.existsSync(logoPath)) {
        const logoBytes = fs.readFileSync(logoPath);
        logoImage = await pdfDoc?.embedPng(logoBytes);
      }
    } catch {}

    let page = pdfDoc?.addPage([595, 842]);
    const { width, height } = page.getSize();
    const margin = 50;
    const centerX = width / 2;
    let y = height - margin;

    if (logoImage) {
      const logoWidth = 200;
      const logoHeight = 70;
      page.drawImage(logoImage, {
        x: centerX - logoWidth / 2,
        y: y - logoHeight,
        width: logoWidth,
        height: logoHeight
      });
      y -= logoHeight + 20;
    } else {
      page.drawText("Mama's restaurant", {
        x: centerX - customFont.widthOfTextAtSize("Mama's restaurant", 24) / 2,
        y: y,
        size: 24,
        font: customFont,
        color: rgb(0, 0.8, 0.4)
      });
      y -= 30;
    }

    const address = 'Đầu lộ Tân Thành, khóm 9, phường 6, Cà Mau';
    page.drawText(address, {
      x: centerX - customFont.widthOfTextAtSize(address, 10) / 2,
      y: y,
      size: 10,
      font: customFont,
      color: rgb(0, 0, 0)
    });
    y -= 20;

    const contact = 'webp/hotline: 0937842680';
    page.drawText(contact, {
      x: centerX - customFont.widthOfTextAtSize(contact, 10) / 2,
      y: y,
      size: 10,
      font: customFont,
      color: rgb(0, 0, 0)
    });
    y -= 20;

    const website = process.env.NEXT_PUBLIC_BASE_URL_DEPLOY || 'phung-food-new.vercel.app';
    page.drawText(website, {
      x: centerX - customFont.widthOfTextAtSize(website, 10) / 2,
      y: y,
      size: 10,
      font: customFont,
      color: rgb(0, 0.4, 0.8)
    });
    y -= 40;

    const title = 'BÁO CÁO TỔNG HỢP';
    page.drawText(title, {
      x: centerX - customFont.widthOfTextAtSize(title, 18) / 2,
      y: y,
      size: 18,
      font: customFont,
      color: rgb(0, 0, 0)
    });
    y -= 40;

    const drawTable = (
      headers: string[],
      rows: string[][],
      colWidths: number[],
      startX: number,
      startY: number,
      page: any,
      pdfDoc: PDFDocument,
      customFont: any
    ) => {
      const rowHeight = 25;
      let y = startY;
      const pageHeight = 842;
      const margin = 50;

      const ensureSpace = (needed: number) => {
        if (y - needed < margin) {
          page = pdfDoc.addPage([595, 842]);
          y = pageHeight - margin;
        }
      };

      ensureSpace(rowHeight);
      headers.forEach((h, i) => {
        const cellX = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
        page.drawRectangle({
          x: cellX,
          y: y - rowHeight,
          width: colWidths[i],
          height: rowHeight,
          borderWidth: 1,
          borderColor: rgb(0.2, 0.2, 0.2),
          color: rgb(0.9, 0.95, 1)
        });
        page.drawText(h, {
          x: cellX + 5,
          y: y - rowHeight + 7,
          size: 11,
          font: customFont
        });
      });
      y -= rowHeight;

      rows.forEach(row => {
        ensureSpace(rowHeight);
        row.forEach((val, i) => {
          const cellX = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
          page.drawRectangle({
            x: cellX,
            y: y - rowHeight,
            width: colWidths[i],
            height: rowHeight,
            borderWidth: 1,
            borderColor: rgb(0.8, 0.8, 0.8)
          });
          page.drawText(val ?? '', {
            x: cellX + 5,
            y: y - rowHeight + 7,
            size: 10,
            font: customFont
          });
        });
        y -= rowHeight;
      });

      return { y, page };
    };

    page.drawText('Tổng quan:', {
      x: margin,
      y,
      size: 14,
      font: customFont,
      color: rgb(0, 0.3, 0.7)
    });
    y -= 15;

    let result = drawTable(
      ['Chỉ số'],
      [
        [`Tổng doanh thu: ${formatPriceLocaleVi(Number(reportData.totalFinalRevenue)) || 0}`],
        [`Tổng người dùng: ${reportData.totalUsers}`],
        [`Tổng đơn hàng: ${reportData.totalOrders}`]
      ],
      [500],
      margin,
      y,
      page,
      pdfDoc,
      customFont
    );

    y = result.y;
    page = result.page;
    y -= 50;

    page.drawText('Doanh thu 7 ngày gần nhất:', {
      x: margin,
      y,
      size: 14,
      font: customFont,
      color: rgb(0, 0.3, 0.7)
    });
    y -= 15;
    result = drawTable(
      ['Ngày', 'Doanh thu'],
      reportData.revenuePeriod?.map((d: any) => [d?.date, formatPriceLocaleVi(d?.revenue)]),
      [250, 250],
      margin,
      y,
      page,
      pdfDoc,
      customFont
    );
    y = result.y;
    page = result.page;
    y -= 50;

    if (reportData.recentOrders.length > 0) {
      page.drawText('Đơn hàng gần đây:', {
        x: margin,
        y,
        size: 14,
        font: customFont,
        color: rgb(0, 0.3, 0.7)
      });
      y -= 15;
      result = drawTable(
        ['ID', 'Khách hàng', 'Tổng tiền', 'Ngày'],
        reportData.recentOrders
          .slice(0, 5)
          .map((o: any) => [
            String(o?.id),
            String(o?.user?.name ?? ''),
            formatPriceLocaleVi(o?.finalTotal),
            formatDateViVN(o?.updatedAt)
          ]),
        [150, 150, 100, 100],
        margin,
        y,
        page,
        pdfDoc,
        customFont
      );
      y = result.y;
      page = result.page;
      y -= 50;
    }

    if (reportData?.recentUsers.length > 0) {
      page.drawText('Người dùng mới:', {
        x: margin,
        y,
        size: 14,
        font: customFont,
        color: rgb(0, 0.3, 0.7)
      });
      y -= 15;
      result = drawTable(
        ['Tên', 'Email', 'Ngày tạo'],
        reportData.recentUsers
          .slice(0, 5)
          .map((u: any) => [String(u?.name ?? ''), String(u?.email ?? ''), formatDateViVN(u?.createdAt)]),
        [150, 200, 150],
        margin,
        y,
        page,
        pdfDoc,
        customFont
      );
      y = result.y;
      page = result.page;
      y -= 30;
    }

    page = pdfDoc.addPage([595, 842]);
    y = height - margin;
    if (reportData?.topUsers.length > 0) {
      page.drawText('Top người dùng:', {
        x: margin,
        y,
        size: 14,
        font: customFont,
        color: rgb(0, 0.3, 0.7)
      });
      y -= 15;
      result = drawTable(
        ['#', 'Tên', 'Tổng chi tiêu'],
        reportData.topUsers
          .slice(0, 5)
          .map((u: any, i: number) => [
            String(i + 1),
            String(u?.name ?? ''),
            formatPriceLocaleVi(Number(u?.totalSpent))
          ]),
        [50, 250, 150],
        margin,
        y,
        page,
        pdfDoc,
        customFont
      );
      y = result.y;
      page = result.page;
      y -= 50;
    }

    page.drawText('Doanh thu theo danh mục:', {
      x: margin,
      y,
      size: 14,
      font: customFont,
      color: rgb(0, 0.3, 0.7)
    });
    y -= 15;
    result = drawTable(
      ['Danh mục', 'Doanh thu'],
      reportData.revenueByCategory.map((c: any) => [String(c?.category), formatPriceLocaleVi(c?.revenue)]),
      [300, 200],
      margin,
      y,
      page,
      pdfDoc,
      customFont
    );
    y = result.y;
    page = result.page;
    y -= 50;
    const addFooter = (page: any, pageNumber: number, totalPages: number, font: any) => {
      const { width } = page.getSize();
      const margin = 50;
      const footerY = 30;

      const now = new Date();
      const dateText = `Xuất ngày: ${now.toLocaleDateString('vi-VN')} ${now.toLocaleTimeString('vi-VN')}`;

      const copyright = '© 2025 PhungFood. All rights reserved.';

      const pageText = `Trang ${pageNumber}/${totalPages}`;

      page.drawText(dateText, {
        x: margin,
        y: footerY,
        size: 9,
        font,
        color: rgb(0.5, 0.5, 0.5)
      });

      page.drawText(copyright, {
        x: width / 2 - font.widthOfTextAtSize(copyright, 9) / 2,
        y: footerY,
        size: 9,
        font,
        color: rgb(0.5, 0.5, 0.5)
      });

      page.drawText(pageText, {
        x: width - margin - font.widthOfTextAtSize(pageText, 9),
        y: footerY,
        size: 9,
        font,
        color: rgb(0.5, 0.5, 0.5)
      });
    };

    const pages = pdfDoc.getPages();
    pages.forEach((p, idx) => {
      addFooter(p, idx + 1, pages.length, customFont);
    });
    const pdfBytes = await pdfDoc?.save();
    return Buffer.from(pdfBytes);
  } catch (error) {
    console.error('Error generating report PDF:', error);
    throw new Error('Failed to generate PDF report');
  }
};
