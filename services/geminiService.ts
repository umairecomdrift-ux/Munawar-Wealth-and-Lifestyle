
import { GoogleGenAI } from "@google/genai";
import { Framework, GroundingSource } from "../types";

export const generateFramework = async (
  topic: string
): Promise<{ framework: Framework; sources: GroundingSource[] }> => {
  // Always create a new instance to pick up the latest API_KEY (especially after using openSelectKey)
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `As Munawar, Wealth & Wisdom Architect, generate a comprehensive intellectual framework for: "${topic}". 
    Output strictly as JSON matching this structure:
    {
      "topicSummary": "A punchy, profound 1-sentence summary of the core thesis.",
      "topicContext": "2-3 sentences explaining the systemic context and why this matters for long-term thinkers.",
      "coreFrameworks": [
        {
          "name": "Framework Name (e.g., The Asymmetric Risk Engine)",
          "points": ["Insight 1", "Insight 2", "Insight 3"],
          "logic": "The underlying formula or logical progression (e.g., Input -> Filtering -> Compounding)"
        }
      ],
      "mentalModels": [
        {
          "name": "Classic or Custom Model Name",
          "application": "How to specifically use this model for this topic."
        }
      ],
      "decisionRules": ["Strict IF/THEN rule for practical application"],
      "lifestyleTradeOffs": [
        {
          "tradeOff": "Benefit A vs. Cost B",
          "reality": "The brutal, honest truth about what you must sacrifice to gain this."
        }
      ],
      "longTermPerspective": "A closing thought on how this topic looks on a 20-50 year horizon."
    }
    Tone: Calm, Deeply Rational, Minimalist, Authoritative. Avoid hype and buzzwords.`,
    config: {
      responseMimeType: "application/json",
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text;
  if (!text) throw new Error("No architectural data returned from the model.");
  
  const framework: Framework = JSON.parse(text);
  
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
