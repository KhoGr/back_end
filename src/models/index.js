import { sequelize } from '../config/database.js'; // Cấu hình Sequelize

// Import models
import Account from './account.js';
import User from './user.js';
import Staff from './staff.js';
import Customer from './customer.js';
import MenuItem from './menu_items.js';
import MenuItemComment from './menu_item_comments.js'
import Category from './category.js'

// Khởi tạo models
const models = {
  Account,
  User,
  Staff,
  Customer,
  MenuItem,
  MenuItemComment,
  Category
};
  // Define associations
  MenuItem.belongsTo(models.Category, {
    foreignKey: "category_id",
    as: "category", 
    onDelete: "CASCADE",
  });
  
  MenuItem.hasMany(models.MenuItemComment, {
    foreignKey: 'item_id',
    as: 'item_comments', // đổi alias từ 'comments'
    onDelete: 'CASCADE',
  });

Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

export { sequelize };
export default models;
