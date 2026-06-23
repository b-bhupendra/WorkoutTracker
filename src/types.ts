export interface Exercise {
  name: string;
  sets?: number;
  reps?: string;
  focus?: string;
  videoUrl?: string;
  alternatives?: string[];
}

export interface DayPlan {
  day: number;
  type: string;
  cardio: string;
  rest_between_exercises: string;
  rest_between_sets: string;
  rest_between_reps: string;
  exercises: Exercise[];
}

export interface NutritionMeal {
  name: string;
  fuel: string;
  protein: string;
  goal: string;
}

export interface NutritionProtocol {
  overview: string;
  meals: NutritionMeal[];
  digestive_note: string;
}

export interface WorkoutPlan {
  workout_plan_name: string;
  structure_description: {
    overview: string;
    exercise_limit: string;
    heavy_days: string;
    light_days: string;
    cardio_integration: string;
  };
  rest_protocols: {
    heavy_days: {
      rest_between_exercises: string;
      rest_between_sets: string;
      rest_between_reps: string;
    };
    light_days: {
      rest_between_exercises: string;
      rest_between_sets: string;
      rest_between_reps: string;
    };
  };
  nutrition_protocol?: NutritionProtocol;
  schedule: DayPlan[];
}
