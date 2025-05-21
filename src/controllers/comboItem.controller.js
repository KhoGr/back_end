import comboItemService from '../service/comboItem.service.js';

class ComboItemController {
  // Thêm một món vào combo
  async addItem(req, res) {
    try {
      const { combo_id, item_id, name, quantity } = req.body;
      const result = await comboItemService.addItemToCombo(combo_id, item_id, name, quantity);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to add item to combo' });
    }
  }

  // Lấy danh sách các món trong combo
  async getItems(req, res) {
    try {
      const { combo_id } = req.params;
      const items = await comboItemService.getItemsInCombo(combo_id);
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to fetch combo items' });
    }
  }

  // Cập nhật thông tin món trong combo (quantity, name,...)
  async updateItem(req, res) {
    try {
      const { combo_id, item_id } = req.params;
      const updateData = req.body; // { quantity, name, ... }
      const updated = await comboItemService.updateComboItem(combo_id, item_id, updateData);
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to update combo item' });
    }
  }

  // Xoá một món khỏi combo
  async removeItem(req, res) {
    try {
      const { combo_id, item_id } = req.params;
      const result = await comboItemService.removeItemFromCombo(combo_id, item_id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to remove combo item' });
    }
  }

  // Xoá tất cả món trong combo
  async clearCombo(req, res) {
    try {
      const { combo_id } = req.params;
      const result = await comboItemService.clearCombo(combo_id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to clear combo' });
    }
  }

  // Tìm kiếm món trong combo theo từ khoá
  async searchComboItem(req, res) {
    try {
      const { combo_id } = req.params;
      const { keyword } = req.query;
      if (!keyword) {
        return res.status(400).json({ message: 'Missing keyword for search' });
      }

      const results = await comboItemService.searchItemsInCombo(combo_id, keyword);
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to search combo item' });
    }
  }
}

export default new ComboItemController();
