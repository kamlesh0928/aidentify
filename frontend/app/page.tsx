"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { redirect, RedirectType } from "next/navigation";
import Footer from "@/components/Footer";
import LandingPage from "@/components/LandingPage";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      // If user exist redirect him to "/app"
      redirect("/app", RedirectType.replace);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-center text-foreground px-6">
      <Navbar />
      <LandingPage />
      <Footer />
    </div>
  );
}
