import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database.js"; 
class Order extends Model{

}




/*Table Orders {
    id INT [pk, increment, not null]
    user_id INT [ref: > Users.user_id, not null]
    total_price DECIMAL(10, 2) [not null]
    order_status ENUM('pending', 'completed', 'shipped', 'cancelled') [default: 'pending']
    shipping_address TEXT
    payment_method ENUM('COD', 'online') [default: 'COD']
    created_at TIMESTAMP [default: 'CURRENT_TIMESTAMP']
    updated_at TIMESTAMP [default: 'CURRENT_TIMESTAMP']
  }*/