import { ModeToggle } from "@/components/ModeToggle";

export default function Home() {
  return (
    <div className={"flex min-h-screen items-center justify-center"}>
      <h1 className={"mr-2 font-sora text-4xl font-bold"}>AIdentify</h1>
      <ModeToggle />
    </div>
  );
}
