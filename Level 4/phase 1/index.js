import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/ai", async (req, res) => {
  const { input } = req.body;
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  //   const interaction = await ai.interactions.create({
  //     model: "gemini-3.6-flash",
  //     system_instruction: "You are an ai asistant and your name is Jarvis",
  //     input,
  //   });
  //   res.status(200).json({ ai: interaction.output_text });

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: [
      {
        role: "system",
        text: "You are an ai asistant and your name is Jarvis",
      },
      {
        role: "user",
        text: input,
      },
    ],
  });
  res.status(200).json({ ai: response.text });
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hi" });
});

app.listen(port, () => {
  console.log(`Runing on ${port}`);
});
