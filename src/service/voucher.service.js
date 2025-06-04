import models from '../models/index.js';
const { Voucher, VoucherRedemption, Customer } = models;
import { Op } from 'sequelize';

class VoucherService {
  // Tạo mới voucher
  async createVoucher(data) {
    return await Voucher.create(data);
  }

  // Cập nhật voucher
  async updateVoucher(id, data) {
    const voucher = await Voucher.findByPk(id);
    if (!voucher) throw new Error('Voucher không tồn tại');
    return await voucher.update(data);
  }

  // Xoá voucher
  async deleteVoucher(id) {
    const voucher = await Voucher.findByPk(id);
    if (!voucher) throw new Error('Voucher không tồn tại');
    await voucher.destroy();
    return { message: 'Xoá voucher thành công' };
  }

  // Lấy tất cả voucher (hoặc có thể lọc theo trạng thái)
  async getAllVouchers() {
    return await Voucher.findAll({
      order: [['created_at', 'DESC']],
    });
  }

  // Kiểm tra voucher hợp lệ
  async validateVoucher(code, customerId) {
    const voucher = await Voucher.findOne({ where: { code } });
    if (!voucher) throw new Error('Voucher không tồn tại');

    const now = new Date();
    if (voucher.start_date && now < voucher.start_date) {
      throw new Error('Voucher chưa bắt đầu');
    }
    if (voucher.end_date && now > voucher.end_date) {
      throw new Error('Voucher đã hết hạn');
    }

    const usageCount = await VoucherRedemption.count({
      where: { voucher_id: voucher.id },
    });

    if (voucher.usage_limit && usageCount >= voucher.usage_limit) {
      throw new Error('Voucher đã được sử dụng hết');
    }

    const alreadyUsed = await VoucherRedemption.findOne({
      where: {
        voucher_id: voucher.id,
        customer_id: customerId,
      },
    });

    if (alreadyUsed) {
      throw new Error('Bạn đã sử dụng voucher này rồi');
    }

    return voucher;
  }

  // Áp dụng voucher cho đơn hàng
  async applyVoucher({ code, customerId, orderTotal }) {
    const voucher = await this.validateVoucher(code, customerId);

    let discountAmount = 0;
    if (voucher.discount_type === 'fixed') {
      discountAmount = parseFloat(voucher.discount_value);
    } else if (voucher.discount_type === 'percent') {
      discountAmount = (parseFloat(voucher.discount_value) / 100) * orderTotal;
    }

    // Đảm bảo không vượt quá giá trị đơn hàng
    discountAmount = Math.min(discountAmount, orderTotal);

    return {
      voucher,
      discountAmount,
      finalTotal: orderTotal - discountAmount,
    };
  }

  // Ghi nhận đã sử dụng
  async redeemVoucher({ voucherId, customerId }) {
    return await VoucherRedemption.create({
      voucher_id: voucherId,
      customer_id: customerId,
      redeemed_at: new Date(),
    });
  }
}

export default new VoucherService();
