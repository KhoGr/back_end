import { Router } from 'express';
import OrderController from '../controllers/order.controller.js';
import { jwtAuthentication } from '../middlewares/passport.middleware.js';
import { verifyAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// 🔒 Lấy danh sách tất cả đơn hàng (chỉ admin)
router.get('/', jwtAuthentication, verifyAdmin, OrderController.getAll);

// 🔍 Tìm kiếm đơn hàng theo từ khóa
router.get('/search', jwtAuthentication, verifyAdmin, OrderController.search);

// 📊 Lọc đơn hàng theo trạng thái
router.get('/status/:status', jwtAuthentication, verifyAdmin, OrderController.filterByStatus);

// 🆕 Tạo mới đơn hàng (khách hàng hoặc nhân viên)
router.post('/', jwtAuthentication, OrderController.create);

// 📦 Lấy chi tiết đơn hàng theo ID (khách hàng có thể xem đơn của mình)
router.get('/:id', jwtAuthentication, OrderController.getById);

// 🔄 Cập nhật đơn hàng (toàn bộ)
router.put('/:id', jwtAuthentication, verifyAdmin, OrderController.update);

// 🔁 Chỉ cập nhật trạng thái
router.patch('/:id/status', jwtAuthentication, verifyAdmin, OrderController.updateStatus);

// ❌ Xoá đơn hàng (admin)
router.delete('/:id', jwtAuthentication, verifyAdmin, OrderController.remove);

export default router;
