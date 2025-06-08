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

// Attendance APIs
attendanceApi.post('/', adminOnly, createAttendanceController);                // POST    /api/attendances
attendanceApi.get('/', adminOnly, getAllAttendancesController);               // GET     /api/attendances
attendanceApi.get('/filter', adminOnly, getFilteredAttendances);              // GET     /api/attendances/filter?name=...&date=YYYY-MM-DD
attendanceApi.get('/:attendance_id', adminOnly, getAttendanceById);           // GET     /api/attendances/:attendance_id
attendanceApi.get('/staff/:staff_id', adminOnly, getAttendancesByStaffId);    // GET     /api/attendances/staff/:staff_id
attendanceApi.put('/:attendance_id', adminOnly, updateAttendanceController);  // PUT     /api/attendances/:attendance_id
attendanceApi.delete('/:attendance_id', adminOnly, deleteAttendanceController); // DELETE  /api/attendances/:attendance_id
attendanceApi.get('/search-by-period', adminOnly, getAttendancesByStaffAndPeriod); // ✅ GET /api/attendances/search-by-period?staff_id=...&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD


export default attendanceApi;
