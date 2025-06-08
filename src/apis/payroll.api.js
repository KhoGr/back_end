import { Router } from 'express';
import {
  createPayroll,
  generatePayrollsForAll,
  getPayrollById,
  getAllPayrolls,
  updatePayrollStatus,
  deletePayroll,
} from '../controllers/payroll.controller.js';
import { jwtAuthentication } from '../middlewares/passport.middleware.js';
import { verifyAdmin } from '../middlewares/auth.middleware.js';

const payrollApi = Router();
const adminOnly = [jwtAuthentication, verifyAdmin];

// Payroll APIs
payrollApi.post('/', adminOnly, createPayroll);                     // POST    /api/payrolls           → Tạo bảng lương cho 1 nhân viên
payrollApi.post('/generate-all', adminOnly, generatePayrollsForAll); // POST    /api/payrolls/generate-all → Tạo bảng lương cho toàn bộ nhân viên
payrollApi.get('/', adminOnly, getAllPayrolls);                     // GET     /api/payrolls           → Lấy tất cả bảng lương
payrollApi.get('/:payroll_id', adminOnly, getPayrollById);          // GET     /api/payrolls/:id       → Lấy bảng lương theo ID
payrollApi.put('/:payroll_id/status', adminOnly, updatePayrollStatus); // PUT /api/payrolls/:id/status → Cập nhật trạng thái bảng lương
payrollApi.delete('/:payroll_id', adminOnly, deletePayroll);        // DELETE  /api/payrolls/:id       → Xoá bảng lương

export default payrollApi;
