import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

class ComboItem extends Model {
  static associate(models) {
    ComboItem.belongsTo(models.MenuItem, {
      foreignKey: "combo_id",
      as: "combo",
      onDelete: "CASCADE",
    });

    ComboItem.belongsTo(models.MenuItem, {
      foreignKey: "item_id",
      as: "item",
      onDelete: "CASCADE",
    });
  }
}

ComboItem.init(
  {
    combo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "menu_items",
        key: "item_id",
      },
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "menu_items",
        key: "item_id",
      },
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    tableName: "combo_items",
    modelName: "ComboItem",
    timestamps: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["combo_id", "item_id"], // Composite key
      },
    ],
  }
);

export default ComboItem;
