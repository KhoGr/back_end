import crypto from 'crypto';
import { paymentService } from '../service/payment.service.js'

export const paymentController = {
  async handleVnpayIpn(req, res) {
    // 👇 Lấy trực tiếp từ process.env
    const vnp_HashSecret = process.env.VNP_HASH_SECRET;

    const query = req.query;
    const vnp_SecureHash = query.vnp_SecureHash;

    const inputData = { ...query };
    delete inputData.vnp_SecureHash;
    delete inputData.vnp_SecureHashType;

    // 🔐 Tạo chuỗi dữ liệu để hash
    const sortedKeys = Object.keys(inputData).sort();
    const signData = sortedKeys.map(key => `${key}=${inputData[key]}`).join('&');

    // 🔒 Tính checksum từ server
    const hmac = crypto.createHmac('sha512', vnp_HashSecret);
    const computedHash = hmac.update(signData).digest('hex');

    if (vnp_SecureHash !== computedHash) {
      return res.status(400).json({ code: '97', message: 'Sai checksum' });
    }

    // ✅ Xử lý thanh toán
    const result = await paymentService.createFromVnpay(inputData);

    if (result.status === 'success' || result.status === 'exists') {
      return res.status(200).json({ RspCode: '00', Message: 'Thành công' });
    } else {
      return res.status(200).json({ RspCode: '99', Message: 'Thất bại' });
    }
  }
};
