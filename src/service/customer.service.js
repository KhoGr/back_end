import models from "../models/index.js";
import { Op } from "sequelize";

const { Customer, User, Account } = models;

// ✅ Tạo mới Customer
export const createCustomer = async (userId, data = {}) => {
  try {
    const existingCustomer = await Customer.findOne({ where: { user_id: userId } });
    if (existingCustomer) {
      throw new Error("Customer đã tồn tại cho user này.");
    }

    const newCustomer = await Customer.create({
      user_id: userId,
      loyalty_point: data.loyalty_point || 0,
      total_spent: data.total_spent || 0,
      membership_level: data.membership_level || "bronze",
      note: data.note || null,
    });

    return newCustomer;
  } catch (error) {
    console.error("❌ Lỗi khi tạo customer:", error);
    throw error;
  }
};

// ✅ Lấy thông tin customer theo user_id
export const getCustomerByUserId = async (userId) => {
  try {
    const customer = await Customer.findOne({
      where: { user_id: userId },
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

    return customer;
  } catch (error) {
    console.error("❌ Lỗi khi lấy customer:", error);
    throw error;
  }
};

// ✅ Cập nhật Customer, User, Account
export const updateCustomer = async (userId, updateData) => {
  try {
    const customer = await Customer.findOne({
      where: { user_id: userId },
      include: {
        model: User,
        as: "user",
        include: {
          model: Account,
          as: "account",
        },
      },
    });

    if (!customer || !customer.user || !customer.user.account) {
      throw new Error("Không tìm thấy thông tin khách hàng hoặc liên kết người dùng.");
    }

    // Cập nhật Customer
    const customerFields = {
      loyalty_point: updateData.loyalty_point,
      total_spent: updateData.total_spent,
      membership_level: updateData.membership_level,
      note: updateData.note,
    };
    await Customer.update(customerFields, { where: { user_id: userId } });

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
      where: { id: customer.user.account_id },
    });

    // Trả lại dữ liệu mới
    return await getCustomerByUserId(userId);
  } catch (error) {
    console.error("❌ Lỗi updateCustomer:", error);
    throw error;
  }
};

// ✅ Xóa customer theo user_id (cascade xóa luôn Customer)
export const deleteCustomer = async (userId) => {
  try {
    const user = await User.findOne({ where: { user_id: userId } });

    if (!user) {
      throw new Error("Không tìm thấy user để xoá.");
    }

    await Account.destroy({ where: { id: user.account_id } });
    await user.destroy(); // sẽ tự động xóa customer nếu thiết lập CASCADE
  } catch (error) {
    console.error("❌ Lỗi khi xóa customer:", error);
    throw error;
  }
};

// ✅ Lấy tất cả customers
export const getAllCustomers = async () => {
  try {
    const customers = await Customer.findAll({
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

    return customers;
  } catch (error) {
    console.error("❌ Lỗi khi lấy tất cả customers:", error);
    throw new Error("Không thể lấy danh sách customer.");
  }
};

// ✅ Tìm kiếm customer theo tên
export const searchCustomersByName = async (searchTerm) => {
  try {
    const customers = await Customer.findAll({
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

    return customers;
  } catch (error) {
    console.error("❌ Lỗi khi tìm kiếm customer:", error);
    throw new Error("Không thể tìm kiếm customer.");
  }
};
