"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
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
  LucideTrophy,
} from "lucide-react";
import Image from "next/image";

export function NavigationMenu({
  onLogout,
  currentScreen,
  onNavigate,
  userData,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

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
    { icon: Home, label: t("nav.dashboard"), screenId: "/dashboard" },
    { icon: Leaf, label: t("nav.quests"), screenId: "/quests" },
    { icon: Users, label: t("nav.community"), screenId: "/community" },
    { icon: Gift, label: t("nav.rewards"), screenId: "/rewards" },
    { icon: User, label: t("nav.profile"), screenId: "/farmer-profile" },
    { icon: Settings, label: t("nav.settings"), screenId: "/settings" },
    { icon: HelpCircle, label: t("nav.help"), screenId: "/help" },
  ];

  const pathname = usePathname();

  const getScreenIdFromPath = (path) => {
    if (!path) return null;
    const p = path.toLowerCase();
    if (p === "/" || p.startsWith("/dashboard")) return "farmer-dashboard";
    if (p.startsWith("/quests")) return "quests-list";
    if (p.startsWith("/community")) return "community";
    if (p.startsWith("/rewards")) return "rewards";
    if (p.startsWith("/profile") || p.startsWith("/farmer/profile"))
      return "/farmer-profile";
    if (p.startsWith("/settings")) return "/settings";
    if (p.startsWith("/help")) return "/help";
    return null;
  };

  const activeScreenFromPath = getScreenIdFromPath(pathname);
  const activeScreen = currentScreen || activeScreenFromPath;

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
        className="fixed bg-white shadow top-5 left-4 z-40 p-3 rounded-xl hover:shadow-lg hover:bg-primary/5 transition-all"
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
          {/* <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X className="icon-sm text-muted-foreground" />
            </button> */}

          <div className="bg-linear-to-br from-green-500/50 to-accent/5 ">
            <div className="p-4  shadow-sm">
              <div className="flex items-center gap-4 mb-3">
                <div className="center-flex w-14 h-14 bg-linear-to-br from-primary to-secondary rounded-full text-primary-foreground font-bold text-xl">
                  {userData?.name?.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-h4 text-foreground leading-tight">
                    {userData?.name}
                  </h3>
                  <div className="flex items-center gap-2 text-medium text-muted-foreground mt-2">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{userData?.location}</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X className="icon-sm text-muted-foreground" />
                </button>{" "}
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center gap-1 mt-1 bg-blue-500 px-2 py-0.5 rounded-full text-white text-xs">
                  <Award className="w-3 h-3 " />
                  <span className="text-small font-semibold ">
                    {userData?.level.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1 bg-green-500 px-2 py-0.5 rounded-full text-white text-xs">
                  <LucideTrophy className="w-3 h-3" />
                  <span className="text-small font-semibold">
                    {userData?.xp} XP
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="space-y-2 font-medium">
              {NAVIGATION_MENU_ITEMS.map((menuItem, index) => {
                const MenuIcon = menuItem.icon;
                const isActiveScreen = activeScreen === menuItem.screenId;

                return (
                  <button
                    key={index}
                    onClick={() => handleMenuNavigation(menuItem.screenId)}
                    className={`w-full flex items-center gap-4 px-4 py-2 rounded-xl transition-all group ${
                      isActiveScreen ? "bg-green-100 " : "hover:bg-muted"
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
                          isActiveScreen ? "text-black" : "text-primary"
                        }`}
                      />
                    </div>
                    <span
                      className={`font-medium group-hover:translate-x-0.5 transition-transform ${
                        isActiveScreen
                          ? "text-black font-semibold!"
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
                  {t("nav.logout")}
                </span>
              </button>
            </div>
          </div>

          <div className=" border-t">
            <div className="bg-accent/10 rounded-xl p-4 flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="FarmStellar Logo"
                width={80}
                height={80}
                className="mx-auto mb-2"
              />
              <div className="flex flex-col items-start text-muted-foreground space-y-2">
                <span className="text-medium">Farmstellar V1</span>
                <small className="text-xs text-gray-400">
                  {t("nav.empoweringSustainable")}
                </small>
              </div>
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
