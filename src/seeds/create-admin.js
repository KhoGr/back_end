import bcrypt from "bcrypt";
import { sequelize } from "../config/database.js"; // đường dẫn config DB
import Account from "../models/account.js";
import User from "../models/user.js";

// Kết nối DB và chạy seed
const createAdminSeed = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected.");

    const email = "admin@example.com";
    const plainPassword = "admin123";
    const username = "admin";

    // Kiểm tra nếu đã tồn tại admin
    const existingAccount = await Account.findOne({ where: { email } });
    if (existingAccount) {
      console.log("⚠️ Admin account already exists. Skipping seed.");
      return;
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const account = await Account.create({ email, password: hashedPassword });

    await User.create({
      account_id: account.id,
      name: "Super Admin",
      username,
      role: "admin",
    });

    console.log("✅ Admin account seeded successfully.");
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  } finally {
    await sequelize.close();
  }
};

createAdminSeed();
