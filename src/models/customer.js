import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

class Customer extends Model {
  static associate(models) {
    Customer.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user_info",
      onDelete: "CASCADE",
    });

    Customer.belongsTo(models.VipLevel, {
      foreignKey: "vip_id",
      as: "vip_level",
      onDelete: "SET NULL",
    });

    Customer.hasMany(models.MenuItemComment, {
      foreignKey: "customer_id",
      as: "customer_comments",
      onDelete: "CASCADE",
    });

    Customer.hasMany(models.VoucherRedemption, {
      foreignKey: "customer_id",
      as: "voucher_usages",
    });
  }
}

Customer.init(
  {
    customer_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "user_id",
      },
      onDelete: "CASCADE",
    },
    vip_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "vip_levels",
        key: "id",
      },
      onDelete: "SET NULL",
    },
    loyalty_point: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    total_spent: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
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
    modelName: "Customer",
    tableName: "customers",
    timestamps: true,
    underscored: true,

    // ✅ Ngăn Sequelize tự tạo cột `id`
    defaultScope: {
      attributes: { exclude: ["id"] },
    },
  }
);

export default Customer;
