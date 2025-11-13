"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { redirect, RedirectType } from "next/navigation";
import Sidebar from "@/components/Sidebar/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      // If user does not exist redirect him to "/"
      redirect("/", RedirectType.replace);
    }
  });

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
