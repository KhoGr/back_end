import * as customerService from "../service/customer.service.js"

export const createCustomerController = async (req, res) => {
  try {
    const { userId, data } = req.body;
    const customer = await customerService.createCustomer(userId, data);
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getCustomerController = async (req, res) => {
  try {
    const userId = req.params.userId;
    const customer = await customerService.getCustomerByUserId(userId);
    if (!customer) return res.status(404).json({ message: "Không tìm thấy customer." });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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

export const deleteCustomerController = async (req, res) => {
  try {
    const userId = req.params.userId;
    await customerService.deleteCustomer(userId);
    res.json({ message: "Customer đã được xóa." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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

