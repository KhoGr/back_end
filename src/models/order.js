import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

class Order extends Model {
  static associate(models) {
    Order.belongsTo(models.Customer, {
      foreignKey: 'customer_id',
      as: 'customer',
      onDelete: 'CASCADE',
    });

    Order.belongsTo(models.Table, {
      foreignKey: 'table_id',
      as: 'table',
      onDelete: 'SET NULL',
    });

    Order.hasMany(models.OrderItem, {
      foreignKey: 'order_id',
      as: 'order_items',
      onDelete: 'CASCADE',
    });
  }
}

Order.init(
  {
      id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    table_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    guest_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    order_type: {
      type: DataTypes.ENUM('dine-in', 'take-away', 'delivery'),
      defaultValue: 'dine-in',
    },
    order_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    discount_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    final_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        'pending',
        'preparing',
        'served',
        'completed',
        'cancelled',
        'refunded'
      ),
      defaultValue: 'pending',
    },
    payment_method: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    is_paid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    modelName: 'Order',
    tableName: 'orders',
    timestamps: true,
    underscored: true,
  }
);

export default Order;
