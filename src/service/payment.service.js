import qs from 'qs';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

import Payment from '../models/payment.js';
import Order from '../models/order.js';

const vnp_TmnCode = process.env.VNP_TMN_CODE;
const vnp_HashSecret = process.env.VNP_HASH_SECRET;
const vnp_Url = process.env.VNP_URL;
const vnp_ReturnUrl = process.env.VNP_RETURN_URL;
const vnp_IpnUrl = process.env.VNP_IPN_URL;

console.log('✅ ENV CONFIG:');
console.log({
  vnp_TmnCode,
  vnp_HashSecret: vnp_HashSecret?.slice(0, 5) + '...', // hide for safety
  vnp_Url,
  vnp_ReturnUrl,
  vnp_IpnUrl,
});

const createPaymentUrl = async ({ orderId, ipAddress }) => {
  console.log(`📦 Creating payment for OrderID: ${orderId} - IP: ${ipAddress}`);

  const order = await Order.findByPk(orderId);
  if (!order) {
    console.error('❌ Order not found');
    throw new Error('Order not found');
  }

  const amount = order.final_amount;
  if (!amount || isNaN(amount)) {
    console.error('❌ Invalid amount in order');
    throw new Error('Invalid order amount');
  }

  const date = new Date();
  const createDate = date.toISOString().replace(/[-:TZ]/g, '').slice(0, 14);
  const txnRef = `${orderId}-${Date.now()}`;

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
    vnp_IpAddr: ipAddress,
    vnp_CreateDate: createDate,
    vnp_IpnUrl,
  };

  console.log('🔧 Raw inputData:', inputData);

  const sortedData = Object.keys(inputData).sort().reduce((acc, key) => {
    acc[key] = inputData[key];
    return acc;
  }, {});

  const signData = qs.stringify(sortedData, { encode: false });
  const secureHash = crypto
    .createHmac('sha512', vnp_HashSecret)
    .update(signData)
    .digest('hex');

  sortedData.vnp_SecureHash = secureHash;

  const finalUrl = `${vnp_Url}?${qs.stringify(sortedData, { encode: true })}`;
  console.log('✅ Generated payment URL:', finalUrl);

  return finalUrl;
};

const handleIPN = async (query) => {
  console.log('📥 IPN received:', query);

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

  console.log('🔒 SecureHash received:', secureHash);
  console.log('🔒 SecureHash calculated:', hashCheck);

  if (secureHash !== hashCheck) {
    console.error('❌ Checksum mismatch');
    return { code: '97', message: 'Checksum not match' };
  }

  const orderId = parseInt(vnpParams.vnp_TxnRef.split('-')[0]);
  const amount = parseFloat(vnpParams.vnp_Amount) / 100;

  const order = await Order.findByPk(orderId);
  if (!order) {
    console.error('❌ Order not found');
    return { code: '01', message: 'Order not found' };
  }

  if (order.final_amount != amount) {
    console.error('❌ Amount mismatch', {
      expected: order.final_amount,
      received: amount,
    });
    return { code: '04', message: 'Invalid amount' };
  }

  const existing = await Payment.findOne({
    where: { transaction_no: vnpParams.vnp_TransactionNo },
  });
  if (existing) {
    console.warn('⚠️ Transaction already exists:', vnpParams.vnp_TransactionNo);
    return { code: '02', message: 'Transaction already exists' };
  }

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
  console.log('💾 Payment recorded:', paymentData);

  if (vnpParams.vnp_ResponseCode === '00') {
    order.is_paid = true;
    await order.save();
    console.log('✅ Order marked as paid');
  }

  return { code: '00', message: 'Success' };
};

export default {
  createPaymentUrl,
  handleIPN,
};
