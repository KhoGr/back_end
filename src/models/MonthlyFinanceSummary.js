import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

class MonthlyFinanceSummary extends Model {
  static associate(models) {
  }
}

MonthlyFinanceSummary.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    month: {
      type: DataTypes.STRING(7),
      allowNull: false,
      unique: true,
      validate: {
        is: /^\d{4}-\d{2}$/,
      },
    },
    total_revenue: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    total_payroll: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    total_orders: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    total_material_cost: { 
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'monthly_finance_summaries',
    modelName: 'MonthlyFinanceSummary',
    timestamps: true,
    underscored: true,
  }
);

export default MonthlyFinanceSummary;
