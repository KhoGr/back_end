import models from "../models/index.js";
import { Op, fn, col } from "sequelize";

const { Payroll, Staff, User, Account,Attendance } = models;
export const calculateMonthlyPayroll = async (month) => {
  if (!/^\d{4}-\d{2}$/.test(month)) {
    throw new Error("Invalid month format. Expected YYYY-MM");
  }

  const startDate = new Date(`${month}-01`);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1); // đầu tháng kế tiếp

  const result = await Payroll.findOne({
    attributes: [[fn("SUM", col("total_salary")), "total_payroll"]],
    where: {
      status: 'paid',
      period_start: {
        [Op.gte]: startDate,
        [Op.lt]: endDate,
      },
    },
    raw: true,
  });

  const total = parseFloat(result.total_payroll || 0);
  return total;
};

export const payrollService = {
async generatePayrollForStaff(staff_id, period_start, period_end) {
  const staff = await Staff.findByPk(staff_id);
  console.log('👤 Nhân viên:', staff?.toJSON?.());

  if (!staff || !staff.salary || !staff.working_type) {
  }

  const attendances = await Attendance.findAll({
    where: {
      staff_id,
      check_in_time: {
        [Op.between]: [period_start, period_end],
      },
    },
  });

  console.log('📋 Số attendance:', attendances.length);

  let total_hours = 0;
  let total_days = 0;
  let total_salary = 0;

  if (staff.working_type === 'parttime') {
    total_hours = attendances.reduce(
      (sum, att) => sum + (att.hours_worked || 0),
      0
    );
    total_salary = total_hours * Number(staff.salary);
  } else {
    const uniqueDays = new Set(
      attendances.map(att =>
        new Date(att.check_in_time).toISOString().split('T')[0]
      )
    );
    total_days = uniqueDays.size;
    total_salary = total_days * Number(staff.salary);
  }

  const payroll = await Payroll.create({
    staff_id,
    period_start,
    period_end,
    total_hours,
    total_salary,
    status: 'pending',
  });


  return payroll;
},


  async generatePayrollsForAll(period_start, period_end) {
    const staffs = await Staff.findAll({ where: { is_active: true } });
    const results = [];

    for (const staff of staffs) {
      try {
        const payroll = await payrollService.generatePayrollForStaff(
          staff.staff_id,
          period_start,
          period_end
        );
        results.push(payroll);
      } catch (err) {
        console.error(`❌ Payroll failed for staff ${staff.staff_id}:`, err.message);
      }
    }

    return results;
  },

  async getPayrollById(payroll_id) {
    const payroll = await Payroll.findByPk(payroll_id, {
      include: [{ model: Staff, as: 'staff' }],
    });
    if (!payroll) throw new Error('Không tìm thấy bản ghi lương');
    return payroll;
  },

async getAllPayrolls() {
  return Payroll.findAll({
    include: [
      {
        model: Staff,
        as: 'staff',
        include: [
          {
            model: User,
            as: 'user',
          },
        ],
      },
    ],
    order: [['period_end', 'DESC']],
  });
},


  async updatePayrollStatus(payroll_id, status) {
    const payroll = await Payroll.findByPk(payroll_id);
    if (!payroll) throw new Error('Không tìm thấy bảng lương');
    payroll.status = status;
    await payroll.save();
    return payroll;
  },

  async deletePayroll(payroll_id) {
    const result = await Payroll.destroy({ where: { payroll_id } });
    return { message: result ? 'Đã xoá bảng lương' : 'Không tìm thấy để xoá' };
  },
};
