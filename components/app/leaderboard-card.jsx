"use client";

import { Trophy, Award, Medal, Crown } from "lucide-react";

export default function LeaderboardCard() {
  const leaderboardData = [
    { rank: 1, name: "Priya Sharma", xp: 1250, badges: 8, avatar: "🌟" },
    { rank: 2, name: "Arjun Patel", xp: 1180, badges: 7, avatar: "🏆" },
    { rank: 3, name: "Lakshmi Reddy", xp: 1050, badges: 6, avatar: "⭐" },
    { rank: 4, name: "Rajesh Kumar", xp: 950, badges: 5, avatar: "🌱" },
    { rank: 5, name: "Meera Singh", xp: 890, badges: 5, avatar: "🌿" },
  ];

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

  return (
    <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-accent/10 rounded-2xl">
          <Trophy className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">Leaderboard</h3>
          <p className="text-xs text-muted-foreground">
            Top Farmers This Month
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {leaderboardData.map((user) => (
          <div
            key={user.rank}
            className={`flex items-center gap-3 p-3 rounded-2xl transition-all hover:scale-[1.02] ${
              user.rank <= 3
                ? "bg-linear-to-r from-accent/10 to-transparent border border-accent/20"
                : "bg-muted/30 hover:bg-muted/50"
            }`}
          >
            {/* Rank */}
            <div className="w-8 h-8 flex items-center justify-center">
              {getRankIcon(user.rank)}
            </div>

            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
              {user.avatar}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm truncate">
                {user.name}
              </p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  {user.xp} XP
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  {user.badges} badges
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          Keep learning to climb the ranks! 🚀
        </p>
      </div>
    </div>
  );
}
