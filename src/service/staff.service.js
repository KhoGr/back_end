import models, { sequelize } from "../models/index.js";
import { Op } from "sequelize";

const { Staff, User, Account } = models;

export const createFullStaff = async (data) => {
  const {
    email,
    password,
    name,
    username,
    phone,
    address,
    position,
    salary,
    working_type = "fulltime",
    joined_date = null,
    note = null,
  } = data;

  if (!email || !password || !name || !username || !position || !salary) {
    throw new Error(
      "Thiếu thông tin bắt buộc (email, password, name, username, position, salary)"
    );
  }

  const transaction = await sequelize.transaction();

  try {
    const existingAccount = await Account.findOne({ where: { email } });
    if (existingAccount) throw new Error("Email đã tồn tại.");

    const newAccount = await Account.create(
      {
        email,
        password,
        provider: "local",
        is_verified: true,
      },
      { transaction }
    );

    const newUser = await User.create(
      {
        account_id: newAccount.id,
        name,
        username,
        phone,
        address,
        role: "staff",
      },
      { transaction }
    );

    const newStaff = await Staff.create(
      {
        user_id: newUser.user_id,
        position,
        salary,
        working_type,
        joined_date,
        note,
      },
      { transaction }
    );

    await transaction.commit();

    return await Staff.findOne({
      where: { user_id: newUser.user_id },
      include: [
        {
          model: User,
          as: "user",
          include: [
            {
              model: Account,
              as: "account",
              attributes: ["email","is_active"],
            },
          ],
        },
      ],
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Lỗi khi tạo đầy đủ staff:", error);
    throw error;
  }
};


// Lấy thông tin staff theo user_id
export const getStaffByUserId = async (userId) => {
  try {
    const staff = await Staff.findOne({
      where: { user_id: userId },
      include: [
        {
          model: User,
          as: "user",
          include: [
            {
              model: Account,
              as:"account",
              attributes: ["email","is_active"],
            },
          ],
        },
      ],
    });

    return staff;
  } catch (error) {
    console.error(" Lỗi khi lấy staff:", error);
    throw error;
  }
};

// Cập nhật Staff
export const updateStaff = async (userId, updateData) => {
  try {
    const staff = await Staff.findOne({
      where: { user_id: userId },
      include: [
        {
          model: User,
          as: "user",
          include: [
            {
              model: Account,
              as: "account",
            },
          ],
        },
      ],
    });

    if (!staff || !staff.user || !staff.user.account) {
      throw new Error(
        "Không tìm thấy thông tin nhân viên hoặc liên kết người dùng."
      );
    }

    // Cập nhật Staff
    const staffFields = {
      position: updateData.position,
      salary: updateData.salary,
      working_type: updateData.working_type,
      joined_date: updateData.joined_date,
      note: updateData.note,
    };
    await Staff.update(staffFields, { where: { user_id: userId } });

    // Cập nhật User
    const userFields = {
      name: updateData.name,
      username: updateData.username,
    };
    await User.update(userFields, { where: { user_id: userId } });

    // Cập nhật Account
    const accountFields = {
      email: updateData.email,
    };

    // Nếu updateData có trường is_active thì cập nhật
    if (Object.prototype.hasOwnProperty.call(updateData, "is_active")) {
      accountFields.is_active = updateData.is_active;
    }

    await Account.update(accountFields, {
      where: { id: staff.user.account_id },
    });

    // Trả lại dữ liệu mới
    return await getStaffByUserId(userId);
  } catch (error) {
    console.error("Lỗi updateStaff:", error);
    throw error;
  }
};

// Xóa staff theo user_id (xóa Account, liên kết cascade sẽ xóa User và Staff)
export const deleteStaff = async (userId) => {
  try {
    const user = await User.findOne({ where: { user_id: userId } });

    if (!user) {
      throw new Error("Không tìm thấy user để xoá.");
    }

    await Account.destroy({ where: { id: user.account_id } });
    await user.destroy(); // sẽ tự động xoá Staff nhờ CASCADE
  } catch (error) {
    console.error(" Lỗi khi xóa staff:", error);
    throw error;
  }
};

// Lấy tất cả staff
export const getAllStaffs = async () => {
  try {
    const staffs = await Staff.findAll({
      include: [
        {
          model: User,
          as: "user",
          include: [
            {
              model: Account,
              as: "account",
              attributes: ["email","is_active"],
            },
          ],
        },
      ],
    });

    return staffs;
  } catch (error) {
    console.error(" Lỗi khi lấy tất cả staffs:", error);
    throw new Error("Không thể lấy danh sách staff.");
  }
};

// Tìm kiếm staff theo tên
export const searchStaffsByName = async (searchTerm) => {
  try {
    const staffs = await Staff.findAll({
      include: [
        {
          model: User,
          as: "user",
          where: {
            name: {
              [Op.like]: `%${searchTerm}%`,
            },
          },
          include: [
            {
              model: Account,
              as: "account",
              attributes: ["email","is_active"],
            },
          ],
        },
      ],
    });

    return staffs;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm staff:", error);
    throw new Error("Không thể tìm kiếm staff.");
  }
};
export const updateStaffAccountStatus = async (userId, isActive) => {
  try {
    const user = await User.findOne({ where: { user_id: userId } });
    if (!user) throw new Error("Không tìm thấy người dùng");

    await Account.update({ is_active: isActive }, { where: { id: user.account_id } });

    return { success: true, message: `Tài khoản đã được ${isActive ? "kích hoạt" : "vô hiệu hóa"}` };
  } catch (error) {
    console.error("Lỗi updateStaffAccountStatus:", error);
    throw error;
  }
};