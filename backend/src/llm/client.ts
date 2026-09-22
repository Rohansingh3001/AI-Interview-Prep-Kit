import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = 'qwen/qwen3.8-27b';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const withRetry = async <T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> => {
  let retries = 0;
  while (true) {
    try {
      return await fn();
    } catch (error: any) {
      if (retries >= maxRetries) throw error;
      
      const isRateLimit = error?.status === 429 || error?.message?.includes('Rate limit');
      if (isRateLimit) {
        let waitMs = 15000; // Default 15 seconds
        // Extract wait time from error message like "Please try again in 36.48s."
        const match = error?.message?.match(/try again in ([\d\.]+)s/);
        if (match && match[1]) {
          waitMs = parseFloat(match[1]) * 1000 + 1000; // Add 1s buffer
        }
        
        console.warn(`Groq rate limit hit. Waiting ${Math.round(waitMs/1000)}s before retry ${retries + 1}/${maxRetries}...`);
        await sleep(waitMs);
        retries++;
      } else {
        throw error;
      }
    }
  }
};

export const generateStructured = async (prompt: string, schema: any) => {
  return withRetry(async () => {
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
  });
};

export const generateText = async (prompt: string) => {
  return withRetry(async () => {
    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
    });
    return response.choices[0]?.message?.content || "";
  });
};
