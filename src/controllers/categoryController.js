import CategoryService from "../service/category.service.js"
class CategoryController {
    static async getAll(req, res) {
      try {
        const categories = await CategoryService.getAllCategories();
        res.json(categories);
      } catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh sách danh mục" });
      }
    }
  
    static async getById(req, res) {
      try {
        const category = await CategoryService.getCategoryById(req.params.id);
        if (!category) return res.status(404).json({ message: "Không tìm thấy danh mục" });
        res.json(category);
      } catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh mục" });
      }
    }
  
    static async create(req, res) {
      try {
        const newCategory = await CategoryService.createCategory(req.body);
        res.status(201).json(newCategory);
      } catch (error) {
        res.status(500).json({ message: "Lỗi tạo danh mục" });
      }
    }
  
    static async update(req, res) {
      try {
        const updatedCategory = await CategoryService.updateCategory(req.params.id, req.body);
        if (!updatedCategory) return res.status(404).json({ message: "Không tìm thấy danh mục" });
        res.json(updatedCategory);
      } catch (error) {
        res.status(500).json({ message: "Lỗi cập nhật danh mục" });
      }
    }
  
    static async remove(req, res) {
      try {
        const deleted = await CategoryService.deleteCategory(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Không tìm thấy danh mục" });
        res.json({ message: "Xóa danh mục thành công" });
      } catch (error) {
        res.status(500).json({ message: "Lỗi xóa danh mục" });
      }
    }
  }
  
  export default CategoryController;