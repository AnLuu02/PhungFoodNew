import nodemailer from 'nodemailer';

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
    from: `"Fast Food App" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html
  });
};

export const getOtpEmail = (otp: string) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
    <h2 style="color: #2e86de; margin-bottom: 16px;">Xác nhận đặt lại mật khẩu</h2>
    
    <p>Xin chào,</p>
    <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình trên <strong>Fast Food App</strong>.</p>
    <p>Vui lòng sử dụng mã OTP dưới đây để hoàn tất quá trình xác nhận:</p>
    
    <p style="
      font-size: 28px; 
      font-weight: bold; 
      letter-spacing: 6px; 
      padding: 14px 28px; 
      background-color: #f5f7fa; 
      display: inline-block; 
      border-radius: 8px;
      border: 1px solid #dcdfe3;
      margin: 16px 0;
    ">
      ${otp}
    </p>
    
    <p>Mã OTP này có hiệu lực trong vòng <strong>15 phút</strong>.</p>
    <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email hoặc liên hệ ngay với bộ phận hỗ trợ để được giúp đỡ.</p>
    
    <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
    <p style="font-size: 12px; color: #888; text-align: center;">
      Fast Food App © 2025<br/>
      Đây là email tự động, vui lòng không trả lời trực tiếp.
    </p>
  </div>
`;
