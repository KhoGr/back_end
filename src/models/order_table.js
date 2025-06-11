import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

class OrderTable extends Model {
  static associate(models) {
    OrderTable.belongsTo(models.Order, {
      foreignKey: 'order_id',
      as: 'order',
      onDelete: 'CASCADE',
    });

    OrderTable.belongsTo(models.Table, {
      foreignKey: 'table_id',
      as: 'table',
      onDelete: 'CASCADE',
    });
  }
}

OrderTable.init(
  {
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id',
      },
      primaryKey: true,
    },
    table_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tables',
        key: 'id',
      },
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: 'OrderTable',
    tableName: 'order_table',
    timestamps: false,
    underscored: true,
  }
);

export default OrderTable;
