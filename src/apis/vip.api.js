import { Router } from 'express';
import MembershipController from '../controllers/MembershipController.js';
import { jwtAuthentication } from '../middlewares/passport.middleware.js';
import { verifyAdmin } from '../middlewares/auth.middleware.js';

const membershipApi = Router();

// ✅ Route tìm kiếm theo keyword (nên đặt trước route /get/:id để tránh nhầm lẫn)
membershipApi.get('/search', MembershipController.getByKeyword);

// Lấy tất cả memberships
membershipApi.get('/get', MembershipController.getAll);

// Lấy membership theo ID
membershipApi.get('/get/:id', MembershipController.getById);

// Tạo mới (yêu cầu admin)
membershipApi.post('/create', jwtAuthentication, verifyAdmin, MembershipController.create);

// Cập nhật (yêu cầu admin)
membershipApi.put('/update/:id', jwtAuthentication, verifyAdmin, MembershipController.update);

// Xoá (yêu cầu admin)
membershipApi.delete('/delete/:id', jwtAuthentication, verifyAdmin, MembershipController.delete);

export default membershipApi;
