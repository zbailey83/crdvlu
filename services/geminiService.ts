import { GoogleGenAI } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeCardValue = async (base64Image: string): Promise<AnalysisResult> => {
  try {
    const model = 'gemini-3-flash-preview';
    
    const base64Data = base64Image.split(',')[1];
    const mimeType = base64Image.split(';')[0].split(':')[1] || 'image/jpeg';

    const prompt = `
      Identify the collectible item or sports card in this image with high precision.
      Include the Name, Year, Manufacturer/Set, and any unique features.
      
      Then, search for current market listings and recently sold prices (eBay, specialized auction houses, etc.) for this specific item.
      Provide a concise response in Markdown with:
      1. **Identification**: Precise name and year.
      2. **Est. Value Range**: Realistic USD range for the condition seen.
      3. **Market Context**: Why is it worth this much? (recent trends).
      
      Be professional and helpful.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 0 } // Flash response optimization
      },
    });

    const text = response.text || "Could not analyze the image.";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      text,
      groundingChunks,
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze. Please try again.");
  }
};