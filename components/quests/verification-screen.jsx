"use client"

import { CheckCircle2, Sparkles, Brain, Eye, Zap } from "lucide-react"
import { useState, useEffect } from "react"

export function VerificationScreen({ quest, onContinue }) {
  const [verificationStage, setVerificationStage] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [verificationResults, setVerificationResults] = useState([])

  const stages = [
    { icon: Eye, text: "Analyzing submitted image...", duration: 2000 },
    { icon: Brain, text: "AI identifying key elements...", duration: 2500 },
    { icon: Sparkles, text: "Verifying completion criteria...", duration: 2000 },
    { icon: Zap, text: "Generating feedback...", duration: 1500 }
  ]

  useEffect(() => {
    // Simulate AI verification process
    const runVerification = async () => {
      for (let i = 0; i < stages.length; i++) {
        setVerificationStage(i)
        await new Promise(resolve => setTimeout(resolve, stages[i].duration))
      }

      // Set verification results
      setVerificationResults([
        { label: "Image Quality", status: "Excellent", color: "text-green-500" },
        { label: "Completion Steps", status: "All Verified", color: "text-green-500" },
        { label: "Authenticity", status: "Confirmed", color: "text-green-500" },
        { label: "Overall Score", status: "95/100", color: "text-primary" }
      ])

      setIsComplete(true)
    }

    runVerification()
  }, [])

  const CurrentIcon = stages[verificationStage]?.icon || Sparkles

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-background to-primary/5">
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center space-y-8 max-w-md w-full">
          {/* AI Icon Animation */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center animate-pulse">
                <CurrentIcon className="w-16 h-16 text-primary" />
              </div>
              {!isComplete && (
                <div className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
              )}
              {isComplete && (
                <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-2 animate-bounce">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Status Text */}
          <div>
            <h2 className="text-3xl font-black text-foreground mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {isComplete ? "AI Verification Complete! ✓" : "AI Analyzing Your Work"}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {isComplete
                ? "Our AI has successfully verified your quest completion!"
                : stages[verificationStage]?.text}
            </p>
          </div>

          {/* Progress Stages */}
          {!isComplete && (
            <div className="space-y-2">
              {stages.map((stage, idx) => {
                const StageIcon = stage.icon
                const isActive = idx === verificationStage
                const isCompleted = idx < verificationStage

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isActive
                        ? "bg-primary/10 border-2 border-primary scale-105"
                        : isCompleted
                          ? "bg-accent/5 border border-accent/20"
                          : "bg-muted/30 border border-border opacity-50"
                      }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCompleted ? "bg-accent" : isActive ? "bg-primary" : "bg-muted"
                      }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      ) : (
                        <StageIcon className={`w-4 h-4 ${isActive ? "text-white" : "text-muted-foreground"}`} />
                      )}
                    </div>
                    <span className={`text-sm font-medium ${isActive ? "text-primary" : isCompleted ? "text-accent" : "text-muted-foreground"
                      }`}>
                      {stage.text}
                    </span>
                  </div>
                )
              })}
            </div>
          )}

          {/* Verification Results */}
          {isComplete && (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Verification Results
              </h3>
              <div className="space-y-3">
                {verificationResults.map((result, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium text-foreground">{result.label}</span>
                    <span className={`text-sm font-bold ${result.color}`}>{result.status}</span>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                <p className="text-sm font-bold text-green-600 dark:text-green-400">
                  🎉 Excellent work! Your quest has been verified successfully.
                </p>
              </div>
            </div>
          )}

          {/* AI Info */}
          {!isComplete && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-left">
              <p className="text-xs text-muted-foreground">
                <strong className="text-primary">AI-Powered Verification:</strong> Our advanced AI analyzes your submission in real-time, checking for completion criteria, image quality, and authenticity.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Continue Button */}
      <div className="px-6 pb-6">
        <button
          onClick={onContinue}
          disabled={!isComplete}
          className={`w-full font-bold py-4 rounded-2xl transition-all shadow-lg ${isComplete
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/30 active:scale-95"
              : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
        >
          {isComplete ? "Continue to Rewards 🎁" : "Verifying..."}
        </button>
      </div>
    </div>
  )
}
