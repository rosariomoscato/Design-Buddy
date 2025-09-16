import Link from "next/link";
import { UserProfile } from "@/components/auth/user-profile";
import { ModeToggle } from "./ui/mode-toggle";
import { Palette } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <Palette className="h-5 w-5 text-white" />
            </div>
            <span className="text-primary">
              Design Buddy
            </span>
          </Link>
        </h1>
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard" 
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Design Studio
          </Link>
          <UserProfile />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
