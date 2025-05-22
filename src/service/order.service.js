import { Op, Sequelize } from 'sequelize';
import { sequelize } from '../config/database.js';
import Order from '../models/order.js';
import Customer from '../models/customer.js';
import Staff from '../models/staff.js';
import OrderItem from '../models/order_item.js';

const orderService = {
  // 🆕 Tạo đơn hàng mới với transaction
  async createOrder(orderData) {
    const t = await sequelize.transaction();
    try {
      const newOrder = await Order.create(orderData, {
        include: [{ model: OrderItem, as: 'order_items' }],
        transaction: t,
      });
      await t.commit();
      return newOrder;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },

  // 📋 Lấy toàn bộ đơn hàng
  async getAllOrders() {
    return await Order.findAll({
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['customer_id', 'name', 'email'],
        },
        {
          model: Staff,
          as: 'staff',
          attributes: ['staff_id', 'name'],
        },
        {
          model: OrderItem,
          as: 'order_items',
          attributes: ['order_item_id', 'item_id', 'quantity', 'price'],
        },
      ],
      order: [['order_date', 'DESC']],
    });
  },

  // 🔍 Lấy đơn hàng theo ID
  async getOrderById(order_id) {
    const order = await Order.findByPk(order_id, {
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['customer_id', 'name', 'email'],
        },
        {
          model: Staff,
          as: 'staff',
          attributes: ['staff_id', 'name'],
        },
        {
          model: OrderItem,
          as: 'order_items',
          attributes: ['order_item_id', 'item_id', 'quantity', 'price'],
        },
      ],
    });

    if (!order) throw new Error('Order not found');
    return order;
  },

  // 🔄 Cập nhật đơn hàng và order_items
  async updateOrder(order_id, updateData) {
    const t = await sequelize.transaction();
    try {
      const order = await Order.findByPk(order_id, { transaction: t });
      if (!order) throw new Error('Order not found');

      // Cập nhật thông tin đơn hàng
      await order.update(updateData, { transaction: t });

      // Nếu có order_items gửi lên → cập nhật lại
      if (updateData.order_items) {
        // Xoá toàn bộ order_items cũ
        await OrderItem.destroy({ where: { order_id }, transaction: t });

        // Tạo lại order_items mới
        const items = updateData.order_items.map(item => ({
          ...item,
          order_id,
        }));
        await OrderItem.bulkCreate(items, { transaction: t });
      }

      await t.commit();
      return await order.reload({ include: [{ model: OrderItem, as: 'order_items' }] });
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },

  // ❌ Xoá đơn hàng
  async deleteOrder(order_id) {
    const deletedCount = await Order.destroy({ where: { order_id } });
    if (deletedCount === 0) throw new Error('Order not found or already deleted');
    return { message: 'Order deleted successfully' };
  },

  // 🔍 Tìm kiếm đơn hàng theo keyword
  async searchOrders(keyword) {
    return await Order.findAll({
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['customer_id', 'name', 'email'],
          required: false,
        },
        {
          model: Staff,
          as: 'staff',
          attributes: ['staff_id', 'name'],
        },
        {
          model: OrderItem,
          as: 'order_items',
          attributes: ['order_item_id', 'item_id', 'quantity', 'price'],
        },
      ],
      where: {
        [Op.or]: [
          { '$customer.name$': { [Op.like]: `%${keyword}%` } },
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
        {
          model: Customer,
          as: 'customer',
          attributes: ['customer_id', 'name', 'email'],
        },
        {
          model: Staff,
          as: 'staff',
          attributes: ['staff_id', 'name'],
        },
        {
          model: OrderItem,
          as: 'order_items',
          attributes: ['order_item_id', 'item_id', 'quantity', 'price'],
        },
      ],
    });
  },
};

export default orderService;
