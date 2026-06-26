import { useState } from 'react';
import { planData } from './data';
import { OverviewSection } from './components/OverviewSection';
import { ScheduleSection } from './components/ScheduleSection';
import { CalendarSection } from './components/CalendarSection';
import { DashboardSection } from './components/DashboardSection';
import { useWorkoutLog } from './hooks/useWorkoutLog';
import { NutritionSection } from './components/NutritionSection';
import { ProgressionSection } from './components/ProgressionSection';
import { Dumbbell, Calendar, BarChart3, Utensils, Calculator, Cloud, CloudOff } from 'lucide-react';
import { useAuth } from './components/AuthProvider';

export default function App() {
  const [activeTab, setActiveTab] = useState<'split' | 'calendar' | 'dashboard' | 'nutrition' | 'progression'>('split');
  const logsManager = useWorkoutLog();
  const { user, signInWithGoogle } = useAuth();

  const parts = planData.workout_plan_name.split(' ');
  const lastWord = parts.pop();

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#CCFF00]/30 selection:text-[#CCFF00]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12 md:px-12 md:py-16 flex flex-col gap-8 sm:gap-12">
        
        {/* Header */}
        <header className="border-b border-white/20 pb-8 sm:pb-12 flex flex-col md:flex-row justify-between items-start md:items-end bg-black gap-6">
          <div>
            <h2 className="text-[#CCFF00] text-xs font-black uppercase tracking-widest mb-3 font-mono">// Hypertrophy Protocol V1.0</h2>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase leading-none tracking-tighter">
              {parts.join(' ')}<br/><span className="text-[#CCFF00]">{lastWord}.</span>
            </h1>
          </div>
          <div className="text-left md:text-right flex flex-col md:items-end w-full md:w-auto">
            <div className="flex items-center gap-3 bg-zinc-900/80 border border-white/10 px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors" onClick={!user ? signInWithGoogle : undefined}>
              {user ? (
                <>
                  <Cloud className="w-5 h-5 text-emerald-400" />
                  <div className="text-left">
                    <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Cloud Sync Active</div>
                    <div className="text-[9px] font-mono opacity-50 uppercase tracking-widest">{user.email || 'Anonymous'}</div>
                  </div>
                </>
              ) : (
                <>
                  <CloudOff className="w-5 h-5 text-zinc-500" />
                  <div className="text-left">
                    <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Offline Mode</div>
                    <div className="text-[9px] font-mono text-[#CCFF00] opacity-80 uppercase tracking-widest hover:underline">Click to Login & Sync</div>
                  </div>
                </>
              )}
            </div>
            <div className="text-[10px] font-mono opacity-50 uppercase tracking-widest mt-4 text-right hidden md:block">{planData.structure_description.exercise_limit}</div>
          </div>
        </header>

        {/* Dynamic Program Intro */}
        <div>
           <p className="text-base sm:text-xl md:text-2xl font-black max-w-4xl leading-tight uppercase tracking-tight text-zinc-300">
             {planData.structure_description.overview}
           </p>
        </div>

          <div className="grid grid-cols-2 md:grid-cols-5 border border-white/20 select-none">
          <button
            onClick={() => setActiveTab('split')}
            className={`flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 md:gap-3 p-3 md:p-4 font-black uppercase tracking-wider text-[10px] md:text-xs text-center sm:text-left transition-all border-r border-b md:border-b-0 border-white/20 cursor-pointer ${
              activeTab === 'split' 
                ? 'bg-[#CCFF00] text-black' 
                : 'bg-transparent text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="font-mono text-[9px] opacity-65 hidden xl:inline">01 //</span>
            <span className="truncate">Active Split</span>
            <Dumbbell className="w-4 h-4 flex-shrink-0" />
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 md:gap-3 p-3 md:p-4 font-black uppercase tracking-wider text-[10px] md:text-xs text-center sm:text-left transition-all border-r border-b md:border-b-0 border-white/20 cursor-pointer ${
              activeTab === 'calendar' 
                ? 'bg-[#CCFF00] text-black' 
                : 'bg-transparent text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="font-mono text-[9px] opacity-65 hidden xl:inline">02 //</span>
            <span className="truncate">Calendar</span>
            <Calendar className="w-4 h-4 flex-shrink-0" />
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 md:gap-3 p-3 md:p-4 font-black uppercase tracking-wider text-[10px] md:text-xs text-center sm:text-left transition-all border-r md:border-r border-b md:border-b-0 border-white/20 cursor-pointer ${
              activeTab === 'dashboard' 
                ? 'bg-[#CCFF00] text-black' 
                : 'bg-transparent text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="font-mono text-[9px] opacity-65 hidden xl:inline">03 //</span>
            <span className="truncate">Analytics</span>
            <BarChart3 className="w-4 h-4 flex-shrink-0" />
          </button>

          <button
            onClick={() => setActiveTab('nutrition')}
            className={`flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 md:gap-3 p-3 md:p-4 font-black uppercase tracking-wider text-[10px] md:text-xs text-center sm:text-left transition-all border-r md:border-r border-b md:border-b-0 border-white/20 cursor-pointer ${
              activeTab === 'nutrition' 
                ? 'bg-[#CCFF00] text-black' 
                : 'bg-transparent text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="font-mono text-[9px] opacity-65 hidden xl:inline">04 //</span>
            <span className="truncate">Nutrition</span>
            <Utensils className="w-4 h-4 flex-shrink-0" />
          </button>

          <button
            onClick={() => setActiveTab('progression')}
            className={`flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 md:gap-3 p-3 md:p-4 font-black uppercase tracking-wider text-[10px] md:text-xs text-center sm:text-left transition-all cursor-pointer ${
              activeTab === 'progression' 
                ? 'bg-[#CCFF00] text-black' 
                : 'bg-transparent text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="font-mono text-[9px] opacity-65 hidden xl:inline">05 //</span>
            <span className="truncate">Calculator</span>
            <Calculator className="w-4 h-4 flex-shrink-0" />
          </button>
        </div>

        {/* Tab content panels with transitions */}
        <main className="min-h-[400px]">
          {activeTab === 'split' && (
            <div className="space-y-16 animate-fade-in">
              <OverviewSection />
              <ScheduleSection logsManager={logsManager} />
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="animate-fade-in">
              <CalendarSection logsManager={logsManager} />
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="animate-fade-in">
              <DashboardSection logsManager={logsManager} />
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div className="animate-fade-in">
              <NutritionSection />
            </div>
          )}

          {activeTab === 'progression' && (
            <div className="animate-fade-in">
              <ProgressionSection />
            </div>
          )}
        </main>
        
        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-white/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-mono font-bold opacity-45 uppercase tracking-widest">
            Commit to the daily protocol. Elite hypertrophy standard.
          </p>
          <p className="text-[10px] font-mono opacity-30 uppercase">
            Designed for BHUPENDRA RAWAT // Offline First / Sheet Backed
          </p>
        </footer>
      </div>
    </div>
  );
}
