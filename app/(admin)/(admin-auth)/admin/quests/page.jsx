"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Save,
  Award,
  Target,
  Zap,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminQuestPage() {
  const [questsData, setQuestsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAIApprovalModal, setShowAIApprovalModal] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [editForm, setEditForm] = useState({});

  const router = useRouter();

  // Mock AI-generated quests pending approval
  const [pendingAIQuests, setPendingAIQuests] = useState([
    {
      id: "ai_quest_1",
      title: "Smart Irrigation Setup",
      description:
        "Learn to set up an efficient drip irrigation system for your crops",
      difficulty: "Intermediate",
      cropType: "General",
      xpReward: 75,
      badgeName: "Water Wizard",
      status: "pending",
      generatedBy: "AI",
      createdAt: new Date().toISOString(),
    },
    {
      id: "ai_quest_2",
      title: "Organic Pest Control",
      description:
        "Master natural methods to protect your crops from common pests",
      difficulty: "Beginner",
      cropType: "Vegetables",
      xpReward: 50,
      badgeName: "Pest Guardian",
      status: "pending",
      generatedBy: "AI",
      createdAt: new Date().toISOString(),
    },
    {
      id: "ai_quest_3",
      title: "Crop Rotation Planning",
      description: "Plan and implement an effective crop rotation strategy",
      difficulty: "Advanced",
      cropType: "General",
      xpReward: 100,
      badgeName: "Rotation Master",
      status: "pending",
      generatedBy: "AI",
      createdAt: new Date().toISOString(),
    },
  ]);

  const [selectedAIQuest, setSelectedAIQuest] = useState(null);
  const [aiQuestForm, setAIQuestForm] = useState({});

  // Convert quests object to array
  const questsArray = Object.entries(questsData).map(([id, quest]) => ({
    ...quest,
    id: id,
  }));

  // Filter quests based on search
  const filteredQuests = questsArray.filter(
    (quest) =>
      quest.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quest.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quest.difficulty?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (quest) => {
    setSelectedQuest(quest);
    setEditForm({
      title: quest.title,
      description: quest.description,
      difficulty: quest.difficulty,
      cropType: quest.cropType,
      xpReward: quest.xpReward,
      badgeName: quest.badgeName,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    const updatedQuests = { ...questsData };
    updatedQuests[selectedQuest.id] = {
      ...updatedQuests[selectedQuest.id],
      ...editForm,
    };
    setQuestsData(updatedQuests);
    setShowEditModal(false);
    setSelectedQuest(null);

    // Here you would also save to backend/localStorage
    console.log("Quest updated:", editForm);
  };

  const handleDelete = (quest) => {
    setSelectedQuest(quest);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const updatedQuests = { ...questsData };
    delete updatedQuests[selectedQuest.id];
    setQuestsData(updatedQuests);
    setShowDeleteModal(false);
    setSelectedQuest(null);

    // Here you would also delete from backend
    console.log("Quest deleted:", selectedQuest.id);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "intermediate":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "advanced":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const handleApproveAIQuest = (aiQuest) => {
    setSelectedAIQuest(aiQuest);
    setAIQuestForm({
      title: aiQuest.title,
      description: aiQuest.description,
      difficulty: aiQuest.difficulty,
      cropType: aiQuest.cropType,
      xpReward: aiQuest.xpReward,
      badgeName: aiQuest.badgeName,
    });
  };

  const confirmApproveAIQuest = () => {
    // Add to main quests
    const updatedQuests = { ...questsData };
    updatedQuests[selectedAIQuest.id] = {
      id: selectedAIQuest.id,
      ...aiQuestForm,
      activities: [],
      outcomes: [],
      steps: [],
    };
    setQuestsData(updatedQuests);

    // Remove from pending
    setPendingAIQuests(
      pendingAIQuests.filter((q) => q.id !== selectedAIQuest.id)
    );

    setSelectedAIQuest(null);
    setAIQuestForm({});

    // Here you would save to backend
    console.log("AI Quest approved:", aiQuestForm);
  };

  const rejectAIQuest = (aiQuest) => {
    setPendingAIQuests(pendingAIQuests.filter((q) => q.id !== aiQuest.id));
    console.log("AI Quest rejected:", aiQuest.id);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Quest Management
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage all farmer quests
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* AI Quest Approval Button */}
              <button
                onClick={() => setShowAIApprovalModal(true)}
                className="relative flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                AI Quest Approval
                {pendingAIQuests.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {pendingAIQuests.length}
                  </span>
                )}
              </button>

              <div className="relative">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search quests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring w-64"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-linear-to-br from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {questsArray.length}
                </p>
                <p className="text-sm text-muted-foreground">Total Quests</p>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-accent/10 to-accent/5 rounded-xl p-4 border border-accent/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/20 rounded-lg">
                <Zap className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {questsArray.reduce((sum, q) => sum + (q.xpReward || 0), 0)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Total XP Available
                </p>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-secondary/10 to-secondary/5 rounded-xl p-4 border border-secondary/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/20 rounded-lg">
                <Award className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {
                    questsArray.filter((q) => q.difficulty === "Beginner")
                      .length
                  }
                </p>
                <p className="text-sm text-muted-foreground">Beginner Quests</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quests List */}
        <div className="space-y-4">
          {filteredQuests.length === 0 ? (
            <div className="bg-card rounded-2xl p-12 text-center border border-border">
              <p className="text-muted-foreground">No quests found</p>
            </div>
          ) : (
            filteredQuests.map((quest) => (
              <div
                key={quest.id}
                className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="text-3xl">
                        {quest.badgeName ? "🏆" : "📋"}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-1">
                          {quest.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {quest.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                          quest.difficulty
                        )}`}
                      >
                        {quest.difficulty}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                        {quest.xpReward} XP
                      </span>
                      {quest.cropType && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                          {quest.cropType}
                        </span>
                      )}
                      {quest.badgeName && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">
                          Badge: {quest.badgeName}
                        </span>
                      )}
                      {quest.steps && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-foreground">
                          {quest.steps.length} Steps
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(quest)}
                      className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-primary"
                      aria-label="Edit quest"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(quest)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
                      aria-label="Delete quest"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedQuest && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setShowEditModal(false)}
          />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-2xl mx-auto bg-card rounded-2xl shadow-xl z-50 max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Edit Quest</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Difficulty
                  </label>
                  <select
                    value={editForm.difficulty}
                    onChange={(e) =>
                      setEditForm({ ...editForm, difficulty: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    XP Reward
                  </label>
                  <input
                    type="number"
                    value={editForm.xpReward}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        xpReward: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Crop Type
                </label>
                <input
                  type="text"
                  value={editForm.cropType}
                  onChange={(e) =>
                    setEditForm({ ...editForm, cropType: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Badge Name
                </label>
                <input
                  type="text"
                  value={editForm.badgeName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, badgeName: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-3 border border-border rounded-xl font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedQuest && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-card rounded-2xl p-6 shadow-xl z-50">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-destructive" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Delete Quest?
              </h2>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete &quot;
                <strong>{selectedQuest.title}</strong>&quot;? This action cannot
                be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-destructive text-destructive-foreground rounded-xl font-medium hover:bg-destructive/90 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 border border-border rounded-xl font-medium hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

      {/* AI Quest Approval Modal */}
      {showAIApprovalModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setShowAIApprovalModal(false)}
          />
          <div className="fixed inset-8 bg-card rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-linear-to-r from-purple-500 to-pink-500 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">AI Quest Approval</h2>
                  <p className="text-sm opacity-90">
                    {pendingAIQuests.length} quests pending review
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAIApprovalModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {pendingAIQuests.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-medium text-foreground mb-2">
                    All caught up!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    No AI-generated quests pending approval
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingAIQuests.map((aiQuest) => (
                    <div
                      key={aiQuest.id}
                      className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800"
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-full text-xs font-bold">
                              AI Generated
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                                aiQuest.difficulty
                              )}`}
                            >
                              {aiQuest.difficulty}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-2">
                            {aiQuest.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {aiQuest.description}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                              {aiQuest.xpReward} XP
                            </span>
                            {aiQuest.cropType && (
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                {aiQuest.cropType}
                              </span>
                            )}
                            {aiQuest.badgeName && (
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">
                                Badge: {aiQuest.badgeName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Approval Form */}
                      {selectedAIQuest?.id === aiQuest.id ? (
                        <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-border space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-foreground mb-1">
                                XP Reward
                              </label>
                              <input
                                type="number"
                                value={aiQuestForm.xpReward}
                                onChange={(e) =>
                                  setAIQuestForm({
                                    ...aiQuestForm,
                                    xpReward: parseInt(e.target.value),
                                  })
                                }
                                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-foreground mb-1">
                                Difficulty
                              </label>
                              <select
                                value={aiQuestForm.difficulty}
                                onChange={(e) =>
                                  setAIQuestForm({
                                    ...aiQuestForm,
                                    difficulty: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                              >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">
                                  Intermediate
                                </option>
                                <option value="Advanced">Advanced</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={confirmApproveAIQuest}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approve & Publish
                            </button>
                            <button
                              onClick={() => setSelectedAIQuest(null)}
                              className="px-4 py-2 border border-border rounded-lg font-medium hover:bg-muted transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => handleApproveAIQuest(aiQuest)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                            Review & Approve
                          </button>
                          <button
                            onClick={() => rejectAIQuest(aiQuest)}
                            className="px-4 py-2 border border-destructive text-destructive rounded-lg font-medium hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
