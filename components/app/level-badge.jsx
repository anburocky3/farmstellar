"use client";

import { Award, Star, Sparkles } from "lucide-react";

export function LevelBadge({ level, size = "md", showStars = true }) {
  const sizes = {
    sm: "w-16 h-16 text-lg",
    md: "w-24 h-24 text-2xl",
    lg: "w-32 h-32 text-3xl",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Rotating sparkles background */}
      {showStars && (
        <div className="absolute inset-0 animate-spin-slow">
          <Star
            className={`absolute top-0 left-1/2 -translate-x-1/2 text-accent/40 ${iconSizes[size]}`}
          />
          <Star
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 text-accent/40 ${iconSizes[size]}`}
          />
          <Star
            className={`absolute left-0 top-1/2 -translate-y-1/2 text-accent/40 ${iconSizes[size]}`}
          />
          <Star
            className={`absolute right-0 top-1/2 -translate-y-1/2 text-accent/40 ${iconSizes[size]}`}
          />
        </div>
      )}

      {/* Main badge */}
      <div
        className={`${sizes[size]} rounded-full bg-linear-to-br from-accent via-primary to-secondary flex items-center justify-center shadow-xl border-4 border-background relative overflow-hidden`}
      >
        {/* Shine effect */}
        <div className="absolute inset-0 bg-linear-to-br from-white/40 via-transparent to-transparent animate-pulse"></div>

        {/* Level number */}
        <div className="relative z-10 flex flex-col items-center">
          <Award className={`${iconSizes[size]} text-white mb-1`} />
          <span className="font-black text-white drop-shadow-lg">{level}</span>
        </div>
      </div>

      {/* Floating sparkle */}
      {showStars && (
        <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-accent animate-pulse" />
      )}
    </div>
  );
}
