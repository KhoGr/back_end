import Payment from '../models/payment.js'; // hoặc đường dẫn phù hợp với dự án bạn
import Order from '../models/order.js';
import { sequelize } from '../config/database.js';

export const paymentService = {
  async createFromVnpay(payload) {
    const {
      vnp_TxnRef,            
      vnp_TransactionNo,     
      vnp_ResponseCode,
      vnp_TransactionStatus,
      vnp_Amount,
      vnp_BankCode,
      vnp_CardType,
      vnp_PayDate,
      vnp_OrderInfo,
    } = payload;

    const orderId = parseInt(vnp_TxnRef);

    // Kiểm tra trùng giao dịch
    const existing = await Payment.findOne({
      where: { transaction_no: vnp_TransactionNo }
    });
    if (existing) return { status: 'exists', message: 'Giao dịch đã được xử lý' };

    // Giao dịch thành công (ResponseCode === '00' và TransactionStatus === '00')
    const isSuccess = vnp_ResponseCode === '00' && vnp_TransactionStatus === '00';

    // Tạo payment
    const payment = await Payment.create({
      order_id: orderId,
      amount: parseFloat(vnp_Amount) / 100,
      transaction_no: vnp_TransactionNo,
      bank_code: vnp_BankCode,
      card_type: vnp_CardType,
      pay_date: convertPayDate(vnp_PayDate),
      response_code: vnp_ResponseCode,
      transaction_status: vnp_TransactionStatus,
      order_info: vnp_OrderInfo,
    });

    // Nếu thành công thì cập nhật đơn hàng
    if (isSuccess) {
      await Order.update(
        { is_paid: true },
        { where: { id: orderId } }
      );
    }

    return { status: isSuccess ? 'success' : 'fail', payment };
  }
};

function convertPayDate(dateStr) {
  // vnp_PayDate có format: YYYYMMDDHHmmss
  const year = parseInt(dateStr.slice(0, 4));
  const month = parseInt(dateStr.slice(4, 6)) - 1;
  const day = parseInt(dateStr.slice(6, 8));
  const hour = parseInt(dateStr.slice(8, 10));
  const minute = parseInt(dateStr.slice(10, 12));
  const second = parseInt(dateStr.slice(12, 14));
  return new Date(year, month, day, hour, minute, second);
}
