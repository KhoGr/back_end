import categoryService from '../service/category.service.js';

class CategoryController {
  async create(req, res) {
    try {
      const data = req.body;
      const newCategory = await categoryService.createCategory(data);
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to create category' });
    }
  }

  async getAll(req, res) {
    try {
      const categories = await categoryService.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to fetch categories' });
    }
  }

  async getById(req, res) {
    try {
      const id = req.params.id;
      const category = await categoryService.getCategoryById(id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to get category' });
    }
  }

  async update(req, res) {
    try {
      const id = req.params.id;
      const data = req.body;
      const updatedCategory = await categoryService.updateCategory(id, data);
      res.status(200).json(updatedCategory);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to update category' });
    }
  }

  async delete(req, res) {
    try {
      const id = req.params.id;
      const result = await categoryService.deleteCategory(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to delete category' });
    }
  }

  // ✅ Thêm controller search theo keyword
  async getByKeyword(req, res) {
    try {
      const keyword = req.query.keyword || '';
      const categories = await categoryService.searchByKeyword(keyword);
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to search categories' });
    }
  }
}

export default new CategoryController();
