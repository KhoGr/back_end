// controller/menuItem.controller.js
import menuItemService from '../service/menuItem.service.js';

class MenuItemController {
  async create(req, res) {
    try {
      const data = req.body;
      const newItem = await menuItemService.createMenuItem(data);
      res.status(201).json(newItem);
    } catch (error) {
      res.status(400).json({ message: error.message || 'Failed to create menu item' });
    }
  }

  async getAll(req, res) {
    try {
      const items = await menuItemService.getAllMenuItems();
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to fetch menu items' });
    }
  }

  async getById(req, res) {
    try {
      const id = req.params.id;
      const item = await menuItemService.getMenuItemById(id);
      if (!item) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
      res.status(200).json(item);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to fetch menu item' });
    }
  }

  async update(req, res) {
    try {
      const id = req.params.id;
      const data = req.body;
      const updatedItem = await menuItemService.updateMenuItem(id, data);
      if (!updatedItem) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
      res.status(200).json(updatedItem);
    } catch (error) {
      res.status(400).json({ message: error.message || 'Failed to update menu item' });
    }
  }

  async delete(req, res) {
    try {
      const id = req.params.id;
      const result = await menuItemService.deleteMenuItem(id);
      if (!result) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to delete menu item' });
    }
  }

  async search(req, res) {
    try {
      const { keyword, category_id } = req.query;
      const items = await menuItemService.searchMenuItems({ keyword, category_id });
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to search menu items' });
    }
  }
}

export default new MenuItemController();
