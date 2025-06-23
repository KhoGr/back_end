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

payrollApi.post('/', adminOnly, createPayroll);                    
payrollApi.post('/generate-all', adminOnly, generatePayrollsForAll);
payrollApi.get('/', adminOnly, getAllPayrolls);                   
payrollApi.get('/:payroll_id', adminOnly, getPayrollById);         
payrollApi.put('/:payroll_id/status', adminOnly, updatePayrollStatus); 
payrollApi.delete('/:payroll_id', adminOnly, deletePayroll);  

export default payrollApi;
