"use client";

import { Sprout, TrendingUp, User } from "lucide-react";
import { LevelBadge } from "./level-badge";

export default function UserProgressCard({ userData }) {
  const xpLevel = userData?.xpLevel || 0;
  const currentXP = userData?.xp || userData?.currentXP || 0;
  const requiredXP = userData?.requiredXP || 100;
  const level = userData?.level || "beginner";
  const farmerName = userData?.name || "Farmer";
  const farmerType = level === "pro" || level === "Pro" ? "Pro" : "Beginner";
  const progressPercentage = (currentXP / requiredXP) * 100;
  const xpToNextLevel = Math.max(0, requiredXP - currentXP);

  // Count completed quests
  const completedQuestsCount =
    userData?.questsProgress?.filter((q) => q.status === "completed")?.length ||
    0;

  // Generate avatar based on first letter of name
  const getAvatarContent = () => {
    if (farmerName && farmerName !== "Farmer") {
      return farmerName.charAt(0).toUpperCase();
    }
    return <User className="w-8 h-8" />;
  };

  return (
    <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all  flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Profile Avatar */}
          <div className="w-16 h-16 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            {getAvatarContent()}
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
              {farmerType}
            </p>
            <h3 className="text-3xl font-bold text-foreground leading-tight">
              {farmerName}
            </h3>
            <p className="text-2xl font-bold text-primary mt-1">
              Level {xpLevel}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Next Milestone</p>
          <p className="text-lg font-bold text-accent">-{xpToNextLevel} XP</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground font-medium">XP Progress</span>
          <span className="font-bold text-foreground">
            {currentXP} / {requiredXP} XP
          </span>
        </div>
        <div className="relative h-4 bg-muted rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-linear-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <TrendingUp className="w-3 h-3" />
          <span>{progressPercentage.toFixed(1)}% to next level</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <p className="text-3xl font-bold text-primary">{currentXP}</p>
          <p className="text-xs text-muted-foreground mt-1">Total XP</p>
        </div>

        <div className="text-center">
          <p className="text-3xl font-bold text-secondary">
            {completedQuestsCount}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Completed Quests</p>
        </div>
      </div>
    </div>
  );
}
