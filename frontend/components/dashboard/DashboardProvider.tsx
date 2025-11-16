"use client";

import { createContext, useState, useContext, ReactNode } from "react";

interface Chat {
  id: string;
  name: string;
  result?: "AI" | "Real";
  confidence?: number;
  messages: Message[];
}

interface Message {
  id: string;
  role: "user" | "aidentify";
  content: string;
  file?: File;
  type: "image" | "video" | "audio" | null;
  result?: "AI" | "Real";
  confidence?: number;
}

interface DashboardContextType {
  chats: Chat[];
  selectedChatId: string | null;
  addChat: () => void;
  selectChat: (id: string) => void;
  updateChatResult: (
    id: string,
    result: "AI" | "Real",
    confidence: number
  ) => void;
  addMessageToChat: (chatId: string, message: Message) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([
    { id: "123", name: "123", result: "AI", messages: [] },
    { id: "456", name: "456", result: "Real", messages: [] },
  ]);

  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const addChat = () => {
    const newId = Date.now().toString();
    setChats((prev) => [
      ...prev,
      { id: newId, name: newId.slice(-6), messages: [] },
    ]);
  };

  const selectChat = (id: string) => setSelectedChatId(id);

  const updateChatResult = (
    id: string,
    result: "AI" | "Real",
    confidence: number
  ) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === id ? { ...chat, result, confidence } : chat
      )
    );
  };

  const addMessageToChat = (chatId: string, message: Message) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, message] }
          : chat
      )
    );
  };

  return (
    <DashboardContext.Provider
      value={{
        chats,
        selectedChatId,
        addChat,
        selectChat,
        updateChatResult,
        addMessageToChat,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboard = () => {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }

  return context;
};
