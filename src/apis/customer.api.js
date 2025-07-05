import { Router } from "express";
import {
  createCustomerController,
  getCustomerController,
  updateCustomerController,
  deleteCustomerController,
  getAllCustomersController,
  searchCustomersByNameController,
  toggleCustomerAccountStatusController, 
} from "../controllers/customer.controller.js";

import { jwtAuthentication } from "../middlewares/passport.middleware.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";

const customerApi = Router();

// Middleware áp dụng cho admin
const adminOnly = [jwtAuthentication, verifyAdmin];


customerApi.get("/getAllCustomers", adminOnly, getAllCustomersController);
customerApi.get("/getCustomer/:userId", getCustomerController);
customerApi.post("/createCustomer", adminOnly, createCustomerController);
customerApi.put("/updateCustomer/:userId", updateCustomerController);
customerApi.delete("/deleteCustomer/:userId", adminOnly, deleteCustomerController);
customerApi.get("/search", adminOnly, searchCustomersByNameController);

customerApi.patch("/toggleAccount/:userId", adminOnly, toggleCustomerAccountStatusController);

export default customerApi;
