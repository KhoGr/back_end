// routes/order.route.js

import { Router } from 'express';
import OrderController from '../controllers/order.controller.js';

const router = Router();

// Lấy danh sách tất cả đơn hàng
router.get('/', OrderController.getAll);

// Tạo mới đơn hàng
router.post('/', OrderController.create);

// Lấy thông tin đơn hàng theo ID
router.get('/:id', OrderController.getById);

// Cập nhật trạng thái đơn hàng
router.put('/:id/status', OrderController.updateStatus);

// Xoá đơn hàng
router.delete('/:id', OrderController.remove);

export default router;
