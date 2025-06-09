// Import config và models
import { sequelize } from "../config/database.js";
import Account from "./account.js";
import User from "./user.js";
import MenuItem from "./menu_items.js";
import MenuItemComment from "./menu_item_comments.js";
import Category from "./category.js";
import Order from "./order.js";
import Table from "./table.js";
import Customer from "./customer.js"
import OrderItem from "./order_item.js";
import Voucher from "./voucher/Voucher.js"
import VoucherRedemption from "./voucher/VoucherRedemption.js";
import VipLevel from "./MembershipTier.js";
import Attendance from "./attendance.js"
import Payroll from "./payroll.js"
import WorkShift from "./workship.js"
import Staff from "./staff.js";
import AIModel from "./AIModel.js";
import ChatbotResponse from "./ChatbotResponse.js";


// Danh sách models
const models = {
  Account,
  User,
  Staff,
  MenuItem,
  MenuItemComment,
  Category,
  Order,
  Table,
  Customer,
OrderItem,
Voucher,
VoucherRedemption,
VipLevel,
Attendance,
Payroll,
WorkShift,
AIModel,
ChatbotResponse
};

// Gọi associate() cho mọi model TRỪ Customer trước
Object.entries(models).forEach(([name, model]) => {
  if (name !== "Customer" && typeof model.associate === "function") {
    model.associate(models);
  }
});

if (typeof Customer.associate === "function") {
  Customer.associate(models);
}

export { sequelize };
export default models;
