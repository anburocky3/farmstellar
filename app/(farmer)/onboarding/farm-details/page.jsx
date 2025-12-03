"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function FarmDetailsPage() {
  const router = useRouter();
  const [hasLand, setHasLand] = useState(true);

  const [farmDetails, setFarmDetails] = useState({
    farmName: "",
    location: "",
    landSize: "",
    soilType: "",
    waterSource: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    const errors = {};
    if (hasLand) {
      if (!farmDetails.location || farmDetails.location.trim() === "") {
        errors.location = "Please provide your farm location";
      }
      const size = parseFloat(farmDetails.landSize);
      if (!farmDetails.landSize || Number.isNaN(size) || size <= 0) {
        errors.landSize = "Please enter a valid land size (> 0)";
      }
      if (!farmDetails.soilType) {
        errors.soilType = "Please select a soil type";
      }
      if (!farmDetails.waterSource) {
        errors.waterSource = "Please select a water source";
      }
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    // Proceed to save and navigate
    setIsSubmitting(true);
    setSubmitError("");
    const payload = { hasLand, ...farmDetails };
    saveFarmDetails(payload)
      .then(() => {
        setIsSubmitting(false);
        // Permissions UI removed — continue to dashboard
        router.push("/dashboard");
      })
      .catch(() => {
        setIsSubmitting(false);
        setSubmitError("Failed to save farm details. Please try again.");
      });
    // if (!hasLand) {
    //   onSuccess({
    //     hasLand: false,
    //     farmName: "",
    //     location: "",
    //     landSize: "",
    //     soilType: "",
    //     waterSource: "",
    //   });
    // } else {
    //   onSuccess({
    //     hasLand: true,
    //     ...farmDetails,
    //   });
    // }
  };

  // Try to sync any pending farm saved in localStorage when we regain connectivity
  useEffect(() => {
    const trySync = async () => {
      try {
        const pending = localStorage.getItem("pendingFarm");
        if (pending && navigator.onLine) {
          const payload = JSON.parse(pending);
          const ok = await saveFarmDetails(payload);
          if (ok) {
            setSaveMessage("Pending farm synced");
            localStorage.removeItem("pendingFarm");
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    trySync();

    const onOnline = () => trySync();
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, []);

  const handleNoLandToggle = (checked) => {
    setHasLand(!checked);
    if (checked) {
      setFarmDetails({
        farmName: "",
        location: "",
        landSize: "",
        soilType: "",
        waterSource: "",
      });
    }
  };

  const saveFarmDetails = async (payload) => {
    // Try to POST to API; if offline or failing, fallback to localStorage
    try {
      if (!navigator.onLine) {
        throw new Error("offline");
      }
      const res = await fetch("/api/farms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("server error");
      setSaveMessage("Saved successfully");
      // Clear any pending local copy
      localStorage.removeItem("pendingFarm");
      return true;
    } catch (err) {
      console.error(err);
      // Persist locally for later sync
      try {
        localStorage.setItem("pendingFarm", JSON.stringify(payload));
        setSaveMessage("Saved locally. Will sync when online.");
      } catch (e) {
        console.error(e);
        setSubmitError("Failed to save farm details");
        return false;
      }
      return false;
    }
  };

  // Small collapse component that animates show/hide using max-height + opacity.
  function Collapse({ isOpen, children, className = "" }) {
    const ref = useRef(null);
    const [maxH, setMaxH] = useState(isOpen ? "auto" : "0px");
    const [render, setRender] = useState(isOpen);

    useEffect(() => {
      let enterTimer = null;
      let leaveTimer = null;
      const el = ref.current;

      if (isOpen) {
        // ensure content is rendered before measuring
        setRender(true);
        // next tick measure and expand
        requestAnimationFrame(() => {
          const height = el ? el.scrollHeight : 0;
          setMaxH(height + "px");
          // after transition, allow auto height for responsive content
          enterTimer = setTimeout(() => setMaxH("auto"), 320);
        });
      } else {
        // collapsing: measure current height, then animate to 0,
        // and unmount after transition to remove any leftover space
        if (el) {
          const height = el.scrollHeight;
          setMaxH(height + "px");
          // next frame collapse
          requestAnimationFrame(() => setMaxH("0px"));
          leaveTimer = setTimeout(() => setRender(false), 320);
        } else {
          setRender(false);
        }
      }

      return () => {
        if (enterTimer) clearTimeout(enterTimer);
        if (leaveTimer) clearTimeout(leaveTimer);
      };
    }, [isOpen]);

    if (!render) return null;

    return (
      <div
        ref={ref}
        className={className}
        style={{
          maxHeight: maxH,
          overflow: "hidden",
          transition:
            "max-height 320ms cubic-bezier(.2,.8,.2,1), opacity 220ms",
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "translateY(0)" : "translateY(-6px)",
        }}
      >
        {children}
      </div>
    );
  }
  // bg-linear-to-br from-background via-muted/30 to-background

  return (
    <div className="relative z-10">
      <Card className="mt-10 sm:mt-0 max-w-2xl p-5 sm:p-8 sm:bg-card sm:border-[1.5px] sm:border-border sm:rounded-2xl shadow-[0_2px_8px_rgba(107,166,115,0.08),0_1px_3px_rgba(107,166,115,0.04)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12),0_2px_6px_rgba(107,166,115,0.08)] hover:-translate-y-0.5 transition-all">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Tell Us About Your Farm
          </h2>
          <p className="text-sm text-muted-foreground">
            Help us customize your experience
          </p>
        </div>

        <div className="flex items-start space-x-3 p-4 rounded-xl bg-blue-50 border border-border/50 hover:border-primary/30 transition-colors ">
          <Checkbox
            id="noLand"
            checked={!hasLand}
            onCheckedChange={handleNoLandToggle}
            className="mt-1 h-5 w-5 border-2 border-blue-500 "
          />
          <div className="flex-1">
            <Label
              htmlFor="noLand"
              className="text-base font-semibold cursor-pointer leading-relaxed text-foreground"
            >
              I am a beginner and don&apos;t have a farm yet
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              Start learning the basics. You can add farm details later from
              your profile settings.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Collapse isOpen={hasLand} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="farmName" className="font-semibold">
                Farm Name (Optional)
              </Label>
              <Input
                id="farmName"
                placeholder="Green Valley Farm"
                value={farmDetails.farmName}
                onChange={(e) =>
                  setFarmDetails({ ...farmDetails, farmName: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="font-semibold">
                Location
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  id="location"
                  placeholder="Village, District, State"
                  className="col-span-2"
                  value={farmDetails.location}
                  onChange={(e) =>
                    setFarmDetails({
                      ...farmDetails,
                      location: e.target.value,
                    })
                  }
                  required
                />
                <button
                  type="button"
                  onClick={async () => {
                    setLocationError("");
                    if (!navigator.geolocation) {
                      setLocationError(
                        "Geolocation is not supported by your browser"
                      );
                      return;
                    }
                    setIsDetectingLocation(true);
                    navigator.geolocation.getCurrentPosition(
                      async (pos) => {
                        try {
                          const lat = pos.coords.latitude;
                          const lon = pos.coords.longitude;
                          const res = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
                          );
                          const data = await res.json();
                          const addr = data.address || {};
                          const place = [
                            addr.village ||
                              addr.town ||
                              addr.city ||
                              addr.suburb ||
                              addr.county,
                            addr.state,
                          ]
                            .filter(Boolean)
                            .join(", ");
                          if (place) {
                            setFarmDetails({
                              ...farmDetails,
                              location: place,
                            });
                          } else {
                            setLocationError(
                              "Unable to determine address from coordinates"
                            );
                          }
                        } catch (err) {
                          console.error(err);
                          setLocationError(
                            "Failed to reverse geocode location"
                          );
                        } finally {
                          setIsDetectingLocation(false);
                        }
                      },
                      (err) => {
                        setLocationError(
                          err.message || "Failed to get location"
                        );
                        setIsDetectingLocation(false);
                      },
                      { enableHighAccuracy: true, timeout: 10000 }
                    );
                  }}
                  className="btn-secondary px-3 py-2 text-sm"
                  disabled={isDetectingLocation}
                >
                  {isDetectingLocation
                    ? "Detecting..."
                    : "Use current location"}
                </button>
              </div>
              {locationError && (
                <p className="text-xs text-destructive mt-1">{locationError}</p>
              )}
              {formErrors.location && (
                <p className="text-xs text-destructive mt-1">
                  {formErrors.location}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="landSize" className="font-semibold">
                Land Size (in acres)
              </Label>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <div className="flex-1">
                  <input
                    id="landSize"
                    aria-label="Land size in acres"
                    type="range"
                    min="0.1"
                    max="100"
                    step="0.1"
                    value={farmDetails.landSize || 2.5}
                    onChange={(e) =>
                      setFarmDetails({
                        ...farmDetails,
                        landSize: e.target.value,
                      })
                    }
                    className="w-full h-3 rounded-lg accent-primary"
                  />
                </div>
                <div className="mt-2 sm:mt-0 w-28 text-center">
                  <div className="text-sm text-muted-foreground">
                    {parseFloat(farmDetails.landSize || 2.5).toFixed(1)} acres
                  </div>
                </div>
              </div>
              {formErrors.landSize && (
                <p className="text-xs text-destructive mt-1">
                  {formErrors.landSize}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2 ">
                <Label htmlFor="soilType" className="font-semibold">
                  Soil Type
                </Label>
                <Select
                  value={farmDetails.soilType}
                  onValueChange={(value) =>
                    setFarmDetails({ ...farmDetails, soilType: value })
                  }
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clay">Clay</SelectItem>
                    <SelectItem value="sandy">Sandy</SelectItem>
                    <SelectItem value="loamy">Loamy</SelectItem>
                    <SelectItem value="silty">Silty</SelectItem>
                    <SelectItem value="peaty">Peaty</SelectItem>
                    <SelectItem value="chalky">Chalky</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.soilType && (
                  <p className="text-xs text-destructive mt-1">
                    {formErrors.soilType}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="waterSource" className="font-semibold">
                  Water Source
                </Label>
                <Select
                  value={farmDetails.waterSource}
                  onValueChange={(value) =>
                    setFarmDetails({ ...farmDetails, waterSource: value })
                  }
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select water source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="well">Well</SelectItem>
                    <SelectItem value="borewell">Borewell</SelectItem>
                    <SelectItem value="canal">Canal</SelectItem>
                    <SelectItem value="river">River</SelectItem>
                    <SelectItem value="rainwater">
                      Rainwater Harvesting
                    </SelectItem>
                    <SelectItem value="pond">Pond</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.waterSource && (
                  <p className="text-xs text-destructive mt-1">
                    {formErrors.waterSource}
                  </p>
                )}
              </div>
            </div>
          </Collapse>

          <Collapse
            isOpen={!hasLand}
            className={`p-4 rounded-xl bg-accent/10 border border-accent/20 ${
              !hasLand ? "" : ""
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">🌱</div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">
                  Perfect! Let&apos;s start your farming journey
                </p>
                <p className="text-xs text-muted-foreground">
                  You&apos;ll access knowledge-based quests and tutorials. When
                  you&apos;re ready to start your own farm, you can add the
                  details anytime from your profile.
                </p>
              </div>
            </div>
          </Collapse>

          <div className="">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Continue"}
            </Button>
            {submitError && (
              <p className="text-xs text-destructive mt-2">{submitError}</p>
            )}
            {saveMessage && (
              <p className="text-xs text-muted-foreground mt-2">
                {saveMessage}
              </p>
            )}
            <Link
              href="/onboarding"
              className="text-center w-full block mt-3 text-sm text-muted-foreground hover:text-foreground"
            >
              Back
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
