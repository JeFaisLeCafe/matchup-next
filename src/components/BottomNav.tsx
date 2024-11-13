"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-16 px-4 bg-white border-t sm:hidden">
      <Link
        href="/"
        className={cn(
          "flex flex-col items-center justify-center",
          pathname === "/" ? "text-primary" : "text-muted-foreground"
        )}
      >
        <Home className="w-6 h-6" />
      </Link>
      <Link
        href="/create"
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-lg",
          pathname === "/create" ? "bg-accent" : "bg-primary"
        )}
      >
        <Plus className="w-6 h-6" />
      </Link>
      <Link
        href="/profile"
        className={cn(
          "flex flex-col items-center justify-center",
          pathname === "/profile" ? "text-primary" : "text-muted-foreground"
        )}
      >
        <User className="w-6 h-6" />
      </Link>
    </nav>
  );
}
