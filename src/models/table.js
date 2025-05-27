import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

class Table extends Model {
  static associate(models) {
    Table.hasMany(models.Order, {
      foreignKey: 'table_id',
      as: 'orders',
      onDelete: 'SET NULL',
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
      unique: true,
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
