import * as AttendanceService from '../service/attendance.service.js';

export const createAttendanceController = async (req, res) => {
  try {
    const data = req.body;

    if (!data.staff_id) {
      return res.status(400).json({ error: 'Thiếu staff_id.' });
    }

    const attendance = await AttendanceService.attendanceService.create(data);
    res.status(201).json(attendance);
  } catch (error) {
    console.error('❌ Tạo attendance thất bại:', error.message);
    res.status(400).json({ error: error.message });
  }
};

export const getAttendanceById = async (req, res) => {
  try {
    const id = req.params.attendance_id;
    const attendance = await AttendanceService.attendanceService.getById(id);

    res.json(attendance);
  } catch (error) {
    console.error('❌ Lấy attendance thất bại:', error.message);
    res.status(404).json({ error: error.message });
  }
};

export const updateAttendanceController = async (req, res) => {
  try {
    const id = req.params.attendance_id;
    const updateData = req.body;

    const updatedAttendance = await AttendanceService.attendanceService.update(id, updateData);
    res.json(updatedAttendance);
  } catch (error) {
    console.error('❌ Cập nhật attendance thất bại:', error.message);
    res.status(400).json({ error: error.message });
  }
};

export const deleteAttendanceController = async (req, res) => {
  try {
    const id = req.params.attendance_id;

    const result = await AttendanceService.attendanceService.delete(id);
    res.json(result);
  } catch (error) {
    console.error('❌ Xoá attendance thất bại:', error.message);
    res.status(400).json({ error: error.message });
  }
};

export const getAllAttendancesController = async (req, res) => {
  try {
    const attendances = await AttendanceService.attendanceService.getAll();
    res.json(attendances);
  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách attendances:', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getAttendancesByStaffId = async (req, res) => {
  try {
    const staffId = req.params.staff_id;

    const attendances = await AttendanceService.attendanceService.getByStaffId(staffId);

    if (!attendances || attendances.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy điểm danh nào.' });
    }

    res.json(attendances);
  } catch (error) {
    console.error('❌ Lỗi khi lấy attendances theo staff_id:', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getFilteredAttendances = async (req, res) => {
  try {
    const { name, date } = req.query;

    const attendances = await AttendanceService.attendanceService.getFiltered({ name, date });

    res.json(attendances);
  } catch (error) {
    console.error('❌ Lỗi khi lọc attendances:', error.message);
    res.status(500).json({ error: error.message });
  }
};
export const getAttendancesByStaffAndPeriod = async (req, res) => {
  try {
    const { staff_id, start_date, end_date } = req.query;

    if (!staff_id || !start_date || !end_date) {
      return res.status(400).json({ error: 'Thiếu staff_id, start_date hoặc end_date.' });
    }

    const attendances = await AttendanceService.attendanceService.getByStaffAndPeriod({
      staff_id,
      start_date,
      end_date,
    });

    res.json(attendances);
  } catch (error) {
    console.error('❌ Lỗi khi lấy attendances theo khoảng thời gian:', error.message);
    res.status(500).json({ error: error.message });
  }
};
export const getPresentStaffCountByDateController = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Thiếu ngày cần thống kê.' });
    }

    const count = await AttendanceService.attendanceService.countPresentStaffByDate(date);
    res.json({ date, present_count: count });
  } catch (error) {
    console.error('❌ Lỗi khi đếm số nhân viên đã đi làm:', error.message);
    res.status(500).json({ error: error.message });
  }
};
export const getAttendanceSummaryByDateController = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Thiếu ngày cần thống kê.' });
    }

    const summary = await AttendanceService.attendanceService.getAttendanceSummaryByDate(date);
    res.json({ date, summary });
  } catch (error) {
    console.error('❌ Lỗi khi lấy thống kê chấm công:', error.message);
    res.status(500).json({ error: error.message });
  }
};
