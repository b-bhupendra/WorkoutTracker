import { ExerciseLog } from '../hooks/useWorkoutLog';

export function parseReps(repsStr: string) {
  if (!repsStr || repsStr.toLowerCase() === 'to failure') return { min: 100, max: 100, isFailure: true };
  const match = repsStr.match(/(\d+)\s*-\s*(\d+)/);
  if (match) return { min: parseInt(match[1]), max: parseInt(match[2]), isFailure: false };
  const matchSingle = repsStr.match(/(\d+)/);
  if (matchSingle) return { min: parseInt(matchSingle[1]), max: parseInt(matchSingle[1]), isFailure: false };
  return { min: 0, max: 0, isFailure: false };
}

export function getSuggestion(targetRepsStr: string, latestLog: ExerciseLog | null) {
  if (!latestLog) return "No data yet. Find a weight that challenges you within the rep range.";
  
  const { min, max, isFailure } = parseReps(targetRepsStr);
  const validReps = latestLog.reps.filter(r => r > 0);
  
  if (validReps.length === 0) {
    return "Log your reps across all sets to get progression suggestions.";
  }
  
  if (isFailure) {
    return `Last session you hit [${validReps.join(', ')}] reps. Try to beat those numbers this time!`;
  }
  
  const allMax = validReps.length === latestLog.reps.length && latestLog.reps.every(r => r >= max);
  const allMin = validReps.every(r => r >= min);
  const anyUnder = validReps.some(r => r < min); 
  
  if (allMax) return `You hit the top of the range (${max} reps). INCREASE WEIGHT by 2.5-5kg today.`;
  if (anyUnder) return `You missed the bottom range (${min} reps). DECREASE WEIGHT slightly or prioritize better execution.`;
  if (allMin) return `In range. MAINTAIN WEIGHT and push to add 1-2 reps per set until you hit ${max} on all sets.`;
  
  return "Maintain weight and focus on progressive execution.";
}
