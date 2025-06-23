import { Router } from 'express';
import {
  createAttendanceController,
  getAttendanceById,
  updateAttendanceController,
  deleteAttendanceController,
  getAllAttendancesController,
  getAttendancesByStaffId,
  getFilteredAttendances,
  getAttendancesByStaffAndPeriod
} from '../controllers/attendance.controller.js';
import { jwtAuthentication } from '../middlewares/passport.middleware.js';
import { verifyAdmin } from '../middlewares/auth.middleware.js';

const attendanceApi = Router();
const adminOnly = [jwtAuthentication, verifyAdmin];

attendanceApi.post('/',  createAttendanceController);                
attendanceApi.get('/',  getAllAttendancesController);            
attendanceApi.get('/filter',  getFilteredAttendances);              // GET     /api/attendances/filter?name=...&date=YYYY-MM-DD
attendanceApi.get('/:attendance_id',  getAttendanceById);          
attendanceApi.get('/staff/:staff_id',  getAttendancesByStaffId);    
attendanceApi.put('/:attendance_id',  updateAttendanceController); 
attendanceApi.delete('/:attendance_id',  deleteAttendanceController); 
attendanceApi.get('/search-by-period',  getAttendancesByStaffAndPeriod); 


export default attendanceApi;
