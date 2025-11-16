"use client";

import { useState, useEffect, useRef } from "react";
import {
  Paperclip,
  Send,
  Loader2,
  X,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { useDropzone } from "react-dropzone";

interface Message {
  id: string;
  role: "user" | "aidentify";
  content: string;
  file?: File;
  type: "image" | "video" | "audio" | null;
  result?: "AI" | "Real";
  confidence?: number;
}

export default function DetectionArea() {
  const { selectedChatId, chats, addMessageToChat, updateChatResult } =
    useDashboard();

  const [input, setInput] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedChat = chats.find((c) => c.id === selectedChatId);
  const messages = selectedChat?.messages ?? [];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const textarea = inputRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [input]);

  const onDrop = (files: File[]) => files[0] && setAttachedFile(files[0]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    noClick: true,
    noKeyboard: true,
  });

  const sendMessage = async () => {
    if (!selectedChatId || (!input.trim() && !attachedFile)) {
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim() || "",
      file: attachedFile ?? undefined,
      type: attachedFile
        ? attachedFile.type.startsWith("image/")
          ? "image"
          : attachedFile.type.startsWith("video/")
          ? "video"
          : "audio"
        : null,
    };

    addMessageToChat(selectedChatId, userMsg);
    setInput("");
    setAttachedFile(null);
    setIsAnalyzing(true);

    const formData = new FormData();
    if (attachedFile) {
      formData.append("file", attachedFile);
    }

    console.log(userMsg);

    // Connect backend
    // try {
    //   const res = await fetch("/api/detect", {
    //     method: "POST",
    //     body: formData,
    //   });
    //   const data = await res.json();

    //   const assistantMsg: Message = {
    //     id: (Date.now() + 1).toString(),
    //     role: "assistant",
    //     content: "",
    //     type: "text",
    //     result: data.result,
    //     confidence: data.confidence,
    //   };
    //   addMessageToChat(selectedChatId, assistantMsg);
    //   updateChatResult(selectedChatId, data.result, data.confidence);
    // } catch {
    //   addMessageToChat(selectedChatId, {
    //     id: (Date.now() + 1).toString(),
    //     role: "assistant",
    //     content: "Sorry, something went wrong. Try again.",
    //     type: "text",
    //   });
    // } finally {
    //   setIsAnalyzing(false);
    // }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Start a New Detection
              </h2>
              <p className="text-foreground/60">
                Upload an image, video, audio or type a message.
              </p>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`
                  max-w-lg p-4 rounded-2xl shadow-sm border
                  ${
                    msg.role === "user"
                      ? "bg-primary/10 border-primary/20"
                      : "bg-card border-sidebar-border"
                  }
                `}
              >
                {/* User */}
                {msg.role === "user" ? (
                  <>
                    {msg.content && <p className="mb-2">{msg.content}</p>}
                    {msg.file && (
                      <div className="mt-3">
                        {msg.type === "image" && (
                          <img
                            src={URL.createObjectURL(msg.file)}
                            alt="uploaded"
                            className="max-w-xs rounded-lg shadow"
                          />
                        )}
                        {msg.type === "video" && (
                          <video
                            controls
                            className="max-w-xs rounded-lg shadow"
                          >
                            <source
                              src={URL.createObjectURL(msg.file)}
                              type={msg.file.type}
                            />
                          </video>
                        )}
                        {msg.type === "audio" && (
                          <audio controls className="w-full">
                            <source
                              src={URL.createObjectURL(msg.file)}
                              type={msg.file.type}
                            />
                          </audio>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  /* AIdentify */
                  <>
                    {msg.result ? (
                      <div className="flex items-center gap-3">
                        {msg.result === "AI" ? (
                          <XCircle className="w-6 h-6 text-red-400" />
                        ) : (
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        )}
                        <p className="font-semibold">
                          {msg.result === "AI"
                            ? "AI‑Generated"
                            : "Real / Human"}
                        </p>
                      </div>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                    {msg.confidence !== undefined && (
                      <p className="mt-1 text-sm text-foreground/70">
                        Confidence:{" "}
                        <span className="font-bold text-primary">
                          {msg.confidence}%
                        </span>
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isAnalyzing && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 px-4 py-3 bg-card rounded-2xl shadow-sm border border-sidebar-border">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-foreground/70">Analyzing…</span>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="border-t border-sidebar-border bg-background/90 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto p-4">
          {/* Attached file preview */}
          {attachedFile && (
            <div className="mb-2 flex items-center gap-2 bg-sidebar px-3 py-1.5 rounded-full text-xs text-foreground/80 shadow-sm">
              <Paperclip className="w-4 h-4" />
              <span className="truncate max-w-48">{attachedFile.name}</span>
              <button
                onClick={() => setAttachedFile(null)}
                className="ml-1 hover:text-red-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex items-end gap-2 bg-card rounded-2xl border border-sidebar-border p-2 shadow-sm">
            <label className="cursor-pointer p-2 rounded-full hover:bg-sidebar-accent/20 transition-colors">
              <Paperclip className="w-5 h-5 text-foreground/60" />
              <input
                type="file"
                className="hidden"
                accept="image/*,video/*,audio/*"
                onChange={(e) =>
                  e.target.files?.[0] && setAttachedFile(e.target.files[0])
                }
              />
            </label>

            {/* Textarea */}
            <div className="flex-1" {...getRootProps()}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Upload media…"
                className="w-full resize-none bg-transparent text-foreground placeholder-foreground/50 outline-none max-h-32 overflow-y-auto pr-10"
                rows={1}
              />
              <input {...getInputProps()} />
            </div>

            {/* Send Message */}
            <button
              onClick={sendMessage}
              disabled={isAnalyzing || !attachedFile}
              className={`
                p-2 rounded-full transition-all
                ${
                  isAnalyzing || !attachedFile
                    ? "text-foreground/40 cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:cursor-pointer hover:bg-primary/90 shadow-md"
                }
              `}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          <p className="mt-2 text-center text-xs text-foreground/50">
            Files are encrypted and deleted after analysis.
          </p>
        </div>
      </div>
    </div>
  );
}
