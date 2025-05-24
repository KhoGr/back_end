import Customer from "../models/customer.js";
import User from "../models/user.js";
import Account from "../models/account.js";
import { Op } from "sequelize";

// Gọi associate để thiết lập quan hệ
User.associate?.({ Account });
Customer.associate?.({ User });

// Tạo mới Customer
export const createCustomer = async (userId, data = {}) => {
  try {
    const existingCustomer = await Customer.findOne({
      where: { user_id: userId },
    });
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
    throw error;
  }
};

// Lấy thông tin chi tiết của 1 Customer
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
              attributes: ["email"],
            },
          ],
        },
      ],
    });
    return customer;
  } catch (error) {
    throw error;
  }
};

// Cập nhật thông tin Customer
export const updateCustomer = async (userId, updateData) => {
  try {
    const customer = await Customer.findOne({
      where: { user_id: userId },
      include: {
        model: User,
        as: 'user',
        include: {
          model: Account,
          as: 'account',
        },
      },
    });

    if (!customer || !customer.user || !customer.user.account) {
      throw new Error('Không tìm thấy thông tin khách hàng hoặc liên kết người dùng.');
    }

    // Cập nhật Customer
    const customerFields = {
      loyalty_point: updateData.loyalty_point,
      total_spent: updateData.total_spent,
      membership_level: updateData.membership_level,
      note: updateData.note,
    };

    await Customer.update(customerFields, {
      where: { user_id: userId },
    });

    // Cập nhật User
    const userFields = {
      name: updateData.name,
      username: updateData.username,
    };

    await User.update(userFields, {
      where: { user_id: userId },
    });

    // Cập nhật Account (dùng từ user.account_id)
    const accountFields = {
      email: updateData.email,
    };

    await Account.update(accountFields, {
      where: { id: customer.user.account_id },
    });

    // Trả lại dữ liệu mới
    return await Customer.findOne({
      where: { user_id: userId },
      include: {
        model: User,
        as: 'user',
        include: {
          model: Account,
          as: 'account',
        },
      },
    });

  } catch (error) {
    console.error('Lỗi updateCustomer:', error);
    throw error;
  }
};

// Xóa customer theo user_id
export const deleteCustomer = async (userId) => {
  const user = await User.findOne({ where: { user_id: userId } });

  if (!user) {
    throw new Error("Không tìm thấy user để xoá.");
  }

  await Account.destroy({ where: { id: user.account_id } });
  await user.destroy(); // Sẽ tự xóa Customer nếu dùng `onDelete: 'CASCADE'`
};

// Lấy tất cả customer
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

// Tìm kiếm customer theo tên
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
    console.error("❌ Lỗi khi tìm kiếm customer theo tên:", error);
    throw new Error("Không thể tìm kiếm customer.");
  }
};
