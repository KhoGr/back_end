import { Op, fn, col } from "sequelize";
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

// ✅ Cập nhật đơn hàng
export const updateOrder = async (id, updates) => {
  const order = await Order.findByPk(id);
  if (!order) throw new Error("Order not found");

  const prevTables = await order.getTables();

  const tableIds = updates.table_ids || [];
  delete updates.table_ids;

  if (updates.order_type === "reservation" && !updates.reservation_time) {
    throw new Error("Reservation order must have a reservation_time.");
  }

  if (updates.order_type === "delivery" && !updates.delivery_address) {
    throw new Error("Delivery order must have a delivery_address.");
  }

  // ✅ Cập nhật dữ liệu đơn hàng (ngoại trừ order_items và table_ids)
  const orderItemsData = updates.order_items;
  delete updates.order_items;

  Object.assign(order, updates);
  await order.save();

  // ✅ Trả lại trạng thái bàn cũ
  for (const table of prevTables) {
    if (["reserved", "occupied"].includes(table.status)) {
      table.status = "available";
      await table.save();
    }
  }

  // ✅ Cập nhật lại bảng mới (nếu có)
  if (tableIds.length > 0) {
    const newTables = await Table.findAll({ where: { table_id: tableIds } });
    await order.setTables(newTables);

    for (const table of newTables) {
      if (order.order_type === "reservation" && order.status === "reserved") {
        table.status = "reserved";
      } else if (order.order_type === "dine-in" && order.status !== "completed") {
        table.status = "occupied";
      }
      await table.save();
    }
  }

  // ✅ Nếu có order_items, xóa cũ + thêm mới
  if (Array.isArray(orderItemsData)) {
    // Xoá các món cũ
    await OrderItem.destroy({ where: { order_id: order.id } });

    // Thêm các món mới kèm giá lấy từ MenuItem
    for (const item of orderItemsData) {
      const menuItem = await MenuItem.findByPk(item.item_id);
      if (!menuItem) continue;

      const price = Number(menuItem.price); // Bạn có thể xử lý giảm giá ở đây nếu muốn

      await OrderItem.create({
        order_id: order.id,
        item_id: item.item_id,
        quantity: item.quantity,
        price,
      });
    }
  }

  // ✅ Luôn tính lại tiền nếu có món
  const hasOrderItems = await OrderItem.count({ where: { order_id: order.id } }) > 0;
  if (hasOrderItems) {
    await calculateTotalAmount(order.id);
  }

  // ✅ Cập nhật khách VIP nếu đơn hoàn tất
  const isNowCompleted = order.status === "completed";
  const isNowPaid = order.is_paid === true;

  if (isNowCompleted && isNowPaid && order.customer_id) {
    await updateCustomerSpentAndVip(order.customer_id);
  }

  // ✅ Trả bàn nếu đơn đã hoàn thành
  if (isNowCompleted) {
    const tables = await order.getTables();
    for (const table of tables) {
      if (["reserved", "occupied"].includes(table.status)) {
        table.status = "available";
        await table.save();
      }
    }
  }

  return order;
};


// ✅ Tạo đơn hàng
export const createOrder = async (data) => {
  if (data.order_type === "reservation" && !data.reservation_time) {
    throw new Error("Reservation order must have a reservation_time.");
  }

  if (data.order_type === "delivery" && !data.delivery_address) {
    throw new Error("Delivery order must have a delivery_address.");
  }

  const tableIds = data.table_ids || [];
  delete data.table_ids;

  const order = await Order.create(data, {
    include: [{ model: OrderItem, as: "order_items" }],
  });

  if (tableIds.length > 0) {
    const tables = await Table.findAll({ where: { table_id: tableIds } });
    await order.setTables(tables);

    for (const table of tables) {
      // ✅ Chỉ đặt reserved khi đơn đã được xác nhận
      if (data.order_type === "reservation" && data.status === "reserved") {
        table.status = "reserved";
      } else if (data.order_type === "dine-in") {
        table.status = "occupied";
      }
      await table.save();
    }
  }

  // ✅ Tính tiền nếu không phải là đơn đặt bàn (vì chưa dùng món)
  if (order.order_type !== "reservation") {
    await calculateTotalAmount(order.id);
  }

  // ✅ Cập nhật thông tin VIP nếu đơn đã hoàn tất
  if (order.status === "completed" && order.is_paid && order.customer_id) {
    await updateCustomerSpentAndVip(order.customer_id);
  }

  return order;
};



// ✅ Tính tổng doanh thu theo tháng
export const calculateMonthlyRevenue = async (monthString) => {
  if (!/^\d{4}-\d{2}$/.test(monthString)) {
    console.error(`[Revenue] ❌ Invalid month format: ${monthString}`);
    throw new Error("Invalid month format. Expected YYYY-MM");
  }

  const startDate = new Date(`${monthString}-01`);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  console.log(`[Revenue] 📅 Calculating revenue from ${startDate.toISOString()} to ${endDate.toISOString()}`);

  const result = await Order.findOne({
    attributes: [[fn("SUM", col("final_amount")), "total_revenue"]],
    where: {
      status: "completed",
      order_date: {
        [Op.gte]: startDate,
        [Op.lt]: endDate,
      },
    },
    raw: true,
  });

  const total = parseFloat(result.total_revenue || 0);
  return total;
};


export const deleteOrder = async (id) => {
  const order = await Order.findByPk(id, {
    include: ['tables'], 
  });

  if (!order) throw new Error("Order not found");

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
  const { keyword, status, date_from, date_to, user_id, order_id } = query;

  return await Order.findAll({
    where: {
      ...(order_id && { id: order_id }), // 👉 THÊM DÒNG NÀY
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
        as: 'customer',
        include: [
          {
            model: User,
            as: 'user_info',
            required: !!(keyword || user_id),
            where: {
              ...(user_id && { id: user_id }),
              ...(keyword && {
                name: {
                  [Op.like]: `%${keyword}%`,
                },
              }),
            },
            include: [
              {
                model: Account,
                as: 'account',
                attributes: ['email'],
              },
            ],
          },
          {
            model: VipLevel,
            as: 'vip_level',
            attributes: ['id', 'name'],
          },
        ],
      },
      {
        model: Table,
        as: 'tables',
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


export const getOrdersByCustomerId = async (customer_id ) => {
  console.log("[Service] 🔍 Fetching orders for customer_id:", customer_id );

  const orders = await Order.findAll({
    where: { customer_id: customer_id  },
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

  return orders;
};
/////////////////////////
// ✅ Thống kê đơn hàng trong ngày
export const getDailyOrderStats = async (dateString) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    console.error(`[OrderStats] ❌ Invalid date format: ${dateString}`);
    throw new Error("Invalid date format. Expected YYYY-MM-DD");
  }

  const start = new Date(`${dateString}T00:00:00.000Z`);
  const end = new Date(`${dateString}T23:59:59.999Z`);

  const orders = await Order.findAll({
    where: {
      order_date: {
        [Op.between]: [start, end],
      },
    },
    attributes: [
      [fn('COUNT', col('id')), 'total_orders'],
      [fn('SUM', col('final_amount')), 'total_revenue'],
      [fn('SUM', col('total_amount')), 'total_gross'],
      [fn('SUM', col('discount_amount')), 'total_discount'],
    ],
    raw: true,
  });

  // Phân loại theo status
  const statusCounts = await Order.findAll({
    where: {
      order_date: {
        [Op.between]: [start, end],
      },
    },
    attributes: ['status', [fn('COUNT', col('id')), 'count']],
    group: ['status'],
    raw: true,
  });

  return {
    date: dateString,
    total_orders: parseInt(orders[0].total_orders || 0),
    total_revenue: parseFloat(orders[0].total_revenue || 0),
    total_gross: parseFloat(orders[0].total_gross || 0),
    total_discount: parseFloat(orders[0].total_discount || 0),
    by_status: statusCounts.reduce((acc, cur) => {
      acc[cur.status] = parseInt(cur.count);
      return acc;
    }, {}),
  };
};
// ✅ Top món ăn được phục vụ nhiều nhất trong ngày
export const getTopServedMenuItemsByDate = async (dateString, limit = 5) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    console.error(`[TopItems] ❌ Invalid date format: ${dateString}`);
    throw new Error("Invalid date format. Expected YYYY-MM-DD");
  }

  const start = new Date(`${dateString}T00:00:00.000Z`);
  const end = new Date(`${dateString}T23:59:59.999Z`);

  const items = await OrderItem.findAll({
    attributes: [
      'item_id',
      [fn('SUM', col('quantity')), 'total_quantity'],
    ],
    include: [
      {
        model: Order,
        as: 'order',
        where: {
          order_date: {
            [Op.between]: [start, end],
          },
          status: 'completed',
        },
        attributes: [],
      },
      {
        model: MenuItem,
        as: 'menu_item',
        attributes: ['item_id', 'name', 'price', 'image_url'],
      },
    ],
    group: ['item_id', 'menu_item.item_id', 'menu_item.name', 'menu_item.price', 'menu_item.image_url'],
    order: [[fn('SUM', col('quantity')), 'DESC']],
    limit,
    raw: false,
  });

  return items.map((item) => ({
    item_id: item.item_id,
    name: item.menu_item.name,
    image_url: item.menu_item.image_url,
    price: item.menu_item.price,
    total_quantity: parseInt(item.get('total_quantity')),
  }));
};
