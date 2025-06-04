import { Router } from 'express';
import OrderController from '../controllers/order.controller.js';
import { jwtAuthentication } from '../middlewares/passport.middleware.js';
import { verifyAdmin } from '../middlewares/auth.middleware.js';

const orderAPI = Router();

// 🔍 Tìm kiếm/lọc đơn hàng theo từ khóa/trạng thái/ngày
// ⚠️ Đặt trước /:id để tránh bị hiểu nhầm là param id
orderAPI.get('/search', jwtAuthentication, verifyAdmin, OrderController.search);

// 📋 🔒 Lấy danh sách tất cả đơn hàng (chỉ admin)
orderAPI.get('/', jwtAuthentication, verifyAdmin, OrderController.getAll);

// 🆕 Tạo mới đơn hàng (nhân viên hoặc khách hàng)
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
