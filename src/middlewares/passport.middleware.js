import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Account from "../models/account.js";

const JWT_SECRET =
  process.env.JWT_SECRET_KEY ||
  "86f0f8b0e4124392102531eb911e1aa546f6e6b87ca7e18cd457097463830f4e2bacba13ac3cbdbb949c54f106159ba294037c8a6b6b97275ae4c505b7b82578";

export const jwtAuthentication = async (req, res, next) => {
  try {
    let token = req.cookies?.jwt_token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      console.log("❌ Không tìm thấy token.");
      return res.status(401).json({ message: "Không tìm thấy token." });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token đã hết hạn." });
      }
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Token không hợp lệ." });
      }
      console.error("❌ Lỗi xác thực JWT:", err);
      return res.status(401).json({ message: "Xác thực thất bại." });
    }

    console.log("📌 Decoded Token:", decoded);

    if (!decoded?.sub) {
      return res.status(401).json({ message: "Token không hợp lệ hoặc thiếu thông tin." });
    }

    // Tìm account theo email trong token
    const account = await Account.findOne({ where: { email: decoded.sub } });
    if (!account) {
      console.log("❌ Không tìm thấy tài khoản với email:", decoded.sub);
      return res.status(404).json({ message: "Tài khoản không tồn tại." });
    }

    // Tìm user liên kết với account_id
    const user = await User.findOne({ where: { account_id: account.id } });
    if (!user) {
      console.log("❌ Không tìm thấy user với account_id:", account.id);
      return res.status(404).json({ message: "User không tồn tại." });
    }

    // Gán user vào req
    req.user = {
      id: user.user_id,
      account_id: account.id,
      email: decoded.sub,
      name: user.name,
      username: user.username,
      phone: user.phone,
      address: user.address,
      is_verified: account.is_verified,
      avatar: user.avatar,
      provider: account.provider,
      role:user.role,
    };

    console.log("✅ Xác thực thành công:", req.user);
    next();
  } catch (error) {
    console.error("❌ JWT Authentication Error:", error);
    return res.status(500).json({ message: "Lỗi máy chủ." });
  }
};


/////////////////////////////////////xong đến đây/////////////
// 