import { create } from "zustand";

interface Message {
  role: "user" | "bot";
  message_content: string;
}

interface MessageStore {
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}

const useMessageStore = create<MessageStore>((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  clearMessages: () => set({ messages: [] }),
}));

export default useMessageStore;
