import { Router } from 'express';
import OrderController from '../controllers/order.controller.js';
import { jwtAuthentication } from '../middlewares/passport.middleware.js';
import { verifyAdmin } from '../middlewares/auth.middleware.js';

const orderAPI = Router();

// 🔍 Tìm kiếm đơn hàng
orderAPI.get('/search', OrderController.search);

// 📊 Thống kê dashboard theo ngày (thêm mới)
orderAPI.get('/dashboard/daily', OrderController.getDashboardStatsByDate);

// 📋 Lấy danh sách tất cả đơn hàng
orderAPI.get('/', jwtAuthentication, verifyAdmin, OrderController.getAll);

// 🆕 Tạo mới đơn hàng
orderAPI.post('/', OrderController.create);

// 🔍 Lấy chi tiết đơn hàng
orderAPI.get('/:id', OrderController.getById);

// 🔁 Cập nhật đơn hàng
orderAPI.patch('/:id', OrderController.update);

// 🔄 Tính lại tổng tiền đơn hàng
orderAPI.patch('/:id/recalculate', jwtAuthentication, verifyAdmin, OrderController.recalculateTotal);

// ❌ Xoá đơn hàng
orderAPI.delete('/:id', jwtAuthentication, verifyAdmin, OrderController.remove);

// 📦 Lấy đơn hàng theo khách hàng
orderAPI.get('/customer/:customer_id', jwtAuthentication, OrderController.getByCustomerId);

export default orderAPI;
