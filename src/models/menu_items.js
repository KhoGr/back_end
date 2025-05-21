import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

class MenuItem extends Model {
  static associate(models) {
    MenuItem.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category',
      onDelete: 'CASCADE',
    });
  }
}

MenuItem.init(
  {
    item_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discount_percent: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00,
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_combo: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    stock_quantity: {
      type: DataTypes.INTEGER,
    },
    image_url: {
      type: DataTypes.STRING(255),
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
    modelName: 'MenuItem',
    tableName: 'menu_items',
    timestamps: true,
    underscored: true,
  }
);

export default MenuItem;
