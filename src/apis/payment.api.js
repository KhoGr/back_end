import { Router } from 'express';
import {
  createVNPayUrl,
  handleVNPayIPN,

} from '../controllers/payment.controller.js';

const paymentAPI = Router();

paymentAPI.get('/create-url/:orderId', createVNPayUrl);

paymentAPI.get('/vnpay/ipn', handleVNPayIPN);



export default paymentAPI;
