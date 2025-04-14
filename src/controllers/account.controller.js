import { createUsername } from "../helper/index.js";
import bcrypt from "bcryptjs";
import {
  COOKIE_EXPIRES_TIME,
  KEYS,
  ACCOUNT_TYPES,
  MAX,
} from "../constant/index.js";
import {
  encodedToken,
  verifyJWT,
  logTokenGeneration,
} from "../configs/jwt.config.js";
import express from "express";
const app = express();
import { sendVerificationEmail } from "../configs/mail.config.js";
import {
  isExistAccount,
  findAccount,
  createAccount,
  createUser,
  changeUserPassword,
  uploadAvatar,
  getUserInfo,
  updateProfile,
  updateUserAvatar,
} from "../service/account.service.js";
import Account from "../models/account.js";
import { uploadImage } from "../service/common.service.js";
import jwt from "jsonwebtoken";


export const registerLocal = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    console.log("🔹 Bắt đầu đăng ký:", { email, name });

    // Kiểm tra tài khoản đã tồn tại chưa
    const exists = await isExistAccount(email);
    if (exists) {
      console.warn("⚠️ Email đã tồn tại:", email);
      return res.status(400).json({ message: "Email already registered" });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("✅ Mật khẩu đã mã hóa");

    // Tạo tài khoản
    const newAccount = await createAccount(
      email,
      hashedPassword,
      ACCOUNT_TYPES.LOCAL
    );
    if (!newAccount || !newAccount.id) {
      console.error("❌ Lỗi tạo tài khoản:", newAccount);
      return res
        .status(409)
        .json({ message: "Tạo tài khoản thất bại, thử lại" });
    }
    console.log("✅ Tạo tài khoản thành công:", newAccount);

    // Tạo username
    const username = createUsername(email, newAccount.id);
    console.log("🔹 Username được tạo:", username);

    // Tạo user
    console.log("🔹 Bắt đầu tạo user...");
    const newUser = await createUser(newAccount.id, name, username);
    if (!newUser) {
      console.error("❌ Lỗi khi tạo user:", newUser);
      return res
        .status(409)
        .json({ message: "Tạo tài khoản thất bại, thử lại" });
    }
    console.log("✅ Tạo user thành công:", newUser);

    // Gửi email xác thực
    const verifyToken = await encodedToken(newAccount);
    await sendVerificationEmail(email, verifyToken);
    console.log("📩 Email xác thực đã được gửi");

    res.status(201).json({
      message: "Đăng ký thành công! Kiểm tra email để xác nhận tài khoản.",
      account: newAccount,
      user: newUser,
    });
  } catch (error) {
    console.error("❌ Lỗi đăng ký local:", error);
    res.status(500).json({ message: "Lỗi hệ thống, thử lại sau." });
  }
};

export const verifyAccount = async (req, res) => {
  try {
    const { token } = req.query;
    console.log("token nhận được là:", token);
    if (!token) {
      return res.status(400).json({ message: "Token không hợp lệ!" });
    }

    const decoded = await verifyJWT(token);
    console.log("📜 Decoded JWT:", decoded);

    if (!decoded || !decoded.sub) {
      return res
        .status(400)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
    }

    const account = await findAccount(decoded.sub);
    if (!account) {
      return res.status(404).json({ message: "Tài khoản không tồn tại!" });
    }

    if (account.is_verified) {
      return res
        .status(400)
        .json({ message: "Tài khoản đã được xác minh trước đó!" });
    }

    // Cập nhật trạng thái xác minh
    await account.update({ is_verified: true });

    // Sau khi xác minh thành công, chuyển hướng người dùng tới trang chủ của client
    return res.redirect(`${process.env.CLIENT_URL}/account/login`);
  } catch (error) {
    console.error("❌ Lỗi xác minh tài khoản:", error);
    return res.status(500).json({ message: "Lỗi hệ thống, thử lại sau." });
  }
};

//login
export const postLogin = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase();
    const { password } = req.body;

    const account = await findAccount(email);
    if (!account) {
      return res.status(406).json({ message: "Tài khoản không tồn tại" });
    }

    if (!account.is_verified) {
      return res.status(403).json({
        message: "Tài khoản chưa được xác minh. Vui lòng kiểm tra email.",
      });
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không đúng" });
    }
    // set cookie with jwt

    const token = await encodedToken(account);

    res.cookie("jwt_token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 3600 * 1000), // Cookie hết hạn sau 1 ngày
    });

    return res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      expires: new Date(Date.now() + 7 * 24 * 3600 * 1000),
    });
  } catch (error) {
    console.error("POST LOGIN ERROR: ", error);
    return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};
// export const postLogout = async (req, res) => {
//   try {
//     // Xóa cookie "jwt_token" mà không cần chỉ định expires
//     res.clearCookie("jwt_token", {
//       httpOnly: true,
//     });

//     return res.status(200).json({ message: "Đăng xuất thành công" });
//   } catch (error) {
//     console.error("POST LOGOUT ERROR:", error);
//     return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
//   }
// };

/////////////////////////
export const postLogout = async (req, res) => {
  try {
    // Nếu req.logout() có sẵn (được cung cấp bởi Passport khi sử dụng session),
    // gọi nó để hủy phiên đăng nhập.
    if (typeof req.logout === "function") {
      req.logout((err) => {
        if (err) {
          console.error("Lỗi khi logout:", err);
        }
      });
    }

    // Xóa cookie chứa JWT (dù bạn dùng session hay JWT lưu cookie, xóa cookie vẫn an toàn)
    res.clearCookie("jwt_token", { httpOnly: true });

    return res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (error) {
    console.error("POST LOGOUT ERROR:", error);
    return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};

// Giả sử bạn có hàm sendResetPasswordEmail để gửi email. Trong ví dụ test, chúng ta sẽ in token ra console.
// import { sendResetPasswordEmail } from "../configs/mail.config.js";

/**
 * Endpoint gửi yêu cầu reset password
 * POST /reset-password-request
 * Body: { email: string }
 */
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email là bắt buộc." });
    }

    // Kiểm tra tài khoản có tồn tại không
    const account = await findAccount(email.toLowerCase());
    if (!account) {
      return res.status(404).json({ message: "Tài khoản không tồn tại." });
    }

    // Tạo token reset với thời gian hết hạn ngắn (ví dụ: 15 phút)
    const resetToken = await encodedToken(account, "15m");

    // Trong môi trường production: gửi email reset password với đường link chứa token
    // await sendResetPasswordEmail(email, resetToken);

    // Ở đây, để test, ta in token ra console và trả về response
    console.log(`Reset token cho ${email}: ${resetToken}`);
    return res.status(200).json({
      message: "Yêu cầu đặt lại mật khẩu đã được gửi.",
      // CHỈ DÙNG CHO MÔI TRƯỜNG TEST, không nên trả token cho người dùng ở production
      resetToken,
    });
  } catch (error) {
    console.error("Lỗi trong requestPasswordReset:", error);
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống. Vui lòng thử lại sau." });
  }
};

/**
 * Endpoint thực hiện reset password
 * POST /reset-password
 * Body: { token: string, newPassword: string }
 */
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Token và mật khẩu mới là bắt buộc." });
    }

    // Xác thực token
    const decoded = await verifyJWT(token);
    if (!decoded || !decoded.sub) {
      return res
        .status(400)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn." });
    }

    // Giả sử token được tạo với payload có trường "sub" chứa email của người dùng
    const account = await findAccount(decoded.sub);
    if (!account) {
      return res.status(404).json({ message: "Tài khoản không tồn tại." });
    }

    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu mới cho tài khoản
    await account.update({ password: hashedPassword });

    return res
      .status(200)
      .json({ message: "Mật khẩu đã được cập nhật thành công." });
  } catch (error) {
    console.error("Lỗi trong resetPassword:", error);
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống. Vui lòng thử lại sau." });
  }
};

export const updatePassword = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Bạn chưa đăng nhập." });
    }

    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin." });
    }

    const account = await Account.findOne({
      where: { id: req.user.account_id },
    });
    if (!account) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản." });
    }

    const isMatch = await bcrypt.compare(oldPassword, account.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu cũ không đúng." });
    }

    account.password = await bcrypt.hash(newPassword, 10);
    await account.save();

    res.clearCookie("jwt_token");
    return res.json({
      message: "Cập nhật mật khẩu thành công. Vui lòng đăng nhập lại.",
    });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi máy chủ nội bộ." });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Bạn chưa đăng nhập." });
    }

    const userInfo = await getUserInfo(req.user.id);
    if (!userInfo) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thông tin user." });
    }

    return res.status(200).json({ success: true, data: userInfo });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin user:", error);
    return res.status(500).json({ message: "Lỗi server." });
  }
};
export const updateUserProfile = async (req, res) => {
  try {
    console.log("📌 Giá trị req.user:", req.user);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Bạn chưa đăng nhập." });
    }

    const { name, username, phone, address } = req.body;

    if (!name && !username && !phone && !address) {
      return res.status(400).json({ message: "Không có dữ liệu cập nhật." });
    }

    const updatedUser = await updateProfile(req.user.id, {
      name,
      username,
      phone,
      address,
    });

    if (!updatedUser) {
      return res.status(500).json({ message: "Cập nhật thất bại." });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "Cập nhật thành công.",
        data: updatedUser,
      });
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật profile:", error);
    return res.status(500).json({ message: "Lỗi server." });
  }
};

////////////////////////////////////

export const googleLoginCallback = async (req, res) => {
  try {
    if (!req.user) {
      console.log("Google authentication failed");

      return res.status(401).json({ message: "Google authentication failed" });
    }

    const account = req.user;

    // Tạo JWT token với cùng cách như postLogin (sử dụng encodedToken)
    const token = await encodedToken(account);
    console

    // Set cookie giống postLogin
    const expiresIn = 7 * 24 * 3600 * 1000; // 7 ngày
    res.cookie("jwt_token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + expiresIn),
    });
    console.log("Redirecting to:", `http://localhost:5173/google-success?token=${token}&tokenExpires=${Date.now() + expiresIn}`);


    // Redirect kèm token và thời gian hết hạn (nếu cần phía FE biết)
    return res.redirect(
      `http://localhost:5173/google-success?token=${token}&tokenExpires=${Date.now() + expiresIn}`
    );
  } catch (error) {
    console.error("Lỗi khi xử lý callback Google:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

///////////////////
export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.log("Get /me chạy thành công");
    return res.status(200).json({
      success: true,
      message: "Get Me chạy thành công",
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        username: req.user.username,
        phone: req.user.phone,
        address: req.user.address,
        is_verified: req.user.is_verified,
        avatar: req.user.avatar,
        provider: req.user.provider,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error("Lỗi GET ME: ", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

///////////////////////////////////

export const changeAvatar = async (req, res) => {
  try {
    const { username } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Vui lòng chọn ảnh" });
    }

    // Upload ảnh lên Cloudinary
    const avatarUrl = await uploadImage(file.path, "avatars");

    // Cập nhật avatar trong DB bằng service
    const updatedUser = await updateUserAvatar(username, avatarUrl);

    if (!updatedUser) {
      return res.status(404).json({ error: "Không tìm thấy user!" });
    }

    return res.json({
      message: "Cập nhật avatar thành công!",
      avatar: updatedUser.avatar,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
