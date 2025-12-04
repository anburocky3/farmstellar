"use client";

import { useState } from "react";
import {
  Leaf,
  Sprout,
  Droplets,
  Sun,
  Wheat,
  TreePine,
  Bug,
  Flower2,
  Search,
  Filter,
  ArrowRight,
  Star,
  Trophy,
  ChevronDown,
  CheckCircle,
  Clock,
} from "lucide-react";

export default function RevampedQuestsListScreen({
  onStartQuest,
  quests,
  userData,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  const questList = Object.values(quests);
  const totalXP = questList.reduce((sum, quest) => sum + quest.xpReward, 0);
  const userLevel = userData?.xpLevel || 0;
  const completedCount = userData?.completedQuests?.length || 0;
  const completionRate =
    questList.length > 0
      ? Math.round((completedCount / questList.length) * 100)
      : 0;

  const cropFilters = ["All", "Cotton", "Coconut", "Wheat", "General"];
  const difficultyFilters = ["All", "Beginner", "Pro"];

  const filteredQuests = questList.filter((quest) => {
    const matchesSearch =
      quest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quest.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCrop =
      selectedCrop === "All" || quest.cropType === selectedCrop;
    const matchesDifficulty =
      selectedDifficulty === "All" || quest.difficulty === selectedDifficulty;

    return matchesSearch && matchesCrop && matchesDifficulty;
  });

  const getBadgeStyle = (crop) => {
    const styles = {
      Wheat: "bg-[#FFF9E5] border-[#FCD34D] text-[#B45309]", // Matches screenshot (yellowish)
      Cotton: "bg-slate-50 border-slate-200 text-slate-600",
      Coconut: "bg-orange-50 border-orange-200 text-orange-700",
      General: "bg-emerald-50 border-emerald-200 text-emerald-700",
      Tomato: "bg-red-50 border-red-200 text-red-700",
      Potato: "bg-yellow-50 border-yellow-200 text-yellow-700",
    };
    return styles[crop] || "bg-gray-50 border-gray-200 text-gray-600";
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20 pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-br from-green-100 via-green-200 to-green-500 pb-12 pt-8 md:pt-12">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-50"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500 text-accent-foreground text-sm font-medium mb-4 border border-accent/20">
              <SparklesIcon className="w-4 h-4" />
              <span>New Quests Available</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              Explore Farming Quests
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Master sustainable farming techniques through interactive lessons.
              Complete quests, earn XP, and become a certified expert.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-center group">
              <div className="w-10 h-10 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{userLevel}</p>
              <p className="text-xs text-muted-foreground">Current Level</p>
            </div>
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-center group">
              <div className="w-10 h-10 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Star className="w-5 h-5 text-accent" />
              </div>
              <p className="text-2xl font-bold text-foreground">{totalXP}</p>
              <p className="text-xs text-muted-foreground">
                Total Available XP
              </p>
            </div>
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-center group">
              <div className="w-10 h-10 mx-auto bg-secondary/10 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Leaf className="w-5 h-5 text-secondary" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {questList.length}
              </p>
              <p className="text-xs text-muted-foreground">Total Quests</p>
            </div>
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-center group">
              <div className="w-10 h-10 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {completedCount}
              </p>
              <p className="text-xs text-muted-foreground">Completed Quests</p>
            </div>
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-center group">
              <div className="w-10 h-10 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {questList.length - completedCount}
              </p>
              <p className="text-xs text-muted-foreground">Remaining Quests</p>
            </div>
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-center group">
              <div className="w-10 h-10 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Wheat className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {completionRate}%
              </p>
              <p className="text-xs text-muted-foreground">Completion Rate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        {/* Search and Filter Bar */}
        <div className="max-w-6xl mx-auto bg-card rounded-2xl shadow-lg border border-border p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search quests..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters Container */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Crop Dropdown */}
              <div className="relative w-full md:w-40">
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer text-sm font-medium"
                >
                  {cropFilters.map((crop) => (
                    <option key={crop} value={crop}>
                      {crop === "All" ? "All Crops" : crop}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>

              {/* Difficulty Dropdown */}
              <div className="relative w-full md:w-40">
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer text-sm font-medium"
                >
                  {difficultyFilters.map((diff) => (
                    <option key={diff} value={diff}>
                      {diff === "All" ? "Any Level" : diff}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Quests Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuests.map((quest) => {
              const icons = {
                soil: Sprout,
                crops: Leaf,
                compost: Droplets,
                water: Droplets,
                weather: Sun,
                harvest: Wheat,
                trees: TreePine,
                pest: Bug,
                flowers: Flower2,
              };
              const IconComponent = icons[quest.id] || Leaf;

              // Check if quest is completed
              const isCompleted =
                userData?.questsProgress?.some(
                  (q) => q.questId === quest.id && q.status === "completed"
                ) || false;

              return (
                <div
                  key={quest.id}
                  onClick={() => onStartQuest(quest.id)}
                  className={`group bg-card rounded-3xl p-6 border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden ${
                    isCompleted
                      ? "border-emerald-500/50 bg-emerald-50/5"
                      : "border-border"
                  }`}
                >
                  {/* Decorative background linear */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-primary/5 to-accent/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-linear-to-br from-primary/10 to-primary/5 rounded-2xl group-hover:from-primary/20 group-hover:to-primary/10 transition-colors">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            quest.difficulty === "Easy" ||
                            quest.difficulty === "Beginner"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : quest.difficulty === "Medium"
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {quest.difficulty}
                        </span>
                        {isCompleted && (
                          <span className="bg-emerald-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold shadow-md">
                            <CheckCircle className="w-3 h-3" />
                            Completed
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
                      {quest.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6 line-clamp-2 leading-relaxed">
                      {quest.description}
                    </p>

                    {/* Crop Badge */}
                    {quest.cropType && (
                      <div
                        className={`w-fit px-3 py-1.5 rounded-xl flex items-center justify-center border mb-4 ${getBadgeStyle(
                          quest.cropType
                        )}`}
                      >
                        <span className="text-[10px] font-bold text-center leading-tight">
                          {quest.cropType}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="w-2 h-2 rounded-full bg-primary/50"></span>
                        {quest.activities.length} activities
                      </div>
                      <div className="flex items-center gap-1 text-sm font-bold text-accent">
                        <span>+{quest.xpReward} XP</span>
                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredQuests.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                No quests found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCrop("All");
                  setSelectedDifficulty("All");
                }}
                className="mt-4 text-primary font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SparklesIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z" />
    </svg>
  );
}
