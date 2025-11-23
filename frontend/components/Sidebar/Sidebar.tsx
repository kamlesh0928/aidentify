"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import HistoryIcon from "@mui/icons-material/History";

import { SidebarItem } from "./SidebarItem";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useDashboard } from "../dashboard/DashboardProvider";

export default function Sidebar() {
  const { chats, selectedChatId, createNewChat, selectChat, deleteChat } =
    useDashboard();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const openSidebar = () => setIsOpen(true);

  return (
    <Tooltip.Provider>
      <aside
        className={`
          relative flex flex-col bg-sidebar border-r border-sidebar-border
          transition-all duration-300 ease-in-out h-screen
          ${isOpen ? "w-72 p-5" : "w-[70px] p-3 items-center"}
        `}
      >
        {/* AIdentify Logo */}
        <header className="mb-6">
          <Link
            href="/"
            className="flex items-center group hover:cursor-pointer"
          >
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
          </Link>
        </header>

        {/* New Detection Button */}
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              onClick={createNewChat} // Now adds new chat & selects it
              className={`
                flex w-full items-center justify-center rounded-xl font-medium
                bg-gradient-to-r from-primary to-primary/80 text-primary-foreground
                transition-all duration-200 glow-animate hover:cursor-pointer
                ${
                  isOpen
                    ? "py-3 px-4 space-x-3 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95"
                    : "p-3"
                }
              `}
            >
              <AddCircleOutlineIcon
                className={isOpen ? "w-5 h-5" : "w-6 h-6"}
              />
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

        {/* Recent Analyses (Collapsed) */}
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

        {/* Recent Analyses (Expanded) */}
        {isOpen && (
          <section className="flex-1 mt-6 overflow-y-auto">
            <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
              <HistoryIcon className="w-4 h-4" />
              Recent Analyses
            </h3>
            <div className="space-y-2">
              {chats.map((chat) => (
                <SidebarItem
                  key={chat.id}
                  chat={chat} // FIX: Pass the full chat object required by updated interface
                  isSelected={selectedChatId === chat.id}
                  onClick={() => selectChat(chat.id)}
                  onDelete={() => deleteChat(chat.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-auto pt-4 border-t border-sidebar-border">
          <div
            className={`
              ${
                isOpen
                  ? "flex items-center justify-between"
                  : "flex flex-col items-center space-y-2"
              }
            `}
          >
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-12 h-12 min-w-[44px] min-h-[44px]",
                  userButtonBox: "bg-transparent border-none p-0 m-0",
                  avatarImage: "w-full h-full",
                },
              }}
            />

            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  onClick={toggleSidebar}
                  className={`
                    p-1.5 rounded-full transition-all duration-200 hover:cursor-pointer
                    ${
                      isOpen
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
