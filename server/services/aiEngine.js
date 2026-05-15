import "dotenv/config";
import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Knowledge from "../models/Knowledge.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const parseJson = (text) => {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("AI returned no JSON object");

  return JSON.parse(cleaned.slice(start, end + 1));
};

export const analyzeEmailAI = async ({
  userId,
  subject,
  from,
  snippet,
  bodyText,
  userProfileDescription,
  labels
}) => {
  const usableLabels = labels || [];

  if (usableLabels.length === 0) {
    return { label: "", action: "none", body: "" };
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const labelInfo = usableLabels
      .map(l => `${l.name} | tone: ${l.tone || "friendly"} | action: ${l.action?.type || "none"}`)
      .join(", ");

    let retrievedKnowledge = "";
    if (userId && bodyText) {
      try {
        const embedModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
        const embedResult = await embedModel.embedContent(bodyText || snippet || subject);
        const queryVector = embedResult.embedding.values;

        const matchedSnippets = await Knowledge.aggregate([
          {
            $vectorSearch: {
              index: "vector_index",
              path: "embedding",
              queryVector: queryVector,
              numCandidates: 100,
              limit: 3,
              filter: { userId: new mongoose.Types.ObjectId(userId) }
            }
          },
          {
            $project: { _id: 0, text: 1 }
          }
        ]);
        
        if (matchedSnippets && matchedSnippets.length > 0) {
          retrievedKnowledge = matchedSnippets.map(doc => doc.text).join("\n\n---\n\n");
        }
      } catch (err) {
        console.error("Vector search error:", err.message);
      }
    }

    const prompt = `
You are an email assistant.

Choose:
1. ONE label from: ${labelInfo}
2. ONE action: reply | draft | none
3. Generate body ONLY if action is not none

Rules:
- don't use "*" in replies
- reply means a short direct response
- draft means a slightly more detailed response
- none means no response is needed
- match the selected label tone
- write as the mailbox owner using the user profile below
- do not mention that this was written by an AI, assistant, bot, or automation
- never invent facts that are not in the email
- if the user profile does not provide enough detail, use the provided Relevant Company Knowledge below if available.
- return only valid JSON

User profile:
${userProfileDescription || "No profile description provided."}

Relevant Company Knowledge (Use this to answer questions in the email accurately):
${retrievedKnowledge || "No specific company knowledge provided for this query."}

Return JSON:
{
  "label": "...",
  "action": "...",
  "body": "..."
}

Email:
From: ${from || ""}
Subject: ${subject || ""}
Snippet: ${snippet || ""}
Body:
${bodyText || snippet || ""}
`;

    const res = await model.generateContent(prompt);
    const parsed = parseJson(res.response.text());

    if (
      usableLabels.some(l => l.name === parsed.label) &&
      ["reply", "draft", "none"].includes(parsed.action)
    ) {
      const cleanBody = String(parsed.body || "")
        .replace(/\*\*(.*?)\*\*/g, "$1") // bold
        .replace(/\*(.*?)\*/g, "$1")     // italic/bullets
        .replace(/^\s*[-*]\s+/gm, "")    // bullet points
        .replace(/^\s*\d+\.\s+/gm, "")   // numbered lists
        .replace(/`/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

      return {
        label: parsed.label,
        action: parsed.action,
        body: parsed.action === "none" ? "" : cleanBody
      };
    }
  } catch (e) {
    console.log("AI error:", e.message);
  }

  return {
    label: usableLabels[0].name,
    action: "none",
    body: ""
  };
};
