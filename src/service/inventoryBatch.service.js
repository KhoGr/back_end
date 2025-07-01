import InventoryBatch from '../models/InventoryBatch.js';
import { Op } from 'sequelize';
import dayjs from 'dayjs';
import { sequelize } from '../config/database.js';

class InventoryBatchService {
  // Tạo mới một đợt nhập hàng
  async createBatch(data) {
    return await InventoryBatch.create(data);
  }

  // Lấy tất cả đợt nhập hàng
  async getAllBatches() {
    return await InventoryBatch.findAll({
      order: [['time_added', 'DESC']],
    });
  }

  // Lấy batch theo ID
  async getBatchById(id) {
    return await InventoryBatch.findByPk(id);
  }

  // Cập nhật batch
  async updateBatch(id, data) {
    const batch = await InventoryBatch.findByPk(id);
    if (!batch) {
      throw new Error('Batch not found');
    }
    return await batch.update(data);
  }

  // Xoá batch
  async deleteBatch(id) {
    const batch = await InventoryBatch.findByPk(id);
    if (!batch) {
      throw new Error('Batch not found');
    }
    await batch.destroy();
    return { message: 'Batch deleted successfully' };
  }

  // Lấy tất cả batch theo tháng cụ thể
  async getBatchesByMonth(monthString) {
    const start = dayjs(monthString).startOf('month').toDate();
    const end = dayjs(monthString).endOf('month').toDate();

    return await InventoryBatch.findAll({
      where: {
        time_added: {
          [Op.between]: [start, end],
        },
      },
      order: [['time_added', 'DESC']],
    });
  }

  // Tìm kiếm theo tên hoặc nhà cung cấp
  async searchByKeyword(keyword) {
    return await InventoryBatch.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
          { supplier: { [Op.like]: `%${keyword}%` } },
        ],
      },
      order: [['time_added', 'DESC']],
    });
  }

  // Lấy tất cả tên nguyên liệu duy nhất
  async getUniqueItemNames() {
    const results = await InventoryBatch.findAll({
      attributes: ['name'],
      group: ['name'],
    });
    return results.map(item => item.name);
  }
  //Tính tổng tiền theo tháng
  async getMonthlyTotalValue(monthString) {
  const start = dayjs(monthString).startOf('month').toDate();
  const end = dayjs(monthString).endOf('month').toDate();

  const result = await InventoryBatch.findOne({
    attributes: [
      [sequelize.fn('SUM', sequelize.col('total_value')), 'total_value']
    ],
    where: {
      time_added: {
        [Op.between]: [start, end],
      },
    },
    raw: true,
  });

  return parseFloat(result.total_value) || 0;
}
}

export default new InventoryBatchService();
