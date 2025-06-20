export const verifyAdmin = async (req, res, next) => {
    try {
        // Kiểm tra user đã đăng nhập chưa
        if (!req.user) {
            return res.status(401).json({ message: "Bạn chưa đăng nhập." });
        }

        // Kiểm tra quyền admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Bạn không có quyền truy cập." });
        }

        next(); // Nếu là admin, tiếp tục thực thi API
    } catch (error) {
        console.error("❌ Lỗi xác thực quyền admin:", error);
        return res.status(500).json({ message: "Lỗi xác thực quyền." });
    }
};

// 📌 Middleware cho cả nhân viên & admin (nếu cần)
export const verifyStaffOrAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Bạn chưa đăng nhập." });
        }

        if (req.user.role !== "admin" && req.user.role !== "staff") {
            return res.status(403).json({ message: "Bạn không có quyền truy cập." });
        }

        next();
    } catch (error) {
        console.error("❌ Lỗi xác thực quyền:", error);
        return res.status(500).json({ message: "Lỗi xác thực quyền." });
    }
};
export const checkLogin=(req,res,next)=>{
    if(req.session.token){

        return res.redirect("/dashboard");
    }
    next();
}
export const verifyCustomer = async (req, res, next) => {
    try {
        // Kiểm tra user đã đăng nhập chưa
        if (!req.user) {
            return res.status(401).json({ message: "Bạn chưa đăng nhập." });
        }

        // Kiểm tra quyền customer
        if (req.user.role !== "customer") {
            return res.status(403).json({ message: "Chỉ khách hàng mới có quyền truy cập." });
        }

        next(); // Nếu là customer, tiếp tục thực thi API
    } catch (error) {
        console.error("❌ Lỗi xác thực quyền customer:", error);
        return res.status(500).json({ message: "Lỗi xác thực quyền khách hàng." });
    }
};
