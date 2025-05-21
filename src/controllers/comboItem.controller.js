import comboItemService from '../service/combo.service.js'

class ComboItemController {
  // Thêm một món vào combo
  async addItem(req, res) {
    try {
      const { combo_id, item_id, quantity } = req.body;
      const result = await comboItemService.addItemToCombo(combo_id, item_id, quantity);
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

  // Cập nhật số lượng món trong combo
  async updateItem(req, res) {
    try {
      const { combo_id, item_id } = req.params;
      const { quantity } = req.body;
      const updated = await comboItemService.updateComboItem(combo_id, item_id, quantity);
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to update combo item' });
    }
  }

  // Xoá một món ra khỏi combo
  async removeItem(req, res) {
    try {
      const { combo_id, item_id } = req.params;
      const result = await comboItemService.removeItemFromCombo(combo_id, item_id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to remove combo item' });
    }
  }

  // Xoá toàn bộ món trong combo
  async clearCombo(req, res) {
    try {
      const { combo_id } = req.params;
      const result = await comboItemService.clearCombo(combo_id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to clear combo' });
    }
  }
}

export default new ComboItemController();
