"use client";

import { Leaf, ArrowRight, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getStoredToken } from "@/lib/auth";
import { useTranslation } from "react-i18next";

export function OngoingQuestsCard({ onResumeQuest }) {
  const [ongoingQuests, setOngoingQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchOngoingQuests = async () => {
      try {
        const token = getStoredToken();
        if (!token) {
          setLoading(false);
          return;
        }

        // Fetch user data to get questsProgress from our Next API
        const userRes = await fetch(`/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!userRes.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userPayload = await userRes.json();
        const user = userPayload?.user || userPayload;

        // Fetch all quests from Next API
        const questsRes = await fetch(`/api/quests`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!questsRes.ok) {
          throw new Error("Failed to fetch quests");
        }

        const allQuests = await questsRes.json();

        // Filter for in-progress quests
        const inProgressQuests =
          user.questsProgress
            ?.filter((qp) => qp.status === "in-progress")
            .map((qp) => {
              const quest = allQuests.find(
                (q) => q._id === qp.questId || q._id === qp.questId.toString()
              );
              if (!quest) return null;

              const totalTasks = quest.stages?.length || 5;
              const completedTasks = qp.stageIndex || 0;
              const progress = Math.round((completedTasks / totalTasks) * 100);

              return {
                id: quest._id || quest.slug,
                name: quest.title,
                progress: progress,
                totalTasks: totalTasks,
                completedTasks: completedTasks,
                remainingTasks: totalTasks - completedTasks,
                icon: "🌱",
                color: "primary",
              };
            })
            .filter(Boolean) || [];

        setOngoingQuests(inProgressQuests);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching ongoing quests:", err);
        setOngoingQuests([]);
        setLoading(false);
      }
    };

    fetchOngoingQuests();
  }, []);

  if (loading) {
    return (
      <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            <div className="h-24 bg-muted rounded-2xl"></div>
            <div className="h-24 bg-muted rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/10 rounded-2xl">
          <Leaf className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">
            {t("dashboard.ongoingQuests.title")}
          </h3>
          <p className="text-xs text-muted-foreground">
            {t("dashboard.ongoingQuests.subtitle")}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {ongoingQuests.map((quest) => (
          <div
            key={quest.id}
            className="bg-gradient-to-r from-muted/30 to-transparent border border-border rounded-2xl p-4 hover:border-primary/30 transition-all group"
          >
            {/* Quest Header */}
            <div className="flex items-start gap-3 mb-3">
              <div className="text-2xl">{quest.icon}</div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground text-sm mb-1 truncate">
                  {quest.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {t("dashboard.ongoingQuests.tasksCompleted", {
                    completed: quest.completedTasks,
                    total: quest.totalTasks,
                  })}
                </p>
              </div>
              <span className="text-xs font-bold text-accent">
                {quest.progress}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-3">
              <div
                className={`absolute inset-y-0 left-0 bg-gradient-to-r from-${quest.color} to-accent rounded-full transition-all duration-500`}
                style={{ width: `${quest.progress}%` }}
              ></div>
            </div>

            {/* Tasks & Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="w-3 h-3" />
                <span>
                  {t("dashboard.ongoingQuests.tasksRemaining", {
                    count: quest.remainingTasks,
                  })}
                </span>
              </div>
              <button
                onClick={() => onResumeQuest && onResumeQuest(quest.id)}
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-accent transition-colors group-hover:gap-2"
              >
                {t("dashboard.ongoingQuests.resume")}
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {ongoingQuests.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            {t("dashboard.ongoingQuests.noQuests")}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {t("dashboard.ongoingQuests.startNew")}
          </p>
        </div>
      )}
    </div>
  );
}
