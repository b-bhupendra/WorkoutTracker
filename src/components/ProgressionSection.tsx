import React, { useState, useMemo } from 'react';
import { Target, TrendingUp, Activity, Calculator, Dumbbell } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { planData } from '../data';
import { useWorkoutLog } from '../hooks/useWorkoutLog';

interface LiftStats {
  weight: number;
  reps: number;
}

const exerciseRatios: Record<string, { base: 'squat' | 'bench' | 'deadlift', ratio: number, isPerHand?: boolean }> = {
  "Deficit Dumbbell Bench Press": { base: 'bench', ratio: 0.75, isPerHand: true },
  "Strict Barbell Row": { base: 'bench', ratio: 0.75 }, 
  "Seated Dumbbell Shoulder Press": { base: 'bench', ratio: 0.5, isPerHand: true },
  "Lat Pulldown": { base: 'bench', ratio: 0.7 },
  "Cable Lateral Raises": { base: 'bench', ratio: 0.2, isPerHand: true },
  "Sumo Deadlifts": { base: 'deadlift', ratio: 0.78 },
  "Leg Press (Close, Low Stance)": { base: 'squat', ratio: 1.6 },
  "Lying Hamstring Curls": { base: 'squat', ratio: 0.3 },
  "Weighted Back Extensions": { base: 'deadlift', ratio: 0.4 },
  "Standing Calf Raises": { base: 'squat', ratio: 0.8 },
  "Incline Dumbbell Press": { base: 'bench', ratio: 0.6, isPerHand: true },
  "Seated Cable Row (Wide Grip)": { base: 'bench', ratio: 0.7 },
  "Incline Dumbbell Flyes": { base: 'bench', ratio: 0.4, isPerHand: true },
  "Single-Arm Lat Pulldown": { base: 'bench', ratio: 0.35, isPerHand: true },
  "Face Pulls": { base: 'bench', ratio: 0.25 },
  "Bulgarian Split Squats": { base: 'squat', ratio: 0.4, isPerHand: true },
  "Reverse Lunges (Dumbbells at sides)": { base: 'squat', ratio: 0.4, isPerHand: true },
  "Dumbbell RDLs": { base: 'deadlift', ratio: 0.5, isPerHand: true },
  "Leg Extensions": { base: 'squat', ratio: 0.4 },
  "Seated Calf Raises": { base: 'squat', ratio: 0.6 },
  "Strict Barbell Bicep Curls": { base: 'bench', ratio: 0.35 },
  "Overhead Cable Tricep Extensions": { base: 'bench', ratio: 0.4 },
  "Dumbbell Hammer Curls": { base: 'bench', ratio: 0.3, isPerHand: true },
  "Tricep Rope Pushdowns": { base: 'bench', ratio: 0.4 },
  "Dumbbell Lateral Raises": { base: 'bench', ratio: 0.2, isPerHand: true },
  "Farmer's Carries": { base: 'deadlift', ratio: 0.4, isPerHand: true },
  "Goblet Squats": { base: 'squat', ratio: 0.3 },
  "Kettlebell Swings": { base: 'deadlift', ratio: 0.3 },
  "Dumbbell Push Press": { base: 'bench', ratio: 0.5, isPerHand: true },
  "Medicine Ball Slams": { base: 'bench', ratio: 0.2 },
  "Plyo Push-ups": { base: 'bench', ratio: 0.4 },
};

export function ProgressionSection() {
  const [squat, setSquat] = useState<LiftStats>({ weight: 124, reps: 3 });
  const [bench, setBench] = useState<LiftStats>({ weight: 80, reps: 1 });
  const [deadlift, setDeadlift] = useState<LiftStats>({ weight: 140, reps: 1 });
  
  const { history } = useWorkoutLog();

  // Calculate 1RM using Epley formula: 1RM = W * (1 + R/30)
  const calc1RM = (stats: LiftStats) => {
    if (stats.reps === 1) return stats.weight;
    return stats.weight * (1 + stats.reps / 30);
  };

  const squat1RM = calc1RM(squat);
  const bench1RM = calc1RM(bench);
  const deadlift1RM = calc1RM(deadlift);

  // Growth assumptions per month based on a high-volume hypertrophy program (not pure peaking)
  // Intermediate lifter gains: Bench ~1.5kg/mo, Squat/DL ~3kg/mo
  const projectionData = useMemo(() => {
    const data = [];
    let currentSquat = squat1RM;
    let currentBench = bench1RM;
    let currentDeadlift = deadlift1RM;

    for (let i = 0; i <= 6; i++) {
      data.push({
        month: i === 0 ? 'Current' : `Month ${i}`,
        Squat: Math.round(currentSquat),
        Bench: Math.round(currentBench),
        Deadlift: Math.round(currentDeadlift),
      });

      currentSquat += 3.5;
      currentBench += 1.5;
      currentDeadlift += 4.0;
    }
    return data;
  }, [squat1RM, bench1RM, deadlift1RM]);

  // Generate dynamic weights for every exercise based on Dr. Mike Israetel's fatigue principles
  // ~10-15% drop-off in systemic output per major exercise in a session
  const fatigueDropoff = 0.88; 

  const dynamicRoutineWeights = useMemo(() => {
    const dates = Object.keys(history).sort((a, b) => b.localeCompare(a));
    
    return planData.schedule.filter(day => day.exercises && day.exercises.length > 0).map(day => {
      const dayExercises = day.exercises.map((ex, index) => {
        const ratioData = exerciseRatios[ex.name];
        let base1RM = 0;
        if (ratioData?.base === 'squat') base1RM = squat1RM;
        if (ratioData?.base === 'bench') base1RM = bench1RM;
        if (ratioData?.base === 'deadlift') base1RM = deadlift1RM;

        // Fresh capacity estimate
        let freshWeight = base1RM * (ratioData?.ratio || 0.4);
        if (ratioData?.isPerHand) freshWeight /= 2;

        // Fatigue capacity estimate
        const fatigueMultiplier = Math.pow(fatigueDropoff, index);
        const fatigueWeight = freshWeight * fatigueMultiplier;

        // Next Weight based on Logged Data
        let loggedNextWeight = null;
        let lastLoggedWeight = null;
        let hitTopRange = false;
        
        for (const date of dates) {
          const log = history[date]?.exercises[ex.name];
          if (log) {
            lastLoggedWeight = log.weight;
            
            // Analyze reps
            const targetMatch = ex.reps.match(/(\d+)\s*-\s*(\d+)/);
            if (targetMatch) {
              const maxTarget = parseInt(targetMatch[2]);
              const validReps = log.reps.filter(r => r > 0);
              hitTopRange = validReps.length === log.reps.length && log.reps.every(r => r >= maxTarget);
            } else if (ex.reps.includes("sec")) {
              const maxTarget = parseInt(ex.reps);
              const validReps = log.reps.filter(r => r > 0);
              hitTopRange = validReps.length === log.reps.length && log.reps.every(r => r >= maxTarget);
            } else {
              const maxTarget = parseInt(ex.reps);
              if (!isNaN(maxTarget)) {
                const validReps = log.reps.filter(r => r > 0);
                hitTopRange = validReps.length === log.reps.length && log.reps.every(r => r >= maxTarget);
              }
            }
            
            // Suggest next weight based on log
            if (hitTopRange) {
              loggedNextWeight = log.weight + (ratioData?.isPerHand ? 2 : 5);
            } else {
              loggedNextWeight = log.weight;
            }
            break;
          }
        }

        return {
          name: ex.name,
          fresh: Math.round(freshWeight),
          fatigued: Math.round(fatigueWeight),
          loggedNext: loggedNextWeight ? Math.round(loggedNextWeight) : null,
          lastLogged: lastLoggedWeight,
          isPerHand: ratioData?.isPerHand
        };
      });

      return {
        day: day.day,
        type: day.type,
        exercises: dayExercises
      };
    });
  }, [squat1RM, bench1RM, deadlift1RM, history]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="border border-white/20 p-6 md:p-8 bg-zinc-900/50">
        <h3 className="text-[#CCFF00] font-black uppercase text-2xl tracking-tighter mb-4 flex items-center gap-3">
          <Calculator className="w-6 h-6" />
          Strength Projections & Initial Weights
        </h3>
        <p className="font-mono text-zinc-300 text-sm leading-relaxed mb-6">
          This 6-Day Alternating Split is highly optimized for hypertrophy. 
          Enter your 1 Rep Max (or an estimated max via reps) to calculate baseline capacities.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { name: 'Squat', state: squat, set: setSquat, e1RM: squat1RM },
            { name: 'Bench Press', state: bench, set: setBench, e1RM: bench1RM },
            { name: 'Deadlift', state: deadlift, set: setDeadlift, e1RM: deadlift1RM },
          ].map((item) => (
            <div key={item.name} className="border border-white/20 p-4 bg-black">
              <h4 className="font-bold text-white uppercase tracking-widest text-sm mb-4 border-b border-white/10 pb-2">{item.name} Reference</h4>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-[10px] text-zinc-500 font-mono uppercase mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={item.state.weight || ''}
                    onChange={(e) => item.set({ ...item.state, weight: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-zinc-900 border border-white/10 text-white font-mono p-2 outline-none focus:border-[#CCFF00]"
                  />
                </div>
                <div className="w-20">
                  <label className="block text-[10px] text-zinc-500 font-mono uppercase mb-1">Reps</label>
                  <input
                    type="number"
                    value={item.state.reps || ''}
                    onChange={(e) => item.set({ ...item.state, reps: parseInt(e.target.value) || 0 })}
                    className="w-full bg-zinc-900 border border-white/10 text-white font-mono p-2 outline-none focus:border-[#CCFF00]"
                  />
                </div>
              </div>
              <div className="bg-[#CCFF00]/10 border border-[#CCFF00]/20 p-2 text-center">
                <span className="text-[10px] text-[#CCFF00] uppercase font-bold tracking-widest block mb-1">Estimated 1RM</span>
                <span className="text-xl font-black text-white">{Math.round(item.e1RM)} kg</span>
              </div>
            </div>
          ))}
        </div>

        <h4 className="font-bold text-white uppercase tracking-widest text-sm mb-4 flex items-center gap-2 mt-12">
          <Target className="w-4 h-4 text-[#CCFF00]" />
          Target Working Weights (Fatigue Adjusted)
        </h4>
        <p className="font-mono text-zinc-400 text-xs leading-relaxed mb-6">
          According to Dr. Mike Israetel's principles of systemic fatigue, muscular output drops roughly 10-15% for every major exercise performed previously in the session. If Leg Press is placed *after* Sumo Deadlifts, your output is not that of a fresh body. The calculated weights below adjust for this intra-session drop.
        </p>

        <div className="space-y-8 mb-10">
          {dynamicRoutineWeights.map((day) => (
            <div key={day.day} className="border border-white/10 bg-black">
              <div className="bg-zinc-900/50 p-3 border-b border-white/10 flex items-center gap-3">
                <span className="text-[#CCFF00] font-mono text-xs uppercase tracking-widest">Day {day.day}</span>
                <span className="text-white font-bold uppercase tracking-tight text-sm">{day.type}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/5 font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                      <th className="p-3">Exercise</th>
                      <th className="p-3 text-center">Fresh Capacity</th>
                      <th className="p-3 text-center bg-white/5 text-[#CCFF00]">Fatigue Adjusted</th>
                      <th className="p-3 text-right">Log Projected</th>
                    </tr>
                  </thead>
                  <tbody>
                    {day.exercises.map((ex, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-3 font-bold text-zinc-300">
                          {ex.name}
                          <div className="text-[10px] text-zinc-600 font-mono font-normal uppercase mt-1">Slot {i + 1}</div>
                        </td>
                        <td className="p-3 text-center font-mono text-zinc-500">
                          {ex.fresh} kg {ex.isPerHand ? '(ea)' : ''}
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-[#CCFF00] bg-white/[0.02]">
                          {ex.fatigued} kg {ex.isPerHand ? '(ea)' : ''}
                        </td>
                        <td className="p-3 text-right">
                          {ex.loggedNext ? (
                            <div className="inline-block bg-[#CCFF00]/10 text-[#CCFF00] px-2 py-1 font-mono font-bold text-xs">
                              {ex.loggedNext} kg {ex.loggedNext > (ex.lastLogged || 0) ? '↑' : '='}
                            </div>
                          ) : (
                            <span className="text-zinc-600 font-mono text-[10px] uppercase">No Data</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        <h4 className="font-bold text-white uppercase tracking-widest text-sm mb-4 flex items-center gap-2 mt-12">
          <TrendingUp className="w-4 h-4 text-[#CCFF00]" />
          6-Month 1RM Projection
        </h4>
        <div className="h-[300px] w-full border border-white/10 p-4 bg-black">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={projectionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis dataKey="month" stroke="#666" tick={{ fill: '#888', fontSize: 11 }} />
              <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }}
                labelStyle={{ fontWeight: 'bold', color: '#fff' }}
              />
              <Line type="monotone" dataKey="Deadlift" stroke="#CCFF00" strokeWidth={3} dot={{ r: 4, fill: '#000', stroke: '#CCFF00', strokeWidth: 2 }} />
              <Line type="monotone" dataKey="Squat" stroke="#ffffff" strokeWidth={3} dot={{ r: 4, fill: '#000', stroke: '#ffffff', strokeWidth: 2 }} />
              <Line type="monotone" dataKey="Bench" stroke="#ff4444" strokeWidth={3} dot={{ r: 4, fill: '#000', stroke: '#ff4444', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
