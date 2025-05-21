// service/menuItem.service.js
import { Op } from 'sequelize';
import MenuItem from '../models/menu_items.js';
import Category from '../models/category.js';

const menuItemService = {
  async createMenuItem(data) {
    // ✅ Validate category_id tồn tại
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
      }
    });
  },

  async getMenuItemById(id) {
    return await MenuItem.findByPk(id, {
      include: {
        model: Category,
        as: 'category',
        attributes: ['id', 'name'],
      }
    });
  },

  async updateMenuItem(id, data) {
    const item = await MenuItem.findByPk(id);
    if (!item) return null;

    // ✅ Nếu có cập nhật category_id thì validate
    if (data.category_id) {
      const category = await Category.findByPk(data.category_id);
      if (!category) {
        throw new Error('Invalid category_id');
      }
    }

    await item.update(data);
    return item;
  },

  async deleteMenuItem(id) {
    const item = await MenuItem.findByPk(id);
    if (!item) return null;
    await item.destroy();
    return { message: 'Menu item deleted successfully' };
  },

  async searchMenuItems({ keyword, category_id }) {
    const whereClause = {};

    if (keyword) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${keyword}%` } },
        { description: { [Op.iLike]: `%${keyword}%` } },
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
      }
    });
  }
};

export default menuItemService;
