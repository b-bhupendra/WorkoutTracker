import { useState, useEffect } from 'react';

export interface ExerciseLog {
  weight: number;
  reps: number[];
}

export interface DayHistoryData {
  day: number;
  exercises: {
    [exerciseName: string]: ExerciseLog;
  };
}

export interface HistoricalLogs {
  [dateStr: string]: DayHistoryData;
}

export interface WorkoutLogs {
  [day: number]: {
    [exerciseName: string]: ExerciseLog;
  };
}

export function useWorkoutLog() {
  const [logs, setLogs] = useState<WorkoutLogs>({});
  const [history, setHistory] = useState<HistoricalLogs>({});

  // Load from LocalStorage
  useEffect(() => {
    const savedLogs = localStorage.getItem('hypertrophy_logs');
    if (savedLogs) {
      try { setLogs(JSON.parse(savedLogs)); } catch (e) {}
    }
    const savedHistory = localStorage.getItem('hypertrophy_history');
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch (e) {}
    } else {
      // Seed initial history with dummy historical data so the user sees beautiful chart bars and lines immediately!
      const dummyHistory: HistoricalLogs = generateInitialMockData();
      setHistory(dummyHistory);
      localStorage.setItem('hypertrophy_history', JSON.stringify(dummyHistory));
    }
  }, []);

  // Save legacy daily log
  const saveLog = (day: number, exerciseName: string, weight: number, reps: number[]) => {
    setLogs((prev) => {
      const newLogs = { ...prev };
      if (!newLogs[day]) newLogs[day] = {};
      newLogs[day][exerciseName] = { weight, reps };
      localStorage.setItem('hypertrophy_logs', JSON.stringify(newLogs));
      return newLogs;
    });

    // Also auto-log to "today" string in history
    const todayStr = new Date().toISOString().split('T')[0];
    saveHistoricalLog(todayStr, day, exerciseName, weight, reps);
  };

  const getLatestLog = (day: number, exerciseName: string): ExerciseLog | null => {
    return logs[day]?.[exerciseName] || null;
  };

  // Modern Historical Logging
  const saveHistoricalLog = (dateStr: string, day: number, exerciseName: string, weight: number, reps: number[]) => {
    setHistory((prev) => {
      const newHistory = { ...prev };
      if (!newHistory[dateStr]) {
        newHistory[dateStr] = {
          day,
          exercises: {}
        };
      }
      newHistory[dateStr].exercises[exerciseName] = { weight, reps };
      localStorage.setItem('hypertrophy_history', JSON.stringify(newHistory));
      return newHistory;
    });

    // Mirror to daily schedule view
    setLogs((prev) => {
      const newLogs = { ...prev };
      if (!newLogs[day]) newLogs[day] = {};
      newLogs[day][exerciseName] = { weight, reps };
      localStorage.setItem('hypertrophy_logs', JSON.stringify(newLogs));
      return newLogs;
    });
  };

  const deleteHistoricalLog = (dateStr: string) => {
    setHistory((prev) => {
      const newHistory = { ...prev };
      delete newHistory[dateStr];
      localStorage.setItem('hypertrophy_history', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  // Get most recent log in our entire logging timeline for progression advice
  const getLatestHistoricalLog = (exerciseName: string, beforeDateStr?: string): { weight: number, reps: number[], date: string } | null => {
    const dates = Object.keys(history).sort((a, b) => b.localeCompare(a)); // Latest first
    for (const d of dates) {
      if (beforeDateStr && d >= beforeDateStr) continue;
      const log = history[d]?.exercises[exerciseName];
      if (log && log.weight > 0 && log.reps.some(r => r > 0)) {
        return { ...log, date: d };
      }
    }
    return null;
  };

  // Bulk import (replaces history)
  const importHistory = (imported: HistoricalLogs) => {
    setHistory(imported);
    localStorage.setItem('hypertrophy_history', JSON.stringify(imported));

    // Rebuild the legacy schedule summary from the latest history points
    const newLogs: WorkoutLogs = {};
    const sortedDates = Object.keys(imported).sort((a, b) => a.localeCompare(b)); // oldest to newest
    for (const date of sortedDates) {
      const dayData = imported[date];
      if (!dayData) continue;
      const { day, exercises } = dayData;
      if (!newLogs[day]) newLogs[day] = {};
      for (const exName of Object.keys(exercises)) {
        newLogs[day][exName] = exercises[exName];
      }
    }
    setLogs(newLogs);
    localStorage.setItem('hypertrophy_logs', JSON.stringify(newLogs));
  };

  return { 
    logs, 
    history, 
    saveLog, 
    getLatestLog, 
    saveHistoricalLog, 
    deleteHistoricalLog, 
    getLatestHistoricalLog,
    importHistory 
  };
}

// Generates some professional historical markers trailing back 3 weeks
// so the charts render spectacular, realistic hypertrophy graphics on load
function generateInitialMockData(): HistoricalLogs {
  const dataset: HistoricalLogs = {};
  const today = new Date();

  // Helper to subtract days
  const subDays = (date: Date, days: number): string => {
    const d = new Date(date);
    d.setDate(d.getDate() - days);
    return d.toISOString().split('T')[0];
  };

  // Let's seed Weeks 1, 2, 3 progression for common exercises
  // We'll write to Day 1, 2, 3, etc.
  
  // Week 3 ago (Days 21-15 ago): Starting low weight
  dataset[subDays(today, 21)] = {
    day: 1,
    exercises: {
      "Hack Squat or Leg Press": { weight: 140, reps: [8, 8, 7, 6] },
      "Flat Dumbbell Bench Press": { weight: 32, reps: [8, 8, 8, 7] },
      "Barbell Row or Heavy Cable Row": { weight: 80, reps: [8, 8, 8] }
    }
  };
  dataset[subDays(today, 20)] = {
    day: 2,
    exercises: {
      "Dumbbell Romanian Deadlifts (RDLs)": { weight: 24, reps: [12, 12, 12, 11] },
      "Incline Dumbbell Flyes": { weight: 12, reps: [15, 15, 14, 12] }
    }
  };
  dataset[subDays(today, 19)] = {
    day: 3,
    exercises: {
      "Sumo Deadlifts": { weight: 120, reps: [8, 8, 6, 5] },
      "Incline Dumbbell Press": { weight: 28, reps: [8, 8, 8, 7] }
    }
  };
  
  // Week 2 ago (Days 14-8 ago): Overload begins
  dataset[subDays(today, 14)] = {
    day: 1,
    exercises: {
      "Hack Squat or Leg Press": { weight: 145, reps: [8, 8, 8, 8] }, // Maxed rep range!
      "Flat Dumbbell Bench Press": { weight: 34, reps: [8, 8, 8, 8] }, // Maxed rep range!
      "Barbell Row or Heavy Cable Row": { weight: 82.5, reps: [8, 8, 8] }
    }
  };
  dataset[subDays(today, 13)] = {
    day: 2,
    exercises: {
      "Dumbbell Romanian Deadlifts (RDLs)": { weight: 26, reps: [12, 12, 12, 12] },
      "Incline Dumbbell Flyes": { weight: 14, reps: [15, 15, 13, 12] }
    }
  };
  dataset[subDays(today, 12)] = {
    day: 3,
    exercises: {
      "Sumo Deadlifts": { weight: 125, reps: [8, 8, 8, 7] },
      "Incline Dumbbell Press": { weight: 30, reps: [8, 8, 8, 6] }
    }
  };

  // Week 1 ago (Days 7-1 ago): Elite numbers logged
  dataset[subDays(today, 7)] = {
    day: 1,
    exercises: {
      "Hack Squat or Leg Press": { weight: 150, reps: [8, 7, 7, 6] }, // Increased weight, reps dropped but progressive overload achieved!
      "Flat Dumbbell Bench Press": { weight: 36, reps: [7, 7, 6, 6] }, // Increased weight!
      "Barbell Row or Heavy Cable Row": { weight: 85, reps: [8, 8, 7] }
    }
  };
  dataset[subDays(today, 6)] = {
    day: 2,
    exercises: {
      "Dumbbell Romanian Deadlifts (RDLs)": { weight: 28, reps: [12, 12, 12, 10] },
      "Incline Dumbbell Flyes": { weight: 16, reps: [14, 13, 12, 12] }
    }
  };

  return dataset;
}
