"use client";

import { useState, useCallback } from "react";
import { Upload, Image, Video, Music } from "lucide-react";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

export function UploadZone({ onFileSelect }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onFileSelect(e.dataTransfer.files[0]);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      className={`relative rounded-3xl p-12 transition-all duration-300 ${
        isDragging
          ? "bg-[#2D2D2D]/90 border-2 border-[#00CED1] shadow-[0_0_40px_rgba(0,206,209,0.4)]"
          : "bg-[#2D2D2D]/60 border-2 border-white/10 hover:border-[#00CED1]/50"
      }`}
      style={{
        backdropFilter: "blur(20px)",
      }}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept="image/*,video/*,audio/*"
        onChange={handleFileInput}
      />

      <label
        htmlFor="file-upload"
        className="flex flex-col items-center gap-6 cursor-pointer"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00CED1] to-[#39FF14] p-[2px]">
          <div className="w-full h-full rounded-2xl bg-[#1A1A1A] flex items-center justify-center">
            <Upload className="w-10 h-10 text-[#00CED1]" />
          </div>
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00CED1] to-[#39FF14] opacity-20 blur-xl" />

        <div className="text-center">
          <h3 className="text-[#FFFFFF] mb-2">Drop your file here</h3>
          <p className="text-[#E0E0E0] opacity-70 mb-4">or click to browse</p>
        </div>

        <div className="flex gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-[#2D2D2D] border border-white/10 flex items-center justify-center">
              <Image className="w-6 h-6 text-[#00CED1]" />
            </div>
            <span className="text-[#E0E0E0] text-sm">Image</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-[#2D2D2D] border border-white/10 flex items-center justify-center">
              <Video className="w-6 h-6 text-[#00CED1]" />
            </div>
            <span className="text-[#E0E0E0] text-sm">Video</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-[#2D2D2D] border border-white/10 flex items-center justify-center">
              <Music className="w-6 h-6 text-[#00CED1]" />
            </div>
            <span className="text-[#E0E0E0] text-sm">Audio</span>
          </div>
        </div>
      </label>
    </div>
  );
}
