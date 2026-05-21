export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-1 h-8 bg-mauve/60 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
        <p className="text-xs font-light text-sage tracking-[0.2em] uppercase">
          Loading
        </p>
      </div>
    </div>
  );
}
