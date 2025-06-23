import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import models from "../models/index.js";
import { Op } from "sequelize";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const stringSimilarity = require('string-similarity');

dotenv.config();
const { MenuItem, ChatbotResponse } = models;

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

function extractKeyword(text) {
  const keywords = ['menu', 'hours', 'reservation', 'location', 'payment', 'delivery'];
  const lowerText = text.toLowerCase();
  const found = keywords.find(kw => lowerText.includes(kw)) || null;
  return found;
}

async function findMenuItemByPrice(text) {
  const priceMatch = text.match(/(?:dưới|nhỏ hơn|ít hơn)\s*(\d+)(?:k|000)?/i);
  if (priceMatch) {
    const maxPrice = parseInt(priceMatch[1]) * (text.includes('k') ? 1000 : 1);
    return await MenuItem.findAll({
      where: {
        is_available: true,
        price: { [Op.lte]: maxPrice },
      },
      order: [['price', 'DESC']],
      limit: 5,
    });
  }
  return [];
}


// ------------------------------
export async function handleUserQuery(userInput) {
  try {
    const inputLower = userInput.toLowerCase();

    const allResponses = await ChatbotResponse.findAll({
      include: {
        model: MenuItem,
        as: 'menu_item',
        attributes: ['item_id', 'name', 'price'],
      },
    });

    const keywordList = allResponses.map(r => r.keyword);
    const bestMatch = stringSimilarity.findBestMatch(inputLower, keywordList).bestMatch;

    if (bestMatch.rating > 0.5) {
      const matched = allResponses.find(r => r.keyword === bestMatch.target);
      if (matched) {
        console.log(`✅ Match found in DB (similarity: ${bestMatch.rating}): "${matched.keyword}"`);

        if (matched.menu_item) {
          const { name, price } = matched.menu_item;
          return `${matched.response} Món "${name}" hiện có giá ${parseInt(price).toLocaleString()}đ.`;
        }

        return matched.response;
      }
    }

    // Nếu không match keyword, thử tìm món theo giá
const cheapItems = await findMenuItemByPrice(userInput);
if (cheapItems.length > 0) {
  const suggestions = cheapItems.map(item => `- ${item.name} (${parseInt(item.price).toLocaleString()}đ)`).join('\n');
  return `Dưới đây là một số món bạn có thể thử:\n${suggestions}`;
}

    // Không tìm được gì -> fallback sang GPT
    const gptResponse = await openai.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: 'Bạn là một nhân viên nhà hàng. Trả lời khách hàng ngắn gọn, lịch sự.' },
        { role: 'user', content: userInput },
      ],
    });

    const reply = gptResponse.choices[0].message.content;

    await ChatbotResponse.create({
      keyword: inputLower.slice(0, 32),
      response: reply,
      category: 'gpt_generated',
      ai_model_id: 'llama3-8b-8192',
    });

    return reply;
  } catch (err) {
    console.error(`handleUserQuery error:`, err.message);
    throw err;
  }
}



export async function addResponse({ keyword, response, category, ai_model_id, item_id }) {
  console.log('Creating response with:', {
    keyword,
    response,
    category,
    ai_model_id,
    item_id,
  });

  return await ChatbotResponse.create({
    keyword,
    response,
    category,
    ai_model_id,
    menu_item_id: item_id || null, 
  });
}


// ------------------------------
// Cập nhật câu trả lời
export async function updateResponse(id, updates) {
  const response = await ChatbotResponse.findByPk(id);
  if (!response) throw new Error('Response not found');
  return await response.update(updates);
}

// ------------------------------
// Xoá câu trả lời
export async function deleteResponse(id) {
  const response = await ChatbotResponse.findByPk(id);
  if (!response) throw new Error('Response not found');
  await response.destroy();
  return { success: true };
}

// ------------------------------
// Lấy toàn bộ responses (cho admin FE)
export async function getAllResponses() {
  return await ChatbotResponse.findAll({
    order: [['created_at', 'DESC']],
  });
}
