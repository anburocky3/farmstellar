"use client";

import {
  ChevronLeft,
  TrendingUp,
  Trophy,
  Award,
  BookOpen,
  Target,
  Star,
  Calendar,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function RewardsPage() {
  const ACTIVITY_DATA = {
    dailyXP: [45, 65, 50, 80, 70, 90, 75],
    weeklyQuests: [1, 2, 1, 3, 2, 4, 3],
    learningHours: [1.2, 1.8, 1.5, 2.2, 2.0, 2.6, 2.4],
  };

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("farmquest_userdata") || "{}");
    setUserData(data);
  }, []);

  const ACHIEVEMENT_MILESTONES = [
    { label: "First Quest", completed: true, date: "Jan 15" },
    //  { label: "5 Day Streak", completed: true, date: "Jan 20" },
    { label: "Level 3", completed: true, date: "Jan 22" },
    { label: "10 Quests", completed: false, date: "In Progress" },
    { label: "Level 5", completed: false, date: "Locked" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card sticky top-0 z-10">
        <button
          onClick={() => window.history.back()}
          className="p-2 hover:bg-muted rounded-xl transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold">Progress Tracker</h1>
        <div className="w-9"></div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-2xl p-5 border border-border shadow-sm text-center">
            <Trophy className="w-8 h-8 text-accent mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">
              {userData?.completedQuests?.length || 3}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Quests Done</p>
          </div>
          <div className="bg-card rounded-2xl p-5 border border-border shadow-sm text-center">
            <Award className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">
              {userData?.badges?.length || 2}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Badges</p>
          </div>
          <div className="bg-card rounded-2xl p-5 border border-border shadow-sm text-center">
            <Star className="w-8 h-8 text-accent mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">
              {userData?.level || 3}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Level</p>
          </div>
          <div className="bg-card rounded-2xl p-5 border border-border shadow-sm text-center">
            <Zap className="w-8 h-8 text-accent mx-auto mb-2" />
            {/* <p className="text-3xl font-bold text-foreground">{userData?.currentStreak || 7}</p>
            <p className="text-xs text-muted-foreground mt-1">Day Streak</p> */}
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-accent/10 rounded-xl">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-bold text-foreground">Daily XP Earned</h3>
          </div>
          <div className="bg-linear-to-b from-accent/5 to-transparent rounded-xl p-4 h-48 flex items-end justify-around gap-2">
            {ACTIVITY_DATA.dailyXP.map((xp, idx) => (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div
                  className="w-full bg-linear-to-t from-accent to-accent/60 rounded-t-lg transition-all hover:from-primary hover:to-primary/60"
                  style={{ height: `${(xp / 90) * 100}%` }}
                ></div>
                <span className="text-xs text-muted-foreground">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx]}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-2xl font-bold text-foreground">
              {userData?.currentXP || 235} XP
            </p>
            <p className="text-sm text-muted-foreground">
              Total earned this week
            </p>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-bold text-foreground">
              Weekly Quest Completion
            </h3>
          </div>
          <div className="bg-linear-to-b from-primary/5 to-transparent rounded-xl p-4 h-48 flex items-end justify-around gap-2">
            {ACTIVITY_DATA.weeklyQuests.map((count, idx) => (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div
                  className="w-full bg-linear-to-t from-primary to-primary/60 rounded-t-lg"
                  style={{ height: `${(count / 4) * 100}%` }}
                ></div>
                <span className="text-xs text-muted-foreground">
                  W{idx + 1}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-2xl font-bold text-foreground">
              {userData?.completedQuests?.length || 3}
            </p>
            <p className="text-sm text-muted-foreground">
              Total quests completed
            </p>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-accent/10 rounded-xl">
              <BookOpen className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-bold text-foreground">
              Learning Hours (Daily)
            </h3>
          </div>
          <div className="bg-linear-to-b from-accent/5 to-transparent rounded-xl p-4 h-48 flex items-end justify-around gap-2">
            {ACTIVITY_DATA.learningHours.map((hours, idx) => (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div
                  className="w-full bg-linear-to-t from-accent to-accent/60 rounded-t-lg"
                  style={{ height: `${(hours / 2.6) * 100}%` }}
                ></div>
                <span className="text-xs text-muted-foreground">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx]}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-2xl font-bold text-foreground">15.2 hrs</p>
            <p className="text-sm text-muted-foreground">
              Total learning time this week
            </p>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-accent/10 rounded-xl">
              <Award className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-bold text-foreground">
              Achievement Milestones
            </h3>
          </div>
          <div className="space-y-3">
            {ACHIEVEMENT_MILESTONES.map((milestone, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-4 rounded-xl border-2 ${
                  milestone.completed
                    ? "bg-accent/5 border-accent/30"
                    : "bg-muted/50 border-border opacity-60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      milestone.completed
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {milestone.completed ? "✓" : "🔒"}
                  </div>
                  <span className="font-medium text-foreground">
                    {milestone.label}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {milestone.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-linear-to-br from-accent/10 to-primary/10 rounded-2xl p-6 border border-accent/20">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-accent" />
            <h3 className="font-bold text-foreground">This Month Summary</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-accent">18</p>
              <p className="text-sm text-muted-foreground mt-1">Active Days</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">92%</p>
              <p className="text-sm text-muted-foreground mt-1">
                Completion Rate
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
