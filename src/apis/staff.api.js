import { Router } from "express";
import {
  handleCreateStaff,
  handleGetStaff,
  handleUpdateStaff,
  handleDeleteStaff,
} from "../controllers/staff.controller.js";
import { jwtAuthentication } from "../middlewares/passport.middleware.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";

const staffApi = Router();

// Áp dụng middleware xác thực và kiểm tra quyền admin
const adminOnly = [jwtAuthentication, verifyAdmin];

// Danh sách routes
staffApi.post("/createStaff", adminOnly, handleCreateStaff);                // POST /api/staff/createStaff
staffApi.get("/getStaff/:user_id", adminOnly, handleGetStaff);              // GET  /api/staff/getStaff/:user_id
staffApi.put("/updateStaff/:user_id", adminOnly, handleUpdateStaff);        // PUT  /api/staff/updateStaff/:user_id
staffApi.delete("/deleteStaff/:user_id", adminOnly, handleDeleteStaff);     // DELETE /api/staff/deleteStaff/:user_id

export default staffApi;
