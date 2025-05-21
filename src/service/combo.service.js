import ComboItem from '../models/combo_item.js';
import MenuItem from '../models/menu_items.js';

const comboItemService = {
  // Thêm một món vào combo
  async addItemToCombo(combo_id, item_id, quantity = 1) {
    return await ComboItem.create({ combo_id, item_id, quantity });
  },

  // Lấy danh sách các món trong một combo
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

  // Cập nhật số lượng món trong combo
  async updateComboItem(combo_id, item_id, quantity) {
    const comboItem = await ComboItem.findOne({ where: { combo_id, item_id } });
    if (!comboItem) throw new Error('Combo item not found');
    comboItem.quantity = quantity;
    return await comboItem.save();
  },

  // Xóa một món khỏi combo
  async removeItemFromCombo(combo_id, item_id) {
    const deleted = await ComboItem.destroy({ where: { combo_id, item_id } });
    if (deleted === 0) throw new Error('Combo item not found or already deleted');
    return { message: 'Combo item deleted successfully' };
  },

  // Xóa tất cả món khỏi combo (nếu cần)
  async clearCombo(combo_id) {
    await ComboItem.destroy({ where: { combo_id } });
    return { message: 'All items removed from combo' };
  },
};

export default comboItemService;
