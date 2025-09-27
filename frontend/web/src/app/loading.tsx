export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen relative">
      {/* Theme-aware background gradient */}
      <div className="fixed inset-0 -z-10 theme-gradient" />
      
      {/* Loading indicator */}
      <div className="flex flex-col items-center gap-4">
        {/* Spinning loader */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        
        {/* Loading text */}
        <div className="text-foreground/80 font-medium animate-pulse">
          Loading...
        </div>
      </div>
    </div>
  );
}