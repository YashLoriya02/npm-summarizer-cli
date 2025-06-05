import fs from 'fs/promises';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv'
dotenv.config()


const buildPrompt = (code, mode = "file", userPrompt = "") => {
  if (mode === "file") {
    return `🔍 Summarize the purpose and key logic of the following file. Use bullet points and use less emojis to make it engaging:\n\n\`\`\`js\n${code}\n\`\`\``;
  }
  if (mode === "function") {
    return `🧠 Explain this function in detail using less emojis and examples if needed:\n\n\`\`\`js\n${code}\n\`\`\``;
  }
  return `🧠 Summarize this prompt instruction using less emojis:\n"${userPrompt}"`;
};

const getGeminiResponse = async (finalPrompt, key) => {
  if (!key) {
    console.log("\nAPI Key not passed")
    return
  }
  const genAI = new GoogleGenerativeAI(key);
  // const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const model = genAI.getGenerativeModel({ model: "gemini-1.5" });
  const result = await model.generateContent(finalPrompt);
  const response = result.response;
  return response.text();
};

export async function summarizePrompt(promptText, key) {
  const finalPrompt = buildPrompt(null, "prompt", promptText);
  return await getGeminiResponse(finalPrompt, key);
}

export async function summarizeFile(filePath, key) {
  const code = await fs.readFile(filePath, 'utf-8');
  const finalPrompt = buildPrompt(code, "file");
  return await getGeminiResponse(finalPrompt, key);
}

export async function summarizeFunction(code, key) {
  const finalPrompt = buildPrompt(code, "function");
  return await getGeminiResponse(finalPrompt, key);
}
