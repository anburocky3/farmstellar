"use client"

import { Check, Sprout } from "lucide-react"

export function QuestCompletionProgress({ steps, completedSteps }) {
  const progress = (completedSteps / steps.length) * 100

  return (
    <div className="space-y-4">
      {/* Overall progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden border border-border/50">
            <div
              className="h-full bg-gradient-to-r from-primary via-accent to-secondary transition-all duration-500 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
        </div>
        <span className="text-sm font-bold text-foreground whitespace-nowrap">
          {completedSteps}/{steps.length}
        </span>
      </div>

      {/* Steps list */}
      <div className="space-y-3">
        {steps.map((step, idx) => {
          const isCompleted = idx < completedSteps
          const isCurrent = idx === completedSteps

          return (
            <div key={idx} className="flex items-start gap-3 group">
              {/* Step indicator with growing plant */}
              <div className="relative flex-shrink-0">
                {/* <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? "bg-gradient-to-br from-accent to-primary scale-110 shadow-lg"
                      : isCurrent
                        ? "bg-primary/20 border-2 border-primary animate-pulse"
                        : "bg-muted border border-border"
                  }`}
                > */}
                  {/* {isCompleted ? (
                    <Sprout className="w-5 h-5 text-white animate-wiggle" />
                  ) : (
                    <span className="text-sm font-bold text-muted-foreground">{idx + 1}</span>
                  )}
                </div> */}

                {/* Checkmark badge */}
                {/* {isCompleted && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center border-2 border-background">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )} */}
              </div>

              {/* Step text */}
              {/* <div className="flex-1 pt-2">
                <p
                  className={`text-sm transition-all ${
                    isCompleted
                      ? "text-foreground font-medium line-through opacity-60"
                      : isCurrent
                        ? "text-foreground font-bold"
                        : "text-muted-foreground"
                  }`}
                >
                  {step}
                </p> */}

                {/* Growing plant animation for current step */}
                {/* {isCurrent && (
                  <p className="text-xs text- font-medium mt-1 ">🌱 Complete this to grow!</p>
                )} */}
              </div>
            // </div>
          )
        })}
      </div>

      {/* Completion message */}
      {progress === 100 && (
        <div className="bg-gradient-to-r from-beige/20 via-primary/20 to-secondary/20 rounded-xl p-4 text-center animate-pulse border border-accent/30">
          <p className="text-lg font-bold text-foreground">🎉 Quest Complete!</p>
          <p className="text-xl text-muted-foreground">Your plant has fully grown!</p>
        </div>
      )}
    </div>
  )
}
