import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { useAuth } from '../components/AuthProvider';
import { doc, getDoc, setDoc, onSnapshot, collection, writeBatch } from 'firebase/firestore';

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
  const { user } = useAuth();

  // Load from LocalStorage initially
  useEffect(() => {
    let initialLogs = {};
    let initialHistory = {};
    
    const savedLogs = localStorage.getItem('hypertrophy_logs');
    if (savedLogs) {
      try { initialLogs = JSON.parse(savedLogs); setLogs(initialLogs); } catch (e) {}
    }
    const savedHistory = localStorage.getItem('hypertrophy_history');
    if (savedHistory) {
      try { initialHistory = JSON.parse(savedHistory); setHistory(initialHistory); } catch (e) {}
    } else {
      const dummyHistory: HistoricalLogs = generateInitialMockData();
      setHistory(dummyHistory);
      localStorage.setItem('hypertrophy_history', JSON.stringify(dummyHistory));
    }
  }, []);

  // Firebase Synchronization
  useEffect(() => {
    if (!user) return;

    const userDocRef = doc(db, 'users', user.uid);
    
    getDoc(userDocRef).then((snap) => {
      if (!snap.exists()) {
        setDoc(userDocRef, { createdAt: new Date().toISOString() }, { merge: true });
        
        // Sync local storage to Firebase if it's a new Firebase user
        const batch = writeBatch(db);
        
        const localHistoryStr = localStorage.getItem('hypertrophy_history');
        if (localHistoryStr) {
          try {
            const localHist = JSON.parse(localHistoryStr);
            Object.entries(localHist).forEach(([dateStr, dayData]) => {
              const histRef = doc(collection(userDocRef, 'history'), dateStr);
              batch.set(histRef, dayData as any);
            });
          } catch(e) {}
        }

        const localLogsStr = localStorage.getItem('hypertrophy_logs');
        if (localLogsStr) {
          try {
            const localLogs = JSON.parse(localLogsStr);
            Object.entries(localLogs).forEach(([dayId, dayLogs]) => {
              const logRef = doc(collection(userDocRef, 'dailyLogs'), dayId.toString());
              batch.set(logRef, { exercises: dayLogs });
            });
          } catch(e) {}
        }
        batch.commit().catch(console.error);
      }
    });

    const unsubscribeHistory = onSnapshot(collection(userDocRef, 'history'), (snapshot) => {
      const newHistory: HistoricalLogs = {};
      snapshot.forEach(docSnap => {
        newHistory[docSnap.id] = docSnap.data() as DayHistoryData;
      });
      setHistory(prev => {
        const merged = { ...prev, ...newHistory };
        localStorage.setItem('hypertrophy_history', JSON.stringify(merged));
        return merged;
      });
    });

    const unsubscribeLogs = onSnapshot(collection(userDocRef, 'dailyLogs'), (snapshot) => {
      const newLogs: WorkoutLogs = {};
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (data.exercises) {
          newLogs[parseInt(docSnap.id)] = data.exercises;
        }
      });
      setLogs(prev => {
        const merged = { ...prev, ...newLogs };
        localStorage.setItem('hypertrophy_logs', JSON.stringify(merged));
        return merged;
      });
    });

    return () => {
      unsubscribeHistory();
      unsubscribeLogs();
    };
  }, [user]);

  const saveLog = async (day: number, exerciseName: string, weight: number, reps: number[]) => {
    setLogs((prev) => {
      const newLogs = { ...prev };
      if (!newLogs[day]) newLogs[day] = {};
      newLogs[day][exerciseName] = { weight, reps };
      localStorage.setItem('hypertrophy_logs', JSON.stringify(newLogs));
      return newLogs;
    });

    const todayStr = new Date().toISOString().split('T')[0];
    
    setHistory((prev) => {
      const newHistory = { ...prev };
      if (!newHistory[todayStr]) {
        newHistory[todayStr] = { day, exercises: {} };
      }
      newHistory[todayStr].exercises[exerciseName] = { weight, reps };
      localStorage.setItem('hypertrophy_history', JSON.stringify(newHistory));
      return newHistory;
    });

    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const batch = writeBatch(db);

      const logRef = doc(collection(userDocRef, 'dailyLogs'), day.toString());
      batch.set(logRef, { 
        exercises: { [exerciseName]: { weight, reps } }
      }, { merge: true });

      const histRef = doc(collection(userDocRef, 'history'), todayStr);
      batch.set(histRef, {
        day,
        exercises: { [exerciseName]: { weight, reps } }
      }, { merge: true });

      await batch.commit().catch(console.error);
    }
  };

  const getLatestLog = (day: number, exerciseName: string): ExerciseLog | null => {
    return logs[day]?.[exerciseName] || null;
  };

  const saveHistoricalLog = async (dateStr: string, day: number, exerciseName: string, weight: number, reps: number[]) => {
    setHistory((prev) => {
      const newHistory = { ...prev };
      if (!newHistory[dateStr]) {
        newHistory[dateStr] = { day, exercises: {} };
      }
      newHistory[dateStr].exercises[exerciseName] = { weight, reps };
      localStorage.setItem('hypertrophy_history', JSON.stringify(newHistory));
      return newHistory;
    });

    setLogs((prev) => {
      const newLogs = { ...prev };
      if (!newLogs[day]) newLogs[day] = {};
      newLogs[day][exerciseName] = { weight, reps };
      localStorage.setItem('hypertrophy_logs', JSON.stringify(newLogs));
      return newLogs;
    });

    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const batch = writeBatch(db);

      const histRef = doc(collection(userDocRef, 'history'), dateStr);
      batch.set(histRef, {
        day,
        exercises: { [exerciseName]: { weight, reps } }
      }, { merge: true });

      const logRef = doc(collection(userDocRef, 'dailyLogs'), day.toString());
      batch.set(logRef, { 
        exercises: { [exerciseName]: { weight, reps } }
      }, { merge: true });

      await batch.commit().catch(console.error);
    }
  };

  const deleteHistoricalLog = async (dateStr: string) => {
    setHistory((prev) => {
      const newHistory = { ...prev };
      delete newHistory[dateStr];
      localStorage.setItem('hypertrophy_history', JSON.stringify(newHistory));
      return newHistory;
    });

    if (user) {
      const histRef = doc(collection(doc(db, 'users', user.uid), 'history'), dateStr);
      const batch = writeBatch(db);
      batch.delete(histRef);
      await batch.commit().catch(console.error);
    }
  };

  const getLatestHistoricalLog = (exerciseName: string, beforeDateStr?: string): { weight: number, reps: number[], date: string } | null => {
    const dates = Object.keys(history).sort((a, b) => b.localeCompare(a));
    for (const d of dates) {
      if (beforeDateStr && d >= beforeDateStr) continue;
      const log = history[d]?.exercises[exerciseName];
      if (log && log.weight > 0 && log.reps.some(r => r > 0)) {
        return { ...log, date: d };
      }
    }
    return null;
  };

  const importHistory = async (imported: HistoricalLogs) => {
    setHistory(imported);
    localStorage.setItem('hypertrophy_history', JSON.stringify(imported));

    const newLogs: WorkoutLogs = {};
    const sortedDates = Object.keys(imported).sort((a, b) => a.localeCompare(b));
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

    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const batch = writeBatch(db);

      Object.entries(imported).forEach(([dateStr, dayData]) => {
        const histRef = doc(collection(userDocRef, 'history'), dateStr);
        batch.set(histRef, dayData);
      });

      Object.entries(newLogs).forEach(([dayId, dayLogs]) => {
        const logRef = doc(collection(userDocRef, 'dailyLogs'), dayId.toString());
        batch.set(logRef, { exercises: dayLogs });
      });

      await batch.commit().catch(console.error);
    }
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
