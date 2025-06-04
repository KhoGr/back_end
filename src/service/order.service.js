import { Op } from 'sequelize';
import Order from '../models/order.js';
import OrderItem from '../models/order_item.js';
import Customer from '../models/customer.js';
import Table from '../models/table.js';
import User from '../models/user.js';
import Account from '../models/account.js';
import MenuItem from '../models/menu_items.js';
import VipLevel from '../models/MembershipTier.js';
import VipLevelService from '../service/vip.service.js'; 
import { updateCustomerSpentAndVip } from '../service/customer.service.js'

export const getAllOrders = async () => {
  return await Order.findAll({
    include: [
      {
        model: Customer,
        as: 'customer',
        include: [
          {
            model: VipLevel,
            as: 'vip_level', 
            attributes: ['id', 'name'], 
          },
          {
            model: User,
            as: 'user_info',
            include: [
              {
                model: Account,
                as: 'account',
                attributes: ['email'],
              },
            ],
          },
        ],
      },
      {
        model: Table,
        as: 'table',
      },
      {
        model: OrderItem,
        as: 'order_items',
        include: [
          {
            model: MenuItem,
            as: 'menu_item',
          },
        ],
      },
    ],
    order: [['order_date', 'DESC']],
  });
};

export const getOrderById = async (id) => {
  const order = await Order.findByPk(id, {
    include: ['customer', 'table', 'order_items'],
  });
  if (!order) throw new Error('Order not found');
  return order;
};

export const createOrder = async (data) => {
  const order = await Order.create(data, { include: ['order_items'] });
  await calculateTotalAmount(order.id);
  await updateCustomerSpentAndVip(order.customer_id);
  return order;
};

export const deleteOrder = async (id) => {
  const deleted = await Order.destroy({ where: { id } });
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
    throw new Error(`Cannot change status from ${order.status} to ${newStatus}`);
  }

  order.status = newStatus;
  await order.save();

  if (newStatus === 'completed') {
    await updateCustomerSpentAndVip(order.customer_id);
  }

  return order;
};

export const markAsPaid = async (id, method) => {
  const order = await Order.findByPk(id);
  if (!order) throw new Error('Order not found');

  // Cập nhật trạng thái thanh toán
  order.is_paid = true;
  order.payment_method = method;
  await order.save();

  // ✅ Ghi nhận redeem nếu có voucher_id và chưa từng redeem
  if (order.voucher_id) {
    const alreadyRedeemed = await VoucherRedemption.findOne({
      where: {
        voucher_id: order.voucher_id,
        customer_id: order.customer_id,
      },
    });

    if (!alreadyRedeemed) {
      await VoucherService.redeemVoucher({
        voucherId: order.voucher_id,
        customerId: order.customer_id,
      });
    }
  }

  // ✅ Cập nhật tổng chi tiêu và cấp bậc VIP của khách
  await updateCustomerSpentAndVip(order.customer_id);

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
        include: [
          {
            model: User,
            as: 'user',
            required: !!(keyword || user_id),
            where: {
              ...(user_id && { id: user_id }),
              ...(keyword && {
                name: {
                  [Op.like]: `%${keyword}%`,
                },
              }),
            },
          },
        ],
      },
      {
        model: Table,
        as: 'table',
      },
    ],
    order: [['order_date', 'DESC']],
  });
};

export const calculateTotalAmount = async (orderId) => {
  const items = await OrderItem.findAll({ where: { order_id: orderId } });

  const total = items.reduce((sum, item) => {
    return sum + parseFloat(item.price) * item.quantity;
  }, 0);

  await Order.update({ total_amount: total }, { where: { id: orderId } });

  return total;
};
