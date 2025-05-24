// src/seeds/seed.js

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Sequelize } from "sequelize";
import bcrypt from "bcrypt";
import Account from "../models/account.js";
import User from "../models/user.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootPath = path.resolve(__dirname, "../../");

dotenv.config({ path: path.join(rootPath, ".env") });

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

const seedAdmin = async () => {
  console.log("🌱 Bắt đầu seed dữ liệu admin...");

  try {
    await sequelize.authenticate();
    console.log("✅ Kết nối DB thành công.");

    const password = "admin123";
    const hashedPassword = await bcrypt.hash(password, 10);

    // Danh sách 6 tài khoản admin
    const adminList = [
      { email: "admin@example.com", name: "Admin Master", username: "adminmaster" },
      { email: "admin1@example.com", name: "Admin One", username: "adminone" },
      { email: "admin2@example.com", name: "Admin Two", username: "admintwo" },
      { email: "admin3@example.com", name: "Admin Three", username: "adminthree" },
      { email: "admin4@example.com", name: "Admin Four", username: "adminfour" },
      { email: "admin5@example.com", name: "Admin Five", username: "adminfive" },
    ];

    for (const admin of adminList) {
      const existing = await Account.findOne({ where: { email: admin.email } });
      if (existing) {
        console.log(`⚠️ Tài khoản ${admin.email} đã tồn tại. Bỏ qua.`);
        continue;
      }

      const account = await Account.create({
        email: admin.email,
        password: hashedPassword,
        provider: "local",
        is_verified: true,
      });

      await User.create({
        account_id: account.id,
        name: admin.name,
        username: admin.username,
        role: "admin",
      });

      console.log(`✅ Đã tạo: ${admin.email} (${admin.username})`);
    }

    console.log("🎉 Hoàn tất seed tài khoản admin.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi seed:");
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();
