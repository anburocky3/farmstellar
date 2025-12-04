"use client";

import { Trophy, Award, Medal, Crown } from "lucide-react";
import { useEffect, useState } from "react";
import { getStoredToken } from "@/lib/auth";
import { useTranslation } from "react-i18next";

export default function LeaderboardCard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = getStoredToken();

        // Get current user ID from our Next API
        if (token) {
          const userRes = await fetch(`/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (userRes.ok) {
            const payload = await userRes.json();
            // payload shape: { success: true, user: { id, ... } }
            const user = payload?.user;
            if (user) setCurrentUserId(user.id || user._id);
          }
        }

        const response = await fetch(`/api/leaderboard?limit=4`);
        if (!response.ok) throw new Error("Failed to fetch leaderboard");

        const data = await response.json();
        setLeaderboardData(data);
        setLoading(false);
      } catch (err) {
        console.error("Leaderboard error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return (
          <span className="text-sm font-bold text-muted-foreground">
            #{rank}
          </span>
        );
    }
  };

  const getAvatar = (name) => {
    // Generate consistent emoji based on first letter
    const firstLetter = name.charAt(0).toUpperCase();
    const emojis = ["🌟", "🏆", "⭐", "🌱", "🌿", "🌾", "🍀", "🌺", "🌻", "🌼"];
    const index = firstLetter.charCodeAt(0) % emojis.length;
    return emojis[index];
  };

  if (loading) {
    return (
      <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-lg h-full">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/2 mb-6"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-muted rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !leaderboardData.length) {
    return (
      <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-lg h-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-accent/10 rounded-2xl">
            <Trophy className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">
              {t("dashboard.leaderboard.title")}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t("dashboard.leaderboard.subtitle")}
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground text-center py-8">
          {error || t("dashboard.leaderboard.noData")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-accent/10 rounded-2xl">
          <Trophy className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">
            {t("dashboard.leaderboard.title")}
          </h3>
          <p className="text-xs text-muted-foreground">
            {t("dashboard.leaderboard.subtitle")}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {leaderboardData.map((user) => {
          const isCurrentUser = user._id === currentUserId;
          return (
            <div
              key={user.rank}
              className={`flex items-center gap-3 p-3 rounded-2xl transition-all hover:scale-[1.02] ${
                isCurrentUser
                  ? "bg-gradient-to-r from-primary/20 to-primary/5 border-2 border-primary shadow-md"
                  : user.rank <= 3
                  ? "bg-gradient-to-r from-accent/10 to-transparent border border-accent/20"
                  : "bg-muted/30 hover:bg-muted/50"
              }`}
            >
              {/* Rank */}
              <div className="w-8 h-8 flex items-center justify-center">
                {getRankIcon(user.rank)}
              </div>

              {/* Avatar */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                  isCurrentUser
                    ? "bg-primary/20 ring-2 ring-primary"
                    : "bg-primary/10"
                }`}
              >
                {getAvatar(user.name)}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p
                    className={`font-semibold text-sm truncate ${
                      isCurrentUser ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {user.name}
                  </p>
                  {isCurrentUser && (
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {t("dashboard.leaderboard.you")}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    {user.xp} XP
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    Level {user.xpLevel}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          {t("dashboard.leaderboard.climbRanks")}
        </p>
      </div>
    </div>
  );
}
