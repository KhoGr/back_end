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
attendanceApi.post('/',  createAttendanceController);                // POST    /api/attendances
attendanceApi.get('/',  getAllAttendancesController);               // GET     /api/attendances
attendanceApi.get('/filter',  getFilteredAttendances);              // GET     /api/attendances/filter?name=...&date=YYYY-MM-DD
attendanceApi.get('/:attendance_id',  getAttendanceById);           // GET     /api/attendances/:attendance_id
attendanceApi.get('/staff/:staff_id',  getAttendancesByStaffId);    // GET     /api/attendances/staff/:staff_id
attendanceApi.put('/:attendance_id',  updateAttendanceController);  // PUT     /api/attendances/:attendance_id
attendanceApi.delete('/:attendance_id',  deleteAttendanceController); // DELETE  /api/attendances/:attendance_id
attendanceApi.get('/search-by-period',  getAttendancesByStaffAndPeriod); // ✅ GET /api/attendances/search-by-period?staff_id=...&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD


export default attendanceApi;
