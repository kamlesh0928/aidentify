import type { Metadata } from "next";
import { Sora, Poppins } from "next/font/google";
import "./globals.css";

const sora = Sora({
  weight: ["600", "800"],
  variable: "--font-sora",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["400", "500"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AIdentify",
  description: "Detect AI-generated content with AIdentify",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${sora.variable} ${poppins.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
