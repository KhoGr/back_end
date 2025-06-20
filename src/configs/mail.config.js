import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Cấu hình SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODE_MAILER_USER, // Email người gửi
    pass: process.env.NODE_MAILER_PASSWORD, // App Password của Google
  },
});

// Hàm gửi email chung
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: `"Mini E-commerce" <${process.env.NODE_MAILER_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email đã gửi đến ${to}:`, info.response);
    return true;
  } catch (error) {
    console.error("❌ Lỗi gửi email:", error);
    return false;
  }
};

// Gửi email xác minh tài khoản
export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.SERVER_URL}/api/account/verify-account?token=${token}`;

  const htmlContent = `
    <h2>Chào mừng bạn đến với Mini E-commerce!</h2>
    <p>Nhấn vào liên kết bên dưới để xác nhận tài khoản của bạn:</p>
    <a href="${verificationUrl}" target="_blank" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Xác nhận tài khoản</a>
    <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>

  `;

  return sendEmail({
    to: email,
    subject: "Xác nhận tài khoản",
    html: htmlContent,
  });
};
//email xác nhận mật khẩu
export const sendResetPasswordEmail = async (email, token) => {
  const resetPasswordUrl = `http://localhost:8080/api/account/reset-password?token=${token}`;
  const htmlContent = `
     <h2>Cung cấp lại mật khẩu!</h2>
    <p>Nhấn vào liên kết bên dưới để xác nhận  bạn muốn đổi mật khẩu:</p>
    <a href="${resetPasswordUrl}" target="_blank" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Xác nhận tài khoản</a>
    <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
  `;
  return sendEmail({
    to: email,
    subject: "Xác nhận tài khoản",
    html: htmlContent,
  });
};
