import Staff from '../models/staff.js';

/**
 * Tạo mới bản ghi nhân viên từ user_id
 * @param {number} userId 
 * @param {Object} data Thông tin bổ sung: position, salary, working_type, joined_date, note
 */
export const createStaff = async (userId, data = {}) => {
  try {
    const newStaff = await Staff.create({
      user_id: userId,
      ...data,
    });
    return newStaff;
  } catch (error) {
    console.error('❌ Lỗi khi tạo staff:', error);
    throw new Error('Tạo nhân viên thất bại');
  }
};

/**
 * Lấy thông tin nhân viên theo user_id
 * @param {number} userId 
 */
export const getStaffByUserId = async (userId) => {
  try {
    const staff = await Staff.findOne({
      where: { user_id: userId },
    });
    return staff;
  } catch (error) {
    console.error('❌ Lỗi khi lấy staff:', error);
    throw new Error('Không thể lấy thông tin nhân viên');
  }
};

/**
 * Cập nhật thông tin nhân viên
 * @param {number} userId 
 * @param {Object} updates Các trường cần cập nhật
 */
export const updateStaffByUserId = async (userId, updates) => {
  try {
    const [rowsUpdated] = await Staff.update(updates, {
      where: { user_id: userId },
    });
    return rowsUpdated > 0;
  } catch (error) {
    console.error('❌ Lỗi khi cập nhật staff:', error);
    throw new Error('Cập nhật nhân viên thất bại');
  }
};

/**
 * Xóa nhân viên theo user_id
 * @param {number} userId 
 */
export const deleteStaffByUserId = async (userId) => {
  try {
    const deleted = await Staff.destroy({
      where: { user_id: userId },
    });
    return deleted > 0;
  } catch (error) {
    console.error('❌ Lỗi khi xóa staff:', error);
    throw new Error('Xóa nhân viên thất bại');
  }
};
