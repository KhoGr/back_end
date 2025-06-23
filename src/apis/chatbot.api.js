import { Router } from "express";
import * as ChatbotController from "../controllers/chatbotController.js";
import { jwtAuthentication } from "../middlewares/passport.middleware.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";

const chatbotApi = Router();

// Route xử lý chatbot trả lời người dùng
chatbotApi.post("/query", ChatbotController.handleQuery);


// Lấy tất cả responses
chatbotApi.get("/responses/get", ChatbotController.listResponses);

// Lấy response theo ID

// Tạo response mới (admin)
chatbotApi.post("/responses/create", jwtAuthentication, verifyAdmin, ChatbotController.createResponse);

// Cập nhật response (admin)
chatbotApi.put("/responses/update/:id", jwtAuthentication, verifyAdmin, ChatbotController.editResponse);

// Xoá response (admin)
chatbotApi.delete("/responses/delete/:id", jwtAuthentication, verifyAdmin, ChatbotController.removeResponse);

export default chatbotApi;
