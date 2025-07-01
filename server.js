import express from "express";
import http from "http"; 
import { Server } from "socket.io"; 
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
import tableApi from "./src/apis/table.api.js";
import menuItemCommentApi from './src/apis/menuItemComment.api.js'
import membershipApi from './src/apis/vip.api.js'
import voucherApi from './src/apis/voucher.api.js'
import workShiftApi from './src/apis/workshift.api.js'
import attendanceApi from './src/apis/attendance.api.js'
import payrollApi from './src/apis/payroll.api.js'
import chatbotApi from './src/apis/chatbot.api.js'
import aiModelApi from './src/apis/aiModel.api.js'
import paymentAPI from './src/apis/payment.api.js'
import monthlyFinanceApi from './src/apis/monthlyFinance.api.js'
import inventoryBatchApi from './src/apis/inventoryBatch.api.js'

import { sequelize,connectDB } from "./src/config/database.js";

dotenv.config();
const connectedUsers = new Map();

const app = express();
const server = http.createServer(app); 

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:8080","http://localhost:8081","https://api.vnpt-hn.io.vn","https://restaurant.vnpt-hn.io.vn"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: [
    process.env.CLIENT_URL,                  
    'http://localhost:5173',                  
    'http://localhost:8080',                 
    'http://localhost:8081',                  
    'https://api.vnpt-hn.io.vn',
    'https://admin.vnpt-hn.io.vn',
    'https://restaurant.vnpt-hn.io.vn'
    
  ],
  credentials: true
}));app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Database
await connectDB();

// Routes
app.use("/api/account", accountApi);
app.use("/api/customer", customerApi);
app.use("/api/category", categoryApi);
app.use("/api/staff", staffApi);
app.use("/api/menuitem", menuItemApi);
app.use("/api/comboItem", comboItemApi);
app.use("/api/order", orderAPI);
app.use("/api/table", tableApi);
app.use("/api/menu-item-comment", menuItemCommentApi); 
app.use("/api/vip", membershipApi); 
app.use("/api/voucher", voucherApi); 
app.use("/api/workshift", workShiftApi); 
app.use("/api/attendance", attendanceApi); 
app.use("/api/payroll", payrollApi); 
app.use("/api/chatbot", chatbotApi); 
app.use("/api/aimodel", aiModelApi); 
app.use("/api/monthlyFinance", monthlyFinanceApi); 
app.use("/api/payment", paymentAPI); 
app.use("/api/inventory", inventoryBatchApi); 
app.get('/', (req, res) => {
  res.send('Backend API is running!');
});
// Sự kiện Socket.IO (khi client kết nối)
io.on("connection", (socket) => {
  console.log(" Client connected:", socket.id);

  // Nhận userId từ client để lưu map
  socket.on("register", (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`📌 Registered user ${userId} with socket ${socket.id}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
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
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
