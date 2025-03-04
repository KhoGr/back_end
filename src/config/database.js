import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Load biến môi trường từ .env

const sequelize = new Sequelize(
  process.env.DB_NAME ,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false, 
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Kết nối MySQL thành công!');
    console.log('📌 Thông tin database:');
    console.log('   🏠 Host:', process.env.DB_HOST || '127.0.0.1');
    console.log('   📂 Database:', process.env.DB_NAME || 'mini_ecommerce');
    console.log('   👤 User:', process.env.DB_USER || 'root');
    console.log('   🔑 Password:', process.env.DB_PASSWORD ? '********' : 'Không có mật khẩu');
    console.log('   🔌 Port:', process.env.DB_PORT || 3306);
  } catch (error) {
    console.error('❌ Lỗi kết nối MySQL:', error);
    process.exit(1);
  }
};

export { sequelize, connectDB };
