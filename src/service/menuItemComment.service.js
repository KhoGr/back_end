import models from '../models/index.js';

const { MenuItemComment, Customer, User } = models;

const createComment = async (data) => {
  return await MenuItemComment.create(data);
};

const getCommentsByItemId = async (item_id) => {
  return await MenuItemComment.findAll({
    where: { item_id },
    include: [
      {
        model: Customer,
        as: 'customer',
        include: {
          model: User,
          as: 'user',
          attributes: ['name', 'avatar'],
        },
      },
    ],
    order: [['created_at', 'DESC']],
  });
};

const updateComment = async (comment_id, data) => {
  const comment = await MenuItemComment.findByPk(comment_id);
  if (!comment) throw new Error('Comment not found');
  return await comment.update(data);
};

const deleteComment = async (comment_id) => {
  const comment = await MenuItemComment.findByPk(comment_id);
  if (!comment) throw new Error('Comment not found');
  await comment.destroy();
  return true;
};

export default {
  createComment,
  getCommentsByItemId,
  updateComment,
  deleteComment,
};
