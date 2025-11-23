"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";

export interface Message {
  id: string;
  role: "user" | "aidentify";
  type: "image" | "video" | "audio";
  file?: File;
  content?: string;
  result?: "AI" | "Real";
  label?: string;
  confidence?: number;
  reason?: string;
}

export interface Chat {
  id: string;
  name: string;
  messages: Message[];
}

interface DashboardContextType {
  chats: Chat[];
  selectedChatId: string | null;
  createNewChat: () => void;
  selectChat: (id: string) => void;
  addMessageToChat: (chatId: string, message: Message) => void;
  refreshChats: () => void;
  deleteChat: (chatId: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

const SERVER_URL = process.env.NEXT_PUBLIC_NEXT_SERVER_URL;

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.emailAddresses[0].emailAddress) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const email = user?.emailAddresses[0].emailAddress;
      const response = await axios.get(
        `${SERVER_URL}/api/chat/history?email=${email}`
      );

      // Map backend response to frontend Chat object
      const mappedChats: Chat[] = response.data.map((chat: any) => ({
        id: chat._id,
        name: chat.title,
        messages: chat.messages.map((message: any) => ({
          ...message,
          result: message.label?.toLowerCase().includes("ai") ? "AI" : "Real",
        })),
      }));

      setChats(mappedChats);
    } catch (error) {
      console.log("Failed to fetch history: ", error);
    }
  };

  const createNewChat = () => {
    setSelectedChatId(null);
  };

  const selectChat = (id: string) => setSelectedChatId(id);

  const addMessageToChat = (chatId: string, message: Message) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, message] }
          : chat
      )
    );
  };

  const deleteChat = async (chatId: string) => {
    try {
      const email = user?.emailAddresses[0].emailAddress;
      await axios.delete(
        `${SERVER_URL}/api/chat/delete?email=${email}&chatId=${chatId}`
      );

      if (selectedChatId === chatId) {
        createNewChat();
      }

      fetchHistory();
      toast.success("Chat deleted successfully");
    } catch (error) {
      console.log("Failed to delete chat: ", error);
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        chats,
        selectedChatId,
        createNewChat,
        selectChat,
        addMessageToChat,
        refreshChats: fetchHistory,
        deleteChat,
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
