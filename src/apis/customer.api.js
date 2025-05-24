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
customerApi.get("/getAllCustomers", adminOnly, getAllCustomersController);               // GET /api/customer
customerApi.get("/getCustomer/:userId", adminOnly, getCustomerController);           // GET /api/customer/:userId
customerApi.post("/createCustomer", adminOnly, createCustomerController);              // POST /api/customer
customerApi.put("/updateCustomer/:userId", adminOnly, updateCustomerController);        // PUT /api/customer/:userId
customerApi.delete("/deleteCustomer/:userId", adminOnly, deleteCustomerController);     // DELETE /api/customer/:userId
customerApi.get("/search",adminOnly, searchCustomersByNameController); // GET /api/customer/search

export default customerApi;
