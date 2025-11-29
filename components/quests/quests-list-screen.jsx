"use client"

import { Leaf, Sprout, Droplets, Sun, Wheat, TreePine, Bug, Flower2 } from "lucide-react"

export function HomeScreen({ onStartQuest, quests }) {
  const questList = Object.values(quests)
  const totalXP = questList.reduce((sum, quest) => sum + quest.xpReward, 0)
  
  // Debug: Log quest data to help troubleshoot
  console.log("[QuestsListScreen] Quest count:", questList.length)
  console.log("[QuestsListScreen] Quest IDs:", questList.map(q => q.id))

  // Function to get crop-specific pills
  const getCropLabels = (quest) => {
    // Check if quest has cropTypes defined
    if (quest.cropTypes && quest.cropTypes.length > 0) {
      return quest.cropTypes.slice(0, 3) // Limit to 3 pills
    }
    
    // Extract from quest description/activities if cropTypes isn't defined
    const commonCrops = ['tomato', 'potato', 'wheat', 'rice', 'corn', 'beans', 'carrot', 'onion', 'spinach', 'lettuce', 'cabbage', 'broccoli']
    const foundCrops = commonCrops.filter(crop => 
      quest.description?.toLowerCase().includes(crop) || 
      quest.title?.toLowerCase().includes(crop) ||
      quest.activities?.some(activity => activity.toLowerCase().includes(crop))
    )
    return foundCrops.slice(0, 3) // Limit to 3 pills
  }

  // Function to get pill style based on crop type
  const getCropPillStyle = (crop) => {
    const styles = {
      tomato: "bg-red-100 text-red-800 border-red-200",
      potato: "bg-yellow-100 text-yellow-800 border-yellow-200", 
      wheat: "bg-amber-100 text-amber-800 border-amber-200",
      rice: "bg-blue-100 text-blue-800 border-blue-200",
      corn: "bg-yellow-100 text-yellow-800 border-yellow-200",
      beans: "bg-green-100 text-green-800 border-green-200",
      carrot: "bg-orange-100 text-orange-800 border-orange-200",
      onion: "bg-purple-100 text-purple-800 border-purple-200",
      spinach: "bg-green-100 text-green-800 border-green-200",
      lettuce: "bg-green-100 text-green-800 border-green-200",
      cabbage: "bg-green-100 text-green-800 border-green-200",
      broccoli: "bg-green-100 text-green-800 border-green-200"
    }
    return styles[crop] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/5 to-transparent p-8 md:p-12 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground text-balance">Welcome to FarmQuest</h2>
          <p className="text-lg text-muted-foreground max-w-2xl text-balance">
            Master sustainable farming through interactive quests. Learn at your own pace, earn rewards, and become a
            certified farmer.
          </p>
        </div>
      </div>

      {/* Level & XP Card */}
      <div className="p-8 md:p-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Level</p>
                <p className="text-3xl font-bold text-primary">1</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Available XP</p>
                <p className="text-3xl font-bold text-accent">{totalXP}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Quests Available</p>
                <p className="text-3xl font-bold text-primary">{questList.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Completion</p>
                <p className="text-3xl font-bold text-accent">0%</p>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-xs text-muted-foreground mb-2">Progress to Level 2</p>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                  className="bg-accent h-full rounded-full shadow-lg shadow-accent/30"
                  style={{ width: "35%" }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">35 / 100 XP</p>
            </div>
          </div>

          {/* Quests Grid */}
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">Available Quests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {questList.map((quest) => {
                const icons = {
                  soil: Sprout,
                  crops: Leaf,
                  compost: Droplets,
                  water: Droplets,
                  weather: Sun,
                  harvest: Wheat,
                  trees: TreePine,
                  pest: Bug,
                  flowers: Flower2,
                }
                const IconComponent = icons[quest.id] || Leaf
                const cropLabels = getCropLabels(quest)

                return (
                  <div
                    key={quest.id}
                    onClick={() => onStartQuest(quest.id)}
                    className="group bg-card rounded-2xl p-6 border border-border shadow-md hover:shadow-xl hover:border-primary/30 transition-all hover:scale-105 cursor-pointer"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-4 bg-accent/10 rounded-xl flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <span className="inline-block text-xs bg-accent/20 text-primary px-3 py-1 rounded-full font-medium mb-2">
                          {quest.difficulty}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg text-foreground mb-2">{quest.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{quest.description}</p>
                    
                    {/* Crop-specific pills */}
                    {cropLabels.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {cropLabels.map((crop, index) => (
                          <span 
                            key={index}
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getCropPillStyle(crop)}`}
                          >
                            🌱 {crop.charAt(0).toUpperCase() + crop.slice(1)}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-sm text-muted-foreground">{quest.activities.length} activities</span>
                      <span className="text-sm font-bold text-accent">+{quest.xpReward} XP</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { HomeScreen as QuestsListScreen }
