import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

class OrderCoupon extends Model {
  static associate(models) {
    OrderCoupon.belongsTo(models.Order, {
      foreignKey: 'order_id',
      as: 'order',
      onDelete: 'CASCADE',
    });

    OrderCoupon.belongsTo(models.Coupon, {
      foreignKey: 'coupon_id',
      as: 'coupon',
      onDelete: 'CASCADE',
    });
  }
}

OrderCoupon.init(
  {
    id: {
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
    coupon_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'coupons',
        key: 'coupon_id',
      },
      onDelete: 'CASCADE',
    },
    discount_applied: {
      type: DataTypes.DECIMAL(10, 2),
    },
  },
  {
    sequelize,
    modelName: 'OrderCoupon',
    tableName: 'order_coupons',
    timestamps: false,
    underscored: true,
  }
);

export default OrderCoupon;
