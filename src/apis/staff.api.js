import { Router } from "express";
import {
  createStaffController,
  getStaffController,
  updateStaffController,
  deleteStaffController,
  getAllStaffsController,
  searchStaffsByNameController,
} from "../controllers/staff.controller.js";
import { jwtAuthentication } from "../middlewares/passport.middleware.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";

const staffApi = Router();

const adminOnly = [jwtAuthentication, verifyAdmin];

staffApi.post("/", adminOnly, createStaffController);                     // POST    /api/staff
staffApi.get("/", adminOnly, getAllStaffsController);                     // GET     /api/staff
staffApi.get("/search", adminOnly, searchStaffsByNameController);         // GET     /api/staff/search?name=...
staffApi.get("/:userId", adminOnly, getStaffController);                  // GET     /api/staff/:userId
staffApi.put("/:userId", adminOnly, updateStaffController);              // PUT     /api/staff/:userId
staffApi.delete("/:userId", adminOnly, deleteStaffController);           // DELETE  /api/staff/:userId

export default staffApi;
