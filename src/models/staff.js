import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

class Staff extends Model {
  static associate(models) {
    Staff.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onDelete: 'CASCADE',
    });
  }
}

Staff.init(
  {
    staff_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'user_id',
      },
      onDelete: 'CASCADE',
    },
    position: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    working_type: {
      type: DataTypes.ENUM('fulltime', 'parttime'),
      defaultValue: 'fulltime',
    },
    joined_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: 'staffs',
    modelName: 'Staff',
    timestamps: true,
    underscored: true,
  }
);

export default Staff;
