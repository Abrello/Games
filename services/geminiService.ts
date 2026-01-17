
import { GoogleGenAI } from "@google/genai";
import { VirtualGameType, Game } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGameStrategy = async (gameType: VirtualGameType): Promise<string> => {
  try {
    const prompt = `Act as a professional virtual casino strategist. Provide a short, cryptic, and exciting "Lucky Tip" for a game called ${gameType}. Mention something about probability or "reading the algorithm" in a playful way. Keep it under 40 words and high-energy.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.9,
      }
    });

    return response.text || "The algorithm is silent. Trust your instinct.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "High probability detected. Proceed with caution.";
  }
};

export const getSportsInsight = async (game: Game): Promise<string> => {
  try {
    const prompt = `Act as a professional sports analyst. Provide a concise, one-sentence betting insight for the following fixture: ${game.teamA} vs ${game.teamB} in ${game.league}. Odds: 1(${game.oddsA}), X(${game.oddsDraw || 'N/A'}), 2(${game.oddsB}).`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Analyzing current team form...";
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Match insights are currently unavailable.";
  }
};

export const generateOTPEmail = async (email: string, otp: string): Promise<string> => {
  try {
    const prompt = `Generate a professional, high-security transaction email body for a sports betting app called "10x Sports". 
    The email is for a password reset request. 
    User Email: ${email}
    OTP Code: ${otp}
    Keep it formal, emphasize security, and mention that the code expires in 10 minutes.
    Return ONLY the body text of the email.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || `Your 10x Sports security code is: ${otp}`;
  } catch (error) {
    return `Security Alert: Your password reset code is ${otp}. Please do not share this with anyone.`;
  }
};
