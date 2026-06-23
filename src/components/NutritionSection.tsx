import { planData } from '../data';
import { Flame, Droplets } from 'lucide-react';

export function NutritionSection() {
  const { nutrition_protocol } = planData;

  if (!nutrition_protocol) return null;

  return (
    <div className="space-y-12">
      <div className="border border-white/20 p-6 md:p-8 bg-zinc-900/50">
        <h3 className="text-[#CCFF00] font-black uppercase text-2xl tracking-tighter mb-4">
          The 5-Scoop Daily Distribution Protocol
        </h3>
        <p className="font-mono text-zinc-300 text-sm leading-relaxed mb-6">
          {nutrition_protocol.overview}
        </p>
        <div className="bg-white/5 border border-white/10 p-4 border-l-4 border-l-[#CCFF00]">
          <h4 className="font-bold text-xs uppercase tracking-widest text-[#CCFF00] mb-1 font-mono">Digestive Note</h4>
          <p className="text-sm text-zinc-400 leading-relaxed font-mono">
            {nutrition_protocol.digestive_note}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {nutrition_protocol.meals.map((meal, index) => (
          <div key={index} className="group border border-white/20 hover:border-[#CCFF00]/50 transition-colors p-4 sm:p-6 bg-black flex flex-col sm:flex-row gap-6">
            <div className="sm:w-1/4 sm:border-r border-white/10 sm:pr-6 flex flex-col justify-center">
              <div className="font-mono text-[10px] text-[#CCFF00] uppercase tracking-widest mb-1">
                Meal {String(index + 1).padStart(2, '0')}
              </div>
              <h4 className="font-black text-lg md:text-xl uppercase tracking-tight leading-none text-white group-hover:text-[#CCFF00] transition-colors">
                {meal.name}
              </h4>
            </div>
            
            <div className="sm:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
                    <Flame className="w-3 h-3 text-orange-500" /> Carb Fuel
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {meal.fuel}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
                    <Droplets className="w-3 h-3 text-blue-400" /> Protein Source
                  </div>
                  <p className="text-base font-bold text-white leading-relaxed">
                    {meal.protein}
                  </p>
                </div>
              </div>
              
              <div className="bg-zinc-900 border border-white/5 p-4 flex flex-col justify-center">
                <div className="font-mono text-[10px] text-[#CCFF00] uppercase tracking-widest mb-2 opacity-70">
                  Target Goal
                </div>
                <p className="text-xs text-zinc-400 uppercase tracking-wide leading-relaxed font-bold">
                  {meal.goal}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
