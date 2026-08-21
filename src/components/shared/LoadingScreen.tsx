import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  message?: string;
  className?: string;
  fullscreen?: boolean;
}

export function LoadingScreen({
  message = "Loading MedDoc...",
  className,
  fullscreen = true,
}: LoadingScreenProps) {
  const [submessage, setSubmessage] = useState("Initializing secure session...");

  useEffect(() => {
    const submessages = [
      "Initializing secure session...",
      "Connecting to clinical databases...",
      "Loading personalized health dashboard...",
      "Configuring AI medical assistant...",
      "Checking appointment schedules...",
    ];
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % submessages.length;
      setSubmessage(submessages[currentIndex]!);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  const loaderContent = (
    <div className="flex flex-col items-center justify-center text-center p-6 max-w-sm mx-auto">
      {/* Glow Backdrop Effect */}
      <div className="relative group">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 opacity-20 blur-xl group-hover:opacity-30 transition duration-1000 group-hover:duration-200 animate-pulse" />

        {/* GIF container with smooth shadow and ring */}
        <div className="relative size-32 md:size-36 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl flex items-center justify-center">
          <img
            src="/downloaded-file.gif"
            alt="Loading animation"
            className="size-full object-cover scale-110"
            onError={(e) => {
              // Fallback to text spinner if GIF fails to load
              e.currentTarget.style.display = "none";
              const fallback = e.currentTarget.parentElement?.querySelector(".fallback-spinner");
              if (fallback) fallback.classList.remove("hidden");
            }}
          />
          {/* Fallback spinner if GIF fails or doesn't exist */}
          <div className="fallback-spinner hidden absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#15A6A6] border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>

      {/* Main loading message */}
      <h2 className="mt-8 text-xl font-bold tracking-tight text-[#0E3860] dark:text-blue-100">
        {message}
      </h2>

      {/* Dynamic details submessage */}
      <p className="mt-2 text-xs font-medium text-muted-foreground min-h-[16px] animate-pulse">
        {submessage}
      </p>

      {/* Modern thin loading progress line */}
      <div className="w-48 h-0.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-6 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-teal-500 to-[#0E3860] dark:to-blue-400 rounded-full w-2/3 animate-[shimmer_1.5s_infinite_linear]" style={{
          backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
          backgroundSize: "200% 100%"
        }} />
      </div>
    </div>
  );

  if (fullscreen) {
    return (
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center bg-slate-50/90 dark:bg-slate-950/95 backdrop-blur-md transition-all duration-300",
          className
        )}
      >
        {loaderContent}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex min-h-[400px] w-full items-center justify-center bg-transparent transition-all duration-300",
        className
      )}
    >
      {loaderContent}
    </div>
  );
}
