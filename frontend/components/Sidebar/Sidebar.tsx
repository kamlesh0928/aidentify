"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SidebarItem from "./SidebarItem";

export default function Sidebar() {
  const [isSideBarOpen] = useState(true);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const sidebarDummyData = [
    { chatName: "123", detectionResult: "AI" },
    { chatName: "456", detectionResult: "Real" },
  ];

  const handleNewChat = () => {
    alert("New detection started!");
  };

  return (
    <aside
      className={`min-h-screen w-72 bg-sidebar border-r border-sidebar-border p-5 flex flex-col transition-all duration-300 ${
        isSideBarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* AIdentify Logo */}
      <header className="mb-8">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <Image
              src="/aidentify-half-logo.svg"
              alt="AIdentify logo"
              width={36}
              height={36}
              className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
            />
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl scale-0 group-hover:scale-100 transition-transform duration-500" />
          </div>
          <span className="text-xl sora font-bold text-sidebar-foreground tracking-tight">
            AIdentify
          </span>
        </Link>
      </header>

      {/* New Detection Button */}
      <button
        onClick={handleNewChat}
        className="mb-8 flex items-center justify-center space-x-3 w-full py-3 px-4 
                   bg-gradient-to-r from-primary to-primary/80 text-primary-foreground 
                   rounded-xl font-medium shadow-lg hover:shadow-xl 
                   transform hover:scale-[1.02] active:scale-95 
                   transition-all duration-200 glow-animate"
      >
        <AddCircleOutlineIcon className="w-5 h-5" />
        <span>New Detection</span>
      </button>

      {/* Recent Analyses */}
      <section className="flex-1">
        <h3 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider mb-3">
          Recent Analyses
        </h3>
        <div className="space-y-2">
          {sidebarDummyData.map((data) => (
            <SidebarItem
              key={data.chatName}
              filename={data.chatName}
              result={data.detectionResult}
              isSelected={selectedChat === data.chatName}
              onSelect={() => setSelectedChat(data.chatName)}
            />
          ))}
        </div>
      </section>

      <footer className="mt-auto pt-6 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/50 text-center">
          © 2025 AIdentify
        </p>
      </footer>
    </aside>
  );
}