import { ChatGoogle } from "@langchain/google";
import { ChatCohere } from "@langchain/cohere";
import { ChatMistralAI } from "@langchain/mistralai";
import { CONFIG } from "../config/model.config.js";
import { ChatGroq } from "@langchain/groq";

export const openAiModel = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  apiKey: CONFIG.openAiKey,
});

export const geminiModel = new ChatGoogle({
  model: "gemini-flash-latest",
  apiKey: CONFIG.geminiKey,
});

export const cohereModel = new ChatCohere({
  model: "command-a-3-25",
  apiKey: CONFIG.cohereKey,
});

export const mistralAiModel = new ChatMistralAI({
  model: "mistral-medium-latest",
  apiKey: CONFIG.mistralAiKey,
});
