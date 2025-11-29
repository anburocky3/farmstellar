"use client";

import { Zap, Trophy, Share2, ArrowRight, Users } from "lucide-react";

export function RewardScreen({
  quest,
  userData,
  onComplete,
  onContinue,
  onNextQuest,
}) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `I completed the ${quest.title} Quest!`,
        text: `I just earned the ${quest.badgeName} badge on Farmstellar! 🌱`,
        url: window.location.href,
      });
    } else {
      alert(
        "Sharing is not supported on this browser, but you can take a screenshot!"
      );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden relative">
      {/* Confetti/Background Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-accent rounded-full animate-bounce"></div>
      </div>

      {/* Content - No Scroll */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 max-w-md mx-auto w-full">
        {/* Celebration */}
        <div className="text-center space-y-2 mb-6">
          <div className="flex justify-center text-5xl mb-3 animate-bounce">
            🎉
          </div>
          <h2 className="text-3xl font-black text-foreground text-balance tracking-tight">
            Quest Complete!
          </h2>
          <p className="text-muted-foreground text-sm">
            Amazing work! You've earned rewards for completing{" "}
            <span className="text-foreground font-bold">{quest.title}</span>
          </p>
        </div>

        {/* Rewards Card */}
        <div className="w-full bg-card/50 backdrop-blur-xl border border-border rounded-3xl p-6 shadow-2xl space-y-4">
          {/* XP */}
          <div className="flex items-center justify-between p-3 bg-primary/5 rounded-2xl border border-primary/10">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-xl">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-bold text-muted-foreground">
                XP Earned
              </span>
            </div>
            <span className="text-2xl font-black text-primary">
              +{quest.xpReward}
            </span>
          </div>

          {/* Badge */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center shadow-lg shadow-accent/20">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-accent uppercase tracking-wider mb-1">
                New Badge
              </p>
              <h3 className="text-lg font-bold text-foreground">
                {quest.badgeName}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Button Container */}
      <div className="p-6 bg-background">
        <div className="flex flex-col gap-3 max-w-md mx-auto">
          {/* Primary Action - Complete Quest */}
          <button
            onClick={onContinue}
            className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transform active:scale-[0.98]"
          >
            <Trophy className="w-5 h-5" />
            Complete Quest
          </button>

          {/* Secondary Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => alert("Shared to Community Feed! (Simulation)")}
              className="flex-1 bg-accent/10 text-accent font-bold py-3 rounded-xl hover:bg-accent/20 transition-colors flex items-center justify-center gap-2 border border-accent/20"
            >
              <Users className="w-5 h-5" />
              Share to Community
            </button>
            <button
              onClick={onNextQuest}
              className="flex-1 bg-secondary/50 text-secondary-foreground font-bold py-3 rounded-xl hover:bg-secondary/70 transition-colors flex items-center justify-center gap-2 border border-secondary/20"
            >
              Next Quest
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
