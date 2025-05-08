import {
    createStaff,
    getStaffByUserId,
    updateStaffByUserId,
    deleteStaffByUserId,
  } from '../services/staff.service.js';
  
  /**
   * Tạo mới nhân viên từ user_id và dữ liệu bổ sung
   */
  export const handleCreateStaff = async (req, res) => {
    try {
      const { user_id, position, salary, working_type, joined_date, note } = req.body;
  
      if (!user_id) {
        return res.status(400).json({ message: 'Thiếu user_id' });
      }
  
      const newStaff = await createStaff(user_id, {
        position,
        salary,
        working_type,
        joined_date,
        note,
      });
  
      res.status(201).json({
        message: 'Tạo nhân viên thành công',
        staff: newStaff,
      });
    } catch (error) {
      console.error('❌ Lỗi tạo staff:', error);
      res.status(500).json({ message: 'Tạo nhân viên thất bại' });
    }
  };
  
  /**
   * Lấy thông tin nhân viên theo user_id
   */
  export const handleGetStaff = async (req, res) => {
    try {
      const { user_id } = req.params;
  
      const staff = await getStaffByUserId(user_id);
      if (!staff) {
        return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
      }
  
      res.status(200).json({ staff });
    } catch (error) {
      console.error('❌ Lỗi lấy staff:', error);
      res.status(500).json({ message: 'Không thể lấy thông tin nhân viên' });
    }
  };
  
  /**
   * Cập nhật thông tin nhân viên
   */
  export const handleUpdateStaff = async (req, res) => {
    try {
      const { user_id } = req.params;
      const updates = req.body;
  
      const success = await updateStaffByUserId(user_id, updates);
      if (!success) {
        return res.status(404).json({ message: 'Không tìm thấy nhân viên để cập nhật' });
      }
  
      res.status(200).json({ message: 'Cập nhật thông tin nhân viên thành công' });
    } catch (error) {
      console.error('❌ Lỗi cập nhật staff:', error);
      res.status(500).json({ message: 'Cập nhật nhân viên thất bại' });
    }
  };
  
  /**
   * Xóa nhân viên theo user_id
   */
  export const handleDeleteStaff = async (req, res) => {
    try {
      const { user_id } = req.params;
  
      const success = await deleteStaffByUserId(user_id);
      if (!success) {
        return res.status(404).json({ message: 'Không tìm thấy nhân viên để xóa' });
      }
  
      res.status(200).json({ message: 'Xóa nhân viên thành công' });
    } catch (error) {
      console.error('❌ Lỗi xóa staff:', error);
      res.status(500).json({ message: 'Xóa nhân viên thất bại' });
    }
  };
  