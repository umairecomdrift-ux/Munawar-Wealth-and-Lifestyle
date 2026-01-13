
import { GoogleGenAI, Type } from "@google/genai";
import { Framework, GroundingSource } from "../types";

/**
 * Generates a sophisticated wisdom framework based on the provided topic.
 * Uses Gemini 3 Flash for fast, efficient architectural reasoning.
 */
export const generateFramework = async (
  topic: string
): Promise<{ framework: Framework; sources: GroundingSource[] }> => {
  // Validate key existence before initialization
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'undefined' || apiKey === '') {
    throw new Error("API Key missing. Please ensure 'VITE_GEMINI_API_KEY' is set in your Netlify site settings and re-deploy.");
  }

  // Correct Initialization: Must use named parameter and process.env.API_KEY directly.
  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    // Using gemini-3-flash-preview for high compatibility and speed.
    model: 'gemini-3-flash-preview',
    contents: `Architect a wisdom framework for: "${topic}"`,
    config: {
      systemInstruction: "You are Munawar, a Wealth, Wisdom & Lifestyle Architect. Your tone is professional, sophisticated, and deeply rational. Focus on 20-50 year horizons and systemic logic. Provide data-driven advice. Avoid buzzwords and hype.",
      temperature: 0.2,
      topP: 0.95,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topicSummary: { type: Type.STRING, description: "One-sentence strategic thesis." },
          topicContext: { type: Type.STRING, description: "Systemic context of the problem." },
          coreFrameworks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                points: { type: Type.ARRAY, items: { type: Type.STRING } },
                logic: { type: Type.STRING, description: "The logical formula or principle behind this module." }
              },
              required: ["name", "points", "logic"]
            }
          },
          mentalModels: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                application: { type: Type.STRING }
              },
              required: ["name", "application"]
            }
          },
          decisionRules: { type: Type.ARRAY, items: { type: Type.STRING } },
          lifestyleTradeOffs: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                tradeOff: { type: Type.STRING },
                reality: { type: Type.STRING }
              },
              required: ["tradeOff", "reality"]
            }
          },
          longTermPerspective: { type: Type.STRING, description: "A decadal outlook on the topic." }
        },
        required: ["topicSummary", "topicContext", "coreFrameworks", "mentalModels", "decisionRules", "lifestyleTradeOffs", "longTermPerspective"]
      },
      tools: [{ googleSearch: {} }],
    },
  });

  // Extract text output using the .text property.
  const text = response.text;
  if (!text) throw new Error("Architectural reasoning stream was interrupted.");
  
  let jsonStr = text.trim();
  if (jsonStr.startsWith('```json')) {
    jsonStr = jsonStr.replace(/^```json\n?/, '').replace(/\n?```$/, '');
  }
  
  const framework: Framework = JSON.parse(jsonStr);
  const sources: GroundingSource[] = [];
  
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (groundingChunks) {
    groundingChunks.forEach((chunk: any) => {
      if (chunk.web) {
        sources.push({
          title: chunk.web.title || "External Intelligence",
          uri: chunk.web.uri
        });
      }
    });
  }

  return { framework, sources };
};
