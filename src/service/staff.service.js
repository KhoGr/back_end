import models from "../models/index.js";
import { Op } from "sequelize";

const { Staff, User, Account } = models;

// Tạo mới Staff
export const createStaff = async (userId, data = {}) => {
  try {
    const existingStaff = await Staff.findOne({ where: { user_id: userId } });
    if (existingStaff) {
      throw new Error("Staff đã tồn tại cho user này.");
    }

    const newStaff = await Staff.create({
      user_id: userId,
      position: data.position || null,
      salary: data.salary || null,
      working_type: data.working_type || "fulltime",
      joined_date: data.joined_date || null,
      note: data.note || null,
    });

    return newStaff;
  } catch (error) {
    console.error(" Lỗi khi tạo staff:", error);
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
              attributes: ["email"],
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

// Cập nhật Staff, User, Account
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
              attributes: ["email"],
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
              attributes: ["email"],
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
