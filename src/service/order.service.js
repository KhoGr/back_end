import Order from '../models/order.js';
import Customer from '../models/customer.js';
import Staff from '../models/staff.js';
import OrderItem from '../models/order_item.js';
import { Op } from 'sequelize';

const orderService = {
  // 🆕 Tạo đơn hàng mới
  async createOrder(orderData) {
    return await Order.create(orderData, {
      include: [
        {
          model: OrderItem,
          as: 'order_items',
        },
      ],
    });
  },

  // 📋 Lấy toàn bộ đơn hàng (có thể phân trang sau)
  async getAllOrders() {
    return await Order.findAll({
      include: [
        { model: Customer, as: 'customer', attributes: ['customer_id', 'name', 'email'] },
        { model: Staff, as: 'staff', attributes: ['staff_id', 'name'] },
        { model: OrderItem, as: 'order_items' },
      ],
      order: [['order_date', 'DESC']],
    });
  },

  // 🔍 Lấy đơn hàng theo ID
  async getOrderById(order_id) {
    const order = await Order.findByPk(order_id, {
      include: [
        { model: Customer, as: 'customer', attributes: ['customer_id', 'name', 'email'] },
        { model: Staff, as: 'staff', attributes: ['staff_id', 'name'] },
        { model: OrderItem, as: 'order_items' },
      ],
    });
    if (!order) throw new Error('Order not found');
    return order;
  },

  // 🔄 Cập nhật đơn hàng
  async updateOrder(order_id, updateData) {
    const order = await Order.findByPk(order_id);
    if (!order) throw new Error('Order not found');
    await order.update(updateData);
    return order;
  },

  // ❌ Xoá đơn hàng
  async deleteOrder(order_id) {
    const deletedCount = await Order.destroy({ where: { order_id } });
    if (deletedCount === 0) throw new Error('Order not found or already deleted');
    return { message: 'Order deleted successfully' };
  },

  // 🔍 Tìm kiếm đơn hàng theo keyword (theo tên khách hàng hoặc ghi chú)
  async searchOrders(keyword) {
    return await Order.findAll({
      include: [
        {
          model: Customer,
          as: 'customer',
          where: {
            name: { [Op.like]: `%${keyword}%` },
          },
          required: false,
        },
        { model: Staff, as: 'staff' },
        { model: OrderItem, as: 'order_items' },
      ],
      where: {
        [Op.or]: [
          { note: { [Op.like]: `%${keyword}%` } },
        ],
      },
    });
  },

  // 📊 Lọc theo trạng thái
  async getOrdersByStatus(status) {
    return await Order.findAll({
      where: { status },
      include: [
        { model: Customer, as: 'customer' },
        { model: Staff, as: 'staff' },
        { model: OrderItem, as: 'order_items' },
      ],
    });
  },
};

export default orderService;
