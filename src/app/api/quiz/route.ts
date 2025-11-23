import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY is not set" },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      Generate a TOEIC Part 5 style reading comprehension question.
      Return ONLY a valid JSON object with the following structure, and no other text:
      {
        "question": "The sentence with a _______ (blank) to be filled.",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "answer": "The correct option string (must be one of the options)",
        "explanation": "A concise explanation of why the answer is correct and others are wrong, in Japanese."
      }
      Ensure the difficulty is appropriate for TOEIC (business context, grammar/vocabulary focus).
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up the text to ensure it's valid JSON (remove markdown code blocks if present)
        const jsonString = text.replace(/```json\n|\n```/g, "").trim();

        try {
            const quizData = JSON.parse(jsonString);
            return NextResponse.json(quizData);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError, "Raw Text:", text);
            return NextResponse.json(
                { error: "Failed to parse generated quiz data" },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
