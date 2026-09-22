import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = 'qwen/qwen3.8-27b';

export const generateStructured = async (prompt: string, schema: any) => {
  const sysPrompt = `You are a helpful assistant. You must output ONLY valid JSON that adheres strictly to this JSON schema:\n${JSON.stringify(schema, null, 2)}`;
  
  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: sysPrompt },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" },
    temperature: 0.2,
  });
  
  const text = response.choices[0]?.message?.content;
  if (text) {
    try {
      return JSON.parse(text);
    } catch (e) {
      throw new Error("Failed to parse LLM response JSON");
    }
  }
  throw new Error("No response from LLM");
};

export const generateText = async (prompt: string) => {
  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "user", content: prompt }
    ],
    temperature: 0.2,
  });
  return response.choices[0]?.message?.content || "";
};
