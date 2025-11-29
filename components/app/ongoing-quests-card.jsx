"use client"

import { Leaf, ArrowRight, CheckCircle2 } from "lucide-react"

export function OngoingQuestsCard({ quests = [], onResumeQuest }) {
    // Mock ongoing quests data
    const ongoingQuests = [
        {
            id: "soil",
            name: "Soil Basics Quest",
            progress: 60,
            totalTasks: 5,
            completedTasks: 3,
            remainingTasks: 2,
            icon: "🌱",
            color: "primary",
        },
        {
            id: "crops",
            name: "Crop Selection Guide",
            progress: 25,
            totalTasks: 4,
            completedTasks: 1,
            remainingTasks: 3,
            icon: "🌾",
            color: "accent",
        },
    ]

    return (
        <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-2xl">
                    <Leaf className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-foreground">Ongoing Quests</h3>
                    <p className="text-xs text-muted-foreground">Continue your learning journey</p>
                </div>
            </div>

            <div className="space-y-4">
                {ongoingQuests.map((quest) => (
                    <div
                        key={quest.id}
                        className="bg-gradient-to-r from-muted/30 to-transparent border border-border rounded-2xl p-4 hover:border-primary/30 transition-all group"
                    >
                        {/* Quest Header */}
                        <div className="flex items-start gap-3 mb-3">
                            <div className="text-2xl">{quest.icon}</div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-foreground text-sm mb-1 truncate">
                                    {quest.name}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                    {quest.completedTasks} of {quest.totalTasks} tasks completed
                                </p>
                            </div>
                            <span className="text-xs font-bold text-accent">{quest.progress}%</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-3">
                            <div
                                className={`absolute inset-y-0 left-0 bg-gradient-to-r from-${quest.color} to-accent rounded-full transition-all duration-500`}
                                style={{ width: `${quest.progress}%` }}
                            ></div>
                        </div>

                        {/* Tasks & Button */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>{quest.remainingTasks} tasks remaining</span>
                            </div>
                            <button
                                onClick={() => onResumeQuest && onResumeQuest(quest.id)}
                                className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-accent transition-colors group-hover:gap-2"
                            >
                                Resume
                                <ArrowRight className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {ongoingQuests.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">No ongoing quests</p>
                    <p className="text-xs text-muted-foreground mt-1">Start a new quest to begin learning!</p>
                </div>
            )}
        </div>
    )
}
