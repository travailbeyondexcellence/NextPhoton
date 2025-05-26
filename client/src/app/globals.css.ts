// Force Tailwind to Include Scrollbar Utilities
// Sometimes Tailwind purges them unless they're in static strings. Add this somewhere in your code (e.g., globals.css.ts)

const _safelistScroll = [
    "scrollbar-thin",
    "scrollbar-thumb-muted",
    "scrollbar-track-transparent"
  ];