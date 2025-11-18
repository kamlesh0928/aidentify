"use client";

import React from "react";
import clsx from "clsx";
import { Trash2 } from "lucide-react";
import { useDashboard } from "@/components/dashboard/DashboardProvider";

interface Props {
  chatId: string;
  filename: string;
  result: string;
  isSelected?: boolean;
}

export default function SidebarItem({
  chatId,
  filename,
  result,
  isSelected = false,
}: Props) {
  const { selectChat, deleteChat } = useDashboard();

  const badge =
    result === "AI"
      ? "bg-red-500/20 text-red-400 border-red-500/30"
      : result === "Real"
      ? "bg-green-500/20 text-green-400 border-green-500/30"
      : "bg-muted text-muted-foreground";

  return (
    <div className="group relative">
      <button
        onClick={() => selectChat(chatId)}
        className={clsx(
          "w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between",
          "hover:bg-sidebar-accent/50 hover:border-sidebar-accent/50",
          isSelected
            ? "bg-sidebar-accent/40 border-sidebar-accent text-sidebar-accent-foreground shadow-sm"
            : "bg-sidebar/50 border-sidebar-border"
        )}
      >
        <h4 className="font-medium text-sidebar-foreground truncate max-w-[120px]">
          {filename}
        </h4>
        <span
          className={clsx(
            "px-2.5 py-0.5 text-xs font-semibold rounded-full border",
            badge
          )}
        >
          {result}
        </span>
      </button>

      {/* Delete Button (appears on hover) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (confirm("Delete this detection?")) {
            deleteChat(chatId);
          }
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-red-500/20"
      >
        <Trash2 className="w-4 h-4 text-red-400" />
      </button>
    </div>
  );
}
