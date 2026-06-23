import React, { useState, useMemo } from 'react';
import { Target, TrendingUp, Activity, Calculator } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LiftStats {
  weight: number;
  reps: number;
}

export function ProgressionSection() {
  const [squat, setSquat] = useState<LiftStats>({ weight: 124, reps: 3 });
  const [bench, setBench] = useState<LiftStats>({ weight: 80, reps: 1 });
  const [deadlift, setDeadlift] = useState<LiftStats>({ weight: 140, reps: 1 });

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

      // Increment per month
      currentSquat += 3.5;
      currentBench += 1.5;
      currentDeadlift += 4.0;
    }
    return data;
  }, [squat1RM, bench1RM, deadlift1RM]);

  const recommendedWorkingWeights = [
    {
      lift: "Deficit Dumbbell Bench Press (Heavy)",
      calculation: `${Math.round((bench1RM * 0.75 * 0.85) / 2)} kg per hand`,
      rationale: "75% of your Barbell 1RM, reduced by ~15% for stability and deficit stretch, divided by 2."
    },
    {
      lift: "Sumo Deadlifts (Heavy)",
      calculation: `${Math.round(deadlift1RM * 0.78)} kg total`,
      rationale: "78% of your Deadlift 1RM is the ideal starting point for 5-8 raw repetitions."
    },
    {
      lift: "Leg Press (Substitute for Squat)",
      calculation: `${Math.round(squat1RM * 1.6)} kg minimum`,
      rationale: "Leg press translates to roughly 1.6x - 2.0x of your barbell squat. Start at 1.6x."
    },
    {
      lift: "Incline Dumbbell Press (Stretch/Pump)",
      calculation: `${Math.round((bench1RM * 0.60 * 0.85) / 2)} kg per hand`,
      rationale: "60% intensity for 10-15 rep range, adjusted for dumbbells and incline."
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="border border-white/20 p-6 md:p-8 bg-zinc-900/50">
        <h3 className="text-[#CCFF00] font-black uppercase text-2xl tracking-tighter mb-4 flex items-center gap-3">
          <Calculator className="w-6 h-6" />
          Strength Projections & Initial Weights
        </h3>
        <p className="font-mono text-zinc-300 text-sm leading-relaxed mb-6">
          This 6-Day Alternating Split is highly optimized for hypertrophy (muscle size) rather than peak neurological strength. 
          Expect morphological growth (bigger muscles) which translates to a steady, linear progression of about 1.5kg/month on Bench, and 3-4kg/month on Squat/Deadlift.
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

        <h4 className="font-bold text-white uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-[#CCFF00]" />
          Program Starting Weights
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {recommendedWorkingWeights.map((rec, i) => (
            <div key={i} className="border border-white/10 p-4 bg-zinc-900/50">
              <div className="text-[10px] font-mono text-[#CCFF00] uppercase tracking-widest mb-1">{rec.lift}</div>
              <div className="text-xl font-black text-white mb-2">{rec.calculation}</div>
              <p className="text-xs text-zinc-400 leading-relaxed font-mono">{rec.rationale}</p>
            </div>
          ))}
        </div>

        <h4 className="font-bold text-white uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
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
