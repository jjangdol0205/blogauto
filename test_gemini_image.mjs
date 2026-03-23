import { GoogleGenAI } from "@google/genai";
import fs from "fs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); // needs API key

async function main() {
  try {
    const res = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: '유튜브 썸네일 스타일, 화면 한가운데에 "테스트" 라는 매우 크고 두꺼운 주황색 한국어 글씨 배치, 배경은 깔끔한 2D 일러스트, 밝고 쨍한 색감',
      config: {
        numberOfImages: 1,
        aspectRatio: '16:9'
      }
    });

    const base64 = res.generatedImages[0].image.imageBytes;
    console.log("Success! Image size:", base64.length);
  } catch(e) {
    console.error("Error:", e);
  }
}
main();
