import React from "react";
import clsx from "clsx";

interface Props {
    filename: string;
    result: string;
    isSelected?: boolean;
    onSelect?: () => void;
}

export default function SidebarItem({
    filename,
    result,
    isSelected = false,
    onSelect,
}: Props) {
    const badge = result === "AI"
        ? "bg-red-500/20 text-red-400 border-red-500/30"
        : "bg-green-500/20 text-green-400 border-green-500/30";

    return (
        <button
            onClick={onSelect}
            className={clsx(
                "w-full text-left p-3 rounded-lg border transition-all",
                "hover:bg-sidebar-accent/50 hover:border-sidebar-accent/50",
                isSelected
                    ? "bg-sidebar-accent/40 border-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "bg-sidebar/50 border-sidebar-border"
            )}
        >
            <div className="flex items-center justify-between">
                <h4 className="font-medium text-sidebar-foreground truncate max-w-[140px]">
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
            </div>
        </button>
    );
}