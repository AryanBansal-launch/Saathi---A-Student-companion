import { NextRequest, NextResponse } from "next/server";

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
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Chat is not configured. Add OPENROUTER_API_KEY to enable." },
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

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.slice(-10).map((h) => ({
        role: h.role === "user" ? "user" : "assistant",
        content: h.content,
      })),
      { role: "user", content: message.trim() },
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXTAUTH_URL || "http://localhost:3000",
        "X-Title": "Saarthi Chat",
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenRouter API error:", errorData);
      return NextResponse.json(
        { error: "Failed to get a response. Please try again." },
        { status: 500 }
      );
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "I couldn't generate a response. Try asking something like: I need a mess in Delhi under ₹3000.";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to get a response. Please try again." },
      { status: 500 }
    );
  }
}
