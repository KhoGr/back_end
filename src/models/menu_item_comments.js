import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

class MenuItemComment extends Model {
  static associate(models) {
    MenuItemComment.belongsTo(models.MenuItem, {
      foreignKey: 'item_id',
      as: 'commented_item', // đổi alias từ 'menu_item'
      onDelete: 'CASCADE',
    });
    MenuItemComment.belongsTo(models.Customer, {
      foreignKey: 'customer_id',
      as: 'commenter', // đổi alias từ 'customer'
      onDelete: 'CASCADE',
    });
  }
}


MenuItemComment.init(
  {
    comment_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'menu_items',
        key: 'item_id',
      },
      onDelete: 'CASCADE',
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customers',
        key: 'customer_id',
      },
      onDelete: 'CASCADE',
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
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
    modelName: 'MenuItemComment',
    tableName: 'menu_item_comments',
    timestamps: true,
    underscored: true,
  }
);

export default MenuItemComment;
