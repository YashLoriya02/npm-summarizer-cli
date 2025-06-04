import fs from 'fs/promises';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv'
dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

const buildPrompt = (code, mode = "file", userPrompt = "") => {
  if (mode === "file") {
    return `🔍 Summarize the purpose and key logic of the following file. Use bullet points and use less emojis to make it engaging:\n\n\`\`\`js\n${code}\n\`\`\``;
  }
  if (mode === "function") {
    return `🧠 Explain this function in detail using less emojis and examples if needed:\n\n\`\`\`js\n${code}\n\`\`\``;
  }
  return `🧠 Summarize this prompt instruction using less emojis:\n"${userPrompt}"`;
};

const getGeminiResponse = async (finalPrompt) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(finalPrompt);
  const response = result.response;
  return response.text();
};

export async function summarizePrompt(promptText) {
  const finalPrompt = buildPrompt(null, "prompt", promptText);
  return await getGeminiResponse(finalPrompt);
}

export async function summarizeFile(filePath) {
  const code = await fs.readFile(filePath, 'utf-8');
  const finalPrompt = buildPrompt(code, "file");
  return await getGeminiResponse(finalPrompt);
}

export async function summarizeFunction(code) {
  const finalPrompt = buildPrompt(code, "function");
  return await getGeminiResponse(finalPrompt);
}
