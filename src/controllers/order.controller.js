import OrderService from '../service/order.service.js';

const OrderController = {
  // 🆕 Tạo đơn hàng
  async create(req, res) {
    try {
      const data = req.body;
      const order = await OrderService.createOrder(data);
      res.status(201).json({ success: true, data: order });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // 📋 Lấy tất cả đơn hàng
  async getAll(req, res) {
    try {
      const orders = await OrderService.getAllOrders();
      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // 🔍 Tìm đơn hàng theo ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const order = await OrderService.getOrderById(id);
      res.status(200).json({ success: true, data: order });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  },

  // 🔄 Cập nhật đơn hàng (toàn bộ dữ liệu)
  async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedOrder = await OrderService.updateOrder(id, updateData);
      res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // 🔁 Chỉ cập nhật status
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedOrder = await OrderService.updateOrder(id, { status });
      res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // ❌ Xoá đơn hàng
  async remove(req, res) {
    try {
      const { id } = req.params;
      await OrderService.deleteOrder(id);
      res.status(200).json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // 🔍 Tìm kiếm theo keyword (tên khách hoặc ghi chú)
  async search(req, res) {
    try {
      const { q } = req.query;
      const result = await OrderService.searchOrders(q || '');
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // 📊 Lọc đơn hàng theo trạng thái
  async filterByStatus(req, res) {
    try {
      const { status } = req.params;
      const result = await OrderService.getOrdersByStatus(status);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
};

export default OrderController;
