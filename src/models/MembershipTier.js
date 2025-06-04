import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

class VipLevel extends Model {}

VipLevel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    min_total_spent: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    discount_percent: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    free_shipping_threshold: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    benefits: {
      type: DataTypes.JSON,
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
    modelName: 'VipLevel',
    tableName: 'vip_levels',
    timestamps: true,
    underscored: true,
  }
);

export default VipLevel;
