import Category from '../models/category.js';
import { Op } from 'sequelize'; // ✅ Thêm dòng này để dùng Op

class CategoryService {
  async createCategory(data) {
    return await Category.create(data);
  }

  async getAllCategories() {
    return await Category.findAll();
  }

  async getCategoryById(id) {
    return await Category.findByPk(id);
  }

  async updateCategory(id, data) {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return await category.update(data);
  }

  async deleteCategory(id) {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new Error('Category not found');
    }
    await category.destroy();
    return { message: 'Category deleted successfully' };
  }

  // ✅ Thêm phương thức search theo keyword
  async searchByKeyword(keyword) {
    return await Category.findAll({
where: {
  [Op.or]: [
    { name: { [Op.like]: `%${keyword}%` } },
    { description: { [Op.like]: `%${keyword}%` } },
  ]
},
      order: [['created_at', 'DESC']],
    });
  }
}

export default new CategoryService();
