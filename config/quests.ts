export const QUESTS_DATA = {
  soil_scout: {
    id: "soil_scout",
    title: "Meet the Soil",
    description:
      "Analyze the physical health of your garden soil to understand what plants will thrive in it.",
    activities: [
      "Collect soil samples",
      "Perform texture test (sand/silt/clay)",
      "Check moisture levels",
      "Evaluate smell and color",
    ],
    outcomes: [
      "Understand soil composition",
      "Identify soil quality indicators",
      "Recognize healthy vs poor soil",
    ],
    difficulty: "Beginner",
    cropType: "General",
    xpReward: 5,
    badgeName: "Soil Scout",
    steps: [
      {
        title: "Preparation & Gear Check",
        objective: "Before you head out, gather your kit.",
        subSteps: [
          "Small trowel or sturdy spoon",
          "3 Clean jars or Ziploc bags",
          "Permanent marker",
          "Water bottle",
          "Notebook & Camera (Phone)",
          "Optional: Ruler & Gloves",
        ],
        tip: "Pro Tip: Soil tests are best done when the soil is slightly damp, but not soaking wet from heavy rain.",
        image: "/images/quests/soil_scout/step1.png",
      },
      {
        title: "Step 1 — The Harvest (Sampling)",
        objective: "Collect a representative sample of your soil.",
        subSteps: [
          "Select 3 Spots: Pick three distinct areas in your plot (e.g., near a plant, center of the row, and an empty corner).",
          "Dig: Clear away surface leaves/mulch. Dig 6–10 cm deep (about finger-length).",
          "Collect: Scoop about 1 cup of soil from each spot into separate bags/jars.",
          "Label: Mark them clearly: S1, S2, S3.",
        ],
        reason:
          "Why? Soil changes across a garden. Three spots give you an average, not an anomaly.",
        image: "/images/quests/soil_scout/step2.jpg",
      },
      {
        title: "Step 2 — Texture Analysis (The Physics)",
        objective: "Determine if your soil is Sandy, Silty, or Clay-heavy.",
        subSteps: [
          "Method A: Take a moist pinch of soil (add a drop of water if needed).",
          "Knead it into a ball, then press it between your thumb and finger to push out a 'ribbon.'",
          "Check Ribbon: Sandy (No ribbon), Silty (Weak ribbon), Clay (Strong ribbon >2cm).",
          "Method B: Fill a clear jar 2/3 with soil and top with water.",
          "Add a pinch of salt and shake vigorously for 2 minutes.",
          "Wait 24 Hours and observe layers (Sand bottom, Silt middle, Clay top).",
        ],
        image: "/images/quests/soil_scout/step3.png",
      },
      {
        title: "Step 3 — Hydration Check",
        objective: "Check water retention and drainage.",
        subSteps: [
          "The Squeeze Test: Pick up a handful of soil and squeeze gently. Open your hand.",
          "Check if Dry: Falls apart immediately (Needs irrigation).",
          "Check if Moist: Holds loose shape but crumbles (Ideal).",
          "Check if Wet: Drips water, sticky blob (Poor drainage).",
        ],
        image: "/images/quests/soil_scout/step4.png",
      },
      {
        title: "Step 4 — Sensory Check (Color & Smell)",
        objective: "Assess organic health and aeration.",
        subSteps: [
          "Smell Test: Earthy/Fresh (Good) vs Sour/Rotten (Bad/Anaerobic).",
          "Color Code: Dark Brown/Black (Rich Organic Matter).",
          "Color Code: Red/Yellow (High Iron).",
          "Color Code: Gray/Blue-ish (Waterlogged).",
          "Color Code: Pale/White (Leached/Salty).",
        ],
        image: "/images/quests/soil_scout/step5.png",
      },
      {
        title: "Conclusion & Learning Summary",
        objective: "Mission Complete! Compile your notes.",
        subSteps: [
          "Determine Texture (e.g., Sandy Loam)",
          "Determine Moisture (e.g., Well-drained)",
          "Determine Health (e.g., Dark & Earthy)",
          "Review: Texture dictates strategy.",
          "Review: Color indicates diet.",
          "Review: Smell reveals breath.",
        ],
        image: null,
      },
    ],
  },

  crop_quest: {
    id: "crop_quest",
    title: "Crops that Fits",
    description: "Discover the best sustainable crops for your region.",
    activities: [
      "Browse recommended crops",
      "Choose 3 crops suited to your climate",
      "Check water and season needs",
    ],
    outcomes: [
      "Identify suitable crops",
      "Understand seasonal planting",
      "Learn water requirements",
    ],
    difficulty: "Beginner",
    cropType: "General",
    xpReward: 60,
    badgeName: "Crop Explorer",
  },

  compost_kickoff: {
    id: "compost_kickoff",
    title: "Soil Booster",
    description: "Turn organic waste into nutrient-rich compost.",
    activities: [
      "Choose compost spot",
      "Add kitchen waste",
      "Mix with dry leaves",
      "Maintain moisture",
    ],
    outcomes: [
      "Start composting",
      "Reduce household waste",
      "Produce organic fertilizer",
    ],
    difficulty: "Beginner",
    cropType: "General",
    xpReward: 45,
    badgeName: "Compost Master",
  },

  zero_waste: {
    id: "zero_waste",
    title: "Zero Waste Warrior",
    description: "Learn to segregate waste for eco-friendly farming.",
    activities: [
      "Separate organic and non-organic waste",
      "Collect dry leaves for mulch",
      "Prepare a mini waste station at home",
    ],
    outcomes: [
      "Adopt zero-waste habits",
      "Reduce farm waste",
      "Improve sustainability",
    ],
    difficulty: "Beginner",
    cropType: "General",
    xpReward: 40,
    badgeName: "Zero Waste Warrior",
  },

  mini_garden: {
    id: "mini_garden",
    title: "Miniplot Mastery",
    description: "Create your first small garden with 5 easy plants.",
    activities: [
      "Select 5 beginner-friendly plants",
      "Prepare soil patch",
      "Plant seeds/saplings",
      "Water and mulch",
    ],
    outcomes: [
      "Start home gardening",
      "Understand plant basics",
      "Build confidence in growing crops",
    ],
    difficulty: "Beginner",
    cropType: "General",
    xpReward: 55,
    badgeName: "Garden Starter",
  },

  mulch_master: {
    id: "mulch_master",
    title: "Soil Shield",
    description: "Protect your soil using natural mulch.",
    activities: [
      "Collect dry leaves/straw",
      "Spread mulch around plants",
      "Water lightly to settle mulch",
    ],
    outcomes: [
      "Reduce soil temperature",
      "Improve moisture retention",
      "Suppress weeds naturally",
    ],
    difficulty: "Beginner",
    cropType: "General",
    xpReward: 50,
    badgeName: "Mulch Master",
  },

  boll_keeper: {
    id: "boll_keeper",
    title: "Boll Keeper Mastery Challenge",
    description: "Improve cotton boll retention with simple interventions.",
    activities: [
      "Check for early boll shedding",
      "Apply balanced nutrient spray",
      "Remove pest-damaged bolls",
    ],
    outcomes: [
      "Increase boll retention",
      "Improve cotton yield",
      "Reduce early shedding",
    ],
    difficulty: "Pro",
    cropType: "Cotton",
    xpReward: 85,
    badgeName: "Boll Keeper",
  },

  coconut_basin: {
    id: "coconut_basin",
    title: "Build the Life Ring",
    description: "Create water-saving basins around coconut trees.",
    activities: [
      "Mark 1–1.5m radius",
      "Dig shallow circular basin",
      "Level inner part",
      "Fill with mulch",
      "Water gently",
    ],
    outcomes: [
      "Save 20–30% irrigation water",
      "Improve coconut root health",
      "Increase moisture retention",
    ],
    difficulty: "Pro",
    cropType: "Coconut",
    xpReward: 85,
    badgeName: "Basin Builder",
  },

  coconut_bioenzyme: {
    id: "coconut_bioenzyme",
    title: "Coconut Water Bio-Elixir",
    description: "Create a natural bio-enzyme using coconut water.",
    activities: [
      "Collect coconut water",
      "Mix with jaggery",
      "Ferment for 7 days",
      "Dilute and apply",
    ],
    outcomes: [
      "Boost soil microbes",
      "Enhance plant growth",
      "Improve soil health",
    ],
    difficulty: "Pro",
    cropType: "Coconut",
    xpReward: 35,
    badgeName: "Bio-Elixir Maker",
  },

  rust_shield: {
    id: "rust_shield",
    title: "Rust Shield Challenge",
    description: "Protect wheat from rust disease using safe practices.",
    activities: [
      "Identify rust symptoms",
      "Remove infected leaves",
      "Improve spacing & airflow",
      "Apply organic fungicidal spray",
    ],
    outcomes: [
      "Reduce rust infection",
      "Improve wheat health",
      "Increase yield",
    ],
    difficulty: "Pro",
    cropType: "Wheat",
    xpReward: 90,
    badgeName: "Rust Shield",
  },

  biodiversity_strip: {
    id: "biodiversity_strip",
    title: "Biodiversity Bloom Bar",
    description:
      "Build a strip of flowering plants to attract beneficial insects.",
    activities: [
      "Select 5 pollinator plants",
      "Prepare 1m strip",
      "Plant in clusters",
      "Mulch and water",
    ],
    outcomes: [
      "Increase beneficial insect presence",
      "Improve farm biodiversity",
      "Support natural pest control",
    ],
    difficulty: "Pro",
    cropType: "General",
    xpReward: 45,
    badgeName: "Biodiversity Hero",
  },

  rainwater_hero: {
    id: "rainwater_hero",
    title: "Rainwater Hero",
    description: "Set up a simple rainwater collection system.",
    activities: [
      "Place barrel under roof edge",
      "Attach filter mesh",
      "Install outlet tap",
      "Use water for plants",
    ],
    outcomes: [
      "Reduce water usage",
      "Increase self-sufficiency",
      "Improve sustainability",
    ],
    difficulty: "Pro",
    cropType: "General",
    xpReward: 80,
    badgeName: "Water Saver",
  },

  biochar_maker: {
    id: "biochar_maker",
    title: "Biochar Mastery Challenge",
    description: "Create biochar using farm waste to enrich soil.",
    activities: [
      "Collect woody waste",
      "Burn in low-oxygen pit",
      "Crush cooled charcoal",
      "Mix with compost",
    ],
    outcomes: [
      "Improve soil fertility",
      "Increase carbon storage",
      "Boost microbial activity",
    ],
    difficulty: "Pro",
    cropType: "General",
    xpReward: 100,
    badgeName: "Biochar Master",
  },

  jeevamrutham: {
    id: "jeevamrutham",
    title: "Panchakavya",
    description:
      "Create a batch of panchakavya, a potent traditional microbial culture that acts as an immunity booster for your garden.",
    activities: [
      "Mix cow dung & urine",
      "Add jaggery + flour",
      "Ferment for 5–7 days",
      "Apply near root zone",
    ],
    outcomes: [
      "Boost soil microbial life",
      "Enhance nutrient availability",
      "Increase crop health",
    ],
    difficulty: "Pro",
    cropType: "General",
    xpReward: 60,
    badgeName: "Microbe Booster",
    steps: [
      {
        title: "Prep & Inventory",
        objective:
          "Before you brew, gather your alchemical ingredients. Note: This recipe is scaled for a standard 'Home Garden Bucket' (approx. 20 Liters).",
        subSteps: [
          "1 Plastic Bucket (20L capacity) – Do not use metal",
          "A wooden stick (for stirring)",
          "Breathable cloth (cotton or jute) & string/rope",
          "1 kg Fresh Cow Dung (Indigenous cow dung is best, but any fresh dung works)",
          "1 Liter Cow Urine (Aged is fine)",
          "250g Jaggery (Black/chemical-free is best) OR fruit pulp",
          "250g Pulse Flour (Besan/Gram flour or any dicot flour)",
          "Handful of Soil (Undisturbed soil from a forest or healthy farm bund)",
        ],
        tip: "Time Required: 20 Minutes (Active) + 5 Days (Passive Fermentation). Goal: Brew a living culture that converts soil nutrients into a form plants can eat.",
        image: "/images/quests/jeevamrutham/step1.jpg",
      },
      {
        title: "Step 1 — The Base (The Culture)",
        objective: "Create the liquid medium for the microbes.",
        subSteps: [
          "Water: Fill your 20L bucket with about 15–17 Liters of water (leave space at the top for foam)",
          "The Source: Add the 1 kg of Cow Dung and 1 Liter of Cow Urine to the water",
          "Mix: Use your wooden stick and mix thoroughly until the dung is dissolved and no large lumps remain",
        ],
        reason:
          "Why? Cow dung is the primary source of the beneficial bacteria/fungi. Cow urine is anti-fungal and acts as an electrolyte.",
        image: "/images/quests/jeevamrutham/step2.jpg",
      },
      {
        title: "Step 2 — The Fuel (The Food)",
        objective: "Feed the microbes so they multiply rapidly.",
        subSteps: [
          "Add Energy: Dissolve the 250g Jaggery in the bucket (This is sugar/carbohydrate energy for the microbes)",
          "Add Protein: Sprinkle in the 250g Pulse Flour (This provides protein for the microbes to build their bodies)",
          "The Inoculant: Toss in the Handful of Soil (This introduces native microbes that are already adapted to your local climate)",
          "Stir: Mix vigorously",
        ],
        image: "/images/quests/jeevamrutham/step3.jpg",
      },
      {
        title: "Step 3 — The Fermentation (The Magic)",
        objective: "Let the culture brew.",
        subSteps: [
          "Cover: Tie the breathable cloth over the top of the bucket (This keeps flies out but lets air/oxygen in)",
          "Place: Store the bucket in the shade (Direct sunlight/UV rays will kill the microbes)",
          "The Ritual: Stir the mixture clockwise for 1 minute, twice a day (Morning and Evening)",
          "Wait: Let it ferment for 5 to 7 days",
        ],
        tip: "The Clockwise Stir: Stirring creates a vortex that oxygenates the pile, helping aerobic bacteria thrive.",
        image: "/images/quests/jeevamrutham/step4.jpg",
      },
      {
        title: "Step 4 — Application (The Boost)",
        objective:
          "Feed your soil. Status Check: After 5–7 days, the mixture should smell fermented (slightly sour, like yeast/alcohol) and have bubbles on top. It is ready!",
        subSteps: [
          "Dilute: Important! Do not use it pure. Dilute this bucket with water at a 1:10 ratio (1 mug of Jeevamrutham to 10 mugs of water)",
          "Apply: Pour the diluted liquid on moist soil near the root zone of your plants",
          "Mulch: For best results, cover the wet soil with dry leaves (mulch) immediately after applying",
          "Note: Use the batch within 7 days of fermentation finishing",
        ],
        image: "/images/quests/jeevamrutham/step5.jpg",
      },
      {
        title: "Conclusion & Learning Summary",
        objective:
          "Mission Complete! You have successfully created a microbial inoculum.",
        subSteps: [
          "It's not a fertilizer: Jeevamrutham is not primarily about N-P-K (Nitrogen/Phosphorus/Potassium). It is a culture.",
          "Microbes do the work: You introduced millions of microbes into the soil. These microbes eat the biomass (mulch/compost) in your garden and unlock the nutrients for the plants.",
          "The Symbiosis: The Jaggery was the starter energy; the Flour was the building block; the Dung was the source.",
          "Shade is Key: You learned that UV light is the enemy of soil microbes, which is why we ferment in the shade and apply near roots.",
        ],
        image: null,
      },
    ],
  },
};

export const QUEST_DIFFICULTY_LEVELS = {
  BEGINNER: "Beginner",
  PRO: "Pro",
};
