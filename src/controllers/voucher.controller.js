import voucherService from '../../src/service/voucher.service.js';

class VoucherController {
  // [POST] /vouchers
  async create(req, res) {
    try {
      const voucher = await voucherService.createVoucher(req.body);
      res.status(201).json(voucher);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // [PUT] /vouchers/:id
  async update(req, res) {
    try {
      const updated = await voucherService.updateVoucher(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  // [DELETE] /vouchers/:id
  async remove(req, res) {
    try {
      const result = await voucherService.deleteVoucher(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  // [GET] /vouchers
  async list(req, res) {
    try {
      const vouchers = await voucherService.getAllVouchers();
      res.json(vouchers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // [POST] /vouchers/apply
  async apply(req, res) {
    try {
      const { code, customerId, orderTotal } = req.body;

      const result = await voucherService.applyVoucher({ code, customerId, orderTotal });

      res.json({
        voucher: result.voucher,
        discountAmount: result.discountAmount,
        finalTotal: result.finalTotal,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // [POST] /vouchers/redeem
  async redeem(req, res) {
    try {
      const { voucherId, customerId } = req.body;

      const redemption = await voucherService.redeemVoucher({ voucherId, customerId });

      res.status(201).json(redemption);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new VoucherController();
