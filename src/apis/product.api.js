import { Router } from "express";
import ProductController from "../controllers/product.controller.js";
import { jwtAuthentication } from "../middlewares/passport.middleware.js";
import { verifyStaffOrAdmin } from "../middlewares/auth.middleware.js";

const productApi = Router();

productApi.get("/", ProductController.getAll);
productApi.get("/:id", ProductController.getById);

productApi.post("/", jwtAuthentication, verifyStaffOrAdmin, ProductController.create);
productApi.put("/:id", jwtAuthentication, verifyStaffOrAdmin, ProductController.update);
productApi.delete("/:id", jwtAuthentication, verifyStaffOrAdmin, ProductController.remove);

export default productApi;
