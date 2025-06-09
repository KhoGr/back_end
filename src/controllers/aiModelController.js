import * as AIModelService from '../service/aiModelService.js';

/**
 * GET /models/get
 * Lấy danh sách toàn bộ AI model
 */
export const listModels = async (req, res) => {
  try {
    const models = await AIModelService.getAllModels();
    res.json(models);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /models/get/:id
 * Lấy chi tiết model theo ID
 */
export const getModel = async (req, res) => {
  try {
    const model = await AIModelService.getModelById(req.params.id);
    res.json(model);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/**
 * POST /models/create
 * Tạo một model mới (chỉ admin)
 */
export const createModel = async (req, res) => {
  try {
    const newModel = await AIModelService.createModel(req.body);
    res.status(201).json(newModel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * PUT /models/update/:id
 * Cập nhật một model theo ID (chỉ admin)
 */
export const updateModel = async (req, res) => {
  try {
    const updatedModel = await AIModelService.updateModel(req.params.id, req.body);
    res.json(updatedModel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * DELETE /models/delete/:id
 * Xoá một model theo ID (chỉ admin)
 */
export const removeModel = async (req, res) => {
  try {
    const result = await AIModelService.deleteModel(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
