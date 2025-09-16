import { Palette } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <Palette className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold">Design Buddy</span>
          </div>
          <p className="text-center text-sm text-muted-foreground max-w-md">
            Transform your space with AI-powered interior design. Upload photos of your rooms and get professional design recommendations in seconds.
          </p>
          <div className="flex flex-col items-center space-y-2 text-xs text-muted-foreground">
            <p>© 2024 Design Buddy. All rights reserved.</p>
            <p>Powered by Google Gemini AI</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
