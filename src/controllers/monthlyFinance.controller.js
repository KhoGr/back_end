import monthlyFinanceService from '../service/monthlyFinance.service.js';

class MonthlyFinanceController {
  // Tạo hoặc cập nhật bản ghi tổng hợp tháng
  async create(req, res) {
    try {
      const { month } = req.body;
      const summary = await monthlyFinanceService.generateMonthlyFinanceSummary(month);
      res.status(201).json(summary);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to generate monthly summary' });
    }
  }

  // Lấy tất cả các bản ghi tổng hợp tài chính theo tháng
  async getAll(req, res) {
    try {
      const data = await monthlyFinanceService.getAllSummaries();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to fetch monthly summaries' });
    }
  }

  // Lấy thông tin tổng hợp theo ID
  async getById(req, res) {
    try {
      const id = req.params.id;
      const summary = await monthlyFinanceService.getSummaryById(id);
      if (!summary) {
        return res.status(404).json({ message: 'Monthly summary not found' });
      }
      res.status(200).json(summary);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to get monthly summary' });
    }
  }

  // Cập nhật ghi chú hoặc dữ liệu tổng hợp nếu cần
  async update(req, res) {
    try {
      const id = req.params.id;
      const data = req.body;
      const updated = await monthlyFinanceService.updateSummary(id, data);
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to update monthly summary' });
    }
  }

  // Xóa bản ghi tổng hợp theo ID
  async delete(req, res) {
    try {
      const id = req.params.id;
      const result = await monthlyFinanceService.deleteSummary(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to delete monthly summary' });
    }
  }

  // Tìm kiếm theo tháng keyword (ví dụ "2025-06")
  async getByKeyword(req, res) {
    try {
      const keyword = req.query.keyword || '';
      const result = await monthlyFinanceService.searchByMonthKeyword(keyword);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to search monthly summaries' });
    }
  }
}

export default new MonthlyFinanceController();
