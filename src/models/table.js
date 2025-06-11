import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

class Table extends Model {
  static associate(models) {


    // N-N quan hệ nhiều bàn cho 1 order
    Table.belongsToMany(models.Order, {
      through: 'OrderTable',
      as: 'multi_orders', // ⚠️ tên khác để phân biệt
      foreignKey: 'table_id',
    });
  }
}

Table.init(
  {
    table_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    table_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    floor: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    seat_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('available', 'occupied', 'reserved', 'unavailable'),
      defaultValue: 'available',
    },
  },
  {
    sequelize,
    modelName: 'Table',
    tableName: 'tables',
    timestamps: false,
    underscored: true,
  }
);

export default Table;
