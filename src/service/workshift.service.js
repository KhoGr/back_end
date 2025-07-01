import { Op } from "sequelize";
import dayjs from "dayjs";
import models from "../models/index.js";

const { WorkShift, Staff, User, Account } = models;

export const createWorkShift = async (staffId, data = {}) => {
  try {
    const staff = await Staff.findByPk(staffId);
    if (!staff) {
      throw new Error("Không tìm thấy nhân viên.");
    }

    //  Kiểm tra trùng giờ với các ca khác trong cùng ngày
    const overlapShift = await WorkShift.findOne({
      where: {
        staff_id: staffId,
        date: data.date,
        [Op.or]: [
          {
            start_time: {
              [Op.between]: [data.start_time, data.end_time],
            },
          },
          {
            end_time: {
              [Op.between]: [data.start_time, data.end_time],
            },
          },
          {
            [Op.and]: [
              { start_time: { [Op.lte]: data.start_time } },
              { end_time: { [Op.gte]: data.end_time } },
            ],
          },
        ],
      },
    });

    if (overlapShift) {
      throw new Error("Ca làm bị trùng với ca đã tồn tại.");
    }

    const newShift = await WorkShift.create({
      staff_id: staffId,
      shift_type: data.shift_type || "morning",
      date: data.date,
      start_time: data.start_time,
      end_time: data.end_time,
      note: data.note || "",
    });

    return newShift;
  } catch (error) {
    console.error("❌ Lỗi khi tạo ca làm việc:", error);
    throw error;
  }
};
export const generateMonthlyFullDayShifts = async (staffId, month) => {
  try {
    const staff = await Staff.findByPk(staffId);
    if (!staff) throw new Error("Không tìm thấy nhân viên.");

    const startDate = dayjs(`${month}-01`);
    const endDate = startDate.endOf("month");

    const datesInMonth = [];
    for (let d = startDate; d.isBefore(endDate) || d.isSame(endDate); d = d.add(1, "day")) {
      datesInMonth.push(d.format("YYYY-MM-DD"));
    }

    const existingShifts = await WorkShift.findAll({
      where: {
        staff_id: staffId,
        date: {
          [Op.between]: [startDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD")],
        },
      },
    });

    const existingDates = new Set(existingShifts.map(s => s.date));

    const shiftsToCreate = datesInMonth
      .filter(date => !existingDates.has(date))
      .map(date => ({
        staff_id: staffId,
        shift_type: "full_day",
        date,
        start_time: "08:00:00",  // ⏰ Giờ bắt đầu đã sửa
        end_time: "21:00:00",    // ⏰ Giờ kết thúc đã sửa
        note: "Tạo ca làm tự động cả ngày (08:00-21:00)",
      }));

    const createdShifts = await WorkShift.bulkCreate(shiftsToCreate);

    return {
      created: createdShifts.length,
      skipped: existingDates.size,
    };
  } catch (error) {
    console.error("❌ Lỗi khi tạo ca làm việc cho cả tháng:", error);
    throw error;
  }
};


export const getWorkShifts = async ({ date, staffId, month }) => {
  try {
    const whereClause = {};

    if (month) {
      const startDate = dayjs(`${month}-01`).startOf("month").format("YYYY-MM-DD");
      const endDate = dayjs(`${month}-01`).endOf("month").format("YYYY-MM-DD");

      whereClause.date = { [Op.between]: [startDate, endDate] };
    } else if (date) {
      whereClause.date = date;
    }

    if (staffId) {
      whereClause.staff_id = staffId;
    }

    const shifts = await WorkShift.findAll({
      where: whereClause,
      include: [
        {
          model: Staff,
          as: "staff",
          include: [
            {
              model: User,
              as: "user",
              include: [
                {
                  model: Account,
                  as: "account",
                  attributes: ["email"],
                },
              ],
            },
          ],
        },
      ],
      order: [["date", "ASC"], ["start_time", "ASC"]],
    });

    return shifts;
  } catch (error) {
    console.error("Lỗi khi lấy lịch làm việc:", error);
    throw error;
  }
};

export const updateWorkShift = async (shiftId, updateData) => {
  try {
    const workShift = await WorkShift.findByPk(shiftId);
    if (!workShift) {
      throw new Error("Không tìm thấy ca làm việc.");
    }

    await workShift.update(updateData);

    return workShift;
  } catch (error) {
    console.error("Lỗi khi cập nhật ca làm việc:", error);
    throw error;
  }
};

export const deleteWorkShift = async (shiftId) => {
  try {
    const workShift = await WorkShift.findByPk(shiftId);
    if (!workShift) {
      throw new Error("Không tìm thấy ca làm việc để xoá.");
    }

    await workShift.destroy();
    return { message: "Đã xoá ca làm việc thành công." };
  } catch (error) {
    console.error(" Lỗi khi xoá ca làm việc:", error);
    throw error;
  }
};
