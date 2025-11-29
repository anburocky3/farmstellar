"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Edit2,
  MapPin,
  TrendingUp,
  Award,
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function FarmerProfilePage({ onBack }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Raj Kumar",
    phone: "+91 98765 43210",
    district: "Patiala",
    state: "Punjab",
    experience: "Intermediate",
    fieldSize: 5,
    crops: ["Wheat", "Rice", "Sugarcane"],
  });

  const achievements = [
    { date: "March 2024", title: "Completed first quest 🌱", icon: Award },
    { date: "April 2024", title: "Reached Level 3 ⭐", icon: TrendingUp },
    { date: "May 2024", title: "5 quests completed 🏆", icon: Award },
  ];

  return (
    <div className="min-h-screen pb-20">
      <div className="sticky top-0 z-10 bg-card border-[1.5px] rounded-2xl shadow-[0_2px_8px_rgba(107,166,115,0.08),0_1px_3px_rgba(107,166,115,0.04)] border-b-2 border-primary/20 p-4 watercolor-bg">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-primary/10 rounded-2xl transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1
              className="text-2xl font-bold text-foreground flex items-center gap-2"
              style={{ fontFamily: "Mali, cursive" }}
            >
              <Leaf className="w-6 h-6 text-primary" />
              Profile
            </h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="rounded-2xl"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            {isEditing ? "Save" : "Edit"}
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <div className="bg-card border-[1.5px] border-border rounded-2xl p-8 shadow-[0_2px_8px_rgba(107,166,115,0.08),0_1px_3px_rgba(107,166,115,0.04)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12),0_2px_6px_rgba(107,166,115,0.08)] hover:-translate-y-0.5 transition-all watercolor-bg border-2 border-primary/20 relative overflow-hidden soft-glow">
          {/* Decorative elements */}
          {/* <div className="absolute top-4 right-4 opacity-15">
            <Flower2 className="w-16 h-16 text-accent" />
          </div> */}
          <div className="absolute bottom-4 left-4 opacity-10">
            <Leaf className="w-20 h-20 text-primary" />
          </div>

          <div className="flex items-center gap-5 mb-5 relative z-10">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 backdrop-blur flex items-center justify-center text-4xl font-bold border-4 border-primary/20 shadow-lg">
              RK
            </div>
            <div>
              <h2
                className="text-3xl font-bold text-foreground mb-1"
                style={{ fontFamily: "Mali, cursive" }}
              >
                {profile.name}
              </h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>
                  {profile.district}, {profile.state}
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-5 border-t-2 border-dashed border-primary/20 relative z-10">
            <div className="text-center p-3 bg-white/50 rounded-2xl">
              <div className="text-3xl font-bold text-primary">150</div>
              <div className="text-sm text-muted-foreground mt-1">
                Total XP ✨
              </div>
            </div>
            <div className="text-center p-3 bg-white/50 rounded-2xl">
              <div className="text-3xl font-bold text-accent">3</div>
              <div className="text-sm text-muted-foreground mt-1">Level 🌱</div>
            </div>
            <div className="text-center p-3 bg-white/50 rounded-2xl">
              <div className="text-3xl font-bold text-secondary">5</div>
              <div className="text-sm text-muted-foreground mt-1">
                Quests 📋
              </div>
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 shadow-[0_2px_8px_rgba(107,166,115,0.08),0_1px_3px_rgba(107,166,115,0.04)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12),0_2px_6px_rgba(107,166,115,0.08)] hover:-translate-y-0.5 transition-all relative before:content-[''] before:absolute before:inset-[-2px] before:border-2 before:border-primary before:rounded-2xl before:opacity-0 hover:before:opacity-20 before:transition-opacity space-y-4">
          <h3
            className="text-lg font-semibold mb-4 flex items-center gap-2"
            style={{ fontFamily: "'Segoe UI', sans-serif" }}
          >
            <Leaf className="w-5 h-5 text-primary" />
            Personal Details
          </h3>

          <div>
            <Label className="text-muted-foreground mb-2">Phone Number</Label>
            <Input
              value={profile.phone}
              disabled={!isEditing}
              className="mt-1 rounded-2xl border-2"
            />
          </div>

          <div>
            <Label className="text-muted-foreground mb-2">
              Experience Level
            </Label>
            <Input
              value={profile.experience}
              disabled={!isEditing}
              className="mt-1 rounded-2xl border-2"
            />
          </div>

          <div>
            <Label className="text-muted-foreground mb-2">
              Field Size (acres)
            </Label>
            <Slider
              value={[profile.fieldSize]}
              max={20}
              step={1}
              disabled={!isEditing}
              className="mt-3"
              onValueChange={(value) =>
                setProfile({ ...profile, fieldSize: value[0] })
              }
            />
            <div className="text-sm text-muted-foreground mt-2">
              {profile.fieldSize} acres 🌾
            </div>
          </div>

          <div>
            <Label className="text-muted-foreground mb-2">Primary Crops</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.crops.map((crop) => (
                <span
                  key={crop}
                  className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border-2 border-primary/20"
                >
                  {crop}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card border-[1.5px] border-border rounded-2xl p-6 shadow-[0_2px_8px_rgba(107,166,115,0.08),0_1px_3px_rgba(107,166,115,0.04)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12),0_2px_6px_rgba(107,166,115,0.08)] hover:-translate-y-0.5 transition-all relative before:content-[''] before:absolute before:inset-[-2px] before:border-2 before:border-primary before:rounded-2xl before:opacity-0 hover:before:opacity-20 before:transition-opacity">
          <h3
            className="text-lg font-semibold mb-5 flex items-center gap-2"
            style={{ fontFamily: "'Segoe UI', sans-serif" }}
          >
            <Award className="w-5 h-5 text-accent" />
            Achievement Timeline
          </h3>
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-3 rounded-2xl hover:bg-primary/5 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 border-2 border-primary/20">
                  <achievement.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    {achievement.title}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {achievement.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
