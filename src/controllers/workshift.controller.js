import * as WorkShiftService from "../service/workshift.service.js";

export const createWorkShiftController = async (req, res) => {
  try {
    const { staff_id, shift_type, date, start_time, end_time, note } = req.body;

    if (!staff_id) {
      return res.status(400).json({ error: "Thiếu staff_id." });
    }

    const workshift = await WorkShiftService.createWorkShift(staff_id, {
      shift_type,
      date,
      start_time,
      end_time,
      note,
    });

    res.status(201).json(workshift);
  } catch (error) {
    console.error("Tạo workshift thất bại:", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const getWorkShiftsByStaffId = async (req, res) => {
  try {
    const staffId = req.params.staff_id;
    const date = req.query.date;

    const workshifts = await WorkShiftService.getWorkShifts({ staffId, date });

    if (!workshifts || workshifts.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy ca làm việc." });
    }

    res.json(workshifts);
  } catch (error) {
    console.error("Lấy workshift thất bại:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const updateWorkShiftController = async (req, res) => {
  try {
    const shiftId = req.params.shift_id;
    const updateData = req.body;

    const updatedWorkShift = await WorkShiftService.updateWorkShift(shiftId, updateData);

    res.json(updatedWorkShift);
  } catch (error) {
    console.error("Cập nhật workshift thất bại:", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const deleteWorkShift = async (req, res) => {
  try {
    const shiftId = req.params.shift_id;

    const result = await WorkShiftService.deleteWorkShift(shiftId);

    res.json(result);
  } catch (error) {
    console.error(" Xoá workshift thất bại:", error.message);
    res.status(400).json({ error: error.message });
  }
};
export const getAllWorkShiftsController = async (req, res) => {
  try {
    const { month, date, staffId } = req.query;

    const workshifts = await WorkShiftService.getWorkShifts({
      month,
      date,
      staffId: staffId ? Number(staffId) : undefined,
    });

    res.json(workshifts);
  } catch (error) {
    console.error(" Lỗi khi lấy danh sách workshifts:", error.message);
    res.status(500).json({ error: error.message });
  }
};
export const generateMonthlyWorkShiftsController = async (req, res) => {
  try {
    const { staff_id, month } = req.body;

    if (!staff_id || !month) {
      return res.status(400).json({ error: "Thiếu thông tin staff_id hoặc month." });
    }

    const result = await WorkShiftService.generateMonthlyFullDayShifts(staff_id, month);

    res.status(201).json({
      message: "Tạo ca làm việc cả tháng thành công.",
      created: result.created,
      skipped: result.skipped,
    });
  } catch (error) {
    console.error("Tạo ca làm việc tháng thất bại:", error.message);
    res.status(400).json({ error: error.message });
  }
};

