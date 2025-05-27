import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database.js"; 

class User extends Model {
static associate(models) {
  User.belongsTo(models.Account, {
    foreignKey: 'account_id',
    as: 'account',
    onDelete: 'CASCADE',
  });

  User.hasOne(models.Staff, {
    foreignKey: 'user_id',
    as: 'staffProfile',
    onDelete: 'CASCADE',
  });
}
}

User.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Accounts", // Tên bảng tham chiếu
        key: "id",
      },
      onDelete: "CASCADE",
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(15),
      unique: true,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("admin", "customer", "staff"),
      allowNull: false,
      defaultValue: "customer",
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
    tableName: "Users",
    modelName: "User",
    timestamps: true,
    underscored: true,
  }
);

export default User;
