import paymentService from '../service/payment.service.js';

export const createVNPayUrl = async (req, res) => {
  try {
    const { orderId } = req.params;
    const ipAddress =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const paymentUrl = await paymentService.createPaymentUrl({
      orderId,
      ipAddress,
    });

    return res.status(200).json({ paymentUrl });
  } catch (error) {
    console.error('❌ createVNPayUrl error:', error.message);
    return res.status(500).json({ error: 'Không tạo được link thanh toán' });
  }
};

export const handleVNPayIPN = async (req, res) => {
  try {
    const result = await paymentService.handleIPN(req.query);

    // 🔁 VNPay yêu cầu phản hồi đúng định dạng JSON
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
