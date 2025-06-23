import { Router } from 'express';
import MembershipController from '../controllers/MembershipController.js';
import { jwtAuthentication } from '../middlewares/passport.middleware.js';
import { verifyAdmin } from '../middlewares/auth.middleware.js';

const membershipApi = Router();

// tìm kiếm theo keyword 
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
//đã xong và hiện ko vấn đề

export default membershipApi;
