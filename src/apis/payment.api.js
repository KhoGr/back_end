import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller.js';
import { jwtAuthentication } from '../middlewares/passport.middleware.js';
import { verifyAdmin } from '../middlewares/auth.middleware.js';

const paymentAPI = Router();

// 💰 Lấy danh sách thanh toán (chỉ admin)
// paymentAPI.get('/', jwtAuthentication, verifyAdmin, paymentController.getAll);

// 📄 Lấy chi tiết thanh toán theo id (chỉ admin)
// paymentAPI.get('/:id', jwtAuthentication, verifyAdmin, paymentController.getById);

// 🛑 Xử lý callback từ VNPay (IPN) - không cần auth
paymentAPI.get('/vnpay/ipn', paymentController.handleVnpayIpn);

// 🔄 (tuỳ chọn) Đồng bộ thanh toán với VNPay theo order id (nếu bạn cần làm thủ công)
// paymentAPI.post('/sync/:orderId', jwtAuthentication, verifyAdmin, paymentController.syncManual); // optional

export default paymentAPI;
