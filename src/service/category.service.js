import Category from "../models/category.js";

class CategoryService {
  static async getAllCategories() {
    return await Category.findAll();
  }

  static async getCategoryById(id) {
    return await Category.findByPk(id);
  }

  static async createCategory(data) {
    return await Category.create(data);
  }

  static async updateCategory(id, data) {
    const category = await Category.findByPk(id);
    if (!category) return null;
    return await category.update(data);
  }

  static async deleteCategory(id) {
    const category = await Category.findByPk(id);
    if (!category) return null;
    return await category.destroy();
  }
}

export default CategoryService;
