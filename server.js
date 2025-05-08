import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
/////////////////////////
import accountApi from "./src/apis/account.api.js"; // Import route của account
import categoryApi from "./src/apis/category.api.js";
import customerApi from "./src/apis/customer.api.js";
import staffApi from "./src/apis/staff.api.js";
//////////////////////////////////

import { sequelize } from "./src/config/database.js"; // Import kết nối Sequelize
import session from "express-session"; // Import express-session
import passport from "./src/middlewares/passport.js";
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecretkey", // Đặt secret cho session, thêm vào .env nếu có
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Nếu dùng HTTPS, đặt secure: true
  })
);

// Khởi tạo Passport và session của Passport
app.use(passport.initialize());
app.use(passport.session());

// Kiểm tra kết nối database
const checkDatabaseConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Đã kết nối database thành công!");
  } catch (error) {
    console.error("❌ Lỗi kết nối database:", error);
    process.exit(1); // Dừng server nếu không kết nối được database
  }
};

// Gọi hàm kiểm tra kết nối
checkDatabaseConnection();

// Routes
app.use("/api/account", accountApi);
app.use("/api/customer", customerApi);
app.use("/api/category", categoryApi);
app.use("/api/staff", staffApi);


// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
