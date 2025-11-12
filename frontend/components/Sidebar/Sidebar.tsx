"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import HistoryIcon from "@mui/icons-material/History";

import SidebarItem from "./SidebarItem";
import * as Tooltip from "@radix-ui/react-tooltip";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const dummyData = [
    { chatName: "123", detectionResult: "AI" },
    { chatName: "456", detectionResult: "Real" },
  ];

  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const openSidebar = () => setIsOpen(true);
  const handleNewDetection = () => alert("New Detection");

  return (
    <Tooltip.Provider>
      <aside
        className={`
          relative flex flex-col bg-sidebar border-r border-sidebar-border
          transition-all duration-300 ease-in-out h-screen
          ${isOpen ? "w-72 p-5" : "w-[70px] p-3 items-center"}
        `}
      >
        {/* ---------- LOGO ---------- */}
        <header className="mb-6">
          <Link href="/" className="flex items-center group hover:cursor-pointer">
            <div className="relative">
              <Image
                src="/aidentify-half-logo.svg"
                alt="AIdentify"
                width={isOpen ? 36 : 32}
                height={isOpen ? 36 : 32}
                className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
              />
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl scale-0 group-hover:scale-100 transition-transform duration-500" />
            </div>
            {isOpen && (
              <h3 className="ml-3 text-xl font-bold text-sidebar-foreground tracking-tight">
                AIdentify
              </h3>
            )}
          </Link>
        </header>

        {/* ---------- NEW DETECTION ---------- */}
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              onClick={handleNewDetection}
              className={`
                flex w-full items-center justify-center rounded-xl font-medium
                bg-gradient-to-r from-primary to-primary/80 text-primary-foreground
                transition-all duration-200 glow-animate hover:cursor-pointer
                ${isOpen
                  ? "py-3 px-4 space-x-3 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95"
                  : "p-3"
                }
              `}
            >
              <AddCircleOutlineIcon className={isOpen ? "w-5 h-5" : "w-6 h-6"} />
              {isOpen && <span>New Detection</span>}
            </button>
          </Tooltip.Trigger>
          {!isOpen && (
            <Tooltip.Portal>
              <Tooltip.Content
                side="right"
                className="z-50 rounded-md bg-sidebar-foreground/90 px-3 py-1.5 text-xs text-sidebar-background shadow-lg"
                sideOffset={5}
              >
                New Detection
                <Tooltip.Arrow className="fill-sidebar-foreground/90" />
              </Tooltip.Content>
            </Tooltip.Portal>
          )}
        </Tooltip.Root>

        {/* ---------- CloseD: HISTORY ICON (top-aligned) ---------- */}
        {!isOpen && (
          <div className="mt-4 w-full flex justify-center">
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  onClick={openSidebar}
                  className="p-2 rounded-lg hover:bg-sidebar-accent/30 transition-colors hover:cursor-pointer"
                  aria-label="View recent analyses"
                >
                  <HistoryIcon className="w-6 h-6 text-sidebar-foreground/70" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="right"
                  className="z-50 rounded-md bg-sidebar-foreground/90 px-3 py-1.5 text-xs text-sidebar-background shadow-lg"
                  sideOffset={5}
                >
                  Recent Analyses
                  <Tooltip.Arrow className="fill-sidebar-foreground/90" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>
        )}

        {/* ---------- OpenED: RECENT LIST ---------- */}
        {isOpen && (
          <section className="flex-1 mt-6 overflow-y-auto">
            <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
              <HistoryIcon className="w-4 h-4" />
              Recent Analyses
            </h3>
            <div className="space-y-2">
              {dummyData.map((d) => (
                <SidebarItem
                  key={d.chatName}
                  filename={d.chatName}
                  result={d.detectionResult}
                  isSelected={selectedChat === d.chatName}
                  onSelect={() => setSelectedChat(d.chatName)}
                />
              ))}
            </div>
          </section>
        )}

        {/* ---------- FOOTER ---------- */}
        <footer className="mt-auto pt-4 border-t border-sidebar-border">
          <div
            className={`
              ${isOpen ? "flex items-center justify-between" : "flex flex-col items-center space-y-2"}
            `}
          >
            {/* Brand */}
            <span
              className="text-xs font-medium text-sidebar-foreground/70 select-none"
              aria-hidden="true"
            >
              {isOpen ? "AIdentify" : "A"}
            </span>

            {/* Toggle – visual feedback */}
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  onClick={toggleSidebar}
                  className={`
                    p-1.5 rounded-full transition-all duration-200 hover:cursor-pointer
                    ${isOpen
                      ? "bg-sidebar-accent/40 text-sidebar-accent-foreground scale-110"
                      : "hover:bg-sidebar-accent/30"
                    }
                  `}
                  aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
                >
                  {isOpen ? (
                    <KeyboardDoubleArrowLeftIcon className="w-5 h-5" />
                  ) : (
                    <KeyboardDoubleArrowRightIcon className="w-5 h-5" />
                  )}
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="right"
                  className="z-50 rounded-md bg-sidebar-foreground/90 px-3 py-1.5 text-xs text-sidebar-background shadow-lg"
                  sideOffset={5}
                >
                  {isOpen ? "Close sidebar" : "Open sidebar"}
                  <Tooltip.Arrow className="fill-sidebar-foreground/90" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>
        </footer>
      </aside>
    </Tooltip.Provider>
  );
}