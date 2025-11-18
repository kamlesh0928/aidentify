"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
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
import toast from "react-hot-toast";

interface Message {
  id: string;
  role: "user" | "aidentify";
  file: File;
  type: "image" | "video" | "audio";
  result?: "AI" | "Real";
  confidence?: number;
}

const SERVER_URL = "http://localhost:5001";

export default function DetectionArea() {
  const { selectedChatId, chats, addMessageToChat, updateChatResult } =
    useDashboard();

  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedChat = chats.find((c) => c.id === selectedChatId);
  const messages: Message[] = (selectedChat?.messages as Message[]) ?? [];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    if (acceptedFiles[0]) setAttachedFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    multiple: false,
    noClick: true,
  });

  const handleSubmit = async () => {
    if (!selectedChatId || !attachedFile) return;

    const fileType = attachedFile.type;
    const type: "image" | "video" | "audio" = fileType.startsWith("video/")
      ? "video"
      : fileType.startsWith("audio/")
      ? "audio"
      : "image";

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      file: attachedFile,
      type,
    };

    addMessageToChat(selectedChatId, userMsg);
    setAttachedFile(null);
    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append("file", attachedFile);

    const endpoint =
      type === "image"
        ? "/backend/api/image/analyze"
        : type === "video"
        ? "/backend/api/video/analyze"
        : "/backend/api/audio/analyze";

    try {
      console.log("Uploading to:", endpoint);
      const response = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 300000,
      });

      console.log("Success:", response.data);

      const aidentifyMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "aidentify",
        file: attachedFile,
        type,
        result: response.data.result,
        confidence: response.data.confidence,
      };

      addMessageToChat(selectedChatId, aidentifyMsg);
      updateChatResult(
        selectedChatId,
        response.data.result,
        response.data.confidence
      );
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
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.length === 0 && (
            <div className="text-center py-24">
              <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Paperclip className="w-14 h-14 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-3">
                Detect AI in Media
              </h2>
              <p className="text-foreground/60 text-lg">
                Upload an image, video, or audio file (.mp3, .wav)
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
                  // User: Show media
                  <div>
                    {msg.type === "image" && (
                      <img
                        src={URL.createObjectURL(msg.file)}
                        alt="Upload"
                        className="max-w-md rounded-xl shadow-xl"
                      />
                    )}
                    {msg.type === "video" && (
                      <video controls className="max-w-md rounded-xl shadow-xl">
                        <source src={URL.createObjectURL(msg.file)} />
                      </video>
                    )}
                    {msg.type === "audio" && (
                      <audio controls className="w-full">
                        <source src={URL.createObjectURL(msg.file)} />
                      </audio>
                    )}
                  </div>
                ) : (
                  // aidentify: Show result
                  <div className="flex items-center gap-4">
                    {msg.result === "AI" ? (
                      <XCircle className="w-10 h-10 text-red-500" />
                    ) : (
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    )}
                    <div>
                      <p className="text-2xl font-bold">
                        {msg.result === "AI"
                          ? "AI-Generated"
                          : "Real / Human-Made"}
                      </p>
                      <p className="text-foreground/70">
                        Confidence:{" "}
                        <span className="font-bold text-primary text-xl">
                          {msg.confidence}%
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isAnalyzing && (
            <div className="flex justify-start">
              <div className="px-6 py-4 bg-card rounded-2xl border border-sidebar-border flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="text-lg">Analyzing your media...</span>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </div>

      {/* Fixed Bottom Input */}
      <div className="border-t border-sidebar-border bg-background/95 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto p-6">
          {attachedFile && (
            <div className="mb-4 flex items-center justify-between bg-sidebar px-5 py-3 rounded-2xl">
              <span className="text-foreground/80 truncate max-w-md">
                {attachedFile.name}
              </span>
              <button
                onClick={() => setAttachedFile(null)}
                className="hover:text-red-400"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-4 bg-card rounded-2xl border border-sidebar-border p-4 shadow-xl">
            <label className="cursor-pointer p-4 rounded-full hover:bg-sidebar-accent/20 transition">
              <Paperclip className="w-7 h-7 text-foreground/70" />
              <input
                type="file"
                className="hidden"
                accept="image/*,video/*,audio/mpeg,audio/wav"
                onChange={(e) =>
                  e.target.files?.[0] && setAttachedFile(e.target.files[0])
                }
              />
            </label>

            <div className="flex-1" {...getRootProps()}>
              <input {...getInputProps()} />
              <button
                onClick={open}
                className="w-full text-left px-6 py-4 text-foreground/60 hover:text-foreground text-lg font-medium"
              >
                Drop or click to upload image, video, or audio
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!attachedFile || isAnalyzing}
              className={`
                p-4 rounded-full transition-all shadow-lg
                ${
                  attachedFile && !isAnalyzing
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }
              `}
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
