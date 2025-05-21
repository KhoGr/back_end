// models/reservations.js
//đặt chỗ trước
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

class Reservation extends Model {
  static associate(models) {
    Reservation.belongsTo(models.Customer, {
      foreignKey: 'customer_id',
      as: 'customer',
      onDelete: 'CASCADE',
    });

    Reservation.belongsTo(models.Table, {
      foreignKey: 'table_id',
      as: 'table',
      onDelete: 'SET NULL',
    });
  }
}

Reservation.init(
  {
    reservation_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    table_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tables',
        key: 'table_id',
      },
      onDelete: 'SET NULL',
    },
    reservation_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    guest_count: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'confirmed', 'canceled']],
      },
    },
    note: {
      type: DataTypes.TEXT,
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
    modelName: 'Reservation',
    tableName: 'reservations',
    timestamps: false,
    underscored: true,
  }
);

export default Reservation;
