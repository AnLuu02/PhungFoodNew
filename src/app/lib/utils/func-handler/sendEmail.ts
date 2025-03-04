import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
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
  <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.5;">
    <h2 style="color: #ff6b6b;">Mã OTP đặt lại mật khẩu</h2>
    <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
    <p>Đây là mã OTP của bạn:</p>
    <p style="
      font-size: 32px; 
      font-weight: bold; 
      letter-spacing: 8px; 
      padding: 12px 24px; 
      background-color: #f3f3f3; 
      display: inline-block; 
      border-radius: 8px;
    ">
      ${otp}
    </p>
    <p>Mã OTP có hiệu lực trong <strong>15 phút</strong>.</p>
    <hr />
    <p style="font-size: 12px; color: #888;">Fast Food App - Cà Mau</p>
  </div>
`;
