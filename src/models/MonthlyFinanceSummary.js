import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

class MonthlyFinanceSummary extends Model {
  // Nếu sau này cần liên kết thì có thể khai báo tại đây
  static associate(models) {
    // Không có liên kết nào lúc này
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
      type: DataTypes.STRING(7), // VD: "2025-06"
      allowNull: false,
      unique: true,
      validate: {
        is: /^\d{4}-\d{2}$/, // định dạng YYYY-MM
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
