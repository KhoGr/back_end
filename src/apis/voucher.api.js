import { Router } from 'express';
import VoucherController from '../controllers/voucher.controller.js';
import { jwtAuthentication } from '../middlewares/passport.middleware.js';
import { verifyAdmin } from '../middlewares/auth.middleware.js';

const voucherApi = Router();



voucherApi.get('/get', VoucherController.list);

voucherApi.post('/create', jwtAuthentication, verifyAdmin, VoucherController.create);

voucherApi.put('/update/:id', jwtAuthentication, verifyAdmin, VoucherController.update);

voucherApi.delete('/delete/:id', jwtAuthentication, verifyAdmin, VoucherController.remove);

voucherApi.post('/apply', jwtAuthentication, VoucherController.apply);

voucherApi.post('/redeem', jwtAuthentication, VoucherController.redeem);
//chưa tích hợp được redeem

export default voucherApi;
