import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are Saarthi's friendly assistant. Saarthi is a platform that helps students and bachelors find essential services in a new city: hostels, mess/dabba (tiffin), bike rental, accommodation, laundry, furniture, books, and more.

Your role:
- Help users find the right type of service (e.g. "I need a mess" -> suggest they browse Mess & Dabba; "cheap PG" -> Hostels or Accommodation).
- Suggest they use the city filter or search (e.g. "near IIT Delhi", "in Bangalore").
- For budget queries (e.g. "under ₹3000"), tell them they can filter by price on the Explore page.
- Keep responses short (2-4 sentences), warm, and actionable. Mention they can explore filters on the website.
- If they ask something off-topic, gently steer back to finding services on Saarthi.
- Don't make up specific listing names or prices. Direct them to browse or search on the site.`;

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Chat is not configured. Add GEMINI_API_KEY to enable." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { message, history = [] } = body as { message?: string; history?: { role: string; content: string }[] };

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Prefer env override; default to a current model (gemini-1.5-flash is deprecated)
    const modelId = process.env.GEMINI_CHAT_MODEL || "gemini-2.0-flash";
    const model = genAI.getGenerativeModel({
      model: modelId,
      systemInstruction: SYSTEM_PROMPT,
    });

    const chat = model.startChat({
      history: history.slice(-10).map((h) => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.content }],
      })),
    });

    const result = await chat.sendMessage(message.trim());
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ text: text || "I couldn't generate a response. Try asking something like: I need a mess in Delhi under ₹3000." });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to get a response. Please try again." },
      { status: 500 }
    );
  }
}
