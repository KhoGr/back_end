import { Router } from "express";
import {
  createCustomerController,
  getCustomerController,
  updateCustomerController,
  deleteCustomerController,
  getAllCustomersController,
  searchCustomersByNameController
} from "../controllers/customer.controller.js";
import { jwtAuthentication } from "../middlewares/passport.middleware.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";

const customerApi = Router();

// Áp dụng middleware xác thực và kiểm tra quyền admin
const adminOnly = [jwtAuthentication, verifyAdmin];

// Danh sách routes
customerApi.get("/getAllCustomers", adminOnly, getAllCustomersController);             
customerApi.get("/getCustomer/:userId", getCustomerController);          
customerApi.post("/createCustomer", adminOnly, createCustomerController);             
customerApi.put("/updateCustomer/:userId",  updateCustomerController);     
customerApi.delete("/deleteCustomer/:userId", adminOnly, deleteCustomerController);     
customerApi.get("/search",adminOnly, searchCustomersByNameController);

export default customerApi;
