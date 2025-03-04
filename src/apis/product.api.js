import { Router } from "express";
import ProductController from "../controllers/product.controller.js";
import { jwtAuthentication } from "../middlewares/passport.middleware.js";
import { verifyStaffOrAdmin } from "../middlewares/auth.middleware.js";

const productApi = Router();

// 📌 Lấy danh sách sản phẩm (Ai cũng xem được)
productApi.get("/", ProductController.getAll);
productApi.get("/:id", ProductController.getById);

// 📌 Chỉ nhân viên & admin mới có quyền thêm/sửa/xóa sản phẩm
productApi.post("/", jwtAuthentication, verifyStaffOrAdmin, ProductController.create);
productApi.put("/:id", jwtAuthentication, verifyStaffOrAdmin, ProductController.update);
productApi.delete("/:id", jwtAuthentication, verifyStaffOrAdmin, ProductController.remove);

export default productApi;
