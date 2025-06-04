// models/VoucherRedemption.js
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

class VoucherRedemption extends Model {
  static associate(models) {
    VoucherRedemption.belongsTo(models.Voucher, {
      foreignKey: 'voucher_id',
      as: 'voucher_log',
    });

    VoucherRedemption.belongsTo(models.Customer, {
      foreignKey: 'customer_id',
      as: 'customer_log',
    });
  }
}
VoucherRedemption.init(
  {
    redemption_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    voucher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Vouchers',
        key: 'voucher_id',
      },
      onDelete: 'CASCADE',
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Customers',
        key: 'customer_id',
      },
      onDelete: 'CASCADE',
    },
    redeemed_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'VoucherRedemption',
    tableName: 'VoucherRedemptions',
    timestamps: false,
    underscored: true,
  }
);

export default VoucherRedemption;
