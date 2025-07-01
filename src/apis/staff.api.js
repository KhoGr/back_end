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

staffApi.post("/", adminOnly, createStaffController);                  
staffApi.get("/", adminOnly, getAllStaffsController);                     
staffApi.get("/search", adminOnly, searchStaffsByNameController);        
staffApi.get("/:userId", adminOnly, getStaffController);                
staffApi.put("/:userId", adminOnly, updateStaffController);             
staffApi.delete("/:userId", adminOnly, deleteStaffController);          

export default staffApi;
