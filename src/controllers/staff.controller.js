import * as staffService from "../service/staff.service.js";

// Tạo Staff mới
export const createStaffController = async (req, res) => {
  try {
    const { userId, position, salary, working_type, joined_date, note } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Thiếu userId." });
    }

    const staff = await staffService.createStaff(userId, {
      position,
      salary,
      working_type,
      joined_date,
      note,
    });

    res.status(201).json(staff);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Lấy thông tin 1 Staff theo userId
export const getStaffController = async (req, res) => {
  try {
    const userId = req.params.userId;

    const staff = await staffService.getStaffByUserId(userId);
    if (!staff) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên." });
    }

    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật Staff
export const updateStaffController = async (req, res) => {
  try {
    const userId = req.params.userId;
    const updateData = req.body;

    const updatedStaff = await staffService.updateStaff(userId, updateData);
    res.json(updatedStaff);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Xóa Staff theo userId
export const deleteStaffController = async (req, res) => {
  try {
    const userId = req.params.userId;
    await staffService.deleteStaff(userId);
    res.json({ message: "Nhân viên đã được xóa." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy danh sách tất cả Staff
export const getAllStaffsController = async (_req, res) => {
  try {
    console.log("📥 Nhận yêu cầu lấy danh sách tất cả nhân viên...");
    const staffs = await staffService.getAllStaffs();
    console.log("✅ Lấy danh sách staff thành công. Số lượng:", staffs.length);
    res.json(staffs);
  } catch (error) {
    console.error("❌ Lỗi khi lấy tất cả staffs:", error);
    res.status(500).json({ error: error.message || "Lỗi server khi lấy danh sách nhân viên." });
  }
};

// Tìm kiếm Staff theo tên
export const searchStaffsByNameController = async (req, res) => {
  try {
    const searchTerm = req.query.name;

    if (!searchTerm || searchTerm.trim() === "") {
      return res.status(400).json({ error: "Vui lòng cung cấp từ khóa tìm kiếm." });
    }

    const staffs = await staffService.searchStaffsByName(searchTerm);
    res.json(staffs);
  } catch (error) {
    res.status(500).json({ error: error.message || "Lỗi khi tìm kiếm nhân viên." });
  }
};
