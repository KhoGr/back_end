import Customer from "../models/customer.js";
import User from "../models/user.js";

// Tạo mới Customer
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
      membership_level: data.membership_level || 'bronze',
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
      include: [{ model: User, as: "user" }],
    });
    return customer;
  } catch (error) {
    throw error;
  }
};

// Cập nhật thông tin Customer
export const updateCustomer = async (userId, updateData) => {
  try {
    const [updated] = await Customer.update(updateData, { where: { user_id: userId } });

    if (!updated) {
      throw new Error("Không thể cập nhật Customer.");
    }

    return await getCustomerByUserId(userId);
  } catch (error) {
    throw error;
  }
};

// Xóa customer theo user_id
export const deleteCustomer = async (userId) => {
  try {
    return await Customer.destroy({ where: { user_id: userId } });
  } catch (error) {
    throw error;
  }
};

// Lấy tất cả customer
export const getAllCustomers = async () => {
  try {
    return await Customer.findAll({ include: [{ model: User, as: "user" }] });
  } catch (error) {
    throw error;
  }
};
