import { GoogleGenAI } from "@google/genai";
import { DashboardData } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const DASHBOARD_MODEL = "gemini-2.5-flash";
const CHAT_MODEL = "gemini-3-pro-preview";
const IMAGE_GEN_MODEL = "gemini-3-pro-image-preview";
const IMAGE_ANALYZE_MODEL = "gemini-3-pro-preview";

export const fetchGoldMarketData = async (): Promise<DashboardData> => {
  try {
    const response = await ai.models.generateContent({
      model: DASHBOARD_MODEL,
      contents: `
        You are a financial market intelligence system focused on the Indian Market.
        
        Task:
        1. **General Market**: Search for current live values for BSE Sensex, Nifty 50, Silver (1kg spot INR), Petrol price (Delhi avg), and Diesel price (Delhi avg).
        2. **Gold Core**: Search for real-time gold price in INR per Troy Ounce.
        3. **Carat Calculation**: Calculate or find the price for 10 grams of 24K (99.9%), 22K (916), and 18K gold in India.
        4. **Regional**: Search for today's 22K & 24K gold rates (10g) in these cities: Chennai, Mumbai, Delhi, Kolkata, Bangalore, Kerala, Hyderabad.
        5. **Banks**: Search for today's 24K Gold Coin rates (10g) from: SBI, Tanishq, IBJA.
        6. **History**: Search for closing gold price (XAU/INR) for last 7 days.
        7. **News**: Summarize market sentiment.
        
        Output:
        Return a valid JSON object strictly matching the structure below. All prices in INR.
        
        {
          "current": {
            "price": <number, price per Troy Ounce>, 
            "price10g24k": <number>,
            "price10g22k": <number>,
            "price10g18k": <number>,
            "currency": "INR",
            "changeAmount": <number, change per Ounce>,
            "changePercent": <number>,
            "timestamp": <string>
          },
          "ticker": {
            "sensex": <number>,
            "sensexChange": <number, percent change>,
            "nifty": <number>,
            "niftyChange": <number, percent change>,
            "silverKg": <number>,
            "petrol": <number>,
            "diesel": <number>
          },
          "regional": [
            { "location": "Chennai", "price24k": <number>, "price22k": <number> },
            { "location": "Mumbai", "price24k": <number>, "price22k": <number> },
            { "location": "Delhi", "price24k": <number>, "price22k": <number> },
            { "location": "Kolkata", "price24k": <number>, "price22k": <number> },
            { "location": "Bangalore", "price24k": <number>, "price22k": <number> },
            { "location": "Kerala", "price24k": <number>, "price22k": <number> },
            { "location": "Hyderabad", "price24k": <number>, "price22k": <number> }
          ],
          "bankRates": [
             { "name": "SBI (24K Coin)", "price": <number>, "unit": "10g" },
             { "name": "Tanishq", "price": <number>, "unit": "10g" },
             { "name": "IBJA", "price": <number>, "unit": "10g" }
          ],
          "analysis": {
            "sentiment": "Bullish" | "Bearish" | "Neutral",
            "summary": <string max 2 sentences>,
            "keyFactors": [<string>, <string>, <string>],
            "recommendation": <string>
          },
          "history": [
            { "date": "YYYY-MM-DD", "price": <number> }
          ]
        }
      `,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    let text = response.text;
    if (!text) throw new Error("No data returned from Gemini");

    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const data = JSON.parse(text) as DashboardData;
    
    return {
      ...data,
      lastUpdated: new Date().toLocaleTimeString()
    };
  } catch (error) {
    console.error("Gemini Service Error:", error);
    throw error;
  }
};

export const sendChatMessage = async (message: string, history: any[]) => {
  try {
    const chat = ai.chats.create({
      model: CHAT_MODEL,
      config: {
        systemInstruction: "You are Aibrez, a helpful and expert AI assistant for a gold market dashboard application. You answer questions about gold prices, investment advice (with disclaimers), jewelry terminology, and market trends in India. Keep answers concise.",
      },
      history: history
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "I'm having trouble connecting to the server right now. Please try again later.";
  }
};

export const generateJewelryDesign = async (prompt: string, aspectRatio: string = "1:1"): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: IMAGE_GEN_MODEL,
      contents: {
        parts: [
          { text: `High quality, photorealistic jewelry design: ${prompt}` }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any
        }
      }
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw error;
  }
};

export const analyzeJewelryImage = async (base64Data: string, mimeType: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: IMAGE_ANALYZE_MODEL,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType
            }
          },
          { text: "Analyze this image. If it is jewelry or gold, estimate its karat, style, and potential craftsmanship value. If it is a market chart, analyze the trend. Keep it concise." }
        ]
      }
    });
    return response.text || "Could not analyze image.";
  } catch (error) {
    console.error("Image Analysis Error:", error);
    throw error;
  }
};