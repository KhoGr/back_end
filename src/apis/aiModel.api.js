import { Router } from 'express';
import * as AIModelController from '../controllers/aiModelController.js';
import { jwtAuthentication } from '../middlewares/passport.middleware.js';
import { verifyAdmin } from '../middlewares/auth.middleware.js';

const aiModelApi = Router();

// ✅ GET tất cả model
aiModelApi.get('/get', AIModelController.listModels);

// ✅ GET một model theo ID
aiModelApi.get('/get/:id', AIModelController.getModel);

// ✅ Tạo mới model (chỉ admin)
aiModelApi.post('/create', jwtAuthentication, verifyAdmin, AIModelController.createModel);

// ✅ Cập nhật model (chỉ admin)
aiModelApi.put('/update/:id', jwtAuthentication, verifyAdmin, AIModelController.updateModel);

// ✅ Xoá model (chỉ admin)
aiModelApi.delete('/delete/:id', jwtAuthentication, verifyAdmin, AIModelController.removeModel);

export default aiModelApi;
