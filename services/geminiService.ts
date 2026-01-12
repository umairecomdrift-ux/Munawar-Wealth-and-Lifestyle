
import { GoogleGenAI, Type } from "@google/genai";
import { Framework, GroundingSource } from "../types";

export const generateFramework = async (
  topic: string
): Promise<{ framework: Framework; sources: GroundingSource[] }> => {
  // Use a new instance to ensure we pick up the latest injected API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    // Framework generation is a complex reasoning task, switching to Gemini 3 Pro
    model: 'gemini-3-pro-preview',
    contents: `As Munawar, Wealth & Wisdom Architect, generate a comprehensive intellectual framework for: "${topic}". 
    Tone: Calm, Deeply Rational, Minimalist, Authoritative. Avoid hype and buzzwords.`,
    config: {
      responseMimeType: "application/json",
      // Enforce specific JSON structure with responseSchema
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

  const text = response.text;
  if (!text) throw new Error("Architectural data stream was interrupted.");
  
  // Safely clean potential markdown wrappers before parsing
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
          title: chunk.web.title || "Reference",
          uri: chunk.web.uri
        });
      }
    });
  }

  return { framework, sources };
};
