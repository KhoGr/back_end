import { Op } from 'sequelize';
import ComboItem from '../models/combo_item.js';
import MenuItem from '../models/menu_items.js';

const comboItemService = {
  // Thêm món vào combo
  async addItemToCombo(combo_id, item_id, name, quantity = 1) {
    return await ComboItem.create({ combo_id, item_id, name, quantity });
  },

  // Lấy tất cả món trong combo
  async getItemsInCombo(combo_id) {
    return await ComboItem.findAll({
      where: { combo_id },
      include: [
        {
          model: MenuItem,
          as: 'item',
          attributes: ['item_id', 'name', 'price', 'image_url'],
        },
      ],
    });
  },

  // Tìm kiếm món trong combo theo keyword (tìm theo trường name)
  async searchItemsInCombo(combo_id, keyword) {
    return await ComboItem.findAll({
      where: {
        combo_id,
        name: {
          [Op.iLike]: `%${keyword}%`, // PostgreSQL: nếu dùng MySQL thì đổi thành Op.like
        },
      },
      include: [
        {
          model: MenuItem,
          as: 'item',
          attributes: ['item_id', 'name', 'price', 'image_url'],
        },
      ],
    });
  },

  // Cập nhật số lượng hoặc tên của item trong combo
  async updateComboItem(combo_id, item_id, data) {
    const comboItem = await ComboItem.findOne({ where: { combo_id, item_id } });
    if (!comboItem) throw new Error('Combo item not found');
    Object.assign(comboItem, data);
    return await comboItem.save();
  },

  // Xóa một item khỏi combo
  async removeItemFromCombo(combo_id, item_id) {
    const deleted = await ComboItem.destroy({ where: { combo_id, item_id } });
    if (deleted === 0) throw new Error('Combo item not found or already deleted');
    return { message: 'Combo item deleted successfully' };
  },

  // Xóa tất cả món khỏi combo
  async clearCombo(combo_id) {
    await ComboItem.destroy({ where: { combo_id } });
    return { message: 'All items removed from combo' };
  },
};

export default comboItemService;
