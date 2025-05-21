// services/order.service.js

import db from '../models/index.js';

const OrderService = {
  async createOrder(data) {
    const { customer_id, staff_id, order_items, note } = data;

    return await db.sequelize.transaction(async (t) => {
      // Tính tổng tiền
      let total_amount = 0;
      for (const item of order_items) {
        const menuItem = await db.MenuItem.findByPk(item.item_id);
        if (!menuItem || !menuItem.is_available) {
          throw new Error(`Item ${item.item_id} is unavailable`);
        }

        let itemPrice = menuItem.price;
        if (menuItem.discount_percent) {
          itemPrice = itemPrice * (1 - menuItem.discount_percent / 100);
        }

        total_amount += itemPrice * item.quantity;
      }

      // Tạo order
      const order = await db.Order.create(
        {
          customer_id,
          staff_id,
          total_amount,
          note,
        },
        { transaction: t }
      );

      // Tạo các order items
      const itemsToCreate = order_items.map((item) => ({
        order_id: order.order_id,
        item_id: item.item_id,
        quantity: item.quantity,
      }));

      await db.OrderItem.bulkCreate(itemsToCreate, { transaction: t });

      return order;
    });
  },

  async getAllOrders() {
    return await db.Order.findAll({
      include: [
        {
          model: db.Customer,
          as: 'customer',
        },
        {
          model: db.Staff,
          as: 'staff',
        },
        {
          model: db.OrderItem,
          as: 'order_items',
          include: {
            model: db.MenuItem,
            as: 'menu_item',
          },
        },
      ],
      order: [['order_date', 'DESC']],
    });
  },

  async getOrderById(order_id) {
    return await db.Order.findByPk(order_id, {
      include: [
        {
          model: db.Customer,
          as: 'customer',
        },
        {
          model: db.Staff,
          as: 'staff',
        },
        {
          model: db.OrderItem,
          as: 'order_items',
          include: {
            model: db.MenuItem,
            as: 'menu_item',
          },
        },
      ],
    });
  },

  async updateOrderStatus(order_id, status) {
    const order = await db.Order.findByPk(order_id);
    if (!order) throw new Error('Order not found');

    order.status = status;
    await order.save();
    return order;
  },

  async deleteOrder(order_id) {
    const order = await db.Order.findByPk(order_id);
    if (!order) throw new Error('Order not found');

    await order.destroy();
    return true;
  },
};

export default OrderService;
