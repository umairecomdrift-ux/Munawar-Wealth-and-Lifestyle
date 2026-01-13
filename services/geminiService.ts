
import { GoogleGenAI, Type } from "@google/genai";
import { Framework, GroundingSource } from "../types";

export const generateFramework = async (
  topic: string
): Promise<{ framework: Framework; sources: GroundingSource[] }> => {
  const apiKey = process.env.API_KEY;
  
  // Explicitly check for empty or undefined string shims
  if (!apiKey || apiKey === 'undefined' || apiKey === '') {
    throw new Error("API Key not found. Please click 'Priority Key' in the top right to provide an active key.");
  }

  // Create a new GoogleGenAI instance right before making an API call to ensure it uses the most up-to-date API key.
  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    // Using gemini-3-pro-preview for complex reasoning and architectural tasks as per guidelines.
    model: 'gemini-3-pro-preview',
    contents: `Architect a wisdom framework for: "${topic}"`,
    config: {
      systemInstruction: "You are Munawar, a Wealth, Wisdom & Lifestyle Architect. Your tone is professional, sophisticated, and deeply rational. Focus on 20-50 year horizons and systemic logic. Provide data-driven advice. Avoid buzzwords and hype.",
      temperature: 0.2, // Low temperature for factual consistency and rational output
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
      // googleSearch tool is used for grounding; relevant URLs are extracted and displayed in the UI.
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text;
  if (!text) throw new Error("Architectural reasoning stream was interrupted.");
  
  let jsonStr = text.trim();
  if (jsonStr.startsWith('```json')) {
    jsonStr = jsonStr.replace(/^```json\n?/, '').replace(/\n?```$/, '');
  }
  
  const framework: Framework = JSON.parse(jsonStr);
  const sources: GroundingSource[] = [];
  // Extract website URLs from groundingMetadata as required when using the googleSearch tool.
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
