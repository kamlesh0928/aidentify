"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, ReactNode } from "react";
import { redirect, RedirectType } from "next/navigation";
import Sidebar from "@/components/sidebar/Sidebar";
import { DashboardProvider } from "@/components/dashboard/DashboardProvider";

export default function MainLayout({ children }: { children: ReactNode }) {
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      // If user does not exist redirect him to "/"
      redirect("/", RedirectType.replace);
    }
  }, [user]);

  return (
    <DashboardProvider>
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </DashboardProvider>
  );
}
