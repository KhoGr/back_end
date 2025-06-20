// models/Voucher.js
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

class Voucher extends Model {

    static associate(models) {
    Voucher.hasMany(models.VoucherRedemption, {
      foreignKey: 'voucher_id',
      as: 'redemptions',
    });
  }
}

Voucher.init(
  {
    voucher_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.ENUM('flat', 'percent'), // Giảm tiền hoặc giảm %
      allowNull: false,
    },
    value: {
      type: DataTypes.DECIMAL(10, 2), // Giá trị giảm
      allowNull: false,
    },
    usage_limit: {
      type: DataTypes.INTEGER,
      allowNull: true, // Null = không giới hạn
    },
    usage_limit_per_user: {
      type: DataTypes.INTEGER,
      allowNull: true, // Null = không giới hạn
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    modelName: 'Voucher',
    tableName: 'vouchers',
    timestamps: true,
    underscored: true,
  }
);

export default Voucher;
