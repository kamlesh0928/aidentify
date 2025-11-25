"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import {
  Paperclip,
  ScanEye,
  Send,
  Loader2,
  X,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

interface Message {
  id: string;
  role: "user" | "aidentify";
  file?: File;
  content?: string;
  type: "image" | "video" | "audio";
  result?: "AI" | "Real";
  label?: string;
  confidence?: number;
  reason?: string;
}

const SERVER_URL = process.env.NEXT_PUBLIC_NEXT_SERVER_URL;

export default function DetectionArea() {
  const { user } = useUser();
  const { selectedChatId, chats, refreshChats, selectChat, addMessageToChat } =
    useDashboard();

  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedChat = chats.find((c) => c.id === selectedChatId);
  const messages = (selectedChat?.messages || []) as unknown as Message[];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getMediaSource = (msg: Message) => {
    if (msg.content) {
      return msg.content;
    }

    if (msg.file) {
      return URL.createObjectURL(msg.file);
    }

    return "";
  };

  const acceptedTypes = {
    "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"],
    "video/*": [".mp4", ".webm", ".ogg", ".mov", ".avi"],
    "audio/mpeg": [".mp3"],
    "audio/wav": [".wav"],
  };

  const onDrop = (acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      toast.error("Unsupported file. Only images, videos, MP3 & WAV allowed.");
      return;
    }

    if (acceptedFiles[0]) {
      setAttachedFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    multiple: false,
    noClick: true,
  });

  const handleSubmit = async () => {
    if (!attachedFile) {
      return;
    }

    const mimeType = attachedFile.type;
    const type: "image" | "video" | "audio" = mimeType.startsWith("video/")
      ? "video"
      : mimeType.startsWith("audio/")
      ? "audio"
      : "image";

    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append("file", attachedFile);
    formData.append("mime_type", mimeType);
    formData.append("email", user!.emailAddresses[0].emailAddress);

    if (selectedChatId) {
      formData.append("chat_id", selectedChatId);
    }

    const endpoint =
      type === "image"
        ? `${SERVER_URL}/api/image/analyze`
        : type === "video"
        ? `${SERVER_URL}/api/video/analyze`
        : `${SERVER_URL}/api/audio/analyze`;

    try {
      if (selectedChatId) {
        const userMsg: Message = {
          id: Date.now().toString(),
          role: "user",
          file: attachedFile,
          type,
        };
        addMessageToChat(selectedChatId, userMsg);
      }

      const response = await axios.post(endpoint, formData, {
        timeout: 300000, // 5 minutes timeout for the Client
      });

      const data = response.data;

      if (!selectedChatId) {
        refreshChats();
        selectChat(data.chat_id);
      } else {
        const isAI = data.ai_message.label?.toLowerCase().includes("ai");

        const aiMsg: Message = {
          id: data.ai_message.id,
          role: "aidentify",
          type: data.ai_message.type,
          content: data.ai_message.content,
          label: data.ai_message.label,
          confidence: data.ai_message.confidence,
          reason: data.ai_message.reason,
          result: isAI ? "AI" : "Real",
        };

        addMessageToChat(selectedChatId, aiMsg);
      }

      setAttachedFile(null);
    } catch (error: any) {
      console.error("Upload failed:", error);
      if (error.code === "ERR_NETWORK") {
        toast.error("Backend not reachable. Is it running?");
      } else if (error.response) {
        toast.error(
          `Error ${error.response.status}: ${
            error.response.data?.detail || "Unknown"
          }`
        );
      } else {
        toast.error("Upload failed");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.length === 0 && !isAnalyzing && (
            <div className="text-center py-24">
              <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <ScanEye className="w-14 h-14 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-3">
                Human or Machine?
              </h2>
              <p className="text-foreground/60 text-lg">
                Analyze the authenticity of your media to detect deepfakes and
                AI generation.
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`
                  max-w-xl p-6 rounded-2xl shadow-lg border
                  ${
                    msg.role === "user"
                      ? "bg-primary/10 border-primary/20"
                      : "bg-card border-sidebar-border"
                  }
                `}
              >
                {msg.role === "user" ? (
                  // User: Show media (Using helper function)
                  <div>
                    {msg.type === "image" && (
                      <img
                        src={getMediaSource(msg)}
                        alt="Upload"
                        className="max-w-md rounded-xl shadow-xl"
                      />
                    )}
                    {msg.type === "video" && (
                      <video controls className="max-w-md rounded-xl shadow-xl">
                        <source src={getMediaSource(msg)} />
                      </video>
                    )}
                    {msg.type === "audio" && (
                      <div className="w-full min-w-[300px]">
                        <audio
                          controls
                          className="w-full mt-1"
                          src={getMediaSource(msg)}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  // AI Response
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      {msg.result === "AI" ? (
                        <XCircle className="w-12 h-12 text-red-500" />
                      ) : (
                        <CheckCircle className="w-12 h-12 text-green-500" />
                      )}
                      <div>
                        <p className="text-2xl font-bold">
                          {msg.result === "AI" ? "AI-Generated" : "Real"}
                        </p>
                        <p className="text-foreground/70">
                          Confidence:{" "}
                          <span
                            className={`font-bold text-xl ${
                              msg.confidence! > 0.8
                                ? "text-primary"
                                : "text-yellow-500"
                            }`}
                          >
                            {(msg.confidence! * 100).toFixed(1)}%
                          </span>
                        </p>
                      </div>
                    </div>

                    {msg.reason && (
                      <div className="bg-background/50 p-4 rounded-xl border border-white/5 mt-2">
                        <div className="flex items-center gap-2 mb-1 text-sm text-foreground/60 uppercase font-semibold tracking-wider">
                          <Info className="w-4 h-4" /> Analysis
                        </div>
                        <p className="text-foreground/90 leading-relaxed">
                          {msg.reason}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isAnalyzing && (
            <div className="flex justify-start">
              <div className="px-6 py-4 bg-card rounded-2xl border border-sidebar-border flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="text-lg font-medium">
                    Analyzing your media...
                  </span>
                </div>
                <p className="text-sm text-foreground/60 ml-9">
                  It may take a few minutes
                </p>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="pb-2 border-sidebar-border bg-background/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 py-3">
          {attachedFile && (
            <div className="mb-2 flex items-center justify-between bg-sidebar px-4 py-2 rounded-lg border border-sidebar-border">
              <span className="text-foreground/90 text-sm truncate max-w-xs">
                {attachedFile.name}
              </span>
              <button
                onClick={() => setAttachedFile(null)}
                className="text-foreground/50 hover:text-red-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 bg-card rounded-full border border-sidebar-border px-2 py-2 shadow-sm hover:border-primary/30 transition-colors">
            <label className="cursor-pointer p-2 rounded-full hover:bg-sidebar-accent/50 transition flex-shrink-0">
              <Paperclip className="w-5 h-5 text-foreground/50" />
              <input
                type="file"
                className="hidden"
                accept="image/*,video/*,audio/mpeg,audio/wav"
                onChange={(e) =>
                  e.target.files?.[0] && setAttachedFile(e.target.files[0])
                }
              />
            </label>

            <div className="flex-1 min-w-0" {...getRootProps()}>
              <input {...getInputProps()} />
              <button
                onClick={open}
                className="w-full text-left px-2 py-1 text-foreground/50 hover:text-foreground/80 text-sm font-medium truncate bg-transparent focus:outline-none"
              >
                {attachedFile
                  ? "File selected. Click send to analyze."
                  : "Upload image, video, or audio..."}
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!attachedFile || isAnalyzing}
              className={`
                p-2 rounded-full transition-all flex-shrink-0
                ${
                  attachedFile && !isAnalyzing
                    ? "bg-primary text-primary-foreground shadow-md hover:scale-105"
                    : "bg-muted/50 text-muted-foreground cursor-not-allowed"
                }
              `}
            >
              {isAnalyzing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>

          <p className="text-center text-xs text-foreground/40 mt-2.5 opacity-70">
            Supports images, videos, MP3 & WAV audio
          </p>
        </div>
      </div>
    </div>
  );
}
