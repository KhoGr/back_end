import { ACCOUNT_TYPES, ROLES } from "../constant/index.js";
import User from "../models/user.js";
import Account from "../models/account.js";
import { uploadImage } from "./common.service.js";
import bcrypt from "bcryptjs";



export const isExistAccount = async (email) => {
  try {
    const account = await Account.findOne({ where: { email } });
    return !!account;
  } catch (error) {
    throw error;
  }
};
export const findAccount = async (email) => {
  try {
    return await Account.findOne({ where: { email } });
  } catch (error) {
    console.log("ko tìm thấy tài khoản");
  }
};

// Tạo tài khoản mới
export const createAccount = async (
  email,
  password,
  authType = ACCOUNT_TYPES.LOCAL
) => {
  try {

    const newAccount = await Account.create({
      email,
      password,
      authType,
      createdDate: new Date(),
    });
    return newAccount; // Trả về toàn bộ đối tượng Account thay vì chỉ id
  } catch (error) {
    throw error;
  }
};
export const createUser = async (
  accountId,
  name,
  username,
  avatar = "",
  phone = "",
  address = "",
  role = ROLES.CUSTOMER
) => {
  try {
    console.log("🔹 Đang tạo user với accountId:", accountId);

    // Kiểm tra role hợp lệ
    if (![ROLES.ADMIN, ROLES.CUSTOMER, ROLES.SELLER].includes(role)) {
      console.warn("⚠️ Vai trò không hợp lệ:", role);
      throw new Error("Vai trò không hợp lệ");
    }

    // Kiểm tra xem tài khoản có tồn tại không
    const account = await Account.findByPk(accountId);
    if (!account) {
      console.error("❌ Không tìm thấy tài khoản với ID:", accountId);
      throw new Error("Không tìm thấy tài khoản tương ứng");
    }

    // Bỏ phần tạo lại username ở đây
    console.log("🔹 Tạo user với username:", username);
    const finalPhone = phone.trim() === "" ? null : phone;


    // Tạo user mới trong database
    const newUser = await User.create({
      account_id: accountId,
      name,
      username,
      phone:finalPhone,
      address,
      role,
    });

    console.log("✅ User được tạo thành công:", newUser);
    return newUser;
  } catch (error) {
    console.error("❌ Lỗi chi tiết khi tạo user:", error);
    throw new Error(`Lỗi khi tạo user: ${error.message}`);
  }
};


export const changeUserPassword = async (email, currentPassword, newPassword) => {
  try {
    // Tìm tài khoản theo email
    const account = await findAccount(email);
    if (!account) {
      return { success: false, status: 404, message: "Tài khoản không tồn tại." };
    }

    // Xác thực mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, account.password);
    if (!isMatch) {
      return { success: false, status: 401, message: "Mật khẩu hiện tại không đúng." };
    }

    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu mới trong database
    await account.update({ password: hashedPassword });

    return { success: true, message: "Cập nhật mật khẩu thành công." };
  } catch (error) {
    console.error("Lỗi trong changeUserPassword:", error);
    return { success: false, status: 500, message: "Lỗi hệ thống, vui lòng thử lại sau." };
  }
};



export const getUserInfo = async (userId) => {
  try {
    const user = await User.findOne({
      where: { user_id: userId },
      attributes: [
        "user_id",
        "account_id",
        "name",
        "username",
        "avatar",
        "phone",
        "address",
        "role",
        "created_at",
        "updated_at",
      ],
    });

    return user || null;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu user:", error);
    throw error;
  }
};

export const updateProfile = async (userId, updateData) => {
  try {
    console.log("📌 Cập nhật profile cho user_id:", userId, "Dữ liệu cập nhật:", updateData);

    if (!userId) {
      throw new Error("❌ user_id bị undefined hoặc null!");
    }

    // Cập nhật user trong database
    const [updatedRows] = await User.update(updateData, { where: { user_id: userId } });

    if (!updatedRows) {
      console.log("❌ Không có dòng nào được cập nhật.");
      return null;
    }

    // Trả về user sau khi cập nhật
    const updatedUser = await User.findOne({
      where: { user_id: userId },
      attributes: ["user_id", "account_id", "name", "username", "phone", "address", "updated_at"],
    });

    return updatedUser;
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật user:", error);
    throw error;
  }
};
export const getUserProfile = (user) => {
  if (!user) return null;
  return {
    id: user.id,
    displayName: user.displayName,
    email: user.emails?.[0]?.value || "",
    photo: user.photos?.[0]?.value || "",
  };
};

export const logoutUser = (req) => {
  return new Promise((resolve, reject) => {
    req.logout((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};
// hoàn thành
////////////////////////////////////////////////////////////

export const uploadAvatar = async (filePath, username) => {
  try {
    // Upload ảnh lên Cloudinary
    const avatarUrl = await uploadImage(filePath, "avatars"); // Lưu vào thư mục avatars

    // Cập nhật avatar trong DB
    const updatedUser = await User.findOneAndUpdate(
      { username },
      { avatar: avatarUrl },
      { new: true }
    );

    if (!updatedUser) throw new Error("Không tìm thấy user!");

    return updatedUser.avatar;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const updateUserAvatar = async (userId, avatarUrl) => {
  try {
    console.log(">> Tìm user với user_id:", userId);

    const user = await User.findOne({ where: { user_id: userId } });
    if (!user) {
      console.error(">> Không tìm thấy user.");
      throw new Error("Người dùng không tồn tại.");
    }

    console.log(">> User tìm được:", user);

    user.avatar = avatarUrl;
    await user.save();

    console.log(">> Đã cập nhật avatar thành công:", avatarUrl);

    return user;
  } catch (error) {
    console.error("Lỗi khi cập nhật avatar:", error);
    throw new Error("Không thể cập nhật avatar.");
  }
};
