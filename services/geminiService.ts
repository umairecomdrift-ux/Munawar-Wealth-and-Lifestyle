
import { GoogleGenAI, Type } from "@google/genai";
import { Framework, GroundingSource } from "../types";

/**
 * Generates a sophisticated wisdom framework based on the provided topic.
 * Uses Gemini 3 Pro for advanced architectural reasoning.
 */
export const generateFramework = async (
  topic: string
): Promise<{ framework: Framework; sources: GroundingSource[] }> => {
  // STRICT REQUIREMENT: Always use process.env.API_KEY directly in initialization.
  // Assume this variable is pre-configured and valid in the execution context.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    // Using gemini-3-pro-preview for complex architectural and reasoning tasks.
    model: 'gemini-3-pro-preview',
    contents: `Architect a wisdom framework for: "${topic}"`,
    config: {
      systemInstruction: "You are Munawar, a Wealth, Wisdom & Lifestyle Architect. Your tone is professional, sophisticated, and deeply rational. Focus on 20-50 year horizons and systemic logic. Provide data-driven advice. Avoid buzzwords and hype.",
      temperature: 0.2,
      topP: 0.95,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topicSummary: { type: Type.STRING },
          topicContext: { type: Type.STRING },
          coreFrameworks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                points: { type: Type.ARRAY, items: { type: Type.STRING } },
                logic: { type: Type.STRING }
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
          longTermPerspective: { type: Type.STRING }
        },
        required: ["topicSummary", "topicContext", "coreFrameworks", "mentalModels", "decisionRules", "lifestyleTradeOffs", "longTermPerspective"]
      },
      tools: [{ googleSearch: {} }],
    },
  });

  // Extracting generated text directly using the .text property.
  const text = response.text;
  if (!text) throw new Error("Architectural reasoning stream was interrupted.");
  
  let jsonStr = text.trim();
  if (jsonStr.startsWith('```json')) {
    jsonStr = jsonStr.replace(/^```json\n?/, '').replace(/\n?```$/, '');
  }
  
  const framework: Framework = JSON.parse(jsonStr);
  const sources: GroundingSource[] = [];
  
  // Extracting website URLs from groundingChunks as per search grounding requirements.
  const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
  if (groundingMetadata?.groundingChunks) {
    groundingMetadata.groundingChunks.forEach((chunk: any) => {
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
