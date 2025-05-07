
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm transition-opacity duration-300 ease-in-out animate-fadeIn">
      <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
      <p className="text-xl font-semibold text-foreground animate-pulse">
        Loading next page...
      </p>
    </div>
  );
}
