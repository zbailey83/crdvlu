import { GoogleGenAI } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeCardValue = async (base64Image: string): Promise<AnalysisResult> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Split the base64 string to get the actual data
    // Format: "data:image/jpeg;base64,..."
    const base64Data = base64Image.split(',')[1];
    const mimeType = base64Image.split(';')[0].split(':')[1] || 'image/jpeg';

    const prompt = `
      Identify the sports card in this image with high precision.
      Include the Player Name, Year, Set, Card Number, and any variation (e.g., Refractor, Holo, Base).
      
      Then, search for current market listings and recently sold prices (eBay, PWCC, Goldin, 130point, etc.) for this specific card.
      Assume the card is in Raw/Ungraded Near Mint condition unless it is clearly inside a graded slab (PSA, BGS, SGC).
      
      Provide a response formatted nicely in Markdown:
      1. **Card Identity**: The full specific name of the card.
      2. **Estimated Value Range**: A realistic low and high price range in USD.
      3. **Market Analysis**: A brief explanation of the value based on recent sales found.
      4. **Condition Note**: Mention if you priced it as Raw or Graded based on the image.
      
      Be concise but accurate.
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
        // Note: responseMimeType is NOT allowed when using googleSearch
      },
    });

    const text = response.text || "Could not analyze the image. Please try again.";
    
    // Extract grounding chunks if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      text,
      groundingChunks,
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze card. Please try again.");
  }
};
