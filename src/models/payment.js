// models/payments.js
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

class Payment extends Model {
  static associate(models) {
    Payment.belongsTo(models.Order, {
      foreignKey: 'order_id',
      as: 'order',
      onDelete: 'CASCADE',
    });
  }
}

Payment.init(
  {
    payment_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'order_id',
      },
      onDelete: 'CASCADE',
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [['cash', 'card', 'momo', 'vnpay']],
      },
    },
    transaction_code: {
      type: DataTypes.STRING(100),
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: 'success',
      validate: {
        isIn: [['success', 'failed', 'pending']],
      },
    },
    paid_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Payment',
    tableName: 'payments',
    timestamps: false, // vì đã có created_at/pai̇d_at riêng
    underscored: true,
  }
);

export default Payment;
