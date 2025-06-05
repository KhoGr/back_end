import models from "../models/index.js";
import { Op } from "sequelize";
import VipLevelService from "../service/vip.service.js";

const { Customer, User, Account, VipLevel,Order } = models;

// ✅ Tạo mới Customer
export const createCustomer = async (userId, data = {}) => {
  try {
    const existingCustomer = await Customer.findOne({ where: { user_id: userId } });
    if (existingCustomer) {
      throw new Error("Customer đã tồn tại cho user này.");
    }

    // Lấy vip level theo total_spent nếu có
    const totalSpent = data.total_spent || 0;
    const vipLevel = await VipLevelService.getLevelForSpentAmount(totalSpent);

    const newCustomer = await Customer.create({
      user_id: userId,
      loyalty_point: data.loyalty_point || 0,
      total_spent: totalSpent,
      membership_level: data.membership_level || "bronze",
      vip_id: vipLevel?.id || null,
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
          as: "user_info",
          include: [
            {
              model: Account,
              as: "account",
              attributes: ["email"],
            },
          ],
        },
        {
          model: VipLevel,
          as: "vip_level",
          attributes: ["id", "name"], // => vip_name
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
        as: "user_info",
        include: {
          model: Account,
          as: "account",
        },
      },
    });

    if (!customer || !customer.user_info || !customer.user_info.account) {
      throw new Error("Không tìm thấy thông tin khách hàng hoặc liên kết người dùng.");
    }

    // Nếu có cập nhật chi tiêu => tự động xét lại cấp VIP
    let vipLevel = null;
    if (updateData.total_spent !== undefined) {
      vipLevel = await VipLevelService.getLevelForSpentAmount(updateData.total_spent);
    }

    const customerFields = {
      loyalty_point: updateData.loyalty_point ?? customer.loyalty_point,
      total_spent: updateData.total_spent ?? customer.total_spent,
      note: updateData.note ?? customer.note,
      ...(vipLevel && { vip_id: vipLevel.id }),
      ...(vipLevel && { membership_level: vipLevel.level_name }),
    };

    await Customer.update(customerFields, { where: { user_id: userId } });

    await User.update(
      {
        name: updateData.name ?? customer.user_info.name,
        username: updateData.username ?? customer.user_info.username,
      },
      { where: { user_id: userId } }
    );

    await Account.update(
      {
        email: updateData.email ?? customer.user_info.account.email,
      },
      {
        where: { id: customer.user_info.account_id },
      }
    );

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

// ✅ Lấy tất cả customers (có vip_name)
export const getAllCustomers = async () => {
  try {
    const customers = await Customer.findAll({
      include: [
        {
          model: User,
          as: "user_info",
          include: [
            {
              model: Account,
              as: "account",
              attributes: ["email"],
            },
          ],
        },
        {
          model: VipLevel,
          as: "vip_level",
          attributes: ["id", "name","min_total_spent","discount_percent","free_shipping_threshold","benefits"], // => vip_name
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
          as: "user_info",
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
        {
          model: VipLevel,
          as: "vip_level",
          attributes: ["id", "name","min_total_spent","discount_percent","free_shipping_threshold","benefits"], // => vip_name
        },
      ],
    });

    return customers;
  } catch (error) {
    console.error("❌ Lỗi khi tìm kiếm customer:", error);
    throw new Error("Không thể tìm kiếm customer.");
  }
  
};
export const updateCustomerSpentAndVip = async (customerId) => {
  console.log('🔍 [updateCustomerSpentAndVip] Bắt đầu cập nhật cho customerId:', customerId);

  const customer = await Customer.findByPk(customerId);
  console.log("customer nhận được là",customer)
  if (!customer) {
    console.error('❌ Customer không tồn tại:', customerId);
    throw new Error('Customer not found');
  }

  const orders = await Order.findAll({
    where: {
      customer_id: customerId,
      is_paid: true,
      status: 'completed', // 🔄 Thêm điều kiện status completed nếu cần
    },
  });

  console.log(`🧾 Tìm thấy ${orders.length} đơn hàng đã thanh toán & hoàn tất.`);

  orders.forEach((order, idx) => {
    console.log(`  - Đơn hàng #${idx + 1} | ID: ${order.id} | Final amount: ${order.final_amount}`);
  });

  const totalSpent = orders.reduce((sum, order) => sum + Number(order.final_amount || 0), 0);
  console.log('💰 Tổng tiền đã chi:', totalSpent);

  const vipLevel = await VipLevelService.getLevelForSpentAmount(totalSpent);
  console.log('⭐ Cấp VIP mới:', vipLevel || 'Không có (giữ bronze)');

  await customer.update({
    total_spent: totalSpent,
    vip_id: vipLevel?.id || null,
    membership_level: vipLevel?.level_name || 'bronze',
  });

  console.log('✅ [updateCustomerSpentAndVip] Cập nhật thành công cho customer:', {
    id: customer.customer_id,
    total_spent: customer.total_spent,
    vip_id: customer.vip_id,
  });

  return customer;
};
