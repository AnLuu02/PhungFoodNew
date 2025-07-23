import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { formatPriceLocaleVi } from './formatPrice';

export const generatePDF = async (invoiceData: any): Promise<Buffer> => {
  try {
    const discount =
      invoiceData?.orderItems?.reduce((sum: number, item: any) => {
        const itemDiscount = item.discount || item.product?.discount || 0;
        return sum + itemDiscount * item.quantity;
      }, 0) || 0;

    const subtotal =
      invoiceData?.orderItems?.reduce((total: number, item: any) => total + item.price * item.quantity, 0) || 0;

    const tax = Math.round((subtotal - discount) * 0.1);
    const finalTotal = subtotal - discount + tax;

    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    let customFont;
    try {
      const fontPath = path.join(process.cwd(), 'public', 'fonts', 'Roboto-VariableFont_wdth,wght.ttf');
      if (fs.existsSync(fontPath)) {
        const fontBytes = fs.readFileSync(fontPath);
        customFont = await pdfDoc.embedFont(fontBytes);
      } else {
        console.warn('Custom font not found, using Helvetica');
        customFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      }
    } catch (error) {
      console.error('Error loading font:', error);
      customFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    }

    let logoImage;
    try {
      const logoPath = path.join(process.cwd(), 'public', 'logo', 'logo_phungfood_1.png');
      if (fs.existsSync(logoPath)) {
        const logoBytes = fs.readFileSync(logoPath);
        logoImage = await pdfDoc.embedPng(logoBytes);
      }
    } catch (error) {
      console.error('Error loading logo:', error);
    }

    const page = pdfDoc.addPage([595, 842]);
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

    const title = 'HÓA ĐƠN BÁN HÀNG';
    page.drawText(title, {
      x: centerX - customFont.widthOfTextAtSize(title, 18) / 2,
      y: y,
      size: 18,
      font: customFont,
      color: rgb(0, 0, 0)
    });
    y -= 30;

    page.drawText(`Thu Ngân: An Luu`, {
      x: margin,
      y: y,
      size: 10,
      font: customFont,
      color: rgb(0, 0, 0)
    });
    y -= 20;

    page.drawText(`Seller: An Luu`, {
      x: margin,
      y: y,
      size: 10,
      font: customFont,
      color: rgb(0, 0, 0)
    });
    y -= 20;

    page.drawText(`Khách Hàng: ${invoiceData?.user?.name || 'Khách lẻ'}`, {
      x: margin,
      y: y,
      size: 10,
      font: customFont,
      color: rgb(0, 0, 0)
    });
    y -= 30;

    const tableTop = y;
    const tableWidth = width - 2 * margin;
    const colWidths: any = [30, 190, 40, 75, 75, 135];
    const colStarts = colWidths.reduce((acc: any, width: any, index: any) => {
      const start = index === 0 ? margin : acc[index - 1] + colWidths[index - 1];
      acc.push(start);
      return acc;
    }, [] as number[]);

    const rowHeight = 25;
    page.drawRectangle({
      x: margin,
      y: tableTop - rowHeight,
      width: tableWidth,
      height: rowHeight,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1
    });

    const headers = ['STT', 'Sản phẩm', 'SL', 'Giá', 'Giảm giá', 'Thành tiền'];
    headers.forEach((header, i) => {
      page.drawText(header, {
        x: colStarts[i] + 5,
        y: tableTop - 15,
        size: 10,
        font: customFont,
        color: rgb(0, 0, 0)
      });

      if (i < headers.length - 1) {
        page.drawLine({
          start: { x: colStarts[i + 1], y: tableTop },
          end: { x: colStarts[i + 1], y: tableTop - rowHeight },
          thickness: 1,
          color: rgb(0, 0, 0)
        });
      }
    });

    y = tableTop - rowHeight;

    if (invoiceData?.orderItems && invoiceData.orderItems.length > 0) {
      invoiceData.orderItems.forEach((item: any, index: number) => {
        const itemTotal = item.price * item.quantity;
        const itemDiscount = (item.discount || item.product?.discount || 0) * item.quantity;
        const finalItemTotal = itemTotal - itemDiscount;

        page.drawRectangle({
          x: margin,
          y: y - rowHeight,
          width: tableWidth,
          height: rowHeight,
          borderColor: rgb(0, 0, 0),
          borderWidth: 1
        });

        const rowData = [
          (index + 1).toString(),
          item.product?.name || 'SP Không xác định',
          item.quantity.toString(),
          formatPriceLocaleVi(item.price),
          formatPriceLocaleVi(item.discount || item.product?.discount || 0),
          formatPriceLocaleVi(finalItemTotal)
        ];

        rowData.forEach((value, i) => {
          let displayValue = value;
          if (i === 1 && customFont.widthOfTextAtSize(value, 10) > colWidths[i] - 10) {
            let truncated = value;
            while (customFont.widthOfTextAtSize(truncated + '...', 10) > colWidths[i] - 10 && truncated.length > 0) {
              truncated = truncated.slice(0, -1);
            }
            displayValue = truncated + '...';
          }

          page.drawText(displayValue, {
            x: colStarts[i] + 5,
            y: y - 15,
            size: 10,
            font: customFont,
            color: rgb(0, 0, 0)
          });

          if (i < rowData.length - 1) {
            page.drawLine({
              start: { x: colStarts[i + 1], y: y },
              end: { x: colStarts[i + 1], y: y - rowHeight },
              thickness: 1,
              color: rgb(0, 0, 0)
            });
          }
        });

        y -= rowHeight;
      });
    } else {
      page.drawRectangle({
        x: margin,
        y: y - rowHeight,
        width: tableWidth,
        height: rowHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1
      });

      page.drawText('Không có sản phẩm', {
        x: centerX - customFont.widthOfTextAtSize('Không có sản phẩm', 10) / 2,
        y: y - 15,
        size: 10,
        font: customFont,
        color: rgb(0, 0, 0)
      });

      y -= rowHeight;
    }

    y -= 20;

    const summaryLabels: any = ['Tổng hoá đơn:', 'Giảm giá:', 'Khuyến mãi (voucher):', 'Thuế (10%):', 'Giá cuối:'];

    const summaryValues: any = [
      formatPriceLocaleVi(subtotal),
      '- ' + formatPriceLocaleVi(discount),
      '- 0₫',
      '- ' + formatPriceLocaleVi(tax),
      formatPriceLocaleVi(finalTotal)
    ];

    for (let i = 0; i < summaryLabels.length; i++) {
      const isLastItem = i === summaryLabels.length - 1;
      const fontSize = isLastItem ? 12 : 10;
      const fontColor = isLastItem ? rgb(0.8, 0, 0) : rgb(0, 0, 0);

      page.drawText(summaryLabels[i], {
        x: margin,
        y: y,
        size: fontSize,
        font: customFont,
        color: fontColor
      });

      page.drawText(summaryValues[i], {
        x: width - margin - customFont.widthOfTextAtSize(summaryValues[i], fontSize),
        y: y,
        size: fontSize,
        font: customFont,
        color: fontColor
      });

      y -= 20;
    }

    y -= 20;

    const thankYouMsg = 'CẢM ƠN QUÝ KHÁCH ĐÃ TIN TƯỞNG PHUNGFOOD!';
    page.drawText(thankYouMsg, {
      x: centerX - customFont.widthOfTextAtSize(thankYouMsg, 12) / 2,
      y: y,
      size: 12,
      font: customFont,
      color: rgb(0, 0, 0)
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF invoice');
  }
};
