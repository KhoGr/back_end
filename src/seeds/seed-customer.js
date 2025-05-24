// src/seeds/seed-customer.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Sequelize } from "sequelize";
import bcrypt from "bcrypt";
import Account from "../models/account.js";
import User from "../models/user.js";
import Customer from "../models/customer.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../.env") });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
  }
);

Account.sequelize = sequelize;
User.sequelize = sequelize;
Customer.sequelize = sequelize;

const seedCustomer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Kết nối DB thành công.");

    const password = "customer123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const customerList = [
      { name: "Nguyễn Văn A", username: "nguyenvana", gender: "male" },
      { name: "Trần Thị B", username: "tranthib", gender: "female" },
      { name: "Lê Văn C", username: "levanc", gender: "male" },
      { name: "Phạm Thị D", username: "phamthid", gender: "female" },
      { name: "Hoàng Minh E", username: "hoangminhe", gender: "male" },
      { name: "Đặng Thị F", username: "dangthif", gender: "female" },
    ];

    for (const customer of customerList) {
      const emailPrefix = customer.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/[^a-zA-Z0-9 ]/g, "") // remove special chars
        .replace(/\s+/g, ".")
        .toLowerCase();

      const email = `${emailPrefix}@example.com`;

      const existing = await Account.findOne({ where: { email } });
      if (existing) {
        console.log(`⚠️ Đã tồn tại: ${email}`);
        continue;
      }

      const account = await Account.create({
        email,
        password: hashedPassword,
        provider: "local",
        is_verified: true,
      });

      const user = await User.create({
        account_id: account.id,
        name: customer.name,
        username: customer.username,
        role: "customer",
        gender: customer.gender,
      });

      await Customer.create({
        user_id: user.user_id,
        loyalty_point: 0,
        rank: "bronze",
        note: "Seeded customer",
      });

      console.log(`✅ Tạo customer: ${email}`);
    }

    console.log("🎉 Seed customer hoàn tất.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi seed customer:", error);
    process.exit(1);
  }
};

seedCustomer();
