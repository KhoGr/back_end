import AIModel from "../models/AIModel.js";

export const getAllModels = async () => {
  return await AIModel.findAll();
};

export const getModelById = async (id) => {
  const model = await AIModel.findByPk(id);
  if (!model) throw new Error("AI Model not found");
  return model;
};

export const createModel = async (data) => {
  const { id, name, description, specialties, response_style } = data;

  // Kiểm tra trùng ID
  const existing = await AIModel.findByPk(id);
  if (existing) throw new Error("AI Model ID already exists");

  return await AIModel.create({
    id,
    name,
    description,
    specialties,
    response_style,
  });
};

export const updateModel = async (id, data) => {
  const model = await AIModel.findByPk(id);
  if (!model) throw new Error("AI Model not found");

  await model.update(data);
  return model;
};

export const deleteModel = async (id) => {
  const model = await AIModel.findByPk(id);
  if (!model) throw new Error("AI Model not found");

  await model.destroy();
  return { message: "AI Model deleted successfully" };
};
