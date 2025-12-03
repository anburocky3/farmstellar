"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FARMER_TYPES } from "@/config/app";
import { useRouter } from "next/navigation";

export default function FarmOnboarding() {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState(null);
  const router = useRouter();

  const farmerTypes = [
    {
      type: FARMER_TYPES.BEGINNER,
      title: t("onboarding.types.beginner.title"),
      description: t("onboarding.types.beginner.desc"),
      icon: "🌱",
      color: "bg-green-100 border-green-300 text-green-700",
    },
    {
      type: FARMER_TYPES.PRO,
      title: t("onboarding.types.pro.title"),
      description: t("onboarding.types.pro.desc"),
      icon: "🌳",
      color: "bg-teal-100 border-teal-300 text-teal-700",
    },
  ];

  return (
    <div className="relative bg-white p-10 rounded z-10 w-full max-w-2xl shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          {t("onboarding.heading")}
        </h2>
        <p className="text-muted-foreground">{t("onboarding.subheading")}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {farmerTypes.map((farmer) => (
          <Card
            key={farmer.type}
            className={`p-6 cursor-pointer transition-all hover:scale-105 ${
              selectedType === farmer.type
                ? "ring-2 ring-primary shadow-lg"
                : "hover:shadow-md"
            }`}
            onClick={() => setSelectedType(farmer.type)}
          >
            <div className="text-center space-y-3">
              <div className="text-5xl mb-2">{farmer.icon}</div>
              <h3 className="font-bold text-lg">{farmer.title}</h3>
              <p className="text-sm text-muted-foreground">
                {farmer.description}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex flex-col space-y-4">
        <Button
          onClick={() => {
            router.push("/onboarding/farm-details");
          }}
          disabled={!selectedType}
          className="w-full font-semibold text-base!"
        >
          {t("onboarding.continue")}
        </Button>
      </div>
    </div>
  );
}
