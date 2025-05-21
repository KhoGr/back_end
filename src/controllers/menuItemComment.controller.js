// controllers/menuItemComment.controller.js
import menuItemCommentService from '../services/menuItemComment.service.js';

const createComment = async (req, res) => {
  try {
    const data = req.body;
    const comment = await menuItemCommentService.createComment(data);
    return res.status(201).json({ message: 'Comment created', comment });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getCommentsByItemId = async (req, res) => {
  try {
    const { item_id } = req.params;
    const comments = await menuItemCommentService.getCommentsByItemId(item_id);
    return res.json(comments);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const { comment_id } = req.params;
    const updated = await menuItemCommentService.updateComment(comment_id, req.body);
    return res.json({ message: 'Comment updated', updated });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { comment_id } = req.params;
    await menuItemCommentService.deleteComment(comment_id);
    return res.json({ message: 'Comment deleted' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default {
  createComment,
  getCommentsByItemId,
  updateComment,
  deleteComment,
};
