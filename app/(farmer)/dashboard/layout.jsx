"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import NavigationMenu from "../../../components/common/navigation-menu";

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userData, setUserData] = useState(true);

  // useEffect(() => {
  //   const auth = localStorage.getItem("farmquest_auth");
  //   if (!auth) {
  //     router.push("/login");
  //     return;
  //   }

  //   const data = JSON.parse(localStorage.getItem("farmquest_userdata") || "{}");
  //   setUserData(data);
  // }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("farmquest_auth");
    localStorage.removeItem("farmquest_userdata");
    router.push("/login");
  };

  const handleNavigate = (screen) => {
    const routes = {
      "farmer-dashboard": "/dashboard",
      "quests-list": "/quests",
      community: "/community",
      rewards: "/rewards",
      "farmer-profile": "/settings/profile",
      settings: "/settings",
      "impact-tracker": "/impact",
    };

    if (routes[screen]) {
      router.push(routes[screen]);
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu
        onLogout={handleLogout}
        currentScreen={pathname}
        onNavigate={handleNavigate}
        userType="farmer"
        userData={{
          name: userData.name || "Farmer",
          level: userData.level || 1,
          xp: userData.xp || 0,
        }}
      />
      {children}
    </div>
  );
}
