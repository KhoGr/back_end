import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

class Customer extends Model {
  static associate(models) {
    Customer.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user_info", 
      onDelete: "CASCADE",
    });

    Customer.hasMany(models.MenuItemComment, {
      foreignKey: 'customer_id',
      as: 'customer_comments', // đổi alias từ 'comments'
      onDelete: 'CASCADE',
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
    loyalty_point: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    total_spent: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    membership_level: {
      type: DataTypes.ENUM("bronze", "silver", "gold", "platinum"),
      defaultValue: "bronze",
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
    tableName: "Customers",
    modelName: "Customer",
    timestamps: true,
    underscored: true,
  }
);

export default Customer;
