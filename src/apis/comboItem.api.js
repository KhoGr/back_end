import { Router } from 'express';
import ComboItemController from '../controllers/comboItem.controller.js';
import { jwtAuthentication } from '../middlewares/passport.middleware.js';
import { verifyAdmin } from '../middlewares/auth.middleware.js';

const comboItemApi = Router();

// Lấy danh sách các món trong combo
comboItemApi.get('/:combo_id', ComboItemController.getItems);

// Thêm một món vào combo
comboItemApi.post('/', jwtAuthentication, verifyAdmin, ComboItemController.addItem);

// Cập nhật số lượng món trong combo
comboItemApi.put('/:combo_id/:item_id', jwtAuthentication, verifyAdmin, ComboItemController.updateItem);

// Xoá một món ra khỏi combo
comboItemApi.delete('/:combo_id/:item_id', jwtAuthentication, verifyAdmin, ComboItemController.removeItem);

// Xoá toàn bộ món trong combo
comboItemApi.delete('/:combo_id', jwtAuthentication, verifyAdmin, ComboItemController.clearCombo);

export default comboItemApi;
