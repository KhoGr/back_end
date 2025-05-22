import { Router } from 'express';
import OrderController from '../controllers/order.controller.js';
import { jwtAuthentication } from '../middlewares/passport.middleware.js';
import { verifyAdmin } from '../middlewares/auth.middleware.js';

const orderAPI = Router();

// 📋 🔒 Lấy danh sách tất cả đơn hàng (chỉ admin)
orderAPI.get('/', jwtAuthentication, verifyAdmin, OrderController.getAll);

// 🔍 Tìm kiếm đơn hàng theo từ khóa (name/note)
orderAPI.get('/search', jwtAuthentication, verifyAdmin, OrderController.search);

// 📊 Lọc đơn hàng theo trạng thái (VD: pending, completed)
orderAPI.get('/status/:status', jwtAuthentication, verifyAdmin, OrderController.filterByStatus);

// 🆕 Tạo mới đơn hàng (khách hàng hoặc nhân viên, không cần admin)
orderAPI.post('/', jwtAuthentication, OrderController.create);

// 📦 Lấy chi tiết đơn hàng theo ID
// 👉 Nếu cần giới hạn quyền (vd: chỉ khách được xem đơn của họ), bạn cần kiểm tra thêm trong controller
orderAPI.get('/:id', jwtAuthentication, OrderController.getById);

// 🔄 Cập nhật toàn bộ đơn hàng (chỉ admin)
orderAPI.put('/:id', jwtAuthentication, verifyAdmin, OrderController.update);

// 🔁 Cập nhật chỉ trạng thái đơn hàng
orderAPI.patch('/:id/status', jwtAuthentication, verifyAdmin, OrderController.updateStatus);

// ❌ Xoá đơn hàng
orderAPI.delete('/:id', jwtAuthentication, verifyAdmin, OrderController.remove);

export default orderAPI;
