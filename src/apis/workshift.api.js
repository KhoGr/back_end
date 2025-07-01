import { Router } from "express";
import {
  createWorkShiftController,
  getWorkShiftsByStaffId,
  updateWorkShiftController,
  deleteWorkShift,
  getAllWorkShiftsController,
  generateMonthlyWorkShiftsController,
} from "../controllers/workshift.controller.js";

import { jwtAuthentication } from "../middlewares/passport.middleware.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";

const workShiftApi = Router();
const adminOnly = [jwtAuthentication, verifyAdmin];

// WorkShift APIs
workShiftApi.post("/", createWorkShiftController);               // Tạo 1 ca
workShiftApi.get("/:staff_id", getWorkShiftsByStaffId);          // Lấy theo staff
workShiftApi.put("/:shift_id", updateWorkShiftController);       // Cập nhật
workShiftApi.delete("/:shift_id", deleteWorkShift);              // Xoá
workShiftApi.get("/", getAllWorkShiftsController);               // Lấy tất cả
//hamf mowi
workShiftApi.post("/generate-monthly", adminOnly, generateMonthlyWorkShiftsController);

export default workShiftApi;
