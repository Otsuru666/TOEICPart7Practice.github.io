import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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
      Generate a TOEIC Part 7 single passage reading comprehension problem.
      The output MUST be a valid JSON object with the following structure:

      {
        "passage": {
          "title": "Title of the document",
          "meta": [
            { "label": "Subject", "value": "..." },
            { "label": "Date", "value": "..." },
            { "label": "From", "value": "..." },
            { "label": "To", "value": "..." }
          ],
          "content": [
            {
              "type": "paragraph",
              "text": "Paragraph text..."
            },
            {
              "type": "table",
              "headers": ["Col1", "Col2"],
              "rows": [["Row1Col1", "Row1Col2"], ["Row2Col1", "Row2Col2"]]
            },
            {
              "type": "kv-list",
              "items": [
                { "label": "Total", "value": "$100", "highlight": true }
              ]
            }
          ]
        },
        "questions": [
          {
            "id": 1,
            "text": "Question text...",
            "correct": "A",
            "explanation": "Explanation in Japanese...",
            "options": [
              { "id": "A", "text": "Option A text" },
              { "id": "B", "text": "Option B text" },
              { "id": "C", "text": "Option C text" },
              { "id": "D", "text": "Option D text" }
            ]
          }
        ]
      }

      Requirements:
      - Topic: Business email, invoice, or memo.
      - Difficulty: Intermediate (TOEIC 600-700 level).
      - Passage length: 150-250 words.
      - Include at least one table or list in the content if appropriate (e.g. for an invoice or schedule).
      - Generate 2-3 questions.
      - Explanation MUST be in Japanese.
      - Ensure the JSON is valid and contains NO markdown formatting (no \`\`\`json).
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up the text to ensure it's valid JSON
        const jsonString = text.replace(/```json\n|\n```/g, "").trim();

        let quizData;
        try {
            quizData = JSON.parse(jsonString);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError, "Raw Text:", text);
            return NextResponse.json(
                { error: "Failed to parse generated quiz data" },
                { status: 500 }
            );
        }

        // Save to file
        const problemsDir = path.join(process.cwd(), "TOEIC", "問題");
        if (!fs.existsSync(problemsDir)) {
            fs.mkdirSync(problemsDir, { recursive: true });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const filename = `part7-${timestamp}.json`;
        const filePath = path.join(problemsDir, filename);

        fs.writeFileSync(filePath, JSON.stringify(quizData, null, 2));

        return NextResponse.json({ ...quizData, savedToFile: filename });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
