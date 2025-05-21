import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
class Coupon extends Model {}
Coupon.init(
  {
    coupon_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
    discount_percent: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: "0.00",
    },
    max_discount: {
      type: DataTypes.DECIMAL(10, 2),
    },
    min_order_value: {
      type: DataTypes.DECIMAL(10, 2),
    },
    valid_from: {
      type: DataTypes.DATE,
    },
    valid_to: {
      type: DataTypes.DATE,
    },
    usage_limit: {
      type: DataTypes.INTEGER,
    },
    times_used: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
    modelName: "Coupon",
    tableName: "Coupons",
    timestamps: true,
    underscored: true,
  }
);
export default Coupon;
