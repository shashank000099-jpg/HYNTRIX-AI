export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-surface/90 px-8 py-10 shadow-soft">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/10 border-t-primary"></div>
        <p className="text-sm text-slate-300">Building your AI operating system...</p>
      </div>
    </div>
  );
}
