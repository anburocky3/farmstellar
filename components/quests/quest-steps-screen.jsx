"use client"

import { ChevronLeft, CheckCircle2, Circle, ChevronRight, Check, Zap, Trophy } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { QuestCompletionProgress } from "./quest-completion-progress"

export const stepsData = {
  soil_scout: [
    { icon: "🥄", title: "Collect Soil", instruction: "Dig 6 inches deep and collect a small soil sample." },
    { icon: "✋", title: "Texture Test", instruction: "Rub soil between fingers to check sand/silt/clay ratio." },
    { icon: "💧", title: "Moisture Check", instruction: "Observe if soil feels dry, moist, or sticky." },
    { icon: "👃", title: "Smell Test", instruction: "Healthy soil has an earthy smell with no foul odor." }
  ],

  crop_quest: [
    { icon: "👀", title: "Explore Crops", instruction: "Browse suggested crops based on your region." },
    { icon: "🌾", title: "Pick Your 3 Crops", instruction: "Select crops that fit your climate & land." },
    { icon: "📅", title: "Check Season", instruction: "Match each crop with the correct planting season." },
    { icon: "💧", title: "Water Needs", instruction: "Confirm whether crops require low, medium, or high water." }
  ],

  compost_kickoff: [
    { icon: "📍", title: "Choose Spot", instruction: "Select a shaded spot with good airflow." },
    { icon: "🥬", title: "Add Greens", instruction: "Include kitchen waste like peels & scraps." },
    { icon: "🍂", title: "Add Browns", instruction: "Mix dry leaves, cardboard, or straw." },
    { icon: "🔄", title: "Mix Weekly", instruction: "Turn compost every 7 days to speed decomposition." }
  ],

  zero_waste: [
    { icon: "♻️", title: "Segregate Waste", instruction: "Separate organic & non-organic waste at home." },
    { icon: "🍂", title: "Collect Dry Leaves", instruction: "Store leaves for mulching your plants." },
    { icon: "🗑️", title: "Mini Waste Station", instruction: "Set up 2–3 labeled bins for easy segregation." }
  ],

  mini_garden: [
    { icon: "🌱", title: "Pick 5 Plants", instruction: "Choose beginner-friendly herbs/veggies." },
    { icon: "🪴", title: "Prepare Patch", instruction: "Loosen top soil in a 1×1m area." },
    { icon: "🌾", title: "Plant Seeds", instruction: "Sow seeds or plant small saplings." },
    { icon: "💧", title: "Water & Mulch", instruction: "Keep soil moist and apply mulch on top." }
  ],

  mulch_master: [
    { icon: "🍂", title: "Collect Mulch", instruction: "Gather dry leaves, straw, or grass clippings." },
    { icon: "🌿", title: "Spread Mulch", instruction: "Create a 2–3 inch thick layer around the plant." },
    { icon: "💦", title: "Settle Mulch", instruction: "Water lightly to keep mulch in place." }
  ],

  boll_keeper: [
    { icon: "🔍", title: "Inspect Bolls", instruction: "Check for early shedding & pest marks." },
    { icon: "🧪", title: "Nutrient Spray", instruction: "Apply balanced micronutrient foliar spray." },
    { icon: "✂️", title: "Remove Damage", instruction: "Cut off pest-affected bolls to prevent spread." }
  ],

  coconut_basin: [
    { icon: "📏", title: "Mark Radius", instruction: "Draw a 1–1.5m circle around the tree." },
    { icon: "⛏️", title: "Dig Basin", instruction: "Create a shallow circular trench." },
    { icon: "📐", title: "Level Soil", instruction: "Flatten inner area for even watering." },
    { icon: "🍂", title: "Add Mulch", instruction: "Fill with dry leaves or coconut husk." },
    { icon: "💧", title: "Water", instruction: "Water gently to help basin settle." }
  ],

  coconut_bioenzyme: [
    { icon: "🥥", title: "Collect Water", instruction: "Use leftover coconut water as base." },
    { icon: "🍯", title: "Add Jaggery", instruction: "Mix jaggery to feed microbes." },
    { icon: "🧪", title: "Ferment 7 Days", instruction: "Store sealed and allow natural fermentation." },
    { icon: "💧", title: "Dilute & Apply", instruction: "Mix with water (1:20) and pour around root zone." }
  ],

  rust_shield: [
    { icon: "🔍", title: "Spot Symptoms", instruction: "Look for yellow/orange rust patches on leaves." },
    { icon: "✂️", title: "Remove Infected Leaves", instruction: "Cut and discard affected parts safely." },
    { icon: "🌬️", title: "Improve Airflow", instruction: "Ensure proper spacing between plants." },
    { icon: "🧴", title: "Organic Spray", instruction: "Apply safe fungicidal solution weekly." }
  ],

  biodiversity_strip: [
    { icon: "🌼", title: "Select Flowers", instruction: "Choose 5 pollinator-friendly plants." },
    { icon: "📏", title: "Mark 1m Strip", instruction: "Prepare a 1-meter planting strip." },
    { icon: "🌱", title: "Cluster Planting", instruction: "Plant flowers in small clusters." },
    { icon: "🍂", title: "Mulch & Water", instruction: "Mulch lightly and water regularly." }
  ],

  rainwater_hero: [
    { icon: "🛢️", title: "Place Barrel", instruction: "Set container under roof edge to collect runoff." },
    { icon: "🧵", title: "Add Mesh Filter", instruction: "Install mesh to block debris and insects." },
    { icon: "🚰", title: "Fit Tap", instruction: "Attach outlet tap near bottom of barrel." },
    { icon: "💧", title: "Use Saved Water", instruction: "Water plants using collected rainwater." }
  ],

  biochar_maker: [
    { icon: "🪵", title: "Gather Waste Wood", instruction: "Collect dry sticks, branches, and husk pieces." },
    { icon: "🔥", title: "Burn Low-Oxygen", instruction: "Slow-burn in pit while limiting airflow." },
    { icon: "🪨", title: "Crush Charcoal", instruction: "Break cooled biochar into smaller pieces." },
    { icon: "🌱", title: "Mix with Compost", instruction: "Blend biochar into compost before application." }
  ],

  jeevamrutham: [
    { icon: "🐄", title: "Mix Dung & Urine", instruction: "Combine fresh cow dung and urine in a drum." },
    { icon: "🍯", title: "Add Jaggery + Flour", instruction: "Add jaggery & gram flour to feed microbes." },
    { icon: "🧪", title: "Ferment 5–7 Days", instruction: "Stir daily and allow microbial growth." },
    { icon: "🌾", title: "Apply to Soil", instruction: "Pour near root zone for microbial boost." }
  ]
};

export function QuestStepsScreen({ quest, onContinue, onBack }) {
  // Check if we have detailed steps in the quest object (New Format)
  const detailedSteps = quest.steps

  // If we have detailed steps, use the Wizard mode
  if (detailedSteps && detailedSteps.length > 0) {
    return <QuestWizard steps={detailedSteps} onComplete={onContinue} onBack={onBack} questId={quest.id} />
  }

  // Fallback to existing Checklist mode (Old Format)
  const steps = stepsData[quest.id] || []

  const storageKey = `quest_steps_${quest.id}`
  const [completedSteps, setCompletedSteps] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem(storageKey)
      return saved ? JSON.parse(saved) : new Array(steps.length).fill(false)
    }
    return new Array(steps.length).fill(false)
  })

  useEffect(() => {
    sessionStorage.setItem(storageKey, JSON.stringify(completedSteps))
  }, [completedSteps, storageKey])

  const toggleStep = (index) => {
    const newCompleted = [...completedSteps]
    newCompleted[index] = !newCompleted[index]
    setCompletedSteps(newCompleted)
  }

  const completedCount = completedSteps.filter(Boolean).length

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <button onClick={onBack} className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold">Quest Steps</h1>
        <div className="w-9"></div>
      </div>

      <div className="px-6 pt-6 pb-4">
        <QuestCompletionProgress steps={steps.map((s) => s.title)} completedSteps={completedCount} />
      </div>

      {/* Steps List */}
      <div className="flex-1 overflow-auto px-6 pb-6 space-y-3">
        {steps.map((step, idx) => (
          <div
            key={idx}
            onClick={() => toggleStep(idx)}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${completedSteps[idx] ? "bg-accent/10 border-accent" : "bg-card border-border hover:border-primary"
              }`}
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl mt-1">{step.icon}</div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{step.instruction}</p>
              </div>
              <div className="flex-shrink-0 mt-1">
                {completedSteps[idx] ? (
                  <CheckCircle2 className="w-6 h-6 text-accent" />
                ) : (
                  <Circle className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Continue Button */}
      <div className="px-6 pb-6">
        <button
          onClick={onContinue}
          disabled={completedCount < steps.length}
          className={`w-full font-bold py-3 rounded-xl transition-all ${completedCount === steps.length
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
        >
          {completedCount === steps.length
            ? "Continue to Proof"
            : `Complete ${steps.length - completedCount} more steps`}
        </button>
      </div>
    </div>
  )
}

function QuestWizard({ steps, onComplete, onBack, questId }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get current step from URL (1-based index)
  const pageParam = searchParams.get("page")
  const currentIndex = pageParam ? parseInt(pageParam) - 1 : 0
  const safeIndex = isNaN(currentIndex) ? 0 : Math.max(0, Math.min(currentIndex, steps.length - 1))

  const step = steps[safeIndex]
  const isLastStep = safeIndex === steps.length - 1
  const isSummaryStep = step.title.toLowerCase().includes('summary') || step.title.toLowerCase().includes('conclusion')

  // Persist checkbox state
  const storageKey = `quest_wizard_checks_${questId}`
  const [checkedItems, setCheckedItems] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem(storageKey)
      return saved ? JSON.parse(saved) : {}
    }
    return {}
  })

  useEffect(() => {
    sessionStorage.setItem(storageKey, JSON.stringify(checkedItems))
  }, [checkedItems, storageKey])

  const toggleCheck = (subStepIdx) => {
    setCheckedItems(prev => ({
      ...prev,
      [safeIndex]: {
        ...prev[safeIndex],
        [subStepIdx]: !prev[safeIndex]?.[subStepIdx]
      }
    }))
  }

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const handleNext = () => {
    if (isLastStep) {
      onComplete()
    } else {
      const nextStep = safeIndex + 2 // +1 for next index, +1 for 1-based URL
      router.push(pathname + '?' + createQueryString('page', nextStep))
    }
  }

  const handlePrev = () => {
    if (safeIndex === 0) {
      onBack()
    } else {
      const prevStep = safeIndex // +1 for 1-based, -1 for prev = current index
      router.push(pathname + '?' + createQueryString('page', prevStep))
    }
  }

  // Calculate progress percentage
  const progress = ((safeIndex + 1) / steps.length) * 100

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background/80 backdrop-blur-md z-20 absolute top-0 left-0 right-0 md:relative">
        <button onClick={handlePrev} className="p-2 hover:bg-muted rounded-full transition-colors border border-transparent hover:border-border">
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center gap-2 w-full max-w-xs mx-4">
          <div className="flex justify-between w-full text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <span>Step {safeIndex + 1}</span>
            <span>{steps.length} Steps</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="w-9"></div>
      </div>

      {/* Layout - Full width for summary, split for regular steps */}
      {isSummaryStep ? (
        /* Full-Width Layout for Summary */
        <div className="flex-1 overflow-hidden pt-16 md:pt-0 bg-background">
          <div className="flex flex-col h-full overflow-hidden relative max-w-6xl mx-auto">
            <div className="flex-1 overflow-y-auto px-6 pt-6 md:px-12 md:pt-12 pb-96 custom-scrollbar">
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
                <h2 className="text-3xl md:text-5xl font-black mb-4 text-foreground tracking-tight leading-tight">{step.title}</h2>
                <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed font-medium">{step.objective}</p>

                {/* Learning Summary View - No Checkboxes */}
                {step.subSteps && step.subSteps.length > 0 && (
                  <div className="space-y-6 mb-10">
                    <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-6 rounded-2xl border border-primary/20">
                      <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-primary" />
                        What You've Learned
                      </h3>
                      <div className="space-y-4">
                        {step.subSteps.map((subStep, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-4 p-4 rounded-xl bg-background/60 backdrop-blur-sm border border-border/50"
                          >
                            <div className="w-8 h-8 mt-0.5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="text-sm font-bold text-primary">{idx + 1}</span>
                            </div>
                            <p className="text-base font-medium leading-relaxed text-foreground">
                              {subStep}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-accent/10 p-6 rounded-2xl border border-accent/20 text-center">
                      <p className="text-lg font-semibold text-foreground mb-2">🎉 Congratulations!</p>
                      <p className="text-muted-foreground">You've completed this quest and gained valuable knowledge about soil analysis.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Button */}
            <div className="p-6 border-t border-border bg-background/80 backdrop-blur-xl absolute bottom-0 left-0 right-0 z-10">
              <button
                onClick={handleNext}
                className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transform active:scale-[0.98] text-lg"
              >
                {isLastStep ? "Complete Mission" : "Next Step"}
                {!isLastStep && <ChevronRight className="w-5 h-5 stroke-[3]" />}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Split Layout for Regular Steps */
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden pt-16 md:pt-0">
          {/* Image Side */}
          <div className="relative h-64 md:h-full bg-muted overflow-hidden group">
            {step.image && (
              <img
                src={step.image}
                alt={step.title}
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Content Side */}
          <div className="flex flex-col h-full overflow-hidden relative bg-background">
            <div className="flex-1 overflow-y-auto px-6 pt-6 md:px-12 md:pt-12 pb-96 custom-scrollbar">
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
                <h2 className="text-3xl md:text-5xl font-black mb-4 text-foreground tracking-tight leading-tight">{step.title}</h2>
                <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed font-medium">{step.objective}</p>

                {/* Regular Interactive Checkboxes */}
                {step.subSteps && step.subSteps.length > 0 && (
                  <div className="space-y-4 mb-10">
                    {step.subSteps.map((subStep, idx) => (
                      <div
                        key={idx}
                        onClick={() => toggleCheck(idx)}
                        className={`flex items-start gap-5 p-5 rounded-2xl border transition-all duration-300 cursor-pointer group ${checkedItems[safeIndex]?.[idx]
                          ? "bg-primary/5 border-primary shadow-md scale-[1.01]"
                          : "bg-card border-border hover:border-primary/50 hover:shadow-lg hover:bg-accent/5"
                          }`}
                      >
                        <div className={`w-6 h-6 mt-0.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${checkedItems[safeIndex]?.[idx]
                          ? "bg-primary border-primary text-primary-foreground scale-110 shadow-sm"
                          : "border-muted-foreground/40 group-hover:border-primary group-hover:scale-110"
                          }`}>
                          {checkedItems[safeIndex]?.[idx] && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <p className="text-base font-medium leading-relaxed text-foreground flex-1">
                          {subStep}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pro Tip */}
                {(step.tip || step.reason) && (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-6 rounded-2xl border border-amber-200 dark:border-amber-800/30 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 shadow-md">
                        <Zap className="w-5 h-5 text-white fill-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-amber-900 dark:text-amber-100 mb-2 text-sm uppercase tracking-wide">PRO TIP</h4>
                        <p className="leading-relaxed font-medium">{step.tip || step.reason}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Button */}
            <div className="p-6 border-t border-border bg-background/80 backdrop-blur-xl absolute bottom-0 left-0 right-0 z-10">
              <button
                onClick={handleNext}
                className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transform active:scale-[0.98] text-lg"
              >
                {isLastStep ? "Complete Mission" : "Next Step"}
                {!isLastStep && <ChevronRight className="w-5 h-5 stroke-[3]" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
