import { WorkoutPlan } from './types';

export const planData: WorkoutPlan = {
  workout_plan_name: "6-Day Alternating Full-Body Hypertrophy Split",
  structure_description: {
    overview: "A 6-day full-body split alternating between heavy (mechanical tension) and light (stretch & pump) days to maximize hypertrophy while managing central nervous system fatigue.",
    exercise_limit: "Strictly capped at 5 exercises per day to optimize volume and recovery.",
    heavy_days: "Focus on 6-8 reps with heavy weight and aggressive lifts to stimulate mechanical tension.",
    light_days: "Focus on 12-20 reps with lighter weight, focusing on a deep muscle stretch and metabolic stress (the pump).",
    cardio_integration: "Includes a 1 km light jog daily. On Heavy days, the jog is performed AFTER lifting to clear lactic acid. On Light days, the jog is performed BEFORE lifting as a dynamic warm-up."
  },
  rest_protocols: {
    heavy_days: {
      rest_between_exercises: "180 - 240 seconds (3 - 4 minutes) to allow full CNS recovery before switching muscle groups.",
      rest_between_sets: "120 - 180 seconds (2 - 3 minutes) to ensure maximum power output for the next heavy set.",
      rest_between_reps: "1 - 2 seconds between reps to fully reset, brace your core, and ensure perfect form (no bouncing)."
    },
    light_days: {
      rest_between_exercises: "90 - 120 seconds (1.5 - 2 minutes) to keep the heart rate elevated while transitioning.",
      rest_between_sets: "60 - 90 seconds to maximize metabolic stress and blood pooling (the pump).",
      rest_between_reps: "0 seconds (continuous tension) but with a mandatory 1-2 second pause at the deepest stretch of the movement."
    }
  },
  schedule: [
    {
      day: 1,
      type: "Heavy Full Body A",
      cardio: "1 km jog AFTER lifting",
      rest_between_exercises: "180 - 240 seconds",
      rest_between_sets: "120 - 180 seconds",
      rest_between_reps: "1-2 second reset",
      exercises: [
        {
          name: "Hack Squat or Leg Press",
          sets: 4,
          reps: "6 - 8",
          focus: "Heavy quad and glute loading"
        },
        {
          name: "Flat Dumbbell Bench Press",
          sets: 4,
          reps: "6 - 8",
          focus: "Raw horizontal pushing power"
        },
        {
          name: "Barbell Row or Heavy Cable Row",
          sets: 3,
          reps: "6 - 8",
          focus: "Back thickness and horizontal pull"
        },
        {
          name: "Lying Leg Curls",
          sets: 3,
          reps: "8 - 10",
          focus: "Heavy hamstring isolation"
        },
        {
          name: "Heavy Barbell Bicep Curls",
          sets: 3,
          reps: "6 - 8",
          focus: "Arm hypertrophy"
        }
      ]
    },
    {
      day: 2,
      type: "Light Full Body A (Stretch & Pump)",
      cardio: "1 km jog BEFORE lifting",
      rest_between_exercises: "90 - 120 seconds",
      rest_between_sets: "60 - 90 seconds",
      rest_between_reps: "Continuous with 1-2s pause at bottom stretch",
      exercises: [
        {
          name: "Dumbbell Romanian Deadlifts (RDLs)",
          sets: 4,
          reps: "12 - 15",
          focus: "Slow negative to stretch the hamstrings"
        },
        {
          name: "Incline Dumbbell Flyes",
          sets: 4,
          reps: "12 - 15",
          focus: "Deep stretch at the bottom for the chest"
        },
        {
          name: "Single-Arm Lat Pulldown",
          sets: 3,
          reps: "12 - 15",
          focus: "Let the cable stretch your lat fully at the top"
        },
        {
          name: "Seated Leg Curls",
          sets: 3,
          reps: "15 - 20",
          focus: "High rep hamstring pump"
        },
        {
          name: "Cable Lateral Raises",
          sets: 3,
          reps: "15 - 20",
          focus: "Constant tension for side delts"
        }
      ]
    },
    {
      day: 3,
      type: "Heavy Full Body B",
      cardio: "1 km jog AFTER lifting",
      rest_between_exercises: "180 - 240 seconds",
      rest_between_sets: "120 - 180 seconds",
      rest_between_reps: "1-2 second reset",
      exercises: [
        {
          name: "Sumo Deadlifts",
          sets: 4,
          reps: "5 - 8",
          focus: "Heavy posterior chain compound"
        },
        {
          name: "Incline Dumbbell Press",
          sets: 4,
          reps: "6 - 8",
          focus: "Upper chest and front delt power"
        },
        {
          name: "Heavy Lat Pulldown",
          sets: 3,
          reps: "6 - 8",
          focus: "Vertical pulling strength"
        },
        {
          name: "Leg Extensions",
          sets: 3,
          reps: "8 - 10",
          focus: "Heavy quad isolation"
        },
        {
          name: "Tricep Pushdowns (Heavy)",
          sets: 3,
          reps: "8 - 10",
          focus: "Tricep overload"
        }
      ]
    },
    {
      day: 4,
      type: "Light Full Body B (Stretch & Pump)",
      cardio: "1 km jog BEFORE lifting",
      rest_between_exercises: "90 - 120 seconds",
      rest_between_sets: "60 - 90 seconds",
      rest_between_reps: "Continuous with 1-2s pause at bottom stretch",
      exercises: [
        {
          name: "Goblet Squats (Heels Elevated)",
          sets: 3,
          reps: "12 - 15",
          focus: "Deep stretch for the quads"
        },
        {
          name: "Push-ups (Hands on blocks/plates)",
          sets: 3,
          reps: "To Failure",
          focus: "Maximum stretch at the bottom of the chest"
        },
        {
          name: "Wide-Grip Seated Cable Row",
          sets: 3,
          reps: "12 - 15",
          focus: "Stretch the shoulder blades forward on the negative"
        },
        {
          name: "Leg Extensions",
          sets: 3,
          reps: "15 - 20",
          focus: "High rep quad burn"
        },
        {
          name: "Incline Dumbbell Bicep Curls",
          sets: 3,
          reps: "12 - 15",
          focus: "Maximum stretch on the bicep"
        }
      ]
    },
    {
      day: 5,
      type: "Heavy Full Body C",
      cardio: "1 km jog AFTER lifting",
      rest_between_exercises: "180 - 240 seconds",
      rest_between_sets: "120 - 180 seconds",
      rest_between_reps: "1-2 second reset",
      exercises: [
        {
          name: "Bulgarian Split Squats",
          sets: 3,
          reps: "6 - 8",
          focus: "Heavy unilateral quad/glute work"
        },
        {
          name: "Seated Dumbbell Shoulder Press",
          sets: 3,
          reps: "6 - 8",
          focus: "Vertical push for shoulder mass"
        },
        {
          name: "Weighted Hyperextensions",
          sets: 3,
          reps: "8 - 10",
          focus: "Lower back and glute strength"
        },
        {
          name: "Seated Cable Row",
          sets: 3,
          reps: "8 - 10",
          focus: "Mid-back thickness"
        },
        {
          name: "Standing Calf Raises",
          sets: 3,
          reps: "8 - 10",
          focus: "Calf mass"
        }
      ]
    },
    {
      day: 6,
      type: "Light Full Body C (Stretch & Pump)",
      cardio: "1 km jog BEFORE lifting",
      rest_between_exercises: "90 - 120 seconds",
      rest_between_sets: "60 - 90 seconds",
      rest_between_reps: "Continuous with 1-2s pause at bottom stretch",
      exercises: [
        {
          name: "Walking Lunges",
          sets: 3,
          reps: "15 - 20",
          focus: "Dynamic stretch for the legs and glutes"
        },
        {
          name: "Cable Crossovers (Low to High)",
          sets: 3,
          reps: "15 - 20",
          focus: "Upper chest pump"
        },
        {
          name: "Face Pulls",
          sets: 3,
          reps: "15 - 20",
          focus: "Rear delt pump and posture health"
        },
        {
          name: "Bodyweight Hyperextensions",
          sets: 3,
          reps: "15 - 20",
          focus: "High rep pump for the lower back"
        },
        {
          name: "Overhead Tricep Extensions",
          sets: 3,
          reps: "12 - 15",
          focus: "Deep stretch on the long head of the tricep"
        }
      ]
    },
    {
      day: 7,
      type: "Active Recovery",
      cardio: "1 km light jog or walk outside with Simbha",
      rest_between_exercises: "N/A",
      rest_between_sets: "N/A",
      rest_between_reps: "N/A",
      exercises: []
    }
  ]
};
