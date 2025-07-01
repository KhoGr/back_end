import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

class InventoryBatch extends Model {}

InventoryBatch.init(
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
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    unit_price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    total_value: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    time_added: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    supplier: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'InventoryBatch',
    tableName: 'inventory_batches',
    timestamps: true,
    underscored: true,
  }
);

export default InventoryBatch;
