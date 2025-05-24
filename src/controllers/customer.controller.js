import * as customerService from "../service/customer.service.js";

// Tạo Customer mới
export const createCustomerController = async (req, res) => {
  try {
    const { userId, loyalty_point, total_spent, membership_level, note } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Thiếu userId." });
    }

    const customer = await customerService.createCustomer(userId, {
      loyalty_point,
      total_spent,
      membership_level,
      note,
    });

    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Lấy thông tin 1 Customer theo userId
export const getCustomerController = async (req, res) => {
  try {
    const userId = req.params.userId;

    const customer = await customerService.getCustomerByUserId(userId);
    if (!customer) {
      return res.status(404).json({ message: "Không tìm thấy customer." });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật Customer
export const updateCustomerController = async (req, res) => {
  try {
    const userId = req.params.userId;
    const updateData = req.body;

    const updatedCustomer = await customerService.updateCustomer(userId, updateData);
    res.json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Xóa Customer theo userId
export const deleteCustomerController = async (req, res) => {
  try {
    const userId = req.params.userId;
    await customerService.deleteCustomer(userId);
    res.json({ message: "Customer đã được xóa." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy danh sách tất cả Customer
export const getAllCustomersController = async (_req, res) => {
  try {
    console.log("📥 Nhận yêu cầu lấy danh sách tất cả khách hàng...");
    const customers = await customerService.getAllCustomers();
    console.log("✅ Lấy danh sách customer thành công. Số lượng:", customers.length);
    res.json(customers);
  } catch (error) {
    console.error("❌ Lỗi khi lấy tất cả customers:", error);
    res.status(500).json({ error: error.message || "Lỗi server khi lấy danh sách khách hàng." });
  }
};

// Tìm kiếm Customer theo tên
export const searchCustomersByNameController = async (req, res) => {
  try {
    const searchTerm = req.query.name;

    if (!searchTerm || searchTerm.trim() === "") {
      return res.status(400).json({ error: "Vui lòng cung cấp từ khóa tìm kiếm." });
    }

    const customers = await customerService.searchCustomersByName(searchTerm);
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message || "Lỗi khi tìm kiếm customer." });
  }
};
