import nodemailer from 'nodemailer';
import { formatPriceLocaleVi } from './Format';

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  }
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: `PhungFood  <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html
  });
};

export const getOtpEmail = (otp: string, user: any, timeExpiredMinutes: number) => `
  <div style="font-family: Arial, sans-serif; background-color: #f6f6f6; padding: 40px 0;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden;">
            
            <tr>
              <td align="center" style="padding: 30px 20px; border-bottom: 1px solid #e5e5e5;">
                <img src="${process.env.NEXT_PUBLIC_BASE_URL_DEPLOY}/logo/logo_phungfood_1.png" alt="Company Logo" width="200" style="margin-bottom: 10px;" />
                <h1 style="margin: 0; font-size: 22px; color: #1a1a1a;">Xác minh địa chỉ email của bạn</h1>
              </td>
            </tr>

            <tr>
              <td style="padding: 30px 40px;">
                ${
                  user?.name
                    ? `<p style="margin: 0 0 16px; font-size: 16px; color: #333;">Xin chào <strong>${user.name}</strong>,</p>`
                    : ''
                }
                <p style="margin: 0 0 24px; font-size: 16px; color: #4a4a4a; line-height: 1.6;">
                  Cảm ơn bạn đã đăng ký! Vui lòng sử dụng mã xác minh bên dưới để hoàn tất quá trình đăng ký tài khoản:
                </p>

                <div style="text-align: center; margin: 30px 0;">
                  <p style="
                    display: inline-block;
                    background-color: #f5f7fa;
                    border: 1px solid #dcdfe3;
                    border-radius: 8px;
                    padding: 16px 40px;
                    font-size: 28px;
                    font-weight: bold;
                    letter-spacing: 6px;
                    color: #1a1a1a;
                  ">
                    ${otp}
                  </p>
                </div>

                <p style="margin: 24px 0 0; font-size: 14px; color: #737373; line-height: 1.6;">
                  Mã này sẽ hết hạn sau <strong>${timeExpiredMinutes} phút</strong>. Nếu bạn không yêu cầu, vui lòng bỏ qua email này.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding: 20px 40px; border-top: 1px solid #e5e5e5; text-align: center;">
                <p style="margin: 0; font-size: 13px; color: #a3a3a3;">
                  Đây là email tự động, vui lòng không trả lời lại.
                </p>
              </td>
            </tr>
          </table>

          <table width="600" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
            <tr>
              <td style="text-align: center; font-size: 12px; color: #a3a3a3;">
                © ${new Date().getFullYear()} Your Company. Mọi quyền được bảo lưu.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
`;

export const getComfirmEmail = (user: any, order: any, orderTrackingUrl: string) => `
 <div style="font-family: Arial, sans-serif; background-color: #f6f6f6; padding: 40px 0;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden;">
          
          <tr>
            <td align="center" style="padding: 30px 20px; border-bottom: 1px solid #e5e5e5;">
              <img src="${process.env.NEXT_PUBLIC_BASE_URL_DEPLOY}/logo/logo_phungfood_1.png" alt="Company Logo" width="200" style="margin-bottom: 10px;" />
              <h1 style="margin: 0; font-size: 22px; color: #1a1a1a;">Xác nhận thanh toán thành công</h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px 40px;">
              ${
                user?.name
                  ? `<p style="margin: 0 0 16px; font-size: 16px; color: #333;">Xin chào <strong>${user.name}</strong>,</p>`
                  : ''
              }
              <p style="margin: 0 0 24px; font-size: 16px; color: #4a4a4a; line-height: 1.6;">
                Cảm ơn bạn đã thanh toán đơn hàng tại <strong>Phùng Food</strong>! Dưới đây là thông tin chi tiết về giao dịch của bạn:
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin: 20px 0;">
                <tr>
                  <td style="padding: 8px 0; font-size: 15px; color: #555;">Mã đơn hàng:</td>
                  <td style="padding: 8px 0; font-size: 15px; font-weight: bold; color: #1a1a1a; text-align: right;">${order?.id}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 15px; color: #555;">Tổng tiền:</td>
                  <td style="padding: 8px 0; font-size: 15px; font-weight: bold; color: #1a1a1a; text-align: right;">${formatPriceLocaleVi(order?.finalTotal)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 15px; color: #555;">Phương thức thanh toán:</td>
                  <td style="padding: 8px 0; font-size: 15px; color: #1a1a1a; text-align: right;">${order?.payment?.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 15px; color: #555;">Thời gian thanh toán:</td>
                  <td style="padding: 8px 0; font-size: 15px; color: #1a1a1a; text-align: right;">${order?.updatedAt}</td>
                </tr>
              </table>

              <div style="background-color: #f7fafc; border: 1px solid #e5e5e5; border-radius: 8px; padding: 16px 20px; text-align: center; margin: 30px 0;">
                <p style="margin: 0; font-size: 16px; color: #2e7d32; font-weight: bold;">
                  Thanh toán của bạn đã được xác nhận thành công!
                </p>
              </div>

              <p style="margin: 16px 0 0; font-size: 14px; color: #737373; line-height: 1.6;">
                Đơn hàng của bạn sẽ được xử lý và giao sớm nhất có thể. Bạn có thể theo dõi trạng thái đơn hàng trong trang <strong>Tài khoản</strong> hoặc nhấn nút bên dưới.
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${orderTrackingUrl}" style="display: inline-block; background-color: #ff6600; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-size: 15px; font-weight: bold;">Theo dõi đơn hàng</a>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 40px; border-top: 1px solid #e5e5e5; text-align: center;">
              <p style="margin: 0; font-size: 13px; color: #a3a3a3;">
                Đây là email tự động, vui lòng không trả lời lại.
              </p>
            </td>
          </tr>
        </table>

        <table width="600" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
          <tr>
            <td style="text-align: center; font-size: 12px; color: #a3a3a3;">
              © ${new Date().getFullYear()} Phùng Food. Mọi quyền được bảo lưu.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>

`;
