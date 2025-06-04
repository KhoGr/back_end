import { Router } from 'express';
import VoucherController from '../controllers/voucher.controller.js';
import { jwtAuthentication } from '../middlewares/passport.middleware.js';
import { verifyAdmin } from '../middlewares/auth.middleware.js';

const voucherApi = Router();

// 🔍 Tìm kiếm (tuỳ chọn thêm sau nếu cần)
// voucherApi.get('/search', VoucherController.search);

// ✅ Lấy danh sách voucher
voucherApi.get('/get', VoucherController.list);

// ✅ Tạo mới voucher (admin)
voucherApi.post('/create', jwtAuthentication, verifyAdmin, VoucherController.create);

// ✅ Cập nhật voucher (admin)
voucherApi.put('/update/:id', jwtAuthentication, verifyAdmin, VoucherController.update);

// ✅ Xoá voucher (admin)
voucherApi.delete('/delete/:id', jwtAuthentication, verifyAdmin, VoucherController.remove);

// ✅ Áp dụng voucher cho đơn hàng
voucherApi.post('/apply', jwtAuthentication, VoucherController.apply);

// ✅ Ghi nhận sử dụng voucher (gọi sau khi thanh toán thành công)
voucherApi.post('/redeem', jwtAuthentication, VoucherController.redeem);

export default voucherApi;
