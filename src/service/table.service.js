import { Op } from "sequelize";
import Table from "../models/table.js";

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
  const { table_number, floor } = data;

  const existing = await Table.findOne({
    where: {
      table_number,
      floor,
    },
  });

  if (existing) {
    throw new Error("Số bàn này đã tồn tại ở tầng đã chọn.");
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
