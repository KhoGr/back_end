import { createUsername } from "../helper/index.js";
import bcrypt from "bcryptjs";
import {
  COOKIE_EXPIRES_TIME,
  KEYS,
  ACCOUNT_TYPES,
  MAX,
  ROLES,
} from "../constant/index.js";
import {
  encodedToken,
  verifyJWT,
  logTokenGeneration,
} from "../configs/jwt.config.js";
import express from "express";
const app = express();
import { sendVerificationEmail,sendResetPasswordEmail } from "../configs/mail.config.js";
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
import { createCustomer } from "../service/customer.service.js";
import { createStaff } from "../service/staff.service.js";
import User from "../models/user.js";
import Customer from "../models/customer.js";
import Staff from "../models/staff.js";

export const postLoginWithStaffId = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase();
    const { password } = req.body;

    const account = await Account.findOne({ where: { email } });
    if (!account) {
      return res.status(406).json({ message: 'Tài khoản không tồn tại' });
    }

    if (!account.is_verified) {
      return res.status(403).json({
        message: 'Tài khoản chưa được xác minh. Vui lòng kiểm tra email.',
      });
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mật khẩu không đúng' });
    }

    const user = await User.findOne({
      where: { account_id: account.id },
      include: [
        {
          model: Staff,
          as: 'staffProfile',
          attributes: [
            'staff_id',
            'position',
            'salary',
            'working_type',
            'joined_date',
            'note',
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    const token = await encodedToken(account);

    res.cookie('jwt_token', token, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 3600 * 1000),
    });

    return res.status(200).json({
      message: 'Đăng nhập thành công',
      token,
      expires: new Date(Date.now() + 7 * 24 * 3600 * 1000),
      user: {
        user_id: user.user_id,
        email: account.email,
        name: user.name,
        username: user.username,
        phone: user.phone,
        address: user.address,
        avatar: user.avatar,
        is_verified: account.is_verified,
        provider: account.provider,
        role: user.role,
        staff: user.staffProfile ,
        staff_id: user.staffProfile?.staff_id ,
      },
    });
  } catch (error) {
    console.error('POST LOGIN W/ STAFF_ID ERROR:', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};


export const postLoginWithCustomerId = async (req, res) => {
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

    // Lấy thông tin user
    const user = await User.findOne({
      where: { account_id: account.id },
      include: [
        {
          model: Customer,
          as: "customer_info",
          attributes: ["customer_id", "vip_id", "loyalty_point", "total_spent"],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    const token = await encodedToken(account);

    res.cookie("jwt_token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 3600 * 1000),
    });

    return res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      expires: new Date(Date.now() + 7 * 24 * 3600 * 1000),
      user: {
        user_id: user.user_id,
        email: account.email,
        name: user.name,
        username: user.username,
        phone: user.phone,
        address: user.address,
        avatar: user.avatar,
        is_verified: account.is_verified,
        provider: account.provider,
        role: user.role,
        customer: user.customer_info ?? null, // nếu có
      },
    });
  } catch (error) {
    console.error("POST LOGIN W/ CUSTOMER_ID ERROR:", error);
    return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};

// login
export const postLogin = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase();
    const { password } = req.body;

    console.log("🟡 [POST LOGIN] Nhận request body:", req.body);

    const account = await findAccount(email);
    console.log("🟢 [POST LOGIN] Tìm thấy tài khoản:", account);

    if (!account) {
      return res.status(401).json({ message: "Tài khoản không tồn tại" });
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

    const token = await encodedToken(account);

    res.cookie("jwt_token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 3600 * 1000), // 7 ngày
    });

    return res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      expires: new Date(Date.now() + 7 * 24 * 3600 * 1000),
    });
  } catch (error) {
    console.error("🔴 [POST LOGIN ERROR]: ", error);
    return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};



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

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("✅ Mật khẩu đã mã hóa");

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

    const username = createUsername(email, newAccount.id);
    console.log("🔹 Username được tạo:", username);

    console.log("🔹 Bắt đầu tạo user...");
    const newUser = await createUser(newAccount.id, name, username);
    if (!newUser) {
      console.error("❌ Lỗi khi tạo user:", newUser);
      return res
        .status(409)
        .json({ message: "Tạo tài khoản thất bại, thử lại" });
    }
    console.log("✅ Tạo user thành công:", newUser);

    // 👉 Tạo Customer nếu user có role là 'customer'
    if (newUser.role === ROLES.CUSTOMER) {
      await createCustomer(newUser.user_id);
      console.log("✅ Tạo customer thành công");
    }

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
//////////////////////////////


export const registerStaff = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    console.log("🔹 Bắt đầu đăng ký nhân viên:", { email, name });

    // Kiểm tra tài khoản đã tồn tại chưa
    const exists = await isExistAccount(email);
    if (exists) {
      console.warn("⚠️ Email đã tồn tại:", email);
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("✅ Mật khẩu đã mã hóa");

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

    const username = createUsername(email, newAccount.id);
    console.log("🔹 Username được tạo:", username);

    console.log("🔹 Bắt đầu tạo user...");
    const newUser = await createUser(
      newAccount.id,
      name,
      username,
      "",     // avatar
      "",     // phone
      "",     // address
      ROLES.STAFF // ✅ role truyền đúng vị trí
    );    if (!newUser) {
      console.error("❌ Lỗi khi tạo user:", newUser);
      return res
        .status(409)
        .json({ message: "Tạo tài khoản thất bại, thử lại" });
    }
    console.log("✅ Tạo user thành công:", newUser);

    // 👉 Tạo Staff nếu user có role là 'staff'
    if (newUser.role === ROLES.STAFF) {
      await createStaff(newUser.user_id); // 👈 Gọi hàm tạo staff
      console.log("✅ Tạo staff thành công");
    }

    const verifyToken = await encodedToken(newAccount);
    await sendVerificationEmail(email, verifyToken);
    console.log("📩 Email xác thực đã được gửi");

    res.status(201).json({
      message: "Đăng ký nhân viên thành công! Kiểm tra email để xác nhận tài khoản.",
      account: newAccount,
      user: newUser,
    });
  } catch (error) {
    console.error("❌ Lỗi đăng ký nhân viên:", error);
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


//adminlogin
export const adminLogin = async (req, res) => {
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

    // ❗️Kiểm tra quyền
    if (account.role !== "admin") {
      return res.status(403).json({ message: "Tài khoản không có quyền admin" });
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không đúng" });
    }

    const token = await encodedToken(account);
    res.cookie("jwt_token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 3600 * 1000),
    });

    return res.status(200).json({
      message: "Đăng nhập admin thành công",
      token,
      expires: new Date(Date.now() + 7 * 24 * 3600 * 1000),
    });
  } catch (error) {
    console.error("ADMIN LOGIN ERROR: ", error);
    return res.status(503).json({ message: "Lỗi dịch vụ, thử lại sau" });
  }
};

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

    const account = await findAccount(email.toLowerCase());
    if (!account) {
      return res.status(404).json({ message: "Tài khoản không tồn tại." });
    }

    const resetToken = await encodedToken(account, "15m");

    // ➕ GỌI SEND EMAIL TẠI ĐÂY
    await sendResetPasswordEmail(account.email, resetToken);

    console.log(`Reset token cho ${email}: ${resetToken}`);
    return res.status(200).json({
      message: "Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email.",
    });
  } catch (error) {
    console.error("Lỗi trong requestPasswordReset:", error);
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống. Vui lòng thử lại sau." });
  }
};

//tạm ổn


export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    console.log("token nhận được là",token);
    console.log("newpassword nhận được là",newPassword);
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

    const hashedPassword = await bcrypt.hash(newPassword, 10);

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
    const token = await encodedToken(account);

    const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000); // 7 ngày

    res.cookie("jwt_token", token, {
      httpOnly: true,
      expires: expiresAt,
    });

    console.log("Redirecting to:", `http://localhost:8080/google-success?token=${token}&tokenExpires=${expiresAt.toISOString()}`);

    return res.redirect(
      `http://localhost:8080/google-success?token=${token}&tokenExpires=${encodeURIComponent(expiresAt.toISOString())}`
    );
  } catch (error) {
    console.error("Lỗi khi xử lý callback Google:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({
      where: { user_id: req.user.id },
      attributes: {
        exclude: ["created_at", "updated_at"],
      },
      include: [
        {
          model: Customer,
          as: "customer_info",
          attributes: ["customer_id", "vip_id", "loyalty_point", "total_spent"],
          required: false,
        },
        {
          model: Staff,
          as: "staffProfile",
          attributes: ["staff_id", "position", "salary", "working_type", "note"],
          required: false,
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    return res.status(200).json({
      success: true,
      message: "Get Me chạy thành công",
      user: {
        user_id: user.user_id,
        name: user.name,
        username: user.username,
        phone: user.phone,
        address: user.address,
        is_verified: user.is_verified,
        avatar: user.avatar,
        provider: user.provider,
        role: user.role,
        customer: user.customer_info || null,
        staff: user.staffProfile || null,
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
    const userId = req.body.user_id;; // Lấy userId từ middleware xác thực
    const file = req.file;

    console.log(">>> Bắt đầu changeAvatar");
    console.log("User ID:", userId);
    console.log("File nhận được:", file);

    if (!userId) {
      return res.status(400).json({ error: "Không xác định được người dùng." });
    }

    if (!file) {
      console.log("Không có file được upload.");
      return res.status(400).json({ error: "Vui lòng chọn ảnh" });
    }

    // Upload ảnh lên Cloudinary
    const avatarUrl = await uploadImage(file.path, "avatars");
    console.log("Đường dẫn ảnh sau khi upload:", avatarUrl);

    // Cập nhật avatar trong DB bằng service
    const updatedUser = await updateUserAvatar(userId, avatarUrl);
    console.log("Kết quả updateUserAvatar:", updatedUser);

    if (!updatedUser) {
      console.log("Không tìm thấy user trong DB.");
      return res.status(404).json({ error: "Không tìm thấy user!" });
    }

    return res.json({
      message: "Cập nhật avatar thành công!",
      avatar: updatedUser.avatar,
    });
  } catch (error) {
    console.error("Lỗi trong changeAvatar:", error);
    return res.status(500).json({ error: error.message });
  }
};
