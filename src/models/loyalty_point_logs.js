import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

class LoyaltyPointLog extends Model {
  static associate(models) {
    LoyaltyPointLog.belongsTo(models.Customer, {
      foreignKey: 'customer_id',
      as: 'customer',
      onDelete: 'CASCADE',
    });

    LoyaltyPointLog.belongsTo(models.Order, {
      foreignKey: 'order_id',
      as: 'order',
      onDelete: 'SET NULL',
    });
  }
}

LoyaltyPointLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customers',
        key: 'customer_id',
      },
      onDelete: 'CASCADE',
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'orders',
        key: 'order_id',
      },
      onDelete: 'SET NULL',
    },
    change_type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [['earn', 'redeem', 'adjustment', 'refund']],
      },
    },
    points_changed: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: 'LoyaltyPointLog',
    tableName: 'loyalty_point_logs',
    timestamps: false,
    underscored: true,
  }
);

export default LoyaltyPointLog;
