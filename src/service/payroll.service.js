import models from "../models/index.js";
import { Op, fn, col } from "sequelize";

const { Payroll, Staff, User, Attendance } = models;

export const calculateMonthlyPayroll = async (month) => {
  if (!/^\d{4}-\d{2}$/.test(month)) {
    throw new Error("Invalid month format. Expected YYYY-MM");
  }

  const startDate = new Date(`${month}-01`);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  const result = await Payroll.findOne({
    attributes: [[fn("SUM", col("total_salary")), "total_payroll"]],
    where: {
      status: "paid",
      period_start: {
        [Op.gte]: startDate,
        [Op.lt]: endDate,
      },
    },
    raw: true,
  });

  return parseFloat(result.total_payroll || 0);
};

export const generatePayrollForStaff = async (staff_id, period_start, period_end) => {
  const staff = await Staff.findByPk(staff_id);
  console.log("👤 Nhân viên:", staff?.toJSON?.());

  if (!staff || !staff.salary || !staff.working_type) {
    throw new Error("Không tìm thấy nhân viên hợp lệ hoặc lương chưa được thiết lập");
  }

  const existing = await Payroll.findOne({
    where: {
      staff_id,
      period_start,
      period_end,
    },
  });

  if (existing) {
    console.log(`❗ Đã tồn tại bảng lương cho staff_id ${staff_id} từ ${period_start} đến ${period_end}`);
    return existing;
  }

  const attendances = await Attendance.findAll({
    where: {
      staff_id,
      check_in_time: {
        [Op.between]: [period_start, period_end],
      },
    },
  });

  let total_hours = 0;
  let total_days = 0;
  let total_salary = 0;

  if (staff.working_type === "parttime") {
    total_hours = attendances.reduce((sum, att) => sum + (att.hours_worked || 0), 0);
    total_salary = total_hours * Number(staff.salary);
  } else {
    const uniqueDays = new Set(
      attendances.map((att) => new Date(att.check_in_time).toISOString().split("T")[0])
    );
    total_days = uniqueDays.size;
    total_salary = total_days * Number(staff.salary);
  }

  return await Payroll.create({
    staff_id,
    period_start,
    period_end,
    total_hours,
    total_salary,
    status: "pending",
  });
};

export const generatePayrollsForAll = async (period_start, period_end, staffIds = null) => {
  const where = {};
  if (Array.isArray(staffIds)) {
    where.staff_id = { [Op.in]: staffIds };
  }

  const staffs = await Staff.findAll({ where });
  const results = [];

  for (const staff of staffs) {
    try {
      const payroll = await generatePayrollForStaff(staff.staff_id, period_start, period_end);
      results.push(payroll);
    } catch (err) {
      console.error(`❌ Payroll failed for staff ${staff.staff_id}:`, err.message);
    }
  }

  return results;
};

export const getPayrollById = async (payroll_id) => {
  const payroll = await Payroll.findByPk(payroll_id, {
    include: [{ model: Staff, as: "staff" }],
  });
  if (!payroll) throw new Error("Không tìm thấy bản ghi lương");
  return payroll;
};

export const getAllPayrolls = async () => {
  return Payroll.findAll({
    include: [
      {
        model: Staff,
        as: "staff",
        include: [{ model: User, as: "user" }],
      },
    ],
    order: [["period_end", "DESC"]],
  });
};

export const updatePayrollStatus = async (payroll_id, status) => {
  const payroll = await Payroll.findByPk(payroll_id);
  if (!payroll) throw new Error("Không tìm thấy bảng lương");
  payroll.status = status;
  await payroll.save();
  return payroll;
};

export const deletePayroll = async (payroll_id) => {
  const result = await Payroll.destroy({ where: { payroll_id } });
  return { message: result ? "Đã xoá bảng lương" : "Không tìm thấy để xoá" };
};
