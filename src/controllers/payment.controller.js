import paymentService from '../service/payment.service.js';

export const createVNPayUrl = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await paymentService.createPaymentUrl({
      orderId,
      amount: req.body.amount, // Nếu bạn muốn nhận amount từ FE
      ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    });

    return res.status(200).json({ paymentUrl: order });
  } catch (error) {
    console.error('❌ createVNPayUrl error:', error.message);
    return res.status(500).json({ error: 'Không tạo được link thanh toán' });
  }
};

export const handleVNPayIPN = async (req, res) => {
  try {
    const result = await paymentService.handleIPN(req.query);

    // VNPay yêu cầu trả đúng định dạng code/message
    return res.status(200).json({
      RspCode: result.code,
      Message: result.message,
    });
  } catch (error) {
    console.error('❌ handleVNPayIPN error:', error.message);
    return res.status(500).json({
      RspCode: '99',
      Message: 'Unknown error',
    });
  }
};
