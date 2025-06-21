import MonthlyFinanceSummary from "../models/MonthlyFinanceSummary.js";
import Order from "../models/order.js";
import { calculateMonthlyRevenue } from "./order.service.js";
import { calculateMonthlyPayroll } from "./payroll.service.js";
import { Op } from "sequelize";

/**
 * Tạo hoặc cập nhật bản ghi tài chính tổng hợp theo tháng
 * @param {string} month - Định dạng "YYYY-MM", ví dụ "2025-06"
 */
const generateMonthlyFinanceSummary = async (month) => {
  if (!/^\d{4}-\d{2}$/.test(month)) {
    throw new Error("Invalid month format. Expected YYYY-MM");
  }

  const startDate = new Date(`${month}-01`);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  const totalRevenue = await calculateMonthlyRevenue(month);
  const totalPayroll = await calculateMonthlyPayroll(month);

  const totalOrders = await Order.count({
    where: {
      status: "completed",
      order_date: {
        [Op.gte]: startDate,
        [Op.lt]: endDate,
      },
    },
  });

  await MonthlyFinanceSummary.upsert(
    {
      month,
      total_revenue: totalRevenue,
      total_payroll: totalPayroll,
      total_orders: totalOrders,
    },
    { returning: true }
  );

  console.log(
    `📊 Tổng hợp tháng ${month}: 💰 Revenue ${totalRevenue} | 🧾 Payroll ${totalPayroll} | 🛒 Orders ${totalOrders}`
  );

  return {
    month,
    total_revenue: totalRevenue,
    total_payroll: totalPayroll,
    total_orders: totalOrders,
  };
};

// Lấy tất cả bản ghi tổng hợp theo tháng
const getAllSummaries = async () => {
  return await MonthlyFinanceSummary.findAll({
    order: [['month', 'DESC']],
  });
};

// Lấy bản ghi theo ID
const getSummaryById = async (id) => {
  return await MonthlyFinanceSummary.findByPk(id);
};

// Cập nhật thông tin ghi chú hoặc dữ liệu
const updateSummary = async (id, data) => {
  await MonthlyFinanceSummary.update(data, {
    where: { id },
  });
  return await MonthlyFinanceSummary.findByPk(id);
};

// Xoá bản ghi
const deleteSummary = async (id) => {
  const result = await MonthlyFinanceSummary.destroy({ where: { id } });
  return { success: result > 0 };
};

// Tìm kiếm theo keyword tháng
const searchByMonthKeyword = async (keyword) => {
  return await MonthlyFinanceSummary.findAll({
    where: {
      month: {
        [Op.like]: `%${keyword}%`,
      },
    },
    order: [['month', 'DESC']],
  });
};

// ✅ Export mặc định
export default {
  generateMonthlyFinanceSummary,
  getAllSummaries,
  getSummaryById,
  updateSummary,
  deleteSummary,
  searchByMonthKeyword,
};
