import { create } from "zustand";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  /** Timestamp ISO. */
  at: string;
};

type ChatbotState = {
  isOpen: boolean;
  messages: ChatMessage[];
  isStreaming: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  appendMessage: (msg: ChatMessage) => void;
  setStreaming: (v: boolean) => void;
  reset: () => void;
};

/**
 * Estado do chatbot ELLA — não persistido em localStorage (LGPD-friendly:
 * conversa some quando o cliente fecha a aba). Mensagens vivem só no
 * runtime React.
 */
export const useChatbot = create<ChatbotState>((set) => ({
  isOpen: false,
  messages: [],
  isStreaming: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  appendMessage: (msg) =>
    set((s) => ({ messages: [...s.messages, msg] })),
  setStreaming: (isStreaming) => set({ isStreaming }),
  reset: () => set({ messages: [], isStreaming: false }),
}));
