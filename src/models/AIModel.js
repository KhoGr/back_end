// models/AIModel.js
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

class AIModel extends Model {
  static associate(models) {
    AIModel.hasMany(models.ChatbotResponse, {
      foreignKey: 'ai_model_id',
      as: 'responses',
      onDelete: 'CASCADE',
    });

  }
}

AIModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    specialties: {
      type: DataTypes.JSON, // Lưu mảng như ["menu", "hours"]
      allowNull: true,
    },
    response_style: {
      type: DataTypes.ENUM('friendly', 'precise', 'creative', 'concise', 'detailed'),
      allowNull: false,
      defaultValue: 'friendly',
    },
  },
  {
    sequelize,
    tableName: 'ai_models',
    modelName: 'AIModel',
    timestamps: true,
    underscored: true,
  }
);

export default AIModel;
