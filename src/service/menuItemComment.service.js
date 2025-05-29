import models from '../models/index.js';

const { MenuItemComment, Customer, User } = models;

const createComment = async (data) => {
  if (data.rating && (data.rating < 1 || data.rating > 5)) {
    throw new Error('Rating must be between 1 and 5');
  }
  return await MenuItemComment.create(data);
};

const getCommentsByItemId = async (item_id) => {
  return await MenuItemComment.findAll({
    where: { item_id },
    include: [
      {
        model: Customer,
        as: 'commenter', // ✅ đúng alias theo model
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

  if (data.rating && (data.rating < 1 || data.rating > 5)) {
    throw new Error('Rating must be between 1 and 5');
  }

  return await comment.update(data);
};

const deleteComment = async (comment_id) => {
  const comment = await MenuItemComment.findByPk(comment_id);
  if (!comment) throw new Error('Comment not found');
  await comment.destroy();
  return { message: 'Comment deleted successfully' };
};
const searchComments = async ({ rating, customerName, itemName }) => {
  return await MenuItemComment.findAll({
    where: {
      ...(rating && { rating }),
    },
    include: [
      {
        model: Customer,
        as: 'commenter',
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['name', 'avatar'],
            where: customerName
              ? {
                  name: { [Op.like]: `%${customerName}%` }, 
                }
              : undefined,
          },
        ],
      },
      {
        model: MenuItem,
        as: 'commented_item',
        attributes: ['name'],
        where: itemName
          ? {
              name: { [Op.iLike]: `%${itemName}%` },
            }
          : undefined,
      },
    ],
    order: [['created_at', 'DESC']],
  });
};
const getAllComments = async () => {
  return await MenuItemComment.findAll({
    include: [
      {
        model: Customer,
        as: 'commenter',
        include: {
          model: User,
          as: 'user',
          attributes: ['name', 'avatar'],
        },
      },
      {
        model: models.MenuItem,
        as: 'commented_item',
        attributes: ['name'],
      },
    ],
    order: [['created_at', 'DESC']],
  });
};


export default {
  createComment,
  getCommentsByItemId,
  updateComment,
  deleteComment,
  searchComments,
  getAllComments
};
