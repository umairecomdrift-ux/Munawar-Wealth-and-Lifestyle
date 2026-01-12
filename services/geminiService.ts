
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Framework, GroundingSource } from "../types";

export const generateFramework = async (
  topic: string, 
  generateVisual: boolean
): Promise<{ framework: Framework; sources: GroundingSource[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const visualPromptSection = generateVisual 
    ? "Include a 'visualPrompts' array with 1-3 conceptual image prompts for gemini-3-pro-image-preview. Style: Minimal, Abstract, Professional, No people, No luxury symbols, Neutral colors, Diagram-like."
    : "";

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `As Munawar, Wealth & Wisdom Architect, generate a framework for: "${topic}". 
    Output strictly as JSON matching this structure:
    {
      "topicSummary": "Brief summary",
      "topicContext": "Why it matters",
      "coreFrameworks": [{"name": "Name", "points": ["Point 1", "Point 2", "Point 3"], "logic": "cause -> effect -> consequence"}],
      "mentalModels": [{"name": "Model", "application": "How it applies"}],
      "decisionRules": ["Rule 1", "Rule 2"],
      "lifestyleTradeOffs": [{"tradeOff": "X vs Y", "reality": "Brutally honest truth"}],
      "longTermPerspective": "3-4 lines on decades over months",
      "visualPrompts": ["Prompt string"] (optional)
    }
    ${visualPromptSection}
    Tone: Calm, Authoritative, Structured, Practical. No hype.`,
    config: {
      responseMimeType: "application/json",
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text;
  const framework: Framework = JSON.parse(text || "{}");
  
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

export const generateImage = async (prompt: string, size: '1K' | '2K' | '4K'): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: size
      }
    },
  });

  for (const part of response.candidates?.[0].content.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image data found in response");
};

export const editImage = async (base64Image: string, editPrompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const base64Data = base64Image.split(',')[1];
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: 'image/png',
          },
        },
        { text: editPrompt },
      ],
    },
  });

  for (const part of response.candidates?.[0].content.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image data found in response");
};
