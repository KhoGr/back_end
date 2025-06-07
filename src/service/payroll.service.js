import models from "../models/index.js";
import { Op } from "sequelize";

const { Payroll, Staff, AttendanceLog, User, Account } = models;

/**
 * Tính tổng giờ làm và tạo bảng lương tháng cho nhân viên
 */
export const generatePayroll = async (staffId, year, month) => {
  try {
    const staff = await Staff.findByPk(staffId);
    if (!staff) {
      throw new Error("Không tìm thấy nhân viên.");
    }

    // Lấy tất cả log chấm công của nhân viên trong tháng đó
    const logs = await AttendanceLog.findAll({
      where: {
        staff_id: staffId,
        date: {
          [Op.between]: [
            `${year}-${month.toString().padStart(2, "0")}-01`,
            `${year}-${month.toString().padStart(2, "0")}-31`,
          ],
        },
      },
    });

    // Tổng giờ làm
    const totalHoursWorked = logs.reduce(
      (sum, log) => sum + (log.hours_worked || 0),
      0
    );

    const salaryPerHour = staff.salary || 0;
    const totalSalary = totalHoursWorked * salaryPerHour;

    // Kiểm tra đã có bảng lương chưa
    const existing = await Payroll.findOne({
      where: { staff_id: staffId, year, month },
    });

    if (existing) {
      throw new Error("Bảng lương đã tồn tại cho tháng này.");
    }

    const payroll = await Payroll.create({
      staff_id: staffId,
      year,
      month,
      total_hours_worked: totalHoursWorked,
      salary_per_hour: salaryPerHour,
      total_salary: totalSalary,
    });

    return payroll;
  } catch (error) {
    console.error("❌ Lỗi tạo bảng lương:", error);
    throw error;
  }
};

/**
 * Lấy bảng lương theo tháng và/hoặc nhân viên
 */
export const getPayrolls = async ({ staffId, year, month }) => {
  try {
    const whereClause = {};
    if (staffId) whereClause.staff_id = staffId;
    if (year) whereClause.year = year;
    if (month) whereClause.month = month;

    const payrolls = await Payroll.findAll({
      where: whereClause,
      include: [
        {
          model: Staff,
          as: "staff",
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
        },
      ],
      order: [["year", "DESC"], ["month", "DESC"]],
    });

    return payrolls;
  } catch (error) {
    console.error("❌ Lỗi khi lấy bảng lương:", error);
    throw error;
  }
};

/**
 * Cập nhật bảng lương (ví dụ cập nhật lại lương thủ công)
 */
export const updatePayroll = async (payrollId, data = {}) => {
  try {
    const payroll = await Payroll.findByPk(payrollId);
    if (!payroll) {
      throw new Error("Không tìm thấy bảng lương.");
    }

    await payroll.update({
      total_hours_worked: data.total_hours_worked || payroll.total_hours_worked,
      salary_per_hour: data.salary_per_hour || payroll.salary_per_hour,
      total_salary: data.total_salary || payroll.total_salary,
    });

    return payroll;
  } catch (error) {
    console.error("❌ Lỗi cập nhật bảng lương:", error);
    throw error;
  }
};

/**
 * Xoá bảng lương
 */
export const deletePayroll = async (payrollId) => {
  try {
    const payroll = await Payroll.findByPk(payrollId);
    if (!payroll) {
      throw new Error("Không tìm thấy bảng lương để xoá.");
    }

    await payroll.destroy();
    return { message: "Đã xoá bảng lương thành công." };
  } catch (error) {
    console.error("❌ Lỗi khi xoá bảng lương:", error);
    throw error;
  }
};
