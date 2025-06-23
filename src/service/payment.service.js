import qs from 'qs';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

import Payment from '../models/payment.js';
import Order from '../models/order.js';

const vnp_TmnCode = process.env.VNP_TMN_CODE;
const vnp_HashSecret = process.env.VNP_HASH_SECRET;
const vnp_Url = process.env.VNP_URL;
const vnp_ReturnUrl = 'https://restaurant.vnpt-hn.io.vn/order-return';

// Hàm chuẩn hóa ngày giờ theo GMT+7
const getVNPayDate = () => {
  const date = new Date(Date.now() + 7 * 60 * 60 * 1000); // +7h
  const pad = (n) => n.toString().padStart(2, '0');
  return (
    date.getFullYear() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
};

// Encode giá trị theo đúng format VNPAY
const encodeVNPay = (str) => encodeURIComponent(str).replace(/%20/g, '+');

const createPaymentUrl = async ({ orderId, ipAddress }) => {
  const realIp = ipAddress.split(',')[0].trim();

  console.log(`📦 Creating payment for OrderID: ${orderId} - IP: ${realIp}`);
  const order = await Order.findByPk(orderId);
  if (!order) throw new Error('Order not found');

  const amount = order.final_amount;
  if (!amount || isNaN(amount)) throw new Error('Invalid order amount');

  const txnRef = `${orderId}-${Date.now()}`;
  const createDate = getVNPayDate();

  const inputData = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: txnRef,
    vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
    vnp_OrderType: 'other',
    vnp_Amount: amount * 100,
    vnp_ReturnUrl,
    vnp_IpAddr: realIp,
    vnp_CreateDate: createDate,
  };

  const sortedData = Object.keys(inputData).sort().reduce((acc, key) => {
    acc[key] = inputData[key];
    return acc;
  }, {});

  // ⚠️ Phải encode từng value theo chuẩn VNPAY
  const signData = Object.entries(sortedData)
    .map(([key, val]) => `${key}=${encodeVNPay(val)}`)
    .join('&');

  const secureHash = crypto
    .createHmac('sha512', vnp_HashSecret)
    .update(signData)
    .digest('hex');

  sortedData.vnp_SecureHash = secureHash;

  const finalUrl = `${vnp_Url}?${qs.stringify(sortedData, { encode: true })}`;

  console.log(' Generated payment URL:', finalUrl);
  return finalUrl;
};

// 📥 Xử lý IPN từ VNPAY
const handleIPN = async (query) => {
  console.log(' IPN received:', query);

  const vnpParams = { ...query };
  const secureHash = vnpParams.vnp_SecureHash;
  delete vnpParams.vnp_SecureHash;
  delete vnpParams.vnp_SecureHashType;

  const sortedParams = Object.keys(vnpParams).sort().reduce((acc, key) => {
    acc[key] = vnpParams[key];
    return acc;
  }, {});

  const signData = qs.stringify(sortedParams, { encode: false });
  const hashCheck = crypto
    .createHmac('sha512', vnp_HashSecret)
    .update(signData)
    .digest('hex');

  if (secureHash !== hashCheck) {
    console.error(' Checksum mismatch');
    return { code: '97', message: 'Checksum not match' };
  }

  const orderId = parseInt(vnpParams.vnp_TxnRef.split('-')[0]);
  const amount = parseFloat(vnpParams.vnp_Amount) / 100;

  const order = await Order.findByPk(orderId);
  if (!order) return { code: '01', message: 'Order not found' };
  if (order.final_amount != amount) return { code: '04', message: 'Invalid amount' };

  const existing = await Payment.findOne({
    where: { transaction_no: vnpParams.vnp_TransactionNo },
  });
  if (existing) return { code: '02', message: 'Transaction already exists' };

  const paymentData = {
    order_id: orderId,
    amount,
    transaction_no: vnpParams.vnp_TransactionNo,
    bank_code: vnpParams.vnp_BankCode,
    bank_transaction_no: vnpParams.vnp_BankTranNo,
    card_type: vnpParams.vnp_CardType,
    pay_date: vnpParams.vnp_PayDate,
    response_code: vnpParams.vnp_ResponseCode,
    transaction_status: vnpParams.vnp_TransactionStatus,
    checksum: secureHash,
    status: vnpParams.vnp_ResponseCode === '00' ? 'success' : 'failed',
  };

  await Payment.create(paymentData);
  console.log(' Payment recorded:', paymentData);

  if (vnpParams.vnp_ResponseCode === '00') {
    order.is_paid = true;
    await order.save();
    console.log('Order marked as paid');
  }

  return { code: '00', message: 'Success' };
};

export default {
  createPaymentUrl,
  handleIPN,
};
