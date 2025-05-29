import menuItemCommentHandler from '../service/menuItemComment.service';

const createMenuItemComment = async (req, res) => {
  try {
    const data = req.body;
    const comment = await menuItemCommentHandler.createComment(data);
    return res.status(201).json({ message: 'Comment created', comment });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getMenuItemComments = async (req, res) => {
  try {
    const { item_id } = req.params;
    const comments = await menuItemCommentHandler.getCommentsByItemId(item_id);
    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateMenuItemComment = async (req, res) => {
  try {
    const { comment_id } = req.params;
    const updated = await menuItemCommentHandler.updateComment(comment_id, req.body);
    return res.status(200).json({ message: 'Comment updated', updated });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const deleteMenuItemComment = async (req, res) => {
  try {
    const { comment_id } = req.params;
    await menuItemCommentHandler.deleteComment(comment_id);
    return res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

const searchMenuItemComments = async (req, res) => {
  try {
    const { rating, customerName, itemName } = req.query;
    const comments = await menuItemCommentHandler.searchComments({
      rating: rating ? Number(rating) : undefined,
      customerName,
      itemName,
    });
    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getAllMenuItemComments = async (req, res) => {
  try {
    const comments = await menuItemCommentHandler.getAllComments();
    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default {
  createMenuItemComment,
  getMenuItemComments,
  updateMenuItemComment,
  deleteMenuItemComment,
  searchMenuItemComments,
  getAllMenuItemComments
};
