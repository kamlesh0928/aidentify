import Link from "next/link";
import Image from "next/image";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <header className="flex justify-between items-center px-6 md:px-12 py-5 bg-background/80 backdrop-blur-md border-b border-sidebar-border sticky top-0 z-50 shadow-sm">
      {/* Logo */}
      <Link href="/" className="flex items-center group hover:cursor-pointer">
        <div className="relative">
          <Image
            src="/aidentify-half-logo.svg"
            alt="AIdentify"
            width={42}
            height={42}
            className="transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
          />
          <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl scale-0 group-hover:scale-110 transition-transform duration-500" />
        </div>
        <h1 className="ml-3 text-2xl font-extrabold text-foreground tracking-tight">
          AIdentify
        </h1>
      </Link>

      {/* Auth Buttons */}
      <div className="flex items-center gap-3">
        <SignInButton>
          <button className="px-5 py-2 rounded-xl font-medium text-foreground/80 hover:text-primary transition-all duration-200 hover:scale-105 hover:cursor-pointer">
            Log In
          </button>
        </SignInButton>
        <SignUpButton>
          <button className="px-6 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md hover:shadow-lg hover:scale-105 hover:cursor-pointer active:scale-95 transition-all duration-200 glow-animate">
            Sign Up Free
          </button>
        </SignUpButton>
      </div>
    </header>
  );
}
