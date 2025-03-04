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
/*id INT [pk, increment, not null]
category_id INT [ref: > Categories.id, not null]   // Danh mục món ăn
name VARCHAR(255) [not null]  // Tên món ăn
description TEXT
price DECIMAL(10,2) [not null]  // Giá món ăn (Buffet = giá mỗi người)
serving_size INT [not null]   // Số người ăn (Buffet mặc định 1)
image VARCHAR(255)  // Ảnh món ăn
stock_quantity INT [default: 10]   // Số lượng nguyên liệu còn trong kho
is_available BOOLEAN [default: true]  // Còn hàng / Hết hàng
is_buffet BOOLEAN [default: false]  // Xác định món có phải buffet không
discount DECIMAL(10,2) [default: 0]  // Khuyến mãi nếu có
created_at TIMESTAMP [default: 'CURRENT_TIMESTAMP']
updated_at TIMESTAMP [default: 'CURRENT_TIMESTAMP']*/
