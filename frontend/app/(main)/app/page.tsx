import Link from "next/link";
import { ModeToggle } from "@/components/ModeToggle";
import DetectionArea from "@/components/dashboard/DetectionArea";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="pb-2 flex justify-between items-center bg-background/80 backdrop-blur-md border-b border-sidebar-border sticky top-0 z-50 shadow-sm">
        <Link href="/app" className="hover:cursor-pointer">
          <h1 className="ml-3 text-xl font-bold text-foreground">AIdentify</h1>
        </Link>

        <ModeToggle />
      </header>

      <DetectionArea />
    </div>
  );
}
