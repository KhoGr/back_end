import { Op } from "sequelize";
import Table from "../models/table.js"; // Đảm bảo có .js nếu dùng ES module

export const getAllTables = async () => {
  return await Table.findAll();
};

export const getTableById = async (tableId) => {
  const table = await Table.findByPk(tableId);
  if (!table) {
    throw new Error("Table not found");
  }
  return table;
};

export const createTable = async (data) => {
  const { table_number } = data;
  const existing = await Table.findOne({ where: { table_number } });
  if (existing) {
    throw new Error("Table number already exists");
  }
  return await Table.create(data);
};

export const updateTable = async (tableId, updates) => {
  const table = await Table.findByPk(tableId);
  if (!table) {
    throw new Error("Table not found");
  }
  await table.update(updates);
  return table;
};

export const deleteTable = async (tableId) => {
  console.log(tableId)
  const table = await Table.findByPk(tableId);
  if (!table) {
    console.log("ko nhận được ID")
    throw new Error("Table not found");
  }
  await table.destroy();
  return { message: "Table deleted successfully" };
};

export const findTablesByStatus = async (status) => {
  return await Table.findAll({ where: { status } });
};

export const bookTable = async (tableId) => {
  const table = await Table.findByPk(tableId);
  if (!table) throw new Error("Table not found");

  if (table.status === "booked") {
    throw new Error("Table is already booked");
  }

  await table.update({ status: "booked" });
  return table;
};
