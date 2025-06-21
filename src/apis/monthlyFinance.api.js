import { Router } from "express";
import MonthlyFinanceController from "../controllers/monthlyFinance.controller.js";
import { jwtAuthentication } from "../middlewares/passport.middleware.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";

const monthlyFinanceApi = Router();

// ✅ Tìm kiếm theo tháng keyword (ví dụ ?keyword=2025-06)
monthlyFinanceApi.get("/search", MonthlyFinanceController.getByKeyword);

// ✅ Lấy tất cả bản ghi tổng hợp
monthlyFinanceApi.get("/get", MonthlyFinanceController.getAll);

// ✅ Lấy bản ghi theo ID
monthlyFinanceApi.get("/get/:id", MonthlyFinanceController.getById);

// ✅ Tạo hoặc cập nhật bản ghi tổng hợp (chỉ admin)
monthlyFinanceApi.post(
  "/create",
  jwtAuthentication,
  verifyAdmin,
  MonthlyFinanceController.create
);

// ✅ Cập nhật ghi chú hoặc dữ liệu (chỉ admin)
monthlyFinanceApi.put(
  "/update/:id",
  jwtAuthentication,
  verifyAdmin,
  MonthlyFinanceController.update
);

// ✅ Xoá bản ghi (chỉ admin)
monthlyFinanceApi.delete(
  "/delete/:id",
  jwtAuthentication,
  verifyAdmin,
  MonthlyFinanceController.delete
);

export default monthlyFinanceApi;
