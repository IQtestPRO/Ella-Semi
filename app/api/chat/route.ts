import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "../../../lib/chat/system-prompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatRequestBody = {
  messages: IncomingMessage[];
};

const MODEL = "claude-sonnet-4-5";

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: "chatbot_unavailable",
        message:
          "Chatbot indisponível. Fale com a Ellen direto pelo WhatsApp: https://wa.link/adq88g",
      }),
      {
        status: 503,
        headers: { "content-type": "application/json" },
      },
    );
  }

  let body: ChatRequestBody;
  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    return new Response(
      JSON.stringify({ error: "invalid_body" }),
      { status: 400, headers: { "content-type": "application/json" } },
    );
  }

  const incoming = (body.messages ?? []).filter(
    (m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string",
  );
  if (incoming.length === 0) {
    return new Response(
      JSON.stringify({ error: "no_messages" }),
      { status: 400, headers: { "content-type": "application/json" } },
    );
  }

  const client = new Anthropic({ apiKey });
  const system = buildSystemPrompt();

  // Stream SSE: cada chunk de texto vai como um evento "delta".
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await client.messages.stream({
          model: MODEL,
          max_tokens: 1024,
          system: [
            {
              type: "text",
              text: system,
              cache_control: { type: "ephemeral" },
            },
          ],
          messages: incoming.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        });

        for await (const event of response) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            const data = JSON.stringify({ type: "delta", text: event.delta.text });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
        controller.close();
      } catch (err) {
        const message = err instanceof Error ? err.message : "unknown_error";
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "error", message })}\n\n`,
          ),
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      "x-accel-buffering": "no",
    },
  });
}
