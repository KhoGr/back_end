import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  markAsPaid,
  searchOrders,
  calculateTotalAmount
} from '../service/order.service.js';

const OrderController = {
  // 🆕 Tạo đơn hàng
  async create(req, res) {
    try {
      const data = req.body;
      const order = await createOrder(data);
      res.status(201).json({ success: true, data: order });
    } catch (error) {
      console.error('Create Order Error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // 📋 Lấy tất cả đơn hàng
  async getAll(req, res) {
    try {
      const orders = await getAllOrders();
      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      console.error('Get All Orders Error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // 🔍 Tìm đơn hàng theo ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const order = await getOrderById(id);
      res.status(200).json({ success: true, data: order });
    } catch (error) {
      console.error('Get Order By ID Error:', error);
      res.status(404).json({ success: false, message: error.message });
    }
  },

  // 🔁 Cập nhật trạng thái đơn hàng
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ success: false, message: 'Status is required' });
      }

      const updatedOrder = await updateOrderStatus(id, status);
      res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
      console.error('Update Order Status Error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // ❌ Xoá đơn hàng
  async remove(req, res) {
    try {
      const { id } = req.params;
      await deleteOrder(id);
      res.status(200).json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
      console.error('Delete Order Error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // 🔍 Tìm kiếm/lọc đơn hàng
  async search(req, res) {
    try {
      const { keyword, status, date_from, date_to } = req.query;
      const result = await searchOrders({ keyword, status, date_from, date_to });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error('Search Orders Error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // 💰 Đánh dấu đã thanh toán
  async markPaid(req, res) {
    try {
      const { id } = req.params;
      const { method } = req.body;

      if (!method) {
        return res.status(400).json({ success: false, message: 'Payment method is required' });
      }

      const order = await markAsPaid(id, method);
      res.status(200).json({ success: true, data: order });
    } catch (error) {
      console.error('Mark Order Paid Error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // 🔄 Tính lại tổng tiền (nếu sửa order_items)
  async recalculateTotal(req, res) {
    try {
      const { id } = req.params;
      const total = await calculateTotalAmount(id);
      res.status(200).json({ success: true, total });
    } catch (error) {
      console.error('Recalculate Total Error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }
};

export default OrderController;
