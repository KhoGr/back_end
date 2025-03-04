import { Router } from "express";
import CategoryController from "../controllers/categoryController.js";
import { jwtAuthentication } from "../middlewares/passport.middleware.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";
const categoryApi = Router();

categoryApi.get("/", CategoryController.getAll);

categoryApi.get("/:id", CategoryController.getById);
categoryApi.post("/", jwtAuthentication, verifyAdmin, CategoryController.create);
categoryApi.put("/:id", jwtAuthentication, verifyAdmin, CategoryController.update);
categoryApi.delete("/:id", jwtAuthentication, verifyAdmin, CategoryController.remove);
export default categoryApi;
