import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
class Product extends Model {
    static associate(models){
        Product.belongsTo(models.Category,{
            foreignKey:"category_id",
            as:"category",
            onDelete:"CASCADE",
        });
    }
}
Product.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "categories",
      key: "id",
    },
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },

  description: {

    type: DataTypes.TEXT,
  },
  price: {
    type: DataTypes.DECIMAL,
  },
  serving_size: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING(255),
  },
  stock_quantity:{
    type:DataTypes.INTEGER,
    defaultValue:10,
  },
  is_available:{
    type:DataTypes.BOOLEAN,
    defaultValue:true,
  },
  is_buffet:{
    type:DataTypes.BOOLEAN,
    defaultValue:false,
  },
  discount:{
    type:DataTypes.DECIMAL(10,2),
    defaultValue:0,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },

},{
    sequelize,
    tableName:"Products",
    modelName:"Product",
    timestamps:true,
    underscored:true,
});
export default Product;

