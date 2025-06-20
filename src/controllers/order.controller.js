import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  searchOrders,
  calculateTotalAmount,
  getOrdersByCustomerId
} from '../service/order.service.js';

const OrderController = {
  // 🆕 Tạo đơn hàng
  async create(req, res) {
    console.log('[OrderController.create] req.body:', JSON.stringify(req.body, null, 2));
    try {
      const order = await createOrder(req.body); // table_ids xử lý trong service
      console.log('[OrderController.create] Order created successfully:', JSON.stringify(order, null, 2));

      // 📤 Phát socket cho tất cả client
      req.io.emit("order-created", order);
      console.log("📤 Emit 'order-created'");

      res.status(201).json({ success: true, data: order });
    } catch (error) {
      console.error('[Create Order] Error object:', error);
      res.status(400).json({ success: false, message: error.message || 'Unknown error' });
    }
  },

  // 📋 Lấy tất cả đơn hàng
  async getAll(req, res) {
    try {
      const orders = await getAllOrders(); // đã include tables trong service
      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      console.error('[Get All Orders]', error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // 🔍 Lấy đơn hàng theo ID
  async getById(req, res) {
    try {
      const order = await getOrderById(req.params.id); // đã include tables trong service
      res.status(200).json({ success: true, data: order });
    } catch (error) {
      console.error('[Get Order By ID]', error.message);
      res.status(404).json({ success: false, message: error.message });
    }
  },

  // 🔁 Cập nhật đơn hàng
  async update(req, res) {
    const { id } = req.params;
    const updates = req.body;

    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ success: false, message: 'No valid update payload provided' });
    }

    try {
      const updatedOrder = await updateOrder(id, updates); // xử lý table_ids trong service

      // 📤 Gửi socket cập nhật đơn hàng
      const senderSocketId = req.headers['x-socket-id'];
      req.io.sockets.sockets.forEach((socket) => {
        if (socket.id !== senderSocketId) {
          socket.emit("order-updated", updatedOrder);
        }
      });
      console.log("📤 Emit 'order-updated'");

      res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
      console.error('[Update Order]', error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // ❌ Xoá đơn hàng
  async remove(req, res) {
    try {
      await deleteOrder(req.params.id);
      res.status(200).json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
      console.error('[Delete Order]', error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // 🔍 Tìm kiếm/lọc đơn hàng
  async search(req, res) {
    try {
      const result = await searchOrders(req.query);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error('[Search Orders]', error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // 🔄 Tính lại tổng tiền đơn hàng
  async recalculateTotal(req, res) {
    try {
      const total = await calculateTotalAmount(req.params.id);
      res.status(200).json({ success: true, total });
    } catch (error) {
      console.error('[Recalculate Total]', error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  },
async getByCustomerId(req, res) {
  try {
    const { customer_id  } = req.params;

    console.log("[GetByCustomerId] customerId param:", customer_id, "Type:", typeof customer_id );

    if (!customer_id || isNaN(Number(customer_id))) {
      console.warn("[GetByCustomerId] ❌ Invalid customer ID:", customer_id );
      return res.status(400).json({ success: false, message: 'Invalid customer ID' });
    }

    const orders = await getOrdersByCustomerId(Number(customer_id ));
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('[GetByCustomerId] ❌ Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
},

};

export default OrderController;
