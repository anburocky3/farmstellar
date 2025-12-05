"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Activity,
  Target,
  Search,
  Eye,
  X,
  LogOut,
  ChevronDown,
  Package,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AdminDashboardPage({ onNavigate }) {
  const router = useRouter();
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [farmers, setFarmers] = useState([]);
  const [stats, setStats] = useState({
    totalFarmers: 0,
    newSignups: 0,
    activeUsers: 0,
    totalQuestsCompleted: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showManageMenu, setShowManageMenu] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("farmstellar_admin_token");

      // Fetch stats
      const statsRes = await fetch("/api/admin/stats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Fetch farmers
      const farmersRes = await fetch("/api/admin/farmers?limit=10", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (farmersRes.ok) {
        const farmersData = await farmersRes.json();
        setFarmers(farmersData.farmers || []);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const token = localStorage.getItem("farmstellar_admin_token");

        // Fetch stats
        const statsRes = await fetch("/api/admin/stats", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (statsRes.ok && isMounted) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        // Fetch farmers
        const farmersRes = await fetch("/api/admin/farmers?limit=10", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (farmersRes.ok && isMounted) {
          const farmersData = await farmersRes.json();
          setFarmers(farmersData.farmers || []);
        }

        if (isMounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    // Clear all admin authentication data
    localStorage.removeItem("farmstellar_admin_token");
    localStorage.removeItem("farmstellar_admin");

    toast.success("Logged out successfully");
    // Use router to redirect to admin login
    router.push("/admin/login");
  };

  const filteredFarmers = farmers.filter(
    (farmer) =>
      farmer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar - Simple with Manage and Logout */}
      <div className="bg-card border-b border-border px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Monitor and manage your platform
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/farmers"
              className="flex items-center gap-2 mr-5 font-medium hover:bg-gray-100 px-4 py-2 rounded-xl transition-colors"
            >
              <Users className="w-4 h-4 inline-block mr-1" />
              Farmers
            </Link>

            {/* Manage Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowManageMenu(!showManageMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
              >
                <Package className="w-4 h-4" />
                Manage
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showManageMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showManageMenu && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowManageMenu(false)}
                  />

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-20">
                    <Link
                      href="/admin/quests"
                      onClick={() => {
                        setShowManageMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center gap-3"
                    >
                      <Target className="w-4 h-4 text-accent" />
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          Manage Quests
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Create and edit quest content
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/admin/rewards"
                      onClick={() => {
                        setShowManageMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center gap-3 border-t border-border"
                    >
                      <Package className="w-4 h-4 text-secondary" />
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          Manage Rewards
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Adjust XP and badge rewards
                        </p>
                      </div>
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl font-medium hover:bg-muted transition-colors text-foreground"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Stats Section - Prominent Display with Charts */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">
            Platform Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Farmers */}
            <div className="bg-linear-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary/20 rounded-xl">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
              <p className="text-4xl font-bold text-foreground mb-1">
                {loading ? "..." : stats.totalFarmers}
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                Total Farmers
              </p>

              {/* Visual Chart - Bar */}
              <div className="space-y-1">
                <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-1000"
                    style={{ width: loading ? "0%" : "100%" }}
                  />
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-primary/20">
                <p className="text-xs text-muted-foreground">
                  Registered users on platform
                </p>
              </div>
            </div>

            {/* New Signups */}
            <div className="bg-linear-to-br from-accent/10 to-accent/5 rounded-2xl p-6 border border-accent/20 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-accent/20 rounded-xl">
                  <Users className="w-6 h-6 text-accent" />
                </div>
              </div>
              <p className="text-4xl font-bold text-foreground mb-1">
                {loading ? "..." : stats.newSignups}
              </p>
              <p className="text-sm text-muted-foreground mb-3">New Signups</p>

              {/* Visual Chart - Mini Line Chart */}
              <div className="h-12 flex items-end gap-1">
                {[20, 35, 25, 45, 30, 50, stats.newSignups || 40].map(
                  (height, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-accent/30 rounded-t transition-all duration-500"
                      style={{
                        height: loading ? "0%" : `${(height / 50) * 100}%`,
                        transitionDelay: `${i * 100}ms`,
                      }}
                    />
                  )
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-accent/20">
                <p className="text-xs text-muted-foreground">
                  This week&apos;s registrations
                </p>
              </div>
            </div>

            {/* Active Users */}
            <div className="bg-linear-to-br from-secondary/10 to-secondary/5 rounded-2xl p-6 border border-secondary/20 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-secondary/20 rounded-xl">
                  <Activity className="w-6 h-6 text-secondary" />
                </div>
              </div>
              <p className="text-4xl font-bold text-foreground mb-1">
                {loading ? "..." : stats.activeUsers}
              </p>
              <p className="text-sm text-muted-foreground mb-3">Active Users</p>

              {/* Visual Chart - Donut Chart */}
              <div className="flex items-center justify-center gap-4">
                <div className="relative">
                  <svg
                    className="w-24 h-24 transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-secondary/10"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-secondary transition-all duration-1000 ease-out"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={
                        loading
                          ? `${2 * Math.PI * 40}`
                          : `${
                              2 *
                              Math.PI *
                              40 *
                              (1 -
                                (stats.activeUsers / stats.totalFarmers || 0.7))
                            }`
                      }
                      strokeLinecap="round"
                    />
                  </svg>
                  {/* Center percentage */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-secondary">
                      {loading
                        ? "..."
                        : Math.round(
                            (stats.activeUsers / stats.totalFarmers || 0.7) *
                              100
                          )}
                      %
                    </span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  <div className="font-medium">Activity Rate</div>
                  <div className="text-secondary">
                    {loading ? "..." : stats.activeUsers} /{" "}
                    {loading ? "..." : stats.totalFarmers}
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-secondary/20">
                <p className="text-xs text-muted-foreground">
                  Currently engaged farmers
                </p>
              </div>
            </div>

            {/* Quests Completed */}
            <div className="bg-linear-to-br from-accent/10 to-accent/5 rounded-2xl p-6 border border-accent/20 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-accent/20 rounded-xl">
                  <Target className="w-6 h-6 text-accent" />
                </div>
              </div>
              <p className="text-4xl font-bold text-foreground mb-1">
                {loading ? "..." : stats.totalQuestsCompleted}
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                Quests Completed
              </p>

              {/* Visual Chart - Stacked Bars */}
              <div className="space-y-1.5">
                <div className="flex gap-1">
                  <div
                    className="h-2 flex-1 bg-accent rounded-full"
                    style={{ opacity: 0.9 }}
                  />
                  <div
                    className="h-2 flex-1 bg-accent rounded-full"
                    style={{ opacity: 0.7 }}
                  />
                  <div
                    className="h-2 flex-1 bg-accent rounded-full"
                    style={{ opacity: 0.5 }}
                  />
                </div>
                <div className="flex gap-1">
                  <div
                    className="h-2 flex-1 bg-accent rounded-full"
                    style={{ opacity: 0.8 }}
                  />
                  <div
                    className="h-2 flex-1 bg-accent rounded-full"
                    style={{ opacity: 0.6 }}
                  />
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-accent/20">
                <p className="text-xs text-muted-foreground">
                  Total quest submissions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Farmers List */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-foreground text-lg">
                  Recent Farmers
                </h3>
                <p className="text-sm text-muted-foreground">
                  Latest registered farmers on the platform
                </p>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search farmers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase p-4">
                    Name
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase p-4">
                    Level
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase p-4">
                    Location
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase p-4">
                    XP
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase p-4">
                    Quests
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase p-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-8 text-center text-muted-foreground"
                    >
                      Loading farmers...
                    </td>
                  </tr>
                ) : filteredFarmers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-8 text-center text-muted-foreground"
                    >
                      No farmers found
                    </td>
                  </tr>
                ) : (
                  filteredFarmers.map((farmer) => (
                    <tr
                      key={farmer._id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4">
                        <p className="font-medium text-foreground">
                          {farmer.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {farmer.email}
                        </p>
                      </td>
                      <td className="p-4">
                        <span className="inline-block text-xs bg-accent/20 text-primary px-2 py-1 rounded-full font-medium">
                          {farmer.level || "beginner"}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-foreground">
                          {farmer.city || farmer.location || "N/A"}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-medium text-foreground">
                          {farmer.xp || 0} XP
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-foreground">
                          {farmer.questsProgress?.filter(
                            (q) => q.status === "completed"
                          ).length || 0}
                        </p>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => setSelectedFarmer(farmer)}
                          className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Farmer Details Popup */}
      {selectedFarmer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-card rounded-2xl border border-border shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
              <h3 className="font-bold text-foreground text-xl">
                Farmer Details
              </h3>
              <button
                onClick={() => setSelectedFarmer(null)}
                className="p-2 hover:bg-muted rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h4 className="font-bold text-foreground mb-3">
                  Basic Information
                </h4>
                <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Name</span>
                    <span className="text-sm font-medium text-foreground">
                      {selectedFarmer.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Email</span>
                    <span className="text-sm font-medium text-foreground">
                      {selectedFarmer.email || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Phone</span>
                    <span className="text-sm font-medium text-foreground">
                      {selectedFarmer.phone || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Experience Level
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {selectedFarmer.level || "beginner"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Location
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {selectedFarmer.city || selectedFarmer.location || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Farm Details */}
              <div>
                <h4 className="font-bold text-foreground mb-3">Farm Details</h4>
                <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Farm Name
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {selectedFarmer.farm?.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Joined Date
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {selectedFarmer.createdAt
                        ? new Date(
                            selectedFarmer.createdAt
                          ).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quest Progress */}
              <div>
                <h4 className="font-bold text-foreground mb-3">
                  Quest Progress
                </h4>
                <div className="bg-linear-to-br from-accent/10 to-primary/5 rounded-xl p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-foreground">
                        {selectedFarmer.questsProgress?.filter(
                          (q) => q.status === "completed"
                        ).length || 0}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Quests Completed
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-accent">
                        {selectedFarmer.xp || 0}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Total XP
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
