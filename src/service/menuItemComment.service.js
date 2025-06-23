import models from '../models/index.js';
import { Op } from "sequelize";


const { MenuItemComment, Customer, User ,MenuItem} = models;

const createComment = async (data) => {
  if (data.rating && (data.rating < 1 || data.rating > 5)) {
    throw new Error('Rating must be between 1 and 5');
  }

  return await MenuItemComment.create({
    item_id: data.item_id,
    customer_id: data.customer_id,
    rating: data.rating,
    comment: data.comment, 
  });
};

const getCommentsByItemId = async (item_id) => {
  return await MenuItemComment.findAll({
    where: { item_id },
    include: [
      {
        model: Customer,
        as: 'commenter', // đúng alias theo model
        include: {
          model: User,
          as: 'user_info',
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

const searchComments = async ({ rating, customerId, itemName }) => {
  console.log('🔍 Input search params:', { rating, customerId, itemName });

  const include = [];

  // Luôn include Customer và User để FE có thông tin người bình luận
  include.push({
    model: Customer,
    as: 'commenter',
    required: false,
    include: [
      {
        model: User,
        as: 'user_info',
        attributes: ['name', 'avatar'],
      },
    ],
  });

  // Include MenuItem
  if (itemName) {
    console.log('🍽️ Filtering by item name:', itemName);
    include.push({
      model: MenuItem,
      as: 'commented_item',
      required: true,
      attributes: ['name'],
      where: {
        name: {
          [Op.like]: `%${itemName}%`,
        },
      },
    });
  } else {
    include.push({
      model: MenuItem,
      as: 'commented_item',
      attributes: ['name'],
    });
  }

  // Where clause chính
  const whereClause = {};
  if (rating) {
    console.log('⭐ Filtering by rating:', rating);
    whereClause.rating = rating;
  }

  if (customerId) {
    console.log('👤 Filtering by customer_id:', customerId);
    whereClause.customer_id = customerId;
  }

  console.log('📦 Final include config:', JSON.stringify(include, null, 2));
  console.log('🔎 Final where clause:', whereClause);

  try {
    const comments = await MenuItemComment.findAll({
      where: whereClause,
      include,
    });

    console.log(`✅ Found ${comments.length} comment(s)`);
    return comments;
  } catch (error) {
    console.error('❌ Error while searching comments:', error);
    throw error;
  }
};


const getAllComments = async () => {
  return await MenuItemComment.findAll({
    include: [
      {
        model: Customer,
        as: 'commenter',
        include: {
          model: User,
          as: 'user_info',
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
