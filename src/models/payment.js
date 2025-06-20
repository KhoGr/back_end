// models/Payment.ts
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
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    transaction_no: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Mã giao dịch trả về từ VNPay (vnp_TransactionNo)',
    },
    bank_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bank_transaction_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    card_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pay_date: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Định dạng từ VNPay trả về: yyyyMMddHHmmss',
    },
    response_code: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: 'Mã phản hồi từ VNPay, 00 = thành công',
    },
    transaction_status: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: 'vnp_TransactionStatus',
    },
    checksum: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'vnp_SecureHash để đối chiếu',
    },
    status: {
      type: DataTypes.ENUM('success', 'failed', 'pending'),
      defaultValue: 'pending',
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
    timestamps: false,
    underscored: true,
  }
);

export default Payment;
