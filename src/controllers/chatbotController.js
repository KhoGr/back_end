import {
  handleUserQuery,
  addResponse,
  updateResponse,
  deleteResponse,
  getAllResponses
} from '../service/gptService.js';

// Xử lý khi người dùng gửi câu hỏi
export async function handleQuery(req, res) {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Missing message' });

    const reply = await handleUserQuery(message);
    res.json({ reply });
  } catch (error) {
    console.error('handleQuery error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Thêm response mới (admin dùng)
export async function createResponse(req, res) {
  try {
    const { keyword, response, category, ai_model_id,item_id } = req.body;
    if (!keyword || !response || !category)
      return res.status(400).json({ error: 'Missing required fields' });

    const newResponse = await addResponse({ keyword, response, category, ai_model_id,item_id });
    res.status(201).json(newResponse);
  } catch (error) {
    console.error('createResponse error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Sửa response
export async function editResponse(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await updateResponse(id, updates);
    res.json(updated);
  } catch (error) {
    console.error('editResponse error:', error.message);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}

// Xoá response
export async function removeResponse(req, res) {
  try {
    const { id } = req.params;

    const result = await deleteResponse(id);
    res.json(result);
  } catch (error) {
    console.error('removeResponse error:', error.message);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}

// Lấy tất cả responses (admin dùng)
export async function listResponses(req, res) {
  try {
    const responses = await getAllResponses();
    res.json(responses);
  } catch (error) {
    console.error('listResponses error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
