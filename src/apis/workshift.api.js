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
workShiftApi.post("/", createWorkShiftController);              
workShiftApi.get("/:staff_id", getWorkShiftsByStaffId);        
workShiftApi.put("/:shift_id", updateWorkShiftController);     
workShiftApi.delete("/:shift_id", deleteWorkShift);           


workShiftApi.get("/", getAllWorkShiftsController);             

export default workShiftApi;
