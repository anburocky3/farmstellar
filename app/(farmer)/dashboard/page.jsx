"use client";

import { Sun, Sparkles } from "lucide-react";
import LeaderboardCard from "../../../components/app/leaderboard-card";
import { UserProgressCard } from "../../../components/app/user-progress-card";
import { WeatherAlertCard } from "../../../components/app/weather-alert-card";
import { OngoingQuestsCard } from "../../../components/app/ongoing-quests-card";

export default function FarmerDashboard({ userData, onStartQuest }) {
  const handleResumeQuest = (questId) => {
    if (onStartQuest) {
      onStartQuest(questId);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-3 ml-16">
            <div className="w-10 h-10 bg-linear-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-accent" />
                <h1 className="text-lg sm:text-xl font-bold text-foreground">
                  Good Morning, {userData?.name || "Farmer"}!
                </h1>
              </div>
              <p className="text-xs text-muted-foreground">
                Ready to grow your knowledge today? 🌱
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content (2/3 width on desktop) */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Progress Bar */}
            <UserProgressCard userData={userData} />

            {/* Weather Alert Widget */}
            <WeatherAlertCard
              location={userData?.location || "Bangalore Rural, Karnataka"}
            />

            {/* Ongoing Quests Section */}
            <OngoingQuestsCard onResumeQuest={handleResumeQuest} />
          </div>

          {/* Right Column - Leaderboard (1/3 width on desktop) */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <LeaderboardCard />
            </div>
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className="mt-8 bg-card border-2 border-border rounded-3xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-foreground mb-6">
            Your Achievements
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-linear-to-br from-primary/10 to-transparent rounded-2xl border border-primary/20 hover:scale-105 transition-transform">
              <p className="text-3xl font-bold text-primary mb-1">
                {userData?.completedQuests?.length || 3}
              </p>
              <p className="text-xs text-muted-foreground">Quests Completed</p>
            </div>
            <div className="text-center p-4 bg-linear-to-br from-accent/10 to-transparent rounded-2xl border border-accent/20 hover:scale-105 transition-transform">
              <p className="text-3xl font-bold text-accent mb-1">
                {userData?.badges?.length || 2}
              </p>
              <p className="text-xs text-muted-foreground">Badges Earned</p>
            </div>
            <div className="text-center p-4 bg-linear-to-br from-secondary/10 to-transparent rounded-2xl border border-secondary/20 hover:scale-105 transition-transform">
              <p className="text-3xl font-bold text-secondary mb-1">15</p>
              <p className="text-xs text-muted-foreground">Hours Learned</p>
            </div>
            <div className="text-center p-4 bg-linear-to-br from-primary/10 to-transparent rounded-2xl border border-primary/20 hover:scale-105 transition-transform">
              <p className="text-3xl font-bold text-primary mb-1">92%</p>
              <p className="text-xs text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
