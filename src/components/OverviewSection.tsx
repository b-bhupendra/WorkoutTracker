import { Activity, ShieldCheck, Timer } from 'lucide-react';
import type { ReactNode } from 'react';
import { planData } from '../data';

export function OverviewSection() {
  const { structure_description, rest_protocols } = planData;

  const renderProtocolParams = (title: string, value: string, icon: ReactNode) => (
    <div className="p-4 border border-white/10 bg-white/5 transition-colors">
      <div className="flex items-center gap-3 mb-2">
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">
          {title}
        </p>
      </div>
      <p className="font-mono text-sm uppercase font-bold">{value}</p>
      <div className="h-1 w-full bg-white/10 mt-4">
         <div className="h-full bg-[#CCFF00] w-1/3"></div>
      </div>
    </div>
  );

  return (
    <div className="mb-12 border border-white/20">
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-x-0 lg:divide-x divide-y lg:divide-y-0 divide-white/20">
        {/* Heavy Days Protocol */}
        <div className="p-8 flex flex-col">
          <div className="flex justify-between items-baseline mb-8">
            <h2 className="text-3xl font-black italic uppercase">Heavy Days</h2>
            <div className="bg-white/5 px-4 py-2 border-l-2 border-[#CCFF00]">
              <p className="text-[10px] uppercase opacity-50 mb-1">Focus</p>
              <p className="text-xs font-bold text-[#CCFF00]">Mechanical Tension</p>
            </div>
          </div>
          <p className="text-lg font-bold uppercase leading-snug tracking-tight mb-8">
            {structure_description.heavy_days}
          </p>
          <div className="mt-auto grid grid-cols-1 xl:grid-cols-3 gap-4">
            {renderProtocolParams("Exercises", rest_protocols.heavy_days.rest_between_exercises, <Timer className="w-4 h-4" />)}
            {renderProtocolParams("Sets", rest_protocols.heavy_days.rest_between_sets, <Timer className="w-4 h-4" />)}
            {renderProtocolParams("Reps", rest_protocols.heavy_days.rest_between_reps, <Activity className="w-4 h-4" />)}
          </div>
        </div>

        {/* Light Days Protocol */}
        <div className="p-8 flex flex-col">
          <div className="flex justify-between items-baseline mb-8">
            <h2 className="text-3xl font-black italic uppercase">Light Days</h2>
            <div className="bg-white/5 px-4 py-2 border-l-2 border-[#CCFF00]">
              <p className="text-[10px] uppercase opacity-50 mb-1">Focus</p>
              <p className="text-xs font-bold text-[#CCFF00]">Stretch & Pump</p>
            </div>
          </div>
          <p className="text-lg font-bold uppercase leading-snug tracking-tight mb-8">
            {structure_description.light_days}
          </p>
          <div className="mt-auto grid grid-cols-1 xl:grid-cols-3 gap-4">
            {renderProtocolParams("Exercises", rest_protocols.light_days.rest_between_exercises, <Timer className="w-4 h-4" />)}
            {renderProtocolParams("Sets", rest_protocols.light_days.rest_between_sets, <Timer className="w-4 h-4" />)}
            {renderProtocolParams("Reps", rest_protocols.light_days.rest_between_reps, <Activity className="w-4 h-4" />)}
          </div>
        </div>
      </div>

      <div className="border-t border-white/20 p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 bg-white/5">
        <div className="flex flex-col gap-2">
            <h3 className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Cardio Integration</h3>
            <p className="text-lg font-bold uppercase xl:max-w-3xl">{structure_description.cardio_integration}</p>
        </div>
        <div className="shrink-0 flex items-center gap-3 p-4 border border-white/20 rounded-sm">
           <ShieldCheck className="w-5 h-5 text-white/50" />
           <div>
             <p className="text-[9px] uppercase tracking-tighter opacity-50">Limits</p>
             <p className="text-xs font-bold text-[#CCFF00] uppercase mt-0.5">{structure_description.exercise_limit}</p>
           </div>
        </div>
      </div>
    </div>
  );
}
