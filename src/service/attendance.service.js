import models from "../models/index.js";
import { Op } from "sequelize";

const { Attendance, Staff, WorkShift, User } = models;

// Hàm hỗ trợ: chuyển sang giờ Việt Nam (UTC+7)
const toVNTime = (dateStr) => {
  const date = new Date(dateStr);
  return new Date(date.getTime() + 7 * 60 * 60 * 1000);
};

export const attendanceService = {
  getAll: async () => {
    return await Attendance.findAll({
      include: [
        {
          model: Staff,
          as: "staff",
          attributes: ["staff_id", "position"],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["user_id", "name", "username"],
            },
          ],
        },
        {
          model: WorkShift,
          as: "work_shift",
        },
      ],
      order: [["created_at", "DESC"]],
    });
  },

  // Cập nhật điểm danh
create: async (data) => {
  const {
    staff_id,
    work_shift_id,
    check_in_time,
    check_out_time,
    status,
    note,
  } = data;

  const checkInVN = check_in_time ? toVNTime(check_in_time) : null;
  const checkOutVN = check_out_time ? toVNTime(check_out_time) : null;

  console.log(`[CREATE] 🕒 Check-in: ${checkInVN}, Check-out: ${checkOutVN}`);

  try {
    console.log("[CREATE] 🔍 Kiểm tra attendance trùng work_shift...");
    const existingAttendance = await Attendance.findOne({
      where: { staff_id, work_shift_id },
    });

    if (existingAttendance) {
      console.log(
        `[CREATE] ⚠️ Attendance đã tồn tại với work_shift_id=${work_shift_id}, check_out=${existingAttendance.check_out_time}`
      );
      if (existingAttendance.check_out_time) {
        throw new Error("Đã chấm công và checkout cho ca này rồi.");
      }
      throw new Error("Đã check-in cho ca này, không thể tạo mới.");
    }

    console.log("[CREATE] 📅 Kiểm tra các ca khác trong ngày...");
    const sameDayAttendances = await Attendance.findAll({
      where: {
        staff_id,
        check_in_time: { [Op.ne]: null },
      },
      include: [{ model: WorkShift, as: "work_shift" }],
      order: [["check_in_time", "ASC"]],
    });

    for (let i = 0; i < sameDayAttendances.length; i++) {
      const current = sameDayAttendances[i];
      const next = sameDayAttendances[i + 1];

      const currentOut = current.check_out_time;
      const nextIn = next?.check_in_time;

      console.log(`[CHECK] 📌 So sánh với attendance ID=${current.id}`);
      console.log(` - current.check_in: ${current.check_in_time}`);
      console.log(` - current.check_out: ${currentOut}`);
      console.log(` - next.check_in: ${nextIn}`);
      console.log(` - incoming checkIn: ${checkInVN}`);

      if (
        currentOut &&
        checkInVN > currentOut &&
        (!nextIn || checkInVN < nextIn)
      ) {
        console.log("✅ Check-in nằm giữa 2 ca => Cho phép.");
        break;
      }

      if (
        checkInVN >= current.check_in_time &&
        (!currentOut || checkInVN <= currentOut)
      ) {
        console.log("❌ Check-in nằm trong thời gian ca đã chấm => Không hợp lệ.");
        throw new Error("Giờ check-in đang nằm trong ca đã chấm công trước đó.");
      }
    }

    // 👉 So sánh với giờ ca làm (start_time, end_time)
    console.log("[CREATE] 🕵️‍♂️ Lấy thông tin work_shift hiện tại...");
    const currentShift = await WorkShift.findOne({ where: { work_shift_id } });

    if (!currentShift) {
      throw new Error("Không tìm thấy ca làm việc tương ứng.");
    }

    const shiftStart = toVNTime(`${currentShift.date}T${currentShift.start_time}`);
    const shiftEnd = toVNTime(`${currentShift.date}T${currentShift.end_time}`);

    console.log(`[CREATE] 🔎 So sánh giờ check-in với giờ ca:`);
    console.log(` - Ca bắt đầu: ${shiftStart}`);
    console.log(` - Ca kết thúc: ${shiftEnd}`);
    console.log(` - Check-in: ${checkInVN}`);

    let finalStatus = status;
    if (!finalStatus) {
      if (checkInVN <= shiftStart) {
        finalStatus = "present";
        console.log("✅ Đúng giờ hoặc sớm hơn => on_time");
      } else if (checkInVN > shiftStart && checkInVN < shiftEnd) {
        finalStatus = "late";
        console.log("⚠️ Đi trễ => late");
      } else {
        finalStatus = "absent";
        console.log("❌ Check-in sau giờ kết thúc => invalid");
      }
    }

    let hours_worked = 0;
    if (checkInVN && checkOutVN) {
      const diffMs = checkOutVN - checkInVN;
      hours_worked = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
    }

    console.log(`[CREATE] ✅ Tạo attendance mới: hours_worked = ${hours_worked}, status = ${finalStatus}`);

    const created = await Attendance.create({
      staff_id,
      work_shift_id,
      check_in_time: checkInVN,
      check_out_time: checkOutVN,
      hours_worked,
      status: finalStatus,
      note,
    });

    console.log(`[CREATE] 🎉 Attendance tạo thành công: ID=${created.attendance_id}`);
    return created;
  } catch (err) {
    console.error("[CREATE] ❌ Lỗi khi tạo attendance:", err.message);
    throw new Error("Lỗi khi tạo attendance: " + err.message);
  }
},
// 📌 Thêm hàm này vào trong attendanceService:
update: async (attendance_id, data) => {
  const attendance = await Attendance.findByPk(attendance_id);
  if (!attendance) throw new Error("Không tìm thấy attendance.");

  // ✅ Chuyển cả check-in và check-out từ payload (nếu có)
  const checkInVN = data.check_in_time ? toVNTime(data.check_in_time) : null;
  const checkOutVN = data.check_out_time ? toVNTime(data.check_out_time) : null;

  if (!checkInVN) throw new Error("Thiếu giờ check-in.");
  if (checkOutVN && checkOutVN <= checkInVN) {
    throw new Error("Check-out phải sau check-in.");
  }

  // Lấy thông tin ca
  const shift = await WorkShift.findByPk(data.work_shift_id || attendance.work_shift_id);
  if (!shift) throw new Error("Không tìm thấy ca làm việc.");

  const shiftEnd = toVNTime(`${shift.date}T${shift.end_time}`);
  if (checkOutVN && checkOutVN > shiftEnd) {
    console.warn("⚠️ Check-out vượt quá giờ ca, vẫn cho phép nhưng có thể tính overtime.");
  }

  // Tính giờ làm
  let hours_worked = attendance.hours_worked;
  if (checkInVN && checkOutVN) {
    const diffMs = checkOutVN - checkInVN;
    hours_worked = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
  }

  const updated = await attendance.update({
    check_in_time: checkInVN,
    check_out_time: checkOutVN,
    hours_worked,
    note: data.note ?? attendance.note,
    status: data.status ?? attendance.status,
    work_shift_id: data.work_shift_id ?? attendance.work_shift_id,
    staff_id: data.staff_id ?? attendance.staff_id,
  });

  return updated;
},  // Lấy điểm danh theo ID
  getById: async (id) => {
    const attendance = await Attendance.findByPk(id, {
      include: [
        { model: Staff, as: "staff" },
        { model: WorkShift, as: "work_shift" },
      ],
    });
    if (!attendance) throw new Error("Attendance not found");
    return attendance;
  },

  // Xóa điểm danh
  delete: async (id) => {
    const attendance = await Attendance.findByPk(id);
    if (!attendance) throw new Error("Attendance not found");
    await attendance.destroy();
    return { message: "Deleted successfully" };
  },

  // Lấy điểm danh theo staff ID
  getByStaffId: async (staff_id) => {
    return await Attendance.findAll({
      where: { staff_id },
      include: [{ model: WorkShift, as: "work_shift" }],
      order: [["created_at", "DESC"]],
    });
  },

  // 🔍 Lọc điểm danh theo tên nhân viên hoặc ngày
  getFiltered: async ({ name, date } = {}) => {
    const whereAttendance = {};
    const whereStaff = {};

    if (date) {
      whereAttendance.created_at = {
        [Op.between]: [
          new Date(`${date}T00:00:00`),
          new Date(`${date}T23:59:59`),
        ],
      };
    }

    if (name) {
      whereStaff.name = {
        [Op.iLike]: `%${name}%`,
      };
    }

    return await Attendance.findAll({
      where: whereAttendance,
      include: [
        {
          model: Staff,
          as: "staff",
          where: whereStaff,
        },
        { model: WorkShift, as: "work_shift" },
      ],
      order: [["created_at", "DESC"]],
    });
  },
  // 📅 Lấy chấm công theo nhân viên + khoảng thời gian (thường là 1 tháng)
getByStaffAndPeriod: async ({ staff_id, start_date, end_date }) => {
  if (!staff_id || !start_date || !end_date) {
    throw new Error("Thiếu thông tin lọc (staff_id, start_date, end_date)");
  }

  const attendances = await Attendance.findAll({
    where: {
      staff_id,
      check_in_time: {
        [Op.gte]: new Date(`${start_date}T00:00:00`),
      },
      check_out_time: {
        [Op.lte]: new Date(`${end_date}T23:59:59`),
      },
    },
    include: [
      { model: WorkShift, as: "work_shift" },
    ],
    order: [["check_in_time", "ASC"]],
  });

  return attendances;
},

};
