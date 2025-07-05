import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

class Order extends Model {
  static associate(models) {
    Order.belongsTo(models.Customer, {
      foreignKey: 'customer_id',
      as: 'customer',
      onDelete: 'CASCADE',
    });

    Order.belongsTo(models.Voucher, {
      foreignKey: 'voucher_id',
      as: 'voucher',
      onDelete: 'SET NULL',
    });

    Order.hasMany(models.OrderItem, {
      foreignKey: 'order_id',
      as: 'order_items',
      onDelete: 'CASCADE',
      hooks: true,
    });

    Order.belongsToMany(models.Table, {
      through: 'OrderTable',
      as: 'tables',
      foreignKey: 'order_id',
    });
  }
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    voucher_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    guest_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    order_type: {
      type: DataTypes.ENUM('reservation', 'dine-in', 'take-away', 'delivery'),
      defaultValue: 'dine-in',
    },
    reservation_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Thời gian khách đặt bàn trước (dùng cho order_type = reservation)',
    },
    delivery_address: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Địa chỉ giao hàng (chỉ dùng khi order_type là delivery)',
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Số điện thoại người đặt hoặc người nhận',
    },
    order_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    discount_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    vip_discount_percent: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0.0,
    },
    shipping_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.0,
    },
    free_shipping_applied: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    final_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
    'pending',     // Mới tạo
    'reserved',    //  Thêm: Đã xác nhận giữ bàn (chỉ reservation)
    'preparing',   // Bếp đang làm
    'served',      // Đã phục vụ
    'delivering',  //  Thêm: Đang giao (delivery)
    'completed',   // Đã thanh toán
    'cancelled',   // Đơn bị hủy
    'refunded'     // Đơn hoàn tiền
      ),
      defaultValue: 'pending',
    },
    payment_method: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    is_paid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    modelName: 'Order',
    tableName: 'orders',
    timestamps: true,
    underscored: true,
  }
);

export default Order;
