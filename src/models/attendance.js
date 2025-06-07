import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

class Attendance extends Model {
  static associate(models) {
    Attendance.belongsTo(models.Staff, {
      foreignKey: 'staff_id',
      as: 'staff',
      onDelete: 'CASCADE',
    });

    Attendance.belongsTo(models.WorkShift, {
      foreignKey: 'work_shift_id',
      as: 'work_shift',
      onDelete: 'SET NULL',
    });
  }
}

Attendance.init(
  {
    attendance_id: {
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
    work_shift_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'WorkShifts',
        key: 'work_shift_id',
      },
      onDelete: 'SET NULL',
    },
    check_in_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    check_out_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    hours_worked: {
  type: DataTypes.FLOAT,
  allowNull: true, 
  defaultValue: 0,
},
    status: {
      type: DataTypes.ENUM('present', 'late', 'absent', 'on_leave'),
      defaultValue: 'present',
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'Attendances',
    modelName: 'Attendance',
    timestamps: true,
    underscored: true,
  }
);

export default Attendance;
