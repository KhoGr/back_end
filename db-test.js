require('dotenv').config();
const { Sequelize } = require('sequelize');

// Lấy thông tin từ file .env
const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql'
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Kết nối cơ sở dữ liệu thành công!');
  } catch (error) {
    console.error('Không thể kết nối cơ sở dữ liệu:', error);
  } finally {
    await sequelize.close();
  }
})();
