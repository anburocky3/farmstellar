"use client";

import { useState, useEffect } from "react";
import {
  Home,
  Leaf,
  Users,
  Gift,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  MapPin,
  Award,
} from "lucide-react";

export function NavigationMenu({
  userName = "Raj Kumar",
  userLevel = 3,
  userLocation = "Patiala, Punjab",
  onLogout,
  currentScreen,
  onNavigate,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const NAVIGATION_MENU_ITEMS = [
    { icon: Home, label: "Dashboard", screenId: "farmer-dashboard" },
    { icon: Leaf, label: "Quests", screenId: "quests-list" },
    { icon: Users, label: "Community", screenId: "community" },
    { icon: Gift, label: "Rewards", screenId: "rewards" },
    { icon: User, label: "Profile", screenId: "farmer-profile" },
    { icon: Settings, label: "Settings", screenId: "settings" },
    { icon: HelpCircle, label: "Help", screenId: "farmer-dashboard" },
  ];

  const handleMenuNavigation = (screenId) => {
    if (onNavigate) {
      onNavigate(screenId);
    }
    setIsMenuOpen(false);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogoutClick = () => {
    setIsMenuOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <>
      <button
        onClick={handleMenuToggle}
        className="fixed top-4 left-4 z-40 p-3 bg-card border border-border rounded-xl shadow-md hover:shadow-lg hover:bg-primary/5 transition-all"
        aria-label="Open navigation menu"
      >
        <Menu className="icon-md text-foreground" />
      </button>

      {/* Overlay Background */}
      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          style={{ animation: "fadeIn 0.3s ease-out" }}
          aria-label="Close navigation menu"
        />
      )}

      <nav
        className={`fixed top-0 left-0 h-full w-80 bg-background border-r border-border shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Main navigation"
      >
        <div className="h-full overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-h3 text-foreground">Menu</h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X className="icon-sm text-muted-foreground" />
            </button>
          </div>

          <div className="p-6 bg-linear-to-br from-primary/5 to-accent/5 border-b border-border">
            <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
              <div className="flex items-center gap-4 mb-3">
                <div className="center-flex w-14 h-14 bg-linear-to-br from-primary to-secondary rounded-full text-primary-foreground font-bold text-xl">
                  {userName.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-h4 text-foreground leading-tight">
                    {userName}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Award className="w-3 h-3 text-accent" />
                    <span className="text-small font-medium text-accent">
                      Level {userLevel}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-medium text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{userLocation}</span>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="space-y-2">
              {NAVIGATION_MENU_ITEMS.map((menuItem, index) => {
                const MenuIcon = menuItem.icon;
                const isActiveScreen = currentScreen === menuItem.screenId;
                return (
                  <button
                    key={index}
                    onClick={() => handleMenuNavigation(menuItem.screenId)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all group ${
                      isActiveScreen
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-lg transition-colors ${
                        isActiveScreen
                          ? "bg-primary-foreground/20"
                          : "bg-primary/10 group-hover:bg-primary/20"
                      }`}
                    >
                      <MenuIcon
                        className={`icon-sm ${
                          isActiveScreen
                            ? "text-primary-foreground"
                            : "text-primary"
                        }`}
                      />
                    </div>
                    <span
                      className={`font-medium group-hover:translate-x-0.5 transition-transform ${
                        isActiveScreen
                          ? "text-primary-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {menuItem.label}
                    </span>
                  </button>
                );
              })}

              <button
                onClick={handleLogoutClick}
                className="w-full flex items-center gap-4 p-4 rounded-xl transition-all group hover:bg-destructive/10"
              >
                <div className="p-2.5 rounded-lg transition-colors bg-destructive/10 group-hover:bg-destructive/20">
                  <LogOut className="icon-sm text-destructive" />
                </div>
                <span className="font-medium text-destructive group-hover:translate-x-0.5 transition-transform">
                  Logout
                </span>
              </button>
            </div>
          </div>

          <div className="p-6 border-t border-border mt-auto">
            <div className="bg-accent/10 rounded-xl p-4">
              <p className="text-medium text-muted-foreground text-center">
                Farmstellar v1
                <br />
                Empowering sustainable farming
              </p>
            </div>
          </div>
        </div>
      </nav>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

export default NavigationMenu;
