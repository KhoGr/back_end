import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

class WorkShift extends Model {
  static associate(models) {
    WorkShift.belongsTo(models.Staff, {
      foreignKey: 'staff_id',
      as: 'staff',
      onDelete: 'CASCADE',
    });

    WorkShift.hasMany(models.Attendance, {
      foreignKey: 'work_shift_id',
      as: 'attendances',
    });
  }
}

WorkShift.init(
  {
    work_shift_id: {
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
    shift_type: {
      type: DataTypes.ENUM('morning', 'afternoon', 'evening', 'full_day'),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'workshifts',
    modelName: 'WorkShift',
    timestamps: true,
    underscored: true,
  }
);

export default WorkShift;
