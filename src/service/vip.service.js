import VipLevel from '../models/MembershipTier.js';
import { Op } from 'sequelize';

class VipLevelService {
  async createLevel(data) {
    return await VipLevel.create(data);
  }

  async getAllLevels() {
    return await VipLevel.findAll({
      order: [['min_total_spent', 'ASC']],
    });
  }

  async getLevelById(id) {
    return await VipLevel.findByPk(id);
  }

  async updateLevel(id, data) {
    const level = await VipLevel.findByPk(id);
    if (!level) {
      throw new Error('VIP level not found');
    }
    return await level.update(data);
  }

  async deleteLevel(id) {
    const level = await VipLevel.findByPk(id);
    if (!level) {
      throw new Error('VIP level not found');
    }
    await level.destroy();
    return { message: 'VIP level deleted successfully' };
  }

  async searchByKeyword(keyword) {
    return await VipLevel.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
          { description: { [Op.like]: `%${keyword}%` } },
        ],
      },
      order: [['min_total_spent', 'ASC']],
    });
  }

  // ✅ Xác định cấp độ phù hợp với tổng chi tiêu
async getLevelForSpentAmount(totalSpent) {
  // Lấy danh sách VIP theo thứ tự từ cao xuống thấp
  const levels = await VipLevel.findAll({
    order: [['min_total_spent', 'DESC']],
  });

  // Tìm mức VIP cao nhất mà totalSpent >= min_total_spent
  for (const level of levels) {
    const minSpent = typeof level.min_total_spent === 'string'
      ? parseFloat(level.min_total_spent)
      : level.min_total_spent;

    if (totalSpent >= minSpent) {
      return level;
    }
  }

  // Nếu không đủ điều kiện mức nào
  return null;
}

}

export default new VipLevelService();
