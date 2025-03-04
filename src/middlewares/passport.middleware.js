import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Account from "../models/account.js";


const JWT_SECRET =
  process.env.JWT_SECRET_KEY ||
  "86f0f8b0e4124392102531eb911e1aa546f6e6b87ca7e18cd457097463830f4e2bacba13ac3cbdbb949c54f106159ba294037c8a6b6b97275ae4c505b7b82578";
export const jwtAuthentication = async (req, res, next) => {
  try {
    let token = req.cookies ? req.cookies["jwt_token"] : null;
    if (!token) {
      console.log("❌ Không tìm thấy token.");
      return res.status(401).json({ message: "Không tìm thấy token." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("📌 Decoded Token:", decoded);

    if (!decoded || !decoded.sub) {
      console.log("❌ Token không hợp lệ hoặc không chứa email.");
      return res
        .status(401)
        .json({ message: "Token không hợp lệ hoặc hết hạn." });
    }

    const account = await Account.findOne({ where: { email: decoded.sub } });
    if (!account) {
      console.log("❌ Không tìm thấy account với email:", decoded.sub);
      return res.status(404).json({ message: "Tài khoản không tồn tại." });
    }

    console.log("✅ Tìm thấy account:", account.id);

    const user = await User.findOne({ where: { account_id: account.id } });
    if (!user) {
      console.log("❌ Không tìm thấy user với account_id:", account.id);
      return res.status(404).json({ message: "User không tồn tại." });
    }

    console.log("✅ Tìm thấy user:", user.user_id);

    req.user = { id: user.user_id, account_id: account.id, email: decoded.sub };
    console.log("📌 req.user được gán:", req.user);

    next();
  } catch (error) {
    console.error("❌ JWT Authentication Error:", error);
    return res.status(401).json({ message: "Xác thực thất bại." });
  }
};

/////////////////////////////////////xong đến đây/////////////
