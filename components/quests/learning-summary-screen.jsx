"use client";

import { ChevronRight } from "lucide-react";

const summaryData = {
  soil_scout: [
    "Soil texture determines water retention and crop suitability.",
    "Moisture testing helps estimate irrigation needs.",
    "Soil color and smell indicate microbial health.",
    "Healthy soil supports stronger roots and better yields.",
  ],

  crop_quest: [
    "Selecting region-suited crops improves success and yield.",
    "Climate-based crop planning reduces risks.",
    "Matching water needs prevents over- or under-irrigation.",
    "Seasonal crop selection ensures healthy growth.",
  ],

  compost_kickoff: [
    "Composting reduces organic waste significantly.",
    "Balancing green and dry materials accelerates breakdown.",
    "Proper moisture keeps compost active and odor-free.",
    "Finished compost enriches soil naturally.",
  ],

  zero_waste: [
    "Segregating waste makes recycling and composting easier.",
    "Collecting dry leaves supports mulching and composting.",
    "Zero-waste habits reduce farm pollution.",
    "Clean waste management improves farm sustainability.",
  ],

  mini_garden: [
    "Starting small builds confidence in growing plants.",
    "A 5-plant patch teaches essential gardening basics.",
    "Beginners learn watering, spacing, and soil preparation.",
    "Mini gardens promote daily care habits.",
  ],

  mulch_master: [
    "Mulching reduces evaporation and saves water.",
    "Soil temperature stays cooler under mulch.",
    "Mulch suppresses weed growth naturally.",
    "Organic mulch improves soil health over time.",
  ],

  boll_keeper: [
    "Monitoring early boll shedding improves cotton yield.",
    "Balanced nutrients strengthen boll development.",
    "Removing pest-damaged bolls avoids crop loss.",
    "Healthy bolls increase final harvest quality.",
  ],

  coconut_basin: [
    "Circular basins help retain rainwater around roots.",
    "Basins improve deep soil moisture levels.",
    "Mulching inside basins boosts microbial activity.",
    "Coconut trees become more drought-resilient.",
  ],

  coconut_bioenzyme: [
    "Bio-enzymes increase beneficial soil microbes.",
    "Fermented solutions strengthen plant immunity.",
    "Diluted enzyme improves nutrient absorption.",
    "Natural fertilizers reduce chemical dependency.",
  ],

  rust_shield: [
    "Early detection of rust reduces crop damage.",
    "Healthy spacing improves airflow and prevents disease.",
    "Removing infected leaves slows disease spread.",
    "Timely organic sprays protect wheat health.",
  ],

  biodiversity_strip: [
    "Flowering strips attract pollinators and predators.",
    "More beneficial insects reduce pest pressure.",
    "Biodiversity improves ecological balance.",
    "Hedgerows support long-term soil and crop health.",
  ],

  rainwater_hero: [
    "Rainwater harvesting reduces dependence on wells.",
    "Filtered storage keeps water clean for plants.",
    "Stored rainwater works well for dry spells.",
    "Simple systems increase farm sustainability.",
  ],

  biochar_maker: [
    "Biochar improves soil aeration and structure.",
    "Low-oxygen burning retains carbon effectively.",
    "Mixing biochar with compost boosts microbial activity.",
    "Biochar increases long-term soil fertility.",
  ],

  jeevamrutham: [
    "Jeevamrutham boosts natural soil microbe counts.",
    "Fermentation releases plant-available nutrients.",
    "Plants grow healthier with improved root activity.",
    "Regular application strengthens overall soil biology.",
  ],
};

export function LearningSummaryScreen({ quest, onContinue }) {
  const summaryPoints = summaryData[quest.id] || [];

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-3xl font-bold text-foreground text-balance mb-2">
          What You Learned
        </h2>
        <p className="text-muted-foreground text-sm">
          Key knowledge from this quest
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 pb-6 space-y-3">
        {summaryPoints.map((point, idx) => (
          <div
            key={idx}
            className="bg-card rounded-2xl p-4 border border-border"
          >
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-accent">{idx + 1}</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed pt-0.5">
                {point}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Next Steps */}
      <div className="px-6 pb-6 space-y-3">
        <button
          onClick={onContinue}
          className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          Back to Home
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
