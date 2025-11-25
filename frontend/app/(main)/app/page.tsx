import Link from "next/link";
import { ModeToggle } from "@/components/ModeToggle";
import DetectionArea from "@/components/dashboard/DetectionArea";
import { MoreOptions } from "@/components/MoreOptions";

export default function DashboardPage() {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <header className="flex-none pb-2 flex justify-between items-center bg-background/80 backdrop-blur-md border-b border-sidebar-border z-50 shadow-sm px-4 pt-4">
        <Link href="/app" className="hover:cursor-pointer">
          <h1 className="text-xl font-bold text-foreground">AIdentify</h1>
        </Link>

        <div className="flex gap-4">
          <ModeToggle />
          <MoreOptions />
        </div>
      </header>

      <main className="flex-1 min-h-0 relative">
        <DetectionArea />
      </main>
    </div>
  );
}
