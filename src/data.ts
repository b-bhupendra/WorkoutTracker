import { WorkoutPlan } from './types';

export const planData: WorkoutPlan = {
  workout_plan_name: "Phase 1: High Tension & Phase 2: Metabolite Protocol",
  structure_description: {
    overview: "A science-backed two-a-day split focusing on mitigating the Interference Effect. Cardio is performed in the morning (AMPK pathway) while lifting is reserved for later in the day, saving 100% of your central nervous system for destroying the weights (mTOR pathway).",
    exercise_limit: "Focused sessions prioritizing intensity and execution over excessive volume.",
    heavy_days: "High Tension (1-2 RIR). Heavy load, slow controlled eccentrics (2-3 seconds down), and explosive concentrics. 2-3 minutes of rest.",
    light_days: "Metabolite & Stretch (0-1 RIR). Lighter weight, pushing right to the edge of failure with 60-90 seconds of rest. Focus entirely on the deep muscle stretch.",
    cardio_integration: "Morning fasted or lightly fueled cardio to separate adaptation pathways from hypertrophic training."
  },
  rest_protocols: {
    heavy_days: {
      rest_between_exercises: "120 - 180 seconds to allow CNS recovery before the next intense movement.",
      rest_between_sets: "120 - 180 seconds (2-3 minutes) to ensure maximum power output for the next high-tension set.",
      rest_between_reps: "Controlled eccentric, explosive concentric. Pause where specified."
    },
    light_days: {
      rest_between_exercises: "90 - 120 seconds to transition while maintaining elevated heart rate.",
      rest_between_sets: "60 - 90 seconds to maximize metabolic stress and prioritize the 'pump'.",
      rest_between_reps: "Continuous tension, pushing close to failure, focusing on the stretch."
    }
  },
  nutrition_protocol: {
    overview: "By having a stash of your own oats and yeast isolate, you can completely bypass the worst of the mess breakfasts and guarantee clean, predictable fuel. This protocol seamlessly integrates Soy, Yeast, Oats, and Dahi to build a highly optimized bodybuilding diet.",
    digestive_note: "If the yeast isolate is unflavored, it can have a slightly savory, umami taste. It mixes incredibly well with water or savory foods, but might taste unusual if mixed directly into a sweet oat bowl.",
    meals: [
      {
        name: "Morning (Post-Cardio / Breakfast)",
        fuel: "50g of your Oats (prepared with hot water from your kettle).",
        protein: "1 Scoop of Soy Isolate mixed with water.",
        goal: "Skip the mess breakfast entirely. Oats provide slow-digesting complex carbs to replenish glycogen from the morning run. Soy isolate halts muscle breakdown instantly."
      },
      {
        name: "Mid-Day (Lunch at the Mess)",
        fuel: "Mess Lunch (2 Rotis, Dal, Sabzi, massive Salad).",
        protein: "1 Scoop of Yeast Isolate right after lunch.",
        goal: "Mess carbs provide sustained energy for the afternoon. Yeast isolate ensures blood amino acid levels stay elevated during the workday."
      },
      {
        name: "Pre-Workout (60-90 minutes before lifting)",
        fuel: "(Optional) 20-30g of raw Oats mixed in with the protein.",
        protein: "1 Scoop of Soy Isolate.",
        goal: "Grinding up oats into your shaker provides a perfect pre-workout glycogen boost if you feel flat. Protein ensures amino acids circulate to repair micro-tears as they happen."
      },
      {
        name: "Post-Workout (Dinner at the Mess)",
        fuel: "Mess Dinner (Rice, Roti, Dal).",
        protein: "1 Scoop of Yeast Isolate immediately after lifting.",
        goal: "Protein isolate absorbs rapidly. Mess carbs spike your insulin, shuttling that protein directly into exhausted muscle cells."
      },
      {
        name: "Pre-Bed (The Slow-Release Hack)",
        fuel: "1 Cup of Dahi.",
        protein: "1 Scoop of Soy Isolate mixed directly into the dahi.",
        goal: "Dahi contains natural, slow-digesting milk protein. Mixing soy directly creates a thick, slow-release protein matrix that feeds muscles overnight. Probiotics help break down heavy mess food."
      }
    ]
  },
  schedule: [
    {
      day: 1,
      type: "Upper Body (High Tension)",
      cardio: "Morning Cardio: 1 km run",
      rest_between_exercises: "120 - 180 seconds",
      rest_between_sets: "120 - 180 seconds",
      rest_between_reps: "2-3s negative, explosive positive",
      exercises: [
        {
          name: "Deficit Dumbbell Bench Press",
          sets: 4,
          reps: "6 - 8",
          focus: "Sink DBs past chest for massive stretch. 1s pause at bottom.",
          videoUrl: "https://www.youtube.com/embed/Y_7aWqnGZyc",
          alternatives: [
            "Flat Dumbbell Bench Press",
            "Barbell Bench Press (Braced)",
            "Weighted Chest Dips"
          ]
        },
        {
          name: "Strict Barbell Row",
          sets: 4,
          reps: "6 - 8",
          focus: "Torso parallel to floor. If torso rises >45°, it's too heavy.",
          videoUrl: "https://www.youtube.com/embed/6FZH1PN_bI0",
          alternatives: [
            "Pendlay Row",
            "Chest-Supported T-Bar Row",
            "Heavy Dumbbell Row"
          ]
        },
        {
          name: "Seated Dumbbell Shoulder Press",
          sets: 3,
          reps: "6 - 8",
          focus: "Full ROM. Bring DBs all the way down to touch shoulders.",
          videoUrl: "https://www.youtube.com/embed/qe6O7N-V2kY",
          alternatives: [
            "Seated Barbell Overhead Press",
            "Standing Overhead Press",
            "Smith Machine Overhead Press"
          ]
        },
        {
          name: "Lat Pulldown",
          sets: 3,
          reps: "6 - 8",
          focus: "Let weight pull shoulders to ears at top for max lat stretch.",
          videoUrl: "https://www.youtube.com/embed/EUIrYQYp200",
          alternatives: [
            "Weighted Pull-Ups",
            "Neutral Grip Lat Pulldown",
            "Single-Arm Cable Lat Pulls"
          ]
        },
        {
          name: "Cable Lateral Raises",
          sets: 3,
          reps: "10 - 12",
          focus: "Continuous tension. Keep chest proud.",
          videoUrl: "https://www.youtube.com/embed/pP71EWe-p_A",
          alternatives: [
            "Dumbbell Lateral Raise",
            "Machine Lateral Raise",
            "Egyptian Lateral Raise"
          ]
        }
      ]
    },
    {
      day: 2,
      type: "Lower Body (High Tension)",
      cardio: "Morning Cardio: 1 km run",
      rest_between_exercises: "120 - 180 seconds",
      rest_between_sets: "120 - 180 seconds",
      rest_between_reps: "2-3s negative, explosive positive",
      exercises: [
        {
          name: "Sumo Deadlifts",
          sets: 4,
          reps: "5 - 8",
          focus: "Reset completely on floor every rep. No bouncing.",
          videoUrl: "https://www.youtube.com/embed/W7ucl4f9sCY",
          alternatives: [
            "Conventional Deadlifts",
            "Trap Bar Deadlifts",
            "Deficit Deadlifts"
          ]
        },
        {
          name: "Leg Press (Close, Low Stance)",
          sets: 4,
          reps: "8 - 10",
          focus: "Feet low on sled to maximize knee flexion and blast quads.",
          videoUrl: "https://www.youtube.com/embed/yZ8_32UCR-g",
          alternatives: [
            "Hack Squat",
            "Heel-Elevated Goblet Squat",
            "Cyclist Squat"
          ]
        },
        {
          name: "Lying Hamstring Curls",
          sets: 3,
          reps: "8 - 10",
          focus: "Hips pinned to pad. 3-second controlled negative.",
          videoUrl: "https://www.youtube.com/embed/ELOCsoDSmHg",
          alternatives: [
            "Seated Leg Curls",
            "Nordic Hamstring Curls",
            "Dumbbell Hamstring Curls"
          ]
        },
        {
          name: "Weighted Back Extensions",
          sets: 3,
          reps: "8 - 10",
          focus: "Squeeze glutes & erectors. Do not hyperextend spine at top.",
          videoUrl: "https://www.youtube.com/embed/uorjA9DshkQ",
          alternatives: [
            "Barbell Good Mornings",
            "Glute-Ham Raises",
            "Reverse Hyperextensions"
          ]
        },
        {
          name: "Standing Calf Raises",
          sets: 3,
          reps: "8 - 10",
          focus: "Mandatory: Pause for 2 full seconds at absolute bottom stretch. No bouncing.",
          videoUrl: "https://www.youtube.com/embed/9Bv_3yG_Bq4",
          alternatives: [
            "Seated Calf Raises",
            "Leg Press Calf Raises",
            "Single-Leg Calf Raises"
          ]
        }
      ]
    },
    {
      day: 3,
      type: "Upper Body (Stretch & Pump)",
      cardio: "Morning Cardio: 1 km run",
      rest_between_exercises: "90 - 120 seconds",
      rest_between_sets: "60 - 90 seconds",
      rest_between_reps: "Continuous with 1-2s pause at bottom stretch",
      exercises: [
        {
          name: "Incline Dumbbell Press",
          sets: 4,
          reps: "10 - 15",
          focus: "30-degree incline. Deep stretch at the bottom.",
          videoUrl: "https://www.youtube.com/embed/8iP7aemgp_U",
          alternatives: [
            "Incline Cable Flyes",
            "Incline Barbell Press",
            "Machine Incline Press"
          ]
        },
        {
          name: "Seated Cable Row (Wide Grip)",
          sets: 3,
          reps: "12 - 15",
          focus: "Let weight pull shoulder blades forward (scapular protraction).",
          videoUrl: "https://www.youtube.com/embed/X9p_92Cj3oI",
          alternatives: [
            "Chest-Supported Machine Row",
            "T-Bar Row",
            "Meadows Row"
          ]
        },
        {
          name: "Incline Dumbbell Flyes",
          sets: 3,
          reps: "12 - 15",
          focus: "Bend elbows slightly, go deep, feel chest fibers stretch.",
          videoUrl: "https://www.youtube.com/embed/8coI01F0YvQ",
          alternatives: [
            "Pec Deck Machine",
            "Cable Crossovers",
            "Flat Dumbbell Flyes"
          ]
        },
        {
          name: "Single-Arm Lat Pulldown",
          sets: 3,
          reps: "12 - 15",
          focus: "Lean into working arm for brutal unilateral lat stretch.",
          videoUrl: "https://www.youtube.com/embed/L7G60-w8Iew",
          alternatives: [
            "Single-Arm Cable Row (High)",
            "Straight-Arm Pulldowns",
            "Underhand Lat Pulldowns"
          ]
        },
        {
          name: "Face Pulls",
          sets: 3,
          reps: "15 - 20",
          focus: "Pull to forehead, squeeze rear delts for a full second.",
          videoUrl: "https://www.youtube.com/embed/V81H7G9KPlU",
          alternatives: [
            "Rear Delt Machine Flyes",
            "Cable Rear Delt Rows",
            "Dumbbell Rear Delt Flyes"
          ]
        }
      ]
    },
    {
      day: 4,
      type: "Lower Body (Stretch & Pump)",
      cardio: "Morning Cardio: 1 km run",
      rest_between_exercises: "90 - 120 seconds",
      rest_between_sets: "60 - 90 seconds",
      rest_between_reps: "Continuous with 1-2s pause at bottom stretch",
      exercises: [
        {
          name: "Bulgarian Split Squats",
          sets: 3,
          reps: "10 - 15",
          focus: "Upright torso. Drop back knee as deep as humanly possible.",
          videoUrl: "https://www.youtube.com/embed/2C-uNgKwPLE",
          alternatives: [
            "Walking Lunges",
            "Deficit Reverse Lunges",
            "Single-Leg Leg Press"
          ]
        },
        {
          name: "Reverse Lunges (Dumbbells at sides)",
          sets: 3,
          reps: "12 - 15",
          focus: "Slight forward torso lean. Controlled, deliberate step backward.",
          videoUrl: "https://www.youtube.com/embed/D7KaRcUTQeY",
          alternatives: [
            "Dumbbell Step-Ups",
            "Static Lunges",
            "Pistol Squats (Assisted)"
          ]
        },
        {
          name: "Dumbbell RDLs",
          sets: 3,
          reps: "12 - 15",
          focus: "Push hips to wall behind. Soft knees, maximum hamstring stretch.",
          videoUrl: "https://www.youtube.com/embed/uNfGsc8mIqQ",
          alternatives: [
            "Barbell RDLs",
            "Cable Pull-Throughs",
            "Deficit RDLs"
          ]
        },
        {
          name: "Leg Extensions",
          sets: 3,
          reps: "15 - 20",
          focus: "Squeeze at top, control descent. Pure quad torture.",
          videoUrl: "https://www.youtube.com/embed/m06HmhZz8b4",
          alternatives: [
            "Sissy Squats",
            "Bodyweight Leg Extensions",
            "Cyclist Goblet Squats"
          ]
        },
        {
          name: "Seated Calf Raises",
          sets: 3,
          reps: "15 - 20",
          focus: "2-second pause at the bottom stretch.",
          videoUrl: "https://www.youtube.com/embed/9Bv_3yG_Bq4",
          alternatives: [
            "Standing Calf Raises",
            "Donkey Calf Raises",
            "Leg Press Calf Extensions"
          ]
        }
      ]
    },
    {
      day: 5,
      type: "Dedicated Arm Day",
      cardio: "Morning Cardio: 2 km run (Increased Volume)",
      rest_between_exercises: "90 - 120 seconds",
      rest_between_sets: "60 - 90 seconds",
      rest_between_reps: "Continuous tension",
      exercises: [
        {
          name: "Strict Barbell Bicep Curls",
          sets: 4,
          reps: "8 - 12",
          focus: "Back against wall if needed. Zero momentum.",
          videoUrl: "https://www.youtube.com/embed/XmGvS9_jN_8",
          alternatives: [
            "EZ-Bar Curls",
            "Dumbbell Alternating Curls",
            "Cable Bicep Curls"
          ]
        },
        {
          name: "Overhead Cable Tricep Extensions",
          sets: 4,
          reps: "10 - 15",
          focus: "Massive overhead stretch for the long head of the tricep.",
          videoUrl: "https://www.youtube.com/embed/fUjZle_Dcl4",
          alternatives: [
            "Dumbbell French Press",
            "EZ-Bar Skullcrushers",
            "Overhead Dumbbell Extensions"
          ]
        },
        {
          name: "Dumbbell Hammer Curls",
          sets: 3,
          reps: "10 - 15",
          focus: "Builds brachialis to push bicep up, thickening the arm.",
          videoUrl: "https://www.youtube.com/embed/zC3nLlEvin4",
          alternatives: [
            "Rope Cable Hammer Curls",
            "Pinwheel Curls",
            "Reverse Grip Barbell Curls"
          ]
        },
        {
          name: "Tricep Rope Pushdowns",
          sets: 3,
          reps: "12 - 15",
          focus: "Spread the rope aggressively at the bottom.",
          videoUrl: "https://www.youtube.com/embed/6Fzep104fTw",
          alternatives: [
            "Straight Bar Pushdowns",
            "V-Bar Pushdowns",
            "Single-Arm Cable Kickbacks"
          ]
        },
        {
          name: "Dumbbell Lateral Raises",
          sets: 3,
          reps: "15 - 20",
          focus: "High reps, deep burn for the lateral delts.",
          videoUrl: "https://www.youtube.com/embed/b11ZEDN-YEE",
          alternatives: [
            "Cable Lateral Raises",
            "Machine Lateral Raises",
            "Leaning Dumbbell Lateral Raises"
          ]
        }
      ]
    },
    {
      day: 6,
      type: "GPP (General Physical Preparedness)",
      cardio: "Morning Cardio: 1 km run",
      rest_between_exercises: "60 seconds",
      rest_between_sets: "60 seconds",
      rest_between_reps: "Continuous",
      exercises: [
        {
          name: "Farmer's Carries",
          sets: 4,
          reps: "45 sec",
          focus: "Heavy DBs. Chest up, core braced, walk with purpose.",
          videoUrl: "https://www.youtube.com/embed/FkVkZbcHqlE",
          alternatives: [
            "Suitcase Carries",
            "Trap Bar Carries",
            "Overhead Sandbag Carries"
          ]
        },
        {
          name: "Goblet Squats",
          sets: 4,
          reps: "20",
          focus: "Constant tension. Don't lock out knees at top.",
          videoUrl: "https://www.youtube.com/embed/MeIiYIF7isY",
          alternatives: [
            "Kettlebell Front Squats",
            "Bodyweight Squats",
            "Wall Sits (Max Time)"
          ]
        },
        {
          name: "Kettlebell Swings",
          sets: 4,
          reps: "20",
          focus: "All hip hinge power, zero arm pulling.",
          videoUrl: "https://www.youtube.com/embed/YSxHifyI6s8",
          alternatives: [
            "Dumbbell Swings",
            "Broad Jumps",
            "Cable Pull-Throughs"
          ]
        },
        {
          name: "Dumbbell Push Press",
          sets: 4,
          reps: "15",
          focus: "Dip knees and explosively drive weight overhead.",
          videoUrl: "https://www.youtube.com/embed/iaBVSJm7Eeo",
          alternatives: [
            "Barbell Push Press",
            "Kettlebell Thrusters",
            "Landmine Presses"
          ]
        },
        {
          name: "Medicine Ball Slams",
          sets: 4,
          reps: "15",
          focus: "Slam through the floor. Max core & lat engagement.",
          videoUrl: "https://www.youtube.com/embed/Rx_UHMnQljU",
          alternatives: [
            "Battle Ropes",
            "Sledgehammer Tire Strikes",
            "Plyo Pushups"
          ]
        }
      ]
    },
    {
      day: 7,
      type: "Complete Systemic Recovery",
      cardio: "Morning Cardio: 1 km light jog or brisk walk",
      rest_between_exercises: "N/A",
      rest_between_sets: "N/A",
      rest_between_reps: "N/A",
      exercises: []
    }
  ]
};
