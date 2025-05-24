import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Sequelize } from "sequelize";
import bcrypt from "bcrypt";
import Account from "../models/account.js";
import User from "../models/user.js";
import Staff from "../models/staff.js";

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
Staff.sequelize = sequelize;

const seedStaff = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Kết nối DB thành công.");

    const password = "staff123";
    const hashedPassword = await bcrypt.hash(password, 10);

const staffList = [
  { name: "Nguyễn Văn Giang", username: "nguyenvang", gender: "male", position: "Quản lý", salary: 15000000, working_type: "fulltime" },
  { name: "Trần Thị Hoa", username: "tranthih", gender: "female", position: "Thu ngân", salary: 9000000, working_type: "parttime" },
  { name: "Lê Văn Yên", username: "levani", gender: "male", position: "Phục vụ", salary: 8000000, working_type: "fulltime" },
  { name: "Phạm Thị Hoa", username: "phamthij", gender: "female", position: "Tạp vụ", salary: 7000000, working_type: "parttime" },
];

    for (const staff of staffList) {
      const emailPrefix = staff.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9 ]/g, "")
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
        name: staff.name,
        username: staff.username,
        role: "staff",
        gender: staff.gender,
      });

      await Staff.create({
        user_id: user.user_id,
        position: staff.position,
        salary: staff.salary,
        working_type: staff.working_type,
        note: "Seeded staff",
      });

      console.log(`✅ Tạo staff: ${email}`);
    }

    console.log("🎉 Seed staff hoàn tất.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi seed staff:", error);
    process.exit(1);
  }
};

seedStaff();
