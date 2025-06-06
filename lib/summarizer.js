import fs from 'fs/promises';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv'
dotenv.config()

const buildPrompt = (code, mode = "file", userPrompt = "") => {
  const baseInstructions = `
You are an expert code analyst and technical documentation specialist. Your task is to provide clear, comprehensive, and well-structured analysis.

IMPORTANT FORMATTING RULES:
- Use clean markdown formatting
- Start with a brief 1-2 sentence overview
- Use bullet points for detailed explanations
- Include code examples when helpful
- Keep explanations concise but thorough
- Use minimal emojis (max 2-3 per response)
- Structure your response logically with clear sections
`;

  if (mode === "file") {
    return `${baseInstructions}

TASK: Analyze and summarize the provided code file.

USER INSTRUCTIONS: ${userPrompt || "Provide a comprehensive analysis"}

Please provide your analysis in the following structure:

## 📋 Overview
[Brief 1-2 sentence summary of what this file does]

## 🔧 Key Functionality
[Bullet points of main features/functions]

## 💡 Important Details
[Notable patterns, algorithms, or implementation details]

## 🔗 Dependencies & Integrations
[External libraries, APIs, or modules used]

## 🎯 Use Cases
[When and why this code would be used]

CODE TO ANALYZE:
\`\`\`javascript
${code}
\`\`\`

Remember to follow the user instructions: "${userPrompt}"
Focus on being helpful, accurate, and thorough in your response and don't give much longer responses. 
Responses should be not more than 100 words, just like short and simple.
`;
  }

  if (mode === "function") {
    return `${baseInstructions}

TASK: Analyze and explain the provided function in detail.

USER INSTRUCTIONS: ${userPrompt || "Provide a detailed function analysis"}

Please provide your analysis in the following structure:

## 🎯 Function Purpose
[What this function does in 1-2 sentences]

## 📥 Parameters
[List and explain each parameter]

## 📤 Return Value
[What the function returns and its type]

## ⚙️ How It Works
[Step-by-step breakdown of the function logic]

## 💡 Key Implementation Details
[Important algorithms, patterns, or logic]

## 🔍 Example Usage
[Show how this function would be called with example inputs/outputs]

## ⚠️ Edge Cases & Considerations
[Potential issues, limitations, or special cases]

FUNCTION TO ANALYZE:
\`\`\`javascript
${code}
\`\`\`

Remember to follow the user instructions: "${userPrompt}"
Focus on being helpful, accurate, and thorough in your response and don't give much longer responses. 
Responses should be not more than 100 words, just like short and simple.
`;
  }

  return `${baseInstructions}
TASK: Process and respond to the user's custom prompt/instruction.

USER PROMPT: "${userPrompt}"

Please provide a comprehensive and well-structured response that directly addresses the user's request. Use clear formatting, relevant examples, and actionable insights where appropriate.

Structure your response logically with:
- Clear headings for different sections
- Bullet points for lists or steps
- Code examples if relevant
- Practical recommendations or next steps

Focus on being helpful, accurate, and thorough in your response and don't give much longer responses. 
Responses should be not more than 100 words, just like short and simple.
`;
};

const getGeminiResponse = async (finalPrompt, key) => {
  if (!key) {
    console.log("\nAPI Key not passed")
    return
  }
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.3,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 2048,
    }
  });
  const result = await model.generateContent(finalPrompt);
  const response = result.response;
  return response.text();
};

export async function summarizePrompt(promptText, key) {
  const finalPrompt = buildPrompt(null, "prompt", promptText);
  return await getGeminiResponse(finalPrompt, key);
}

export async function summarizeFile(filePath, key, prompt) {
  const code = await fs.readFile(filePath, 'utf-8');
  const finalPrompt = buildPrompt(code, "file", prompt);
  return await getGeminiResponse(finalPrompt, key);
}

export async function summarizeFunction(code, key, prompt) {
  const finalPrompt = buildPrompt(code, "function", prompt);
  return await getGeminiResponse(finalPrompt, key);
}
