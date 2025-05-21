import { Router } from "express";
import CategoryController from "../controllers/category.controller.js";
import { jwtAuthentication } from "../middlewares/passport.middleware.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";

const categoryApi = Router();

// ✅ Route tìm kiếm theo keyword (nên đặt trước route /get/:id để tránh nhầm lẫn)
categoryApi.get("/search", CategoryController.getByKeyword);

// Lấy tất cả categories
categoryApi.get("/get", CategoryController.getAll);

// Lấy category theo ID
categoryApi.get("/get/:id", CategoryController.getById);

// Tạo mới (yêu cầu admin)
categoryApi.post("/create-controller", jwtAuthentication, verifyAdmin, CategoryController.create);

// Cập nhật (yêu cầu admin)
categoryApi.put("/update/:id", jwtAuthentication, verifyAdmin, CategoryController.update);

// Xoá (yêu cầu admin)
categoryApi.delete("/delete/:id", jwtAuthentication, verifyAdmin, CategoryController.delete);

export default categoryApi;
