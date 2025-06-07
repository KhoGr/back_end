import { Router } from "express";
import {
  createWorkShiftController,
  getWorkShiftsByStaffId,
  updateWorkShiftController,
  deleteWorkShift,
  getAllWorkShiftsController, // ✅ Bổ sung
} from "../controllers/workshift.controller.js";
import { jwtAuthentication } from "../middlewares/passport.middleware.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";

const workShiftApi = Router();
const adminOnly = [jwtAuthentication, verifyAdmin];

// WorkShift APIs
workShiftApi.post("/", adminOnly, createWorkShiftController);              // POST    /api/workshifts
workShiftApi.get("/:staff_id", adminOnly, getWorkShiftsByStaffId);         // GET     /api/workshifts/:staff_id?date=YYYY-MM-DD
workShiftApi.put("/:shift_id", adminOnly, updateWorkShiftController);      // PUT     /api/workshifts/:shift_id
workShiftApi.delete("/:shift_id", adminOnly, deleteWorkShift);             // DELETE  /api/workshifts/:shift_id

// ✅ Bổ sung: lấy tất cả workshifts có thể lọc theo month, date, staffId
workShiftApi.get("/", adminOnly, getAllWorkShiftsController);              // GET     /api/workshifts?month=YYYY-MM&date=YYYY-MM-DD&staffId=1

export default workShiftApi;
