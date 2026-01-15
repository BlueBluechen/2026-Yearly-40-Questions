import { GoogleGenAI, Type } from "@google/genai";
import { Answers } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to get a random poetic hint for a question
export const getQuestionHint = async (questionText: string): Promise<string> => {
  if (!apiKey) return "请连接 API 以获取灵感...";
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User is filling out a yearly reflection questionnaire. The question is: "${questionText}". 
      Provide a short, poetic, and inspiring 'thought starter' or a metaphorical example answer to help them reflect. 
      Do not answer the question directly, but guide their memory. 
      Keep it under 30 words. In Chinese.`,
    });
    return response.text || "回忆一下那些微小的瞬间...";
  } catch (error) {
    console.error("Gemini Hint Error:", error);
    return "闭上眼睛，深呼吸，答案在心里...";
  }
};

// Helper to generate the yearly summary report
export const generateYearlyReport = async (answers: Answers) => {
  if (!apiKey) {
    // Mock data if no API key
    return {
      keywords: ["成长", "勇气", "爱", "旅行"],
      summaryCards: [
        { title: "关于突破", content: "这一年你像破土的种子，在未知的领域试探。那些第一次的尝试，构成了你新的年轮。" },
        { title: "关于得失", content: "有些东西随风而去，有些却在心里生根。得到的不仅是物品，更是对生活的理解。" },
        { title: "关于爱", content: "在喧嚣的世界里，你依然保留了一份柔软。爱人，也被爱，这是最伟大的平凡。" },
        { title: "致未来", content: "带着今年的故事，继续向前走吧。星光不问赶路人，时光不负有心人。" }
      ]
    };
  }

  try {
    // Construct a context string from answers (taking a subset if too long, but 40 short answers fit in context)
    const answersContext = Object.entries(answers)
      .map(([id, ans]) => `Q${id}: ${ans}`)
      .join("\n");

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze these 40 answers from a user's yearly review:\n${answersContext}\n\n
      Task:
      1. Extract 4-6 abstract keywords that define their year.
      2. Write 4 distinct summary paragraphs (cards) that capture the essence of their year. Each paragraph should have a short title (e.g., "关于成长"). The tone should be literary, warm, reflective, and slightly poetic, suitable for printing on a thermal receipt or postcard.
      
      Return as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            summaryCards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini Report Error:", error);
     return {
      keywords: ["时光", "记忆"],
      summaryCards: [
        { title: "年度总结", content: "生成报告时遇到了一点小插曲，但你的生活依然精彩。请稍后重试。" }
      ]
    };
  }
};