import { GoogleGenAI, Type } from "@google/genai";
import { Vector3 } from "../types";

const API_KEY = process.env.API_KEY || '';

// Initialize the Gemini AI client
let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

export const generateShapeFromGemini = async (prompt: string): Promise<Vector3[]> => {
  if (!ai) {
    console.error("Gemini API Key is missing.");
    throw new Error("API Key missing");
  }

  try {
    const model = "gemini-2.5-flash";
    const systemInstruction = `
      You are a 3D geometry engine. 
      Your task is to generate a list of 3D coordinates (x, y, z) that form a specific shape described by the user.
      The coordinates should be normalized to fit roughly within a -4 to +4 bounding box.
      Return exactly 500 representative points. The client will interpolate more points based on these.
      Use JSON format.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: `Generate a 3D point cloud for a shape that looks like: ${prompt}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            points: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  x: { type: Type.NUMBER },
                  y: { type: Type.NUMBER },
                  z: { type: Type.NUMBER }
                },
                required: ["x", "y", "z"]
              }
            }
          }
        }
      }
    });

    const jsonStr = response.text;
    if (!jsonStr) throw new Error("No data returned from Gemini");

    const data = JSON.parse(jsonStr) as { points: Vector3[] };
    return data.points;

  } catch (error) {
    console.error("Error generating shape with Gemini:", error);
    throw error;
  }
};
