import inventoryBatchService from '../service/inventoryBatch.service.js';

class InventoryBatchController {
  // Tạo batch mới
  async create(req, res) {
    try {
      const data = req.body;
      const newBatch = await inventoryBatchService.createBatch(data);
      res.status(201).json(newBatch);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to create inventory batch' });
    }
  }

  // Lấy tất cả các batch
  async getAll(req, res) {
    try {
      const batches = await inventoryBatchService.getAllBatches();
      res.status(200).json(batches);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to fetch inventory batches' });
    }
  }

  // Lấy batch theo ID
  async getById(req, res) {
    try {
      const id = req.params.id;
      const batch = await inventoryBatchService.getBatchById(id);
      if (!batch) {
        return res.status(404).json({ message: 'Inventory batch not found' });
      }
      res.status(200).json(batch);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to get inventory batch' });
    }
  }

  // Cập nhật batch
  async update(req, res) {
    try {
      const id = req.params.id;
      const data = req.body;
      const updated = await inventoryBatchService.updateBatch(id, data);
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to update inventory batch' });
    }
  }

  // Xoá batch
  async delete(req, res) {
    try {
      const id = req.params.id;
      const result = await inventoryBatchService.deleteBatch(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to delete inventory batch' });
    }
  }

  // Lấy theo tháng
  async getByMonth(req, res) {
    try {
      const month = req.query.month; // YYYY-MM
      if (!month) {
        return res.status(400).json({ message: 'Month is required' });
      }
      const batches = await inventoryBatchService.getBatchesByMonth(month);
      res.status(200).json(batches);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to filter inventory by month' });
    }
  }

  // Tìm kiếm theo tên hoặc supplier
  async getByKeyword(req, res) {
    try {
      const keyword = req.query.keyword || '';
      const results = await inventoryBatchService.searchByKeyword(keyword);
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to search inventory batches' });
    }
  }

  // Lấy danh sách tên nguyên liệu duy nhất
  async getUniqueItemNames(req, res) {
    try {
      const names = await inventoryBatchService.getUniqueItemNames();
      res.status(200).json(names);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to get unique item names' });
    }
  }
}

export default new InventoryBatchController();
