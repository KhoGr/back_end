import { Op } from 'sequelize';
import MenuItem from '../models/menu_items.js';
import Category from '../models/category.js';

const menuItemService = {
  async createMenuItem(data) {
    const category = await Category.findByPk(data.category_id);
    if (!category) {
      throw new Error('Invalid category_id');
    }
    return await MenuItem.create(data);
  },

  async getAllMenuItems() {
    return await MenuItem.findAll({
      include: {
        model: Category,
        as: 'category',
        attributes: ['id', 'name'],
      },
    });
  },

  async getMenuItemById(item_id) {
    console.log("Lấy menu item với item_id:", item_id); 

    const item = await MenuItem.findOne({
      where: { item_id },
      include: {
        model: Category,
        as: 'category',
        attributes: ['id', 'name'],
      },
    });

    console.log("Kết quả truy vấn item:", item); // ✅ Log để debug
    return item;
  },

  async updateMenuItem(item_id, data) {
    const item = await MenuItem.findOne({ where: { item_id } });
    if (!item) return null;

    if (data.category_id) {
      const category = await Category.findByPk(data.category_id);
      if (!category) {
        throw new Error('Invalid category_id');
      }
    }

    await item.update(data);
    return item;
  },

  async deleteMenuItem(item_id) {
    const item = await MenuItem.findOne({ where: { item_id } });
    if (!item) return null;

    await item.destroy();
    return { message: 'Menu item deleted successfully' };
  },

  async searchMenuItems({ keyword, category_id }) {
    const whereClause = {};

    if (keyword) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } },
      ];
    }

    if (category_id) {
      whereClause.category_id = category_id;
    }

    return await MenuItem.findAll({
      where: whereClause,
      include: {
        model: Category,
        as: 'category',
        attributes: ['id', 'name'],
      },
    });
  },

  async updateMenuItemImage(item_id, imageUrl) {
    try {
      const item = await MenuItem.findOne({ where: { item_id } });
      if (!item) {
        throw new Error("Không tìm thấy món ăn.");
      }

      item.image_url = imageUrl;
      await item.save();

      return item;
    } catch (error) {
      console.error("Lỗi khi cập nhật ảnh món ăn:", error);
      throw new Error("Không thể cập nhật ảnh món ăn.");
    }
  }
};

export default menuItemService;
