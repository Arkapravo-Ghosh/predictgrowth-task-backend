import { GoogleGenAI } from "@google/genai";
import path from "path";
import fs from "fs/promises";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = "gemini-1.5-flash";
const pdfPath = path.resolve("src/assets/data/context_document.pdf");

interface Chat {
  role: "user" | "model";
  parts: ({
    text: string;
    inlineData?: undefined;
  } | {
    inlineData: {
      mimeType: string;
      data: string;
    };
    text?: undefined;
  })[];
};

// Main chat function
export const chatWithAI = async (messages: Chat[], systemPrompt?: string): Promise<string> => {
  const pdfBuffer = await fs.readFile(pdfPath);
  const base64PDF = pdfBuffer.toString("base64");
  const contents = [
    {
      role: "user",
      parts: [
        { text: systemPrompt || "The following is a document having an explanation of startup fundraising along with explanations of funding stages, SAFE notes, cap tables, investor expectations, etc. Answer the questions asked based on the document." },
        {
          inlineData: {
            mimeType: "application/pdf",
            data: base64PDF,
          },
        },
      ],
    },
  ];

  // Add the messages to the contents
  messages.forEach((message) => {
    contents.push(message);
  });

  const result = await ai.models.generateContent({
    model: model,
    contents: contents,
  });
  return result.text || "Network error";
};
