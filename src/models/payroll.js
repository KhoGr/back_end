import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

class Payroll extends Model {
  static associate(models) {
    Payroll.belongsTo(models.Staff, {
      foreignKey: 'staff_id',
      as: 'staff',
      onDelete: 'CASCADE',
    });
  }
}

Payroll.init(
  {
    payroll_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    staff_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Staffs',
        key: 'staff_id',
      },
      onDelete: 'CASCADE',
    },
    period_start: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    period_end: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    total_hours: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    total_salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('pending', 'paid'),
      defaultValue: 'pending',
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'payrolls',
    modelName: 'Payroll',
    timestamps: true,
    underscored: true,
  }
);

export default Payroll;
