"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FARMER_TYPES } from "@/config/app";
import { useRouter } from "next/navigation";

export default function FarmOnboarding() {
  const [selectedType, setSelectedType] = useState(null);
  const router = useRouter();

  const farmerTypes = [
    {
      type: FARMER_TYPES.BEGINNER,
      title: "Beginner Farmer",
      description: "I'm new to farming or just starting out",
      icon: "🌱",
      color: "bg-green-100 border-green-300 text-green-700",
    },
    {
      type: FARMER_TYPES.PRO,
      title: "Pro Farmer",
      description: "I'm an experienced farmer looking to optimize",
      icon: "🌳",
      color: "bg-teal-100 border-teal-300 text-teal-700",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-background via-muted/30 to-background">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            What&apos;s Your Farming Experience?
          </h2>
          <p className="text-muted-foreground">
            This helps us personalize your learning journey
          </p>
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

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {}}
            className="flex-1 bg-transparent"
          >
            Back
          </Button>
          <Button
            onClick={() => {
              router.push("/onboarding/farm-details");
            }}
            disabled={!selectedType}
            className="flex-1"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
