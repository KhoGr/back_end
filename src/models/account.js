
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js'; // Đảm bảo đường dẫn chính xác đến file cấu hình Sequelize

class Account extends Model {
  static associate(models) {
    // Define associations here if needed
  }
}

Account.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    google_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
    google_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    facebook_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
    facebook_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    provider: {
      type: DataTypes.ENUM('google', 'facebook', 'local'),
      allowNull: false,
      defaultValue: 'local',
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'Accounts',
    modelName: 'Account',
    timestamps: true,
    underscored: true,
  }
);

export default Account;
