import { sequelize } from '../config/database.js'; // Import cấu hình Sequelize

import Account from './account.js';
import User from './user.js';
import Staff from './staff.js';
import Customer from './customer.js';

// Khởi tạo models
const models = { Account, User, Staff, Customer };

// Gọi các hàm associate để thiết lập quan hệ
Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

// Export sequelize và models
export { sequelize };
export default models;
