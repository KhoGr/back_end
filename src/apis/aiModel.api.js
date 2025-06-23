import { Router } from 'express';
import * as AIModelController from '../controllers/aiModelController.js';
import { jwtAuthentication } from '../middlewares/passport.middleware.js';
import { verifyAdmin } from '../middlewares/auth.middleware.js';

const aiModelApi = Router();

// get tất cả model
aiModelApi.get('/get', AIModelController.listModels);

// get một model theo ID
aiModelApi.get('/get/:id', AIModelController.getModel);

// Tạo mới model
aiModelApi.post('/create', jwtAuthentication, verifyAdmin, AIModelController.createModel);

// Cập nhật model 
aiModelApi.put('/update/:id', jwtAuthentication, verifyAdmin, AIModelController.updateModel);

//  Xoá model 
aiModelApi.delete('/delete/:id', jwtAuthentication, verifyAdmin, AIModelController.removeModel);

export default aiModelApi;
