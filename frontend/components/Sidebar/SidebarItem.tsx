"use client";

import { MessageSquare } from "lucide-react";
import { Chat } from "@/components/dashboard/DashboardProvider";

interface SidebarItemProps {
  chat: Chat;
  isSelected?: boolean;
  onClick: () => void;
}

export function SidebarItem({ chat, isSelected, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 
        ${
          isSelected
            ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
            : "text-foreground/60 hover:bg-sidebar-accent hover:text-foreground"
        }`}
    >
      <div
        className={`p-2 rounded-lg transition-colors ${
          isSelected
            ? "bg-primary/20"
            : "bg-sidebar-accent/50 group-hover:bg-sidebar-accent"
        }`}
      >
        <MessageSquare className="w-4 h-4" />
      </div>

      <div className="flex-1 text-left overflow-hidden">
        <h4 className="font-medium truncate text-sm">
          {chat.name || "Untitled Chat"}
        </h4>
      </div>
    </button>
  );
}
