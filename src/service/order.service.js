import { Op } from 'sequelize';
import Order from '../models/order.js';
import OrderItem from '../models/order_item.js';
import Customer from '../models/customer.js';
import Staff from '../models/staff.js';
import Table from '../models/table.js';

export const getAllOrders = async () => {
  return await Order.findAll({
    include: ['customer', 'staff', 'table', 'order_items'],
    order: [['order_date', 'DESC']],
  });
};

export const getOrderById = async (id) => {
  const order = await Order.findByPk(id, {
    include: ['customer', 'staff', 'table', 'order_items'],
  });
  if (!order) throw new Error('Order not found');
  return order;
};

export const createOrder = async (data) => {
  const order = await Order.create(data, { include: ['order_items'] });
  await calculateTotalAmount(order.order_id);
  return order;
};

export const deleteOrder = async (id) => {
  const deleted = await Order.destroy({ where: { order_id: id } });
  if (!deleted) throw new Error('Order not found or already deleted');
  return { message: 'Order deleted successfully' };
};

export const updateOrderStatus = async (id, newStatus) => {
  const allowedStatuses = [
    'pending',
    'preparing',
    'served',
    'completed',
    'cancelled',
    'refunded',
  ];

  const order = await Order.findByPk(id);
  if (!order) throw new Error('Order not found');

  if (!allowedStatuses.includes(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}`);
  }

  const statusFlow = {
    pending: ['preparing', 'cancelled'],
    preparing: ['served', 'cancelled'],
    served: ['completed', 'refunded'],
    completed: [],
    cancelled: [],
    refunded: [],
  };

  if (!statusFlow[order.status].includes(newStatus)) {
    throw new Error(
      `Cannot change status from ${order.status} to ${newStatus}`
    );
  }

  order.status = newStatus;
  await order.save();
  return order;
};

export const markAsPaid = async (id, method) => {
  const order = await Order.findByPk(id);
  if (!order) throw new Error('Order not found');

  order.is_paid = true;
  order.payment_method = method;
  await order.save();
  return order;
};
export const searchOrders = async (query) => {
  const { keyword, status, date_from, date_to, user_id } = query;

  return await Order.findAll({
    where: {
      ...(status && { status }),
      ...(date_from && date_to && {
        order_date: {
          [Op.between]: [new Date(date_from), new Date(date_to)],
        },
      }),
    },
    include: [
      {
        model: Customer,
        as: 'customer',
        required: true,
        include: user_id
          ? [
              {
                model: User,
                as: 'user',
                where: { id: user_id },
              },
            ]
          : [],
        where: keyword
          ? {
              name: {
                [Op.iLike]: `%${keyword}%`,
              },
            }
          : undefined,
      },
      { model: Staff, as: 'staff' },
      { model: Table, as: 'table' },
    ],
    order: [['order_date', 'DESC']],
  });
};


export const calculateTotalAmount = async (orderId) => {
  const items = await OrderItem.findAll({ where: { order_id: orderId } });

  const total = items.reduce((sum, item) => {
    return sum + parseFloat(item.price) * item.quantity;
  }, 0);

  await Order.update({ total_amount: total }, { where: { order_id: orderId } });

  return total;
};
