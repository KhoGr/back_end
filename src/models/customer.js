import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database.js"; // hoặc nơi bạn định nghĩa sequelize

class Customer extends Model {
  static associate(models) {
    Customer.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user_info",
      onDelete: "CASCADE",
    });

    Customer.hasMany(models.MenuItemComment, {
      foreignKey: "customer_id",
      as: "customer_comments",
      onDelete: "CASCADE",
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
        model: "Users", // tên bảng trong DB, không phải model
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
    modelName: "Customer",
    tableName: "Customers",
    timestamps: true,
    underscored: true,
  }
);

// Nếu bạn muốn test nhanh ở đây, có thể mock models và gọi associate
// ví dụ:
// Customer.associate({ User: UserModelMock, MenuItemComment: CommentModelMock });

export default Customer;
