import { Router } from 'express';
import OrderController from '../controllers/order.controller.js';
import { jwtAuthentication } from '../middlewares/passport.middleware.js';
import { verifyAdmin } from '../middlewares/auth.middleware.js';

const orderAPI = Router();


orderAPI.get('/search', jwtAuthentication, verifyAdmin, OrderController.search);

//  Lấy danh sách tất cả đơn hàng 
orderAPI.get('/', jwtAuthentication, verifyAdmin, OrderController.getAll);

//  Tạo mới đơn hàng 
orderAPI.post('/', jwtAuthentication, OrderController.create);

//  Lấy chi tiết đơn hàng
orderAPI.get('/:id', jwtAuthentication, OrderController.getById);

//  Cập nhật đơn hàng hơi bug tý
orderAPI.patch('/:id', jwtAuthentication, OrderController.update);

//  Tính lại tổng tiền đơn hàng
orderAPI.patch('/:id/recalculate', jwtAuthentication, verifyAdmin, OrderController.recalculateTotal);

//  Xoá đơn hàng
orderAPI.delete('/:id', jwtAuthentication, verifyAdmin, OrderController.remove);
orderAPI.get('/customer/:customer_id', jwtAuthentication, OrderController.getByCustomerId);


export default orderAPI;
