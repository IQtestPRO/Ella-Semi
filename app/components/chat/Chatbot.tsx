"use client";

import {
  useEffect,
  useRef,
  useState,
  type FC,
  type FormEvent,
  type ReactNode,
} from "react";
import { useChatbot } from "../../../lib/chat/store";

const SparkleAccent: FC = () => (
  <svg width="14" height="14" viewBox="-9 -9 18 18" fill="#D99A30" aria-hidden="true">
    <path d="M0,-8 L1.6,-1.6 L8,0 L1.6,1.6 L0,8 L-1.6,1.6 L-8,0 L-1.6,-1.6 Z" />
  </svg>
);

const ChatIcon: FC = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 5 a2 2 0 0 1 2-2 h12 a2 2 0 0 1 2 2 v9 a2 2 0 0 1-2 2 h-7 l-4 4 v-4 h-1 a2 2 0 0 1-2-2 z" />
  </svg>
);

const CloseIcon: FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
    <line x1="5" y1="5" x2="15" y2="15" />
    <line x1="15" y1="5" x2="5" y2="15" />
  </svg>
);

const SendIcon: FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 8 L14 2 L11 14 L7.5 9 L2 8 Z" />
  </svg>
);

/**
 * Renderiza texto de mensagem do bot transformando links wa.me / wa.link em
 * botão estilizado, e mantém **negrito** simples.
 */
function renderMessageContent(content: string): ReactNode {
  // Split first by wa.me|wa.link links — substitui por botão.
  const linkRegex = /(https?:\/\/wa\.(?:me|link)\/[^\s)]+)/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  // Helper: applies bold transform on a plain text fragment.
  const renderText = (txt: string, baseKey: number): ReactNode => {
    const boldRegex = /\*\*([^*]+)\*\*/g;
    const segs: ReactNode[] = [];
    let li = 0;
    let bm: RegExpExecArray | null;
    let k = 0;
    while ((bm = boldRegex.exec(txt)) !== null) {
      if (bm.index > li) segs.push(<span key={`${baseKey}-t-${k++}`}>{txt.slice(li, bm.index)}</span>);
      segs.push(<strong key={`${baseKey}-b-${k++}`}>{bm[1]}</strong>);
      li = bm.index + bm[0].length;
    }
    if (li < txt.length) segs.push(<span key={`${baseKey}-t-${k++}`}>{txt.slice(li)}</span>);
    return segs.length > 0 ? <>{segs}</> : txt;
  };

  while ((match = linkRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{renderText(content.slice(lastIndex, match.index), key)}</span>);
    }
    const url = match[1];
    parts.push(
      <a
        key={key++}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="my-2 inline-flex items-center gap-2 rounded-full px-4 py-2 transition-colors"
        style={{
          fontFamily: "var(--font-secondary, Inter, system-ui, sans-serif)",
          fontSize: "12px",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          fontWeight: 600,
          backgroundColor: "var(--color-preto-warm, #251008)",
          color: "#FFF1ED",
          textDecoration: "none",
        }}
      >
        Falar com a Ellen no WhatsApp →
      </a>,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) {
    parts.push(<span key={key++}>{renderText(content.slice(lastIndex), key)}</span>);
  }

  return parts;
}

const SUGGESTIONS = [
  "Tem brinco de hoop dourado?",
  "Como cuidar do banho de ouro?",
  "O que vocês têm em pulseiras?",
  "Diferença entre semijoia e bijuteria?",
];

export const Chatbot: FC = () => {
  const isOpen = useChatbot((s) => s.isOpen);
  const messages = useChatbot((s) => s.messages);
  const isStreaming = useChatbot((s) => s.isStreaming);
  const open = useChatbot((s) => s.open);
  const close = useChatbot((s) => s.close);
  const appendMessage = useChatbot((s) => s.appendMessage);
  const setStreaming = useChatbot((s) => s.setStreaming);

  const [input, setInput] = useState("");
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll bottom on new content
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent, isOpen]);

  // Lock body scroll when open (mobile)
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      role: "user" as const,
      content: trimmed,
      at: new Date().toISOString(),
    };
    appendMessage(userMsg);
    setInput("");

    const allMessages = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    setStreaming(true);
    const botId = `a-${Date.now()}`;
    setStreamingId(botId);
    setStreamingContent("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: allMessages.filter((m) => m.role !== "system") }),
      });

      if (res.status === 503) {
        const data = await res.json();
        appendMessage({
          id: botId,
          role: "assistant",
          content:
            data.message ??
            "Chatbot indisponível. Fale com a Ellen direto pelo WhatsApp: https://wa.link/adq88g",
          at: new Date().toISOString(),
        });
        setStreaming(false);
        setStreamingId(null);
        setStreamingContent("");
        return;
      }

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let acc = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const json = line.slice(5).trim();
          if (!json) continue;
          try {
            const parsed = JSON.parse(json);
            if (parsed.type === "delta" && typeof parsed.text === "string") {
              acc += parsed.text;
              setStreamingContent(acc);
            }
          } catch {
            // ignore parse errors mid-stream
          }
        }
      }

      appendMessage({
        id: botId,
        role: "assistant",
        content:
          acc ||
          "Desculpa, tive um problema. Pode tentar de novo? Ou fale com a Ellen: https://wa.link/adq88g",
        at: new Date().toISOString(),
      });
    } catch {
      appendMessage({
        id: botId,
        role: "assistant",
        content:
          "Tive um problema técnico. Fale com a Ellen direto no WhatsApp: https://wa.link/adq88g",
        at: new Date().toISOString(),
      });
    } finally {
      setStreaming(false);
      setStreamingId(null);
      setStreamingContent("");
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating launcher button */}
      <button
        type="button"
        onClick={isOpen ? close : open}
        aria-label={isOpen ? "Fechar Ellen IA" : "Abrir Ellen IA — assistente"}
        data-testid="chatbot-launcher"
        className="fixed bottom-5 right-5 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
        style={{
          backgroundColor: "var(--color-preto-warm, #251008)",
          color: "#FFF1ED",
          display: isOpen ? "none" : "inline-flex",
        }}
      >
        <ChatIcon />
        <span
          className="absolute -right-0.5 -top-0.5 inline-flex h-3.5 w-3.5 items-center justify-center"
          aria-hidden="true"
        >
          <SparkleAccent />
        </span>
      </button>

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Conversa com a Ellen IA"
        data-testid="chatbot-drawer"
        className="fixed bottom-0 right-0 z-40 flex w-full flex-col bg-[#FFF7EE] shadow-2xl transition-transform duration-300 ease-out md:bottom-5 md:right-5 md:max-h-[600px] md:w-[400px] md:rounded-2xl"
        style={{
          height: isOpen ? "min(85vh, 600px)" : "0",
          transform: isOpen ? "translateY(0)" : "translateY(100%)",
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-5 py-4 md:rounded-t-2xl"
          style={{
            borderColor: "rgba(138, 110, 92, 0.2)",
            backgroundColor: "var(--color-salmao-claro, #FFF1ED)",
          }}
        >
          <div className="flex items-center gap-2.5">
            <SparkleAccent />
            <div className="flex flex-col">
              <span
                className="font-hero"
                style={{
                  fontSize: "17px",
                  fontWeight: 400,
                  letterSpacing: "0.01em",
                  color: "var(--color-preto-warm, #251008)",
                }}
              >
                Ellen IA
              </span>
              <span
                style={{
                  fontFamily:
                    "var(--font-secondary, Inter, system-ui, sans-serif)",
                  fontSize: "10px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "rgba(37, 16, 8, 0.55)",
                }}
              >
                assistente da ELLA
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Fechar conversa"
            className="-mr-2 inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-black/5"
            style={{ color: "var(--color-preto-warm, #251008)" }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4">
          {messages.length === 0 && (
            <div className="flex flex-col gap-4">
              <p
                style={{
                  fontFamily:
                    "var(--font-secondary, Inter, system-ui, sans-serif)",
                  fontSize: "13.5px",
                  lineHeight: 1.6,
                  color: "rgba(37, 16, 8, 0.78)",
                }}
              >
                Oi! Sou a Ellen IA — assistente da ELLA. Posso te ajudar a
                escolher uma peça, tirar dúvida sobre banho ou cuidados, e te
                conectar com a Ellen no WhatsApp pra fechar.
              </p>
              <div className="flex flex-col gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => sendMessage(s)}
                    className="rounded-full px-4 py-2 text-left transition-colors"
                    style={{
                      fontFamily:
                        "var(--font-secondary, Inter, system-ui, sans-serif)",
                      fontSize: "12.5px",
                      letterSpacing: "0.02em",
                      backgroundColor: "rgba(255, 217, 204, 0.45)",
                      color: "var(--color-preto-warm, #251008)",
                      border: "1px solid rgba(138, 110, 92, 0.22)",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <ul className="flex flex-col gap-3" data-testid="chat-messages">
            {messages.map((m) => (
              <li
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[85%] rounded-2xl px-4 py-2.5"
                  style={{
                    fontFamily:
                      "var(--font-secondary, Inter, system-ui, sans-serif)",
                    fontSize: "13.5px",
                    lineHeight: 1.55,
                    backgroundColor:
                      m.role === "user"
                        ? "var(--color-preto-warm, #251008)"
                        : "rgba(255, 217, 204, 0.45)",
                    color:
                      m.role === "user" ? "#FFF1ED" : "var(--color-preto-warm, #251008)",
                  }}
                >
                  {m.role === "assistant" ? renderMessageContent(m.content) : m.content}
                </div>
              </li>
            ))}
            {isStreaming && streamingId && streamingContent && (
              <li className="flex justify-start">
                <div
                  className="max-w-[85%] rounded-2xl px-4 py-2.5"
                  style={{
                    fontFamily:
                      "var(--font-secondary, Inter, system-ui, sans-serif)",
                    fontSize: "13.5px",
                    lineHeight: 1.55,
                    backgroundColor: "rgba(255, 217, 204, 0.45)",
                    color: "var(--color-preto-warm, #251008)",
                  }}
                >
                  {renderMessageContent(streamingContent)}
                  <span className="ml-1 inline-block animate-pulse">▍</span>
                </div>
              </li>
            )}
            {isStreaming && !streamingContent && (
              <li className="flex justify-start">
                <div
                  className="rounded-2xl px-4 py-2.5"
                  style={{
                    backgroundColor: "rgba(255, 217, 204, 0.45)",
                  }}
                >
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-preto-warm)]/45" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-preto-warm)]/45 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-preto-warm)]/45 [animation-delay:300ms]" />
                  </span>
                </div>
              </li>
            )}
          </ul>
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="border-t px-4 py-3 md:rounded-b-2xl"
          style={{ borderColor: "rgba(138, 110, 92, 0.2)" }}
        >
          <div
            className="flex items-center gap-2 rounded-full px-4 py-2.5"
            style={{
              backgroundColor: "rgba(255, 247, 238, 0.65)",
              border: "1px solid rgba(138, 110, 92, 0.22)",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunta sobre uma peça…"
              disabled={isStreaming}
              aria-label="Mensagem para Ellen IA"
              className="flex-1 bg-transparent outline-none"
              style={{
                fontFamily:
                  "var(--font-secondary, Inter, system-ui, sans-serif)",
                fontSize: "13.5px",
                letterSpacing: "0.01em",
                color: "var(--color-preto-warm, #251008)",
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              aria-label="Enviar mensagem"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors disabled:opacity-40"
              style={{
                backgroundColor: "var(--color-preto-warm, #251008)",
                color: "#FFF1ED",
              }}
            >
              <SendIcon />
            </button>
          </div>
        </form>
      </aside>
    </>
  );
};
