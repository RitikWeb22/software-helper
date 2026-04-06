import dotenv from "dotenv";

dotenv.config();

export const CONFIG = {
  geminiKey: process.env.GEMINI_API_KEY || "",
  openAiKey: process.env.OPENAI_API_KEY || "",
  mistralAiKey: process.env.MISTRALAI_API_KEY || "",
  cohereKey: process.env.COHERE_API_KEY || "",
};
