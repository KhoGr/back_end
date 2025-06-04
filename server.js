import express from "express";
import http from "http"; // 👈 Cần thêm
import { Server } from "socket.io"; // 👈 Cần thêm
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "./src/middlewares/passport.js";

import accountApi from "./src/apis/account.api.js";
import categoryApi from "./src/apis/category.api.js";
import customerApi from "./src/apis/customer.api.js";
import staffApi from "./src/apis/staff.api.js";
import menuItemApi from "./src/apis/menuItem.api.js";
import comboItemApi from "./src/apis/comboItem.api.js";
import orderAPI from "./src/apis/order.api.js";
import tableApi from "./src/apis/table.api.js"; // 👈 Route mới
import menuItemCommentApi from './src/apis/menuItemComment.api.js'
import membershipApi from './src/apis/vip.api.js'
import voucherApi from './src/apis/voucher.api.js'

import { sequelize } from "./src/config/database.js";

dotenv.config();
const connectedUsers = new Map();

const app = express();
const server = http.createServer(app); // 👈 Dùng http để tạo server

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Gắn socket.io vào req để controller dùng được
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Database
const checkDatabaseConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Đã kết nối database thành công!");
  } catch (error) {
    console.error("❌ Lỗi kết nối database:", error);
    process.exit(1);
  }
};

checkDatabaseConnection();

// Routes
app.use("/api/account", accountApi);
app.use("/api/customer", customerApi);
app.use("/api/category", categoryApi);
app.use("/api/staff", staffApi);
app.use("/api/menuitem", menuItemApi);
app.use("/api/comboItem", comboItemApi);
app.use("/api/order", orderAPI);
app.use("/api/table", tableApi); // 👈 Đường dẫn API mới
app.use("/api/menu-item-comment", menuItemCommentApi); // 👈 Đường dẫn API mới
app.use("/api/vip", membershipApi); 
app.use("/api/voucher", voucherApi); 
// Sự kiện Socket.IO (khi client kết nối)
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  // Nhận userId từ client để lưu map
  socket.on("register", (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`📌 Registered user ${userId} with socket ${socket.id}`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
    for (const [userId, id] of connectedUsers.entries()) {
      if (id === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
  });
});

// Khởi động server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
