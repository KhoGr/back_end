import { Op } from "sequelize";
import Order from "../models/order.js";
import OrderItem from "../models/order_item.js";
import Customer from "../models/customer.js";
import Table from "../models/table.js";
import User from "../models/user.js";
import Account from "../models/account.js";
import MenuItem from "../models/menu_items.js";
import VipLevel from "../models/MembershipTier.js";
import OrderTable from "../models/order_table.js";
import { updateCustomerSpentAndVip } from "../service/customer.service.js";

export const createOrder = async (data) => {
  if (data.order_type === 'reservation' && !data.reservation_time) {
    throw new Error("Reservation order must have a reservation_time.");
  }

  const tableIds = data.table_ids || []; // expects [id, id]
  delete data.table_ids;

  const order = await Order.create(data, {
    include: [
      {
        model: OrderItem,
        as: "order_items",
      },
    ],
  });

  if (tableIds.length > 0) {
    const tables = await Table.findAll({ where: { table_id: tableIds } });
    await order.setTables(tables);
    if (data.order_type === "reservation") {
      for (const table of tables) {
        table.status = "reserved";
        await table.save();
      }
    }
  }

  if (order.order_type !== "reservation") {
    await calculateTotalAmount(order.id);
  }

  if (order.status === "completed" && order.is_paid) {
    await updateCustomerSpentAndVip(order.customer_id);
  }

  return order;
};

export const updateOrder = async (id, updates) => {
  const order = await Order.findByPk(id);
  if (!order) throw new Error("Order not found");

  const prevStatus = order.status;

  const tableIds = updates.table_ids || [];
  delete updates.table_ids;

  Object.assign(order, updates);

  if (order.order_type === "reservation" && !order.reservation_time) {
    throw new Error("Reservation order must have a reservation_time.");
  }

  await order.save();

  if (tableIds.length > 0) {
    const tables = await Table.findAll({ where: { table_id: tableIds } });
    await order.setTables(tables);
    if (order.order_type === "reservation") {
      for (const table of tables) {
        table.status = "reserved";
        await table.save();
      }
    }
  }

  const hasOrderItems = await OrderItem.count({ where: { order_id: order.id } }) > 0;
  if (hasOrderItems) {
    await calculateTotalAmount(order.id);
  }

  const isNowCompleted = order.status === "completed";
  const isNowPaid = order.is_paid === true;

  if (isNowCompleted && isNowPaid) {
    await updateCustomerSpentAndVip(order.customer_id);
  }

  if (order.order_type === "reservation" && prevStatus !== "completed" && order.status === "completed") {
    const tables = await order.getTables();
    for (const table of tables) {
      if (table.status === "reserved") {
        table.status = "available";
        await table.save();
      }
    }
  }

  return order;
};

export const deleteOrder = async (id) => {
  const order = await Order.findByPk(id, {
    include: ['tables'], // đảm bảo lấy được danh sách bàn liên kết
  });

  if (!order) throw new Error("Order not found");

  // Nếu là loại reservation thì cập nhật lại status các bàn về available
  if (order.order_type === "reservation" && order.tables?.length > 0) {
    for (const table of order.tables) {
      table.status = "available";
      await table.save();
    }
  }

  await OrderItem.destroy({ where: { order_id: id } });
  await OrderTable.destroy({ where: { order_id: id } });
  await Order.destroy({ where: { id } });

  return { message: "Order and related items deleted successfully" };
};


export const calculateTotalAmount = async (orderId) => {
  const items = await OrderItem.findAll({ where: { order_id: orderId } });

  const total = items.reduce((sum, item) => {
    return sum + parseFloat(item.price) * item.quantity;
  }, 0);

  await Order.update({ total_amount: total }, { where: { id: orderId } });

  return total;
};

export const getAllOrders = async () => {
  return await Order.findAll({
    include: [
      {
        model: Customer,
        as: "customer",
        include: [
          {
            model: VipLevel,
            as: "vip_level",
            attributes: ["id", "name"],
          },
          {
            model: User,
            as: "user_info",
            include: [
              {
                model: Account,
                as: "account",
                attributes: ["email"],
              },
            ],
          },
        ],
      },
      {
        model: Table,
        as: "tables",
      },
      {
        model: OrderItem,
        as: "order_items",
        include: [
          {
            model: MenuItem,
            as: "menu_item",
          },
        ],
      },
    ],
    order: [["order_date", "DESC"]],
  });
};


export const getOrderById = async (id) => {
  const order = await Order.findByPk(id, {
    include: [
      {
        model: Customer,
        as: "customer",
        include: [
          {
            model: VipLevel,
            as: "vip_level",
            attributes: ["id", "name"],
          },
          {
            model: User,
            as: "user_info",
            include: [
              {
                model: Account,
                as: "account",
                attributes: ["email"],
              },
            ],
          },
        ],
      },
      {
        model: Table,
        as: "tables",
      },
      {
        model: OrderItem,
        as: "order_items",
        include: [
          {
            model: MenuItem,
            as: "menu_item",
          },
        ],
      },
    ],
  });

  if (!order) throw new Error("Order not found");
  return order;
};

export const searchOrders = async (query) => {
  const { keyword, status, date_from, date_to, user_id } = query;

  return await Order.findAll({
    where: {
      ...(status && { status }),
      ...(date_from &&
        date_to && {
          order_date: {
            [Op.between]: [new Date(date_from), new Date(date_to)],
          },
        }),
    },
    include: [
      {
        model: Customer,
        as: "customer",
        required: true,
        include: [
          {
            model: User,
            as: "user",
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
        as: "tables",
      },
    ],
    order: [["order_date", "DESC"]],
  });
};
