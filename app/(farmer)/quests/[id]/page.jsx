"use client";

import { QuestIntroScreen } from "@/components/quests/quest-intro-screen";
import { QuestStepsScreen } from "@/components/quests/quest-steps-screen";
import { SubmitProofScreen } from "@/components/quests/submit-proof-screen";
import { VerificationScreen } from "@/components/quests/verification-screen";
import { RewardScreen } from "@/components/quests/reward-screen";
import { LearningSummaryScreen } from "@/components/quests/learning-summary-screen";
import { SoilEvaluationScreen } from "@/components/quests/soil-evaluation-screen";
import { QUESTS_DATA } from "@/config/quests";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function QuestContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const questId = params.id;
  const step = searchParams.get("step") || "intro";

  const [userData, setUserData] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const auth = localStorage.getItem("farmquest_auth");
    if (!auth) {
      router.push("/login");
      return;
    }

    const data = JSON.parse(localStorage.getItem("farmquest_userdata") || "{}");
    setUserData(data);
  }, [router]);

  const quest = QUESTS_DATA[questId];

  if (!quest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Quest Not Found</h2>
          <button
            onClick={() => router.push("/quests")}
            className="text-primary"
          >
            Back to Quests
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const showSuccessToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleQuestComplete = (quest) => {
    const newXP = userData.xp + quest.xpReward;
    const newLevel = Math.floor(newXP / 100) + 1;

    const updatedData = {
      ...userData,
      xp: newXP,
      level: newLevel,
      completedQuests: [...(userData.completedQuests || []), quest.id],
      badges: [...(userData.badges || []), quest.badgeName],
    };

    setUserData(updatedData);
    localStorage.setItem("farmquest_userdata", JSON.stringify(updatedData));

    return { leveledUp: newLevel > userData.level, newLevel };
  };

  const navigateToStep = (newStep) => {
    router.push(`/quests/${questId}?step=${newStep}`);
  };

  const questIds = Object.keys(QUESTS_DATA);
  const currentQuestIndex = questIds.indexOf(questId);
  const nextQuestId = questIds[currentQuestIndex + 1] || questIds[0];

  const handleNextQuest = () => {
    router.push(`/quests/${nextQuestId}`);
  };

  return (
    <>
      {step === "intro" && (
        <QuestIntroScreen
          quest={quest}
          onStart={() => navigateToStep("steps&page=1")}
          onBack={() => router.push("/quests")}
        />
      )}

      {step === "steps" && (
        <QuestStepsScreen
          quest={quest}
          onContinue={() => navigateToStep("submit")}
          onBack={() => navigateToStep("intro")}
        />
      )}

      {step === "submit" &&
        (quest.id === "soil_scout" ? (
          <SoilEvaluationScreen
            quest={quest}
            onSubmit={(evaluation) => {
              console.log("Evaluation submitted:", evaluation);
              showSuccessToast("✅ Evaluation Submitted! Great job! 🌱");
              navigateToStep("reward");
            }}
            onBack={() => navigateToStep("steps")}
          />
        ) : (
          <SubmitProofScreen
            quest={quest}
            onSubmit={() => {
              showSuccessToast("✅ Submitted! We'll review within 24 hours 🌱");
              navigateToStep("verification");
            }}
            onBack={() => navigateToStep("steps")}
          />
        ))}

      {step === "verification" && (
        <VerificationScreen
          quest={quest}
          onContinue={() => navigateToStep("reward")}
        />
      )}

      {step === "reward" && (
        <RewardScreen
          quest={quest}
          userData={userData}
          onComplete={handleQuestComplete}
          onContinue={() => navigateToStep("summary")}
          onNextQuest={handleNextQuest}
        />
      )}

      {step === "summary" && (
        <LearningSummaryScreen
          quest={quest}
          onContinue={() => router.push("/dashboard")}
        />
      )}

      {showToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-100 animate-slide-down">
          <div className="bg-accent text-accent-foreground px-6 py-3 rounded-2xl shadow-2xl border-2 border-accent/30 flex items-center gap-2 max-w-md">
            <span className="text-lg">✓</span>
            <p className="text-sm font-medium">{toastMessage}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default function QuestPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <QuestContent />
    </Suspense>
  );
}
