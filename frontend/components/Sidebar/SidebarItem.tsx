"use client";

import { Trash2 } from "lucide-react";
import { Chat } from "@/components/dashboard/DashboardProvider";

interface SidebarItemProps {
  chat: Chat;
  isSelected?: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export function SidebarItem({
  chat,
  isSelected,
  onClick,
  onDelete,
}: SidebarItemProps) {
  return (
    <div
      onClick={onClick}
      role="button"
      className={`w-full group flex items-center justify-between gap-3 p-3 rounded-xl transition-all duration-200 hover:cursor-pointer
        ${
          isSelected
            ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
            : "text-foreground/60 hover:bg-sidebar-accent hover:text-foreground"
        }`}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="text-left overflow-hidden">
          <h4 className="font-medium truncate text-sm">
            {chat.name || "Untitled Chat"}
          </h4>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-md hover:bg-red-500/10 hover:text-red-500 text-foreground/40"
        title="Delete chat"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
