import { Op } from "sequelize";
import Order from "../models/order.js";
import OrderItem from "../models/order_item.js";
import Customer from "../models/customer.js";
import Table from "../models/table.js";
import User from "../models/user.js";
import Account from "../models/account.js";
import MenuItem from "../models/menu_items.js";
import VipLevel from "../models/MembershipTier.js";
import VipLevelService from "../service/vip.service.js";
import Voucher from "../models/voucher/Voucher.js";
import voucherService from "./voucher.service.js";
import VoucherRedemption from "../models/voucher/VoucherRedemption.js";
import { updateCustomerSpentAndVip } from "../service/customer.service.js";
export const deleteOrder = async (id) => {
  const order = await Order.findByPk(id);
  if (!order) throw new Error("Order not found");

  // Xoá tất cả OrderItem liên quan
  await OrderItem.destroy({ where: { order_id: id } });

  // Sau đó xoá Order
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

export const createOrder = async (data) => {
  const order = await Order.create(data, {
    include: [
      {
        model: OrderItem,
        as: "order_items", // phải đúng với alias trong Order.associate
      },
    ],
  });

  await calculateTotalAmount(order.id);
  await updateCustomerSpentAndVip(order.customer_id);

  return order;
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
        as: "table",
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
        as: "table",
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

// export const updateOrder = async (id, updates) => {
//   const order = await Order.findByPk(id);
//   if (!order) throw new Error("Order not found");

//   const prevStatus = order.status;
//   const prevIsPaid = order.is_paid;

//   Object.assign(order, updates);
//   await order.save();

//   const isNowCompleted = order.status === "completed";
//   const isNowPaid = order.is_paid === true;
//   const wasNotCompletedOrUnpaid = prevStatus !== "completed" || !prevIsPaid;

//   console.log("📝 [updateOrder] Trạng thái trước:", {
//     prevStatus,
//     prevIsPaid,
//   });
//   console.log("📝 [updateOrder] Trạng thái sau cập nhật:", {
//     status: order.status,
//     is_paid: order.is_paid,
//     isNowCompleted,
//     isNowPaid,
//     wasNotCompletedOrUnpaid,
//   });

//   // Nếu từ chưa hoàn thành/chưa thanh toán → chuyển sang completed + đã trả
//   if (isNowCompleted && isNowPaid && wasNotCompletedOrUnpaid) {
//     console.log("✅ Gọi updateCustomerSpentAndVip cho customer_id =", order.customer_id);
//     await updateCustomerSpentAndVip(order.customer_id);
//   } else {
//     console.log("❌ KHÔNG gọi updateCustomerSpentAndVip vì không thoả điều kiện.");
//   }

//   return order;
// };
export const updateOrder = async (id, updates) => {
  const order = await Order.findByPk(id);
  if (!order) throw new Error("Order not found");

  Object.assign(order, updates);
  await order.save();

  const isNowCompleted = order.status === "completed";
  const isNowPaid = order.is_paid === true;

  console.log("📝 [updateOrder] Trạng thái sau cập nhật:", {
    status: order.status,
    is_paid: order.is_paid,
    isNowCompleted,
    isNowPaid,
  });

  // Nếu trạng thái là completed và đã thanh toán thì gọi cập nhật khách hàng
  if (isNowCompleted && isNowPaid) {
    console.log("✅ Gọi updateCustomerSpentAndVip cho customer_id =", order.customer_id);
    await updateCustomerSpentAndVip(order.customer_id);
  } else {
    console.log("❌ KHÔNG gọi updateCustomerSpentAndVip vì không thoả điều kiện.");
  }

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
        as: "table",
      },
    ],
    order: [["order_date", "DESC"]],
  });
};
