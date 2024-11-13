import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="p-8 mb-8 rounded-full bg-secondary">
        <h1 className="text-4xl font-bold text-primary">MATCHUP</h1>
        <p className="text-sm text-center text-primary">Find what you like</p>
      </div>

      <div className="flex items-center justify-center w-full gap-4 space-x-4">
        <Button
          asChild
          className="w-full bg-secondary text-primary hover:bg-secondary/90"
        >
          <Link href="/register">GET STARTED</Link>
        </Button>

        <Button asChild variant="outline" className="w-full text-primary">
          <Link href="/login">I HAVE AN ACCOUNT</Link>
        </Button>
      </div>
    </div>
  );
}
