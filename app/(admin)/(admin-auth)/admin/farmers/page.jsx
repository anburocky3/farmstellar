"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  User,
  Search,
  MapPin,
  Phone,
  Mail,
  Award,
  TrendingUp,
  Users,
  Target,
  Eye,
  X,
  CheckCircle,
} from "lucide-react";

export default function AdminFarmersScreen() {
  const router = useRouter();
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    beginners: 0,
    pros: 0,
    activeUsers: 0,
  });

  const fetchFarmers = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("farmstellar_admin_token");

      const res = await fetch(
        `/api/admin/farmers?search=${encodeURIComponent(searchQuery)}&limit=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setFarmers(data.farmers || []);

        // Calculate stats
        const total = data.total || 0;
        const beginners = data.farmers.filter(
          (f) => f.level === "beginner"
        ).length;
        const pros = data.farmers.filter((f) => f.level === "pro").length;
        const activeUsers = data.farmers.filter(
          (f) => f.questsProgress && f.questsProgress.length > 0
        ).length;

        setStats({ total, beginners, pros, activeUsers });
      } else {
        console.error("Failed to fetch farmers:", res.status);
        toast.error("Failed to load farmers");
        setFarmers([]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching farmers:", error);
      toast.error("Failed to load farmers");
      setFarmers([]);
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        await fetchFarmers();
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [fetchFarmers]);

  const handleViewDetails = (farmer) => {
    setSelectedFarmer(farmer);
    setShowDetailsModal(true);
  };

  const getLevelColor = (level) => {
    return level === "pro"
      ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
      : "bg-green-500/10 text-green-600 border-green-500/20";
  };

  const getLevelIcon = (level) => {
    return level === "pro" ? "🏆" : "🌱";
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
                  Farmers Management
                </h1>
                <p className="text-sm text-muted-foreground">
                  View and manage all registered farmers
                </p>
              </div>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search farmers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring w-64"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-linear-to-br from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.total}
                </p>
                <p className="text-sm text-muted-foreground">Total Farmers</p>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-green-500/10 to-green-500/5 rounded-xl p-4 border border-green-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <span className="text-xl">🌱</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.beginners}
                </p>
                <p className="text-sm text-muted-foreground">Beginners</p>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-purple-500/10 to-purple-500/5 rounded-xl p-4 border border-purple-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <span className="text-xl">🏆</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.pros}
                </p>
                <p className="text-sm text-muted-foreground">Pro Farmers</p>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-accent/10 to-accent/5 rounded-xl p-4 border border-accent/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/20 rounded-lg">
                <Target className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.activeUsers}
                </p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
            </div>
          </div>
        </div>

        {/* Farmers List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-card rounded-2xl p-12 text-center border border-border">
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
              <p className="text-muted-foreground">Loading farmers...</p>
            </div>
          ) : farmers.length === 0 ? (
            <div className="bg-card rounded-2xl p-12 text-center border border-border">
              <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">
                No farmers found
              </p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search criteria
              </p>
            </div>
          ) : (
            farmers.map((farmer) => (
              <div
                key={farmer._id}
                className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground">
                          {farmer.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getLevelColor(
                              farmer.level
                            )}`}
                          >
                            {getLevelIcon(farmer.level)}{" "}
                            {farmer.level?.toUpperCase()}
                          </span>
                          {farmer.onboarded && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 border border-blue-500/20">
                              <CheckCircle className="w-3 h-3 inline mr-1" />
                              Onboarded
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">
                          {farmer.phone || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">
                          {farmer.email || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">
                          {farmer.city || farmer.location || "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-accent" />
                        <span className="text-sm font-medium text-foreground">
                          {farmer.xp || 0} XP
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">
                          Level {farmer.xpLevel || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {farmer.questsProgress?.length || 0} Quests
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewDetails(farmer)}
                    className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-primary"
                    aria-label="View details"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedFarmer && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setShowDetailsModal(false)}
          />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-3xl mx-auto bg-card rounded-2xl shadow-xl z-50 max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">
                Farmer Details
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="bg-muted/50 rounded-xl p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Name</p>
                    <p className="text-sm font-medium text-foreground">
                      {selectedFarmer.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Phone</p>
                    <p className="text-sm font-medium text-foreground">
                      {selectedFarmer.phone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <p className="text-sm font-medium text-foreground">
                      {selectedFarmer.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Location
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {selectedFarmer.city || selectedFarmer.location || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Level</p>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getLevelColor(
                        selectedFarmer.level
                      )}`}
                    >
                      {getLevelIcon(selectedFarmer.level)}{" "}
                      {selectedFarmer.level?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Onboarding
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {selectedFarmer.onboarded ? "Completed" : "Pending"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-muted/50 rounded-xl p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Progress & Stats
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-background rounded-lg">
                    <p className="text-2xl font-bold text-primary">
                      {selectedFarmer.xp || 0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Total XP
                    </p>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg">
                    <p className="text-2xl font-bold text-accent">
                      {selectedFarmer.xpLevel || 0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Level</p>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg">
                    <p className="text-2xl font-bold text-foreground">
                      {selectedFarmer.questsProgress?.length || 0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Quests</p>
                  </div>
                </div>
              </div>

              {/* Quest Progress */}
              {selectedFarmer.questsProgress &&
                selectedFarmer.questsProgress.length > 0 && (
                  <div className="bg-muted/50 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                      Quest Progress
                    </h3>
                    <div className="space-y-2">
                      {selectedFarmer.questsProgress.map((quest, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-background rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Target className="w-4 h-4 text-primary" />
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                Quest {quest.questId || "N/A"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Stage {quest.stageIndex || 0}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              quest.status === "completed"
                                ? "bg-green-500/10 text-green-600"
                                : quest.status === "in-progress"
                                ? "bg-blue-500/10 text-blue-600"
                                : "bg-gray-500/10 text-gray-600"
                            }`}
                          >
                            {quest.status?.replace("-", " ").toUpperCase() ||
                              "N/A"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Purchased Rewards */}
              {selectedFarmer.purchasedRewards &&
                selectedFarmer.purchasedRewards.length > 0 && (
                  <div className="bg-muted/50 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                      Purchased Rewards
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedFarmer.purchasedRewards.map((reward, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-background rounded-full text-xs font-medium text-foreground"
                        >
                          {reward}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Timestamps */}
              <div className="bg-muted/50 rounded-xl p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Account Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Joined On
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {selectedFarmer.createdAt
                        ? new Date(selectedFarmer.createdAt).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Last Updated
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {selectedFarmer.updatedAt
                        ? new Date(selectedFarmer.updatedAt).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
