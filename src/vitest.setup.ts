// Suppress jsdom "Not implemented: navigation" errors that leak as unhandled
// events — they don't affect test correctness but pollute Vitest's output.
const originalConsoleError = console.error.bind(console);
console.error = (...args: any[]) => {
  const msg = String(args[0]?.message ?? args[0] ?? "");
  if (msg.includes("Not implemented: navigation")) return;
  originalConsoleError(...args);
};
