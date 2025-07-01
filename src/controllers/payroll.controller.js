import * as payrollService from '../service/payroll.service.js';

// Tạo bảng lương cho 1 nhân viên theo kỳ
export const createPayroll = async (req, res) => {
  try {
    const { staff_id, period_start, period_end } = req.body;

    if (!staff_id || !period_start || !period_end) {
      return res.status(400).json({
        error: 'Thiếu thông tin bắt buộc: staff_id, period_start, period_end.',
      });
    }

    const payroll = await payrollService.generatePayrollForStaff(
      staff_id,
      period_start,
      period_end
    );

    res.status(201).json(payroll);
  } catch (error) {
    console.error('❌ Tạo payroll thất bại:', error.message);
    res.status(400).json({ error: error.message });
  }
};

// Tính và tạo bảng lương cho tất cả nhân viên theo kỳ
export const generatePayrollsForAll = async (req, res) => {
  try {
    const { period_start, period_end } = req.body;

    if (!period_start || !period_end) {
      return res.status(400).json({ error: 'Thiếu period_start hoặc period_end.' });
    }

    const results = await payrollService.generatePayrollsForAll(period_start, period_end);
    res.status(201).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy bảng lương theo ID
export const getPayrollById = async (req, res) => {
  try {
    const { payroll_id } = req.params;
    const payroll = await payrollService.getPayrollById(payroll_id);
    res.json(payroll);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Lấy danh sách tất cả bảng lương
export const getAllPayrolls = async (req, res) => {
  try {
    const list = await payrollService.getAllPayrolls();
    res.json(list);
  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách payroll:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật trạng thái bảng lương (pending → paid)
export const updatePayrollStatus = async (req, res) => {
  try {
    const { payroll_id } = req.params;
    const { status } = req.body;

    if (!['pending', 'paid'].includes(status)) {
      return res.status(400).json({
        error: 'Trạng thái không hợp lệ. Chỉ cho phép: pending, paid.',
      });
    }

    const payroll = await payrollService.updatePayrollStatus(payroll_id, status);
    res.json(payroll);
  } catch (error) {
    console.error('❌ Cập nhật trạng thái payroll thất bại:', error.message);
    res.status(400).json({ error: error.message });
  }
};

// Xoá bảng lương
export const deletePayroll = async (req, res) => {
  try {
    const { payroll_id } = req.params;
    const result = await payrollService.deletePayroll(payroll_id);
    res.json(result);
  } catch (error) {
    console.error('❌ Xoá payroll thất bại:', error.message);
    res.status(400).json({ error: error.message });
  }
};
