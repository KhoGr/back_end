import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
class Table extends Model {}

Table.init({
  table_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  table_number: {
    type: DataTypes.INTEGER,
    unique: true,
  },
  capacity: {
    type: DataTypes.INTEGER,
    defaultValue: 4,
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: "avaliable",
    validate: {
      isIn: [["available", "occupied", "reserved"]],
    },
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
    modelName: 'Table',
    tableName: 'Tables',
    timestamps: false, // vì đã có created_at/pai̇d_at riêng
    underscored: true, 
}
);
export default Table;
