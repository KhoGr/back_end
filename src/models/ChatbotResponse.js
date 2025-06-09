import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

class ChatbotResponse extends Model {
  static associate(models) {
    ChatbotResponse.belongsTo(models.AIModel, {
      foreignKey: "ai_model_id",
      as: "ai_model",
      onDelete: "CASCADE",
    });

    ChatbotResponse.belongsTo(models.MenuItem, {
      foreignKey: "menu_item_id",
      as: "menu_item",
      onDelete: "SET NULL", // mềm mại hơn, nếu món ăn bị xóa thì câu trả lời vẫn tồn tại
    });
  }
}

ChatbotResponse.init(
  {
    response_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    keyword: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    response: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    ai_model_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "ai_models",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    menu_item_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "menu_items",
        key: "item_id",
      },
      onDelete: "SET NULL",
    },
  },
  {
    sequelize,
    tableName: "chatbot_responses",
    modelName: "ChatbotResponse",
    timestamps: true,
    underscored: true,
  }
);

export default ChatbotResponse;
