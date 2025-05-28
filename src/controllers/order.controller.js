import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  markAsPaid,
  searchOrders,
  calculateTotalAmount,
} from '../service/order.service.js';

const OrderController = {
  // 🆕 Tạo đơn hàng
  async create(req, res) {
    try {
      const order = await createOrder(req.body);
      res.status(201).json({ success: true, data: order });
    } catch (error) {
      console.error('[Create Order]', error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // 📋 Lấy tất cả đơn hàng
  async getAll(req, res) {
    try {
      const orders = await getAllOrders();
      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      console.error('[Get All Orders]', error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // 🔍 Lấy đơn hàng theo ID
  async getById(req, res) {
    try {
      const order = await getOrderById(req.params.id);
      res.status(200).json({ success: true, data: order });
    } catch (error) {
      console.error('[Get Order By ID]', error.message);
      res.status(404).json({ success: false, message: error.message });
    }
  },

  // 🔁 Cập nhật trạng thái đơn hàng
  async updateStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    try {
      const updatedOrder = await updateOrderStatus(id, status);
      res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
      console.error('[Update Status]', error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // ❌ Xoá đơn hàng
  async remove(req, res) {
    try {
      await deleteOrder(req.params.id);
      res.status(200).json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
      console.error('[Delete Order]', error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // 🔍 Tìm kiếm/lọc đơn hàng
  async search(req, res) {
    try {
      const result = await searchOrders(req.query);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error('[Search Orders]', error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // 💰 Đánh dấu đã thanh toán
  async markPaid(req, res) {
    const { method } = req.body;
    if (!method) {
      return res.status(400).json({ success: false, message: 'Payment method is required' });
    }

    try {
      const order = await markAsPaid(req.params.id, method);
      res.status(200).json({ success: true, data: order });
    } catch (error) {
      console.error('[Mark Paid]', error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // 🔄 Tính lại tổng tiền đơn hàng
  async recalculateTotal(req, res) {
    try {
      const total = await calculateTotalAmount(req.params.id);
      res.status(200).json({ success: true, total });
    } catch (error) {
      console.error('[Recalculate Total]', error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  },
};

export default OrderController;
