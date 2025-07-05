import { Router } from 'express';
import {
  createAttendanceController,
  getAttendanceById,
  updateAttendanceController,
  deleteAttendanceController,
  getAllAttendancesController,
  getAttendancesByStaffId,
  getFilteredAttendances,
  getAttendancesByStaffAndPeriod,
  getPresentStaffCountByDateController,
  getAttendanceSummaryByDateController
} from '../controllers/attendance.controller.js';
import { jwtAuthentication } from '../middlewares/passport.middleware.js';
import { verifyAdmin } from '../middlewares/auth.middleware.js';

const attendanceApi = Router();
const adminOnly = [jwtAuthentication, verifyAdmin];

// Attendance CRUD
attendanceApi.post('/', createAttendanceController);
attendanceApi.get('/', getAllAttendancesController);
attendanceApi.get('/filter', getFilteredAttendances);                        // GET /api/attendances/filter?name=...&date=YYYY-MM-DD
attendanceApi.get('/search-by-period', getAttendancesByStaffAndPeriod);     // GET /api/attendances/search-by-period?staff_id=...&start_date=...&end_date=...
attendanceApi.get('/present-count', getPresentStaffCountByDateController);  // GET /api/attendances/present-count?date=YYYY-MM-DD
attendanceApi.get('/summary', getAttendanceSummaryByDateController);        // GET /api/attendances/summary?date=YYYY-MM-DD
attendanceApi.get('/:attendance_id', getAttendanceById);
attendanceApi.get('/staff/:staff_id', getAttendancesByStaffId);
attendanceApi.put('/:attendance_id', updateAttendanceController);
attendanceApi.delete('/:attendance_id', deleteAttendanceController);

export default attendanceApi;
