import membershipService from '../service/vip.service.js';

class MembershipController {
  async create(req, res) {
    try {
      const data = req.body;
      const newMembership = await membershipService.createLevel(data);
      res.status(201).json(newMembership);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to create membership' });
    }
  }

  // Lấy danh sách tất cả cấp độ VIP
  async getAll(req, res) {
    try {
      const memberships = await membershipService.getAllLevels();
      res.status(200).json(memberships);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to fetch memberships' });
    }
  }

  // Lấy chi tiết cấp độ VIP theo ID
  async getById(req, res) {
    try {
      const id = req.params.id;
      const membership = await membershipService.getLevelById(id);
      if (!membership) {
        return res.status(404).json({ message: 'Membership not found' });
      }
      res.status(200).json(membership);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to get membership' });
    }
  }

  // Cập nhật cấp độ VIP
  async update(req, res) {
    try {
      const id = req.params.id;
      const data = req.body;
      const updatedMembership = await membershipService.updateLevel(id, data);
      res.status(200).json(updatedMembership);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to update membership' });
    }
  }

  // Xóa cấp độ VIP
  async delete(req, res) {
    try {
      const id = req.params.id;
      const result = await membershipService.deleteLevel(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to delete membership' });
    }
  }

  // Tìm kiếm cấp độ VIP theo keyword
  async getByKeyword(req, res) {
    try {
      const keyword = req.query.keyword || '';
      const memberships = await membershipService.searchByKeyword(keyword);
      res.status(200).json(memberships);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to search memberships' });
    }
  }

  // Lấy cấp độ phù hợp với tổng chi tiêu
  async getLevelBySpent(req, res) {
    try {
      const totalSpent = parseFloat(req.query.totalSpent || '0');
      const level = await membershipService.getLevelForSpentAmount(totalSpent);
      res.status(200).json(level || null);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to get level for spent amount' });
    }
  }
}

export default new MembershipController();
