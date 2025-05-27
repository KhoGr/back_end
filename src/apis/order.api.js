import { Router } from 'express';
import OrderController from '../controllers/order.controller.js';
import { jwtAuthentication } from '../middlewares/passport.middleware.js';
import { verifyAdmin } from '../middlewares/auth.middleware.js';

const orderAPI = Router();

// 📋 🔒 Lấy danh sách tất cả đơn hàng (chỉ admin)
orderAPI.get('/', jwtAuthentication, verifyAdmin, OrderController.getAll);

// 🔍 Tìm kiếm/lọc đơn hàng theo từ khoá/trạng thái/ngày
orderAPI.get('/search', jwtAuthentication, verifyAdmin, OrderController.search);

// 🆕 Tạo mới đơn hàng (nhân viên hoặc khách)
orderAPI.post('/', jwtAuthentication, OrderController.create);

// 📦 Lấy chi tiết đơn hàng
orderAPI.get('/:id', jwtAuthentication, OrderController.getById);

// 🔁 Cập nhật trạng thái đơn hàng
orderAPI.patch('/:id/status', jwtAuthentication, verifyAdmin, OrderController.updateStatus);

// 💰 Đánh dấu đơn hàng đã thanh toán
orderAPI.patch('/:id/pay', jwtAuthentication, verifyAdmin, OrderController.markPaid);

// 🔄 Tính lại tổng tiền đơn hàng
orderAPI.patch('/:id/recalculate', jwtAuthentication, verifyAdmin, OrderController.recalculateTotal);

// ❌ Xoá đơn hàng
orderAPI.delete('/:id', jwtAuthentication, verifyAdmin, OrderController.remove);

export default orderAPI;
