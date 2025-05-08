import { Model, DataTypes, AssociationError } from "sequelize";
import { sequelize } from "../config/database.js";
class Order extends Model {
  static Associate(models) {
    Order.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
      onDelete: "CASCADE",
    });
  }
}
Order.init({
  order_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
    total_price:{
      type:DataTypes.DECIMAL(10,2),
      allowNull:false,
    },
    order_status:{
     type:DataTypes.ENUM('pending', 'completed', 'shipped', 'cancelled'),
     defaultValue:'pending',
    },
    shipping_adress:{
      type :DataTypes.TEXT,
      allowNull:true,

    },
    payment_method:{
      type: DataTypes.ENUM('COD','ONLINE','OFFLINE'),
      defaultValue:'ONLINE'
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
});

