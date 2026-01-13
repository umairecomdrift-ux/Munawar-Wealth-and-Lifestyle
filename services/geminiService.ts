
import { GoogleGenAI, Type } from "@google/genai";
import { Framework, GroundingSource } from "../types";

export const generateFramework = async (
  topic: string
): Promise<{ framework: Framework; sources: GroundingSource[] }> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please use the Priority Key button to provide a valid key.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze and architect a framework for: "${topic}"`,
    config: {
      systemInstruction: "You are Munawar, a Wealth, Wisdom & Lifestyle Architect and long-term investor. Your tone is professional, sophisticated, and insightful. Provide data-driven, rational advice. Focus on 20-50 year horizons and systemic logic. Avoid buzzwords and hype.",
      temperature: 0.2, // Lower temperature for consistency and rationality
      topP: 0.95,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topicSummary: { type: Type.STRING, description: "One-sentence thesis." },
          topicContext: { type: Type.STRING, description: "Systemic context." },
          coreFrameworks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                points: { type: Type.ARRAY, items: { type: Type.STRING } },
                logic: { type: Type.STRING, description: "The logical formula." }
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
          longTermPerspective: { type: Type.STRING, description: "Decadal outlook." }
        },
        required: ["topicSummary", "topicContext", "coreFrameworks", "mentalModels", "decisionRules", "lifestyleTradeOffs", "longTermPerspective"]
      },
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text;
  if (!text) throw new Error("Architectural data stream interrupted.");
  
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
