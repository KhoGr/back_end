import OrderService from '../service/order.service.js';

const OrderController = {
  // 🆕 Tạo đơn hàng
  async create(req, res) {
    try {
      const data = req.body;
      const order = await OrderService.createOrder(data);
      res.status(201).json({ success: true, data: order });
    } catch (error) {
      console.error('Create Order Error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // 📋 Lấy tất cả đơn hàng
  async getAll(req, res) {
    try {
      const orders = await OrderService.getAllOrders();
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
      const order = await OrderService.getOrderById(id);
      res.status(200).json({ success: true, data: order });
    } catch (error) {
      console.error('Get Order By ID Error:', error);
      res.status(404).json({ success: false, message: error.message });
    }
  },

  // 🔄 Cập nhật đơn hàng (bao gồm cả order_items)
  async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedOrder = await OrderService.updateOrder(id, updateData);
      res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
      console.error('Update Order Error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // 🔁 Chỉ cập nhật trạng thái đơn hàng
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ success: false, message: 'Status is required' });
      }

      const updatedOrder = await OrderService.updateOrder(id, { status });
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
      await OrderService.deleteOrder(id);
      res.status(200).json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
      console.error('Delete Order Error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // 🔍 Tìm kiếm đơn hàng theo tên khách hoặc ghi chú
  async search(req, res) {
    try {
      const { q } = req.query;
      const result = await OrderService.searchOrders(q || '');
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error('Search Orders Error:', error);
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
      console.error('Filter Orders By Status Error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  },
};

export default OrderController;
