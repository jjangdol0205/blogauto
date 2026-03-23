import { GoogleGenAI } from '@google/genai'; 
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 

async function test() {
  try {
    const imgRes = await ai.models.generateImages({
      model: 'imagen-4.0-fast-generate-001',
      prompt: `한글 텍스트 테스트`,
      config: { 
        numberOfImages: 1, 
        aspectRatio: '16:9',
        outputMimeType: 'image/jpeg'
      }
    });
    console.log("Success! Image size:", imgRes.generatedImages[0].image.imageBytes.length);
  } catch(e) {
    console.log("FAILED WITH ERROR:", e);
  }
}
test();
