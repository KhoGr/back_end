// controllers/order.controller.js

import OrderService from '../services/order.service.js';

const OrderController = {
  async create(req, res) {
    try {
      const data = req.body;
      const order = await OrderService.createOrder(data);
      res.status(201).json({ success: true, data: order });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const orders = await OrderService.getAllOrders();
      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const order = await OrderService.getOrderById(id);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      res.status(200).json({ success: true, data: order });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedOrder = await OrderService.updateOrderStatus(id, status);
      res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      await OrderService.deleteOrder(id);
      res.status(200).json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
};

export default OrderController;
