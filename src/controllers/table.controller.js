import * as TableService from "../service/table.service.js"

export const getAllTables = async (req, res) => {
  try {
    const tables = await TableService.getAllTables();
    res.status(200).json({ success: true, data: tables });
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch tables" });
  }
};

export const getTableById = async (req, res) => {
  try {
    const table = await TableService.getTableById(req.params.id);
    res.status(200).json({ success: true, data: table });
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch table" });
  }
};

export const createTable = async (req, res) => {
  try {
    const newTable = await TableService.createTable(req.body);
    res.status(201).json({ success: true, data: newTable });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to create table" });
  }
};

export const updateTable = async (req, res) => {
  try {
    const updatedTable = await TableService.updateTable(req.params.id, req.body);
    res.status(200).json({ success: true, data: updatedTable });
  } catch {
    res.status(500).json({ success: false, message: "Failed to update table" });
  }
};

export const deleteTable = async (req, res) => {
  try {
    const result = await TableService.deleteTable(req.params.id);
    res.status(200).json({ success: true, message: result.message });
  } catch {
    res.status(500).json({ success: false, message: "Failed to delete table" });
  }
};

// 🔁 Realtime Đặt bàn
export const bookTable = async (req, res) => {
  try {
    const { table_id } = req.body;
    const booked = await TableService.bookTable(table_id);

    // Socket.IO emit: thông báo tới tất cả client
    req.io.emit("table-booked", booked);

    res.status(200).json({ success: true, data: booked });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to book table" });
  }
};
