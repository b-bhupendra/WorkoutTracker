import React, { useState, useEffect } from 'react';
import { planData } from '../data';
import { Exercise } from '../types';
import { PlayCircle, TrendingUp, Save, Check, Shuffle, Timer, Play, Pause, RotateCcw } from 'lucide-react';
import { useWorkoutLog } from '../hooks/useWorkoutLog';
import { getSuggestion } from '../utils/fitness';

const RestTimer = ({ defaultSeconds = 90 }: { defaultSeconds?: number }) => {
  const [timeLeft, setTimeLeft] = useState(defaultSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(defaultSeconds);
  };

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-3 bg-black border border-white/20 p-2 ml-4">
      <Timer className={`w-4 h-4 ${isActive ? 'text-[#CCFF00] animate-pulse' : 'text-zinc-500'}`} />
      <span className={`font-mono text-xl ${isActive ? 'text-[#CCFF00]' : 'text-white'}`}>
        {mins}:{secs}
      </span>
      <div className="flex gap-1 border-l border-white/10 pl-2">
        <button onClick={toggleTimer} className="p-1.5 hover:bg-white/10 transition-colors cursor-pointer text-white">
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button onClick={resetTimer} className="p-1.5 hover:bg-white/10 transition-colors cursor-pointer text-white">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const ExerciseRow: React.FC<{ exercise: Exercise; index: number; dayType: string; dayId: number; logsManager: ReturnType<typeof useWorkoutLog> }> = ({ exercise, index, dayType, dayId, logsManager }) => {
  const [expanded, setExpanded] = useState(false);
  const [activeExerciseName, setActiveExerciseName] = useState<string>(exercise.name);
  const [playVideo, setPlayVideo] = useState(false);

  const { getLatestLog, saveLog } = logsManager;
  const latestLog = getLatestLog(dayId, activeExerciseName);
  
  const [weightInput, setWeightInput] = useState<string>('');
  const [repsInput, setRepsInput] = useState<string[]>([]);
  
  // Update inputs whenever active exercise, day, or sets definition changes
  useEffect(() => {
    const currentLog = getLatestLog(dayId, activeExerciseName);
    setWeightInput(currentLog?.weight?.toString() || '');
    setRepsInput(currentLog?.reps?.map(String) || Array.from({ length: exercise.sets || 1 }, () => ''));
  }, [activeExerciseName, dayId, exercise.sets]);

  const suggestion = getSuggestion(exercise.reps || '', latestLog);
  const isLight = dayType.includes('Stretch');

  const handleSave = () => {
    saveLog(dayId, activeExerciseName, parseFloat(weightInput) || 0, repsInput.map(r => parseInt(r) || 0));
    setExpanded(false);
  };

  return (
    <>
      <div 
        className={`flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 p-4 border-b border-white/10 items-stretch hover:bg-white/5 transition-colors cursor-pointer ${expanded ? 'bg-white/5' : ''}`}
        onClick={() => {
          setExpanded(!expanded);
          if (!expanded) {
            setPlayVideo(false);
          }
        }}
      >
        <div className="hidden md:block md:col-span-1 opacity-30 font-mono text-xl font-bold">
          {(index + 1).toString().padStart(2, '0')}
        </div>
        
        <div className="md:col-span-5 flex items-start justify-between gap-2">
          <div className="font-black uppercase text-base sm:text-lg leading-tight">
            <span className="md:hidden opacity-40 font-mono text-xs mr-1.5">{(index + 1).toString().padStart(2, '0')}</span>
            {activeExerciseName}
            {activeExerciseName !== exercise.name && (
              <span className="text-[10px] text-[#CCFF00] font-mono tracking-widest uppercase block mt-1">
                [Subbed: {exercise.name}]
              </span>
            )}
            {exercise.focus && (
              <p className="text-[9px] opacity-40 uppercase tracking-widest mt-0.5 block font-bold">{exercise.focus}</p>
            )}
          </div>
          {/* Mobile status indicator badge */}
          <div className="md:hidden flex-shrink-0">
            {latestLog ? (
              <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[9px] font-black uppercase px-2 py-0.5 tracking-wider rounded-sm">Logged</span>
            ) : (
              <span className="bg-[#CCFF00]/10 text-[#CCFF00]/80 border border-[#CCFF00]/20 text-[9px] font-black uppercase px-2 py-0.5 tracking-wider rounded-sm">Log</span>
            )}
          </div>
        </div>

        <div className="md:col-span-4 grid grid-cols-2 gap-4 mt-1 md:mt-0 pt-2 md:pt-0 border-t border-white/5 md:border-0">
          <div className="flex md:flex-col justify-between items-center md:justify-center">
            <p className="text-[9px] opacity-40 uppercase font-black tracking-widest">Sets</p>
            <p className="font-mono text-base md:text-xl text-[#CCFF00]">{exercise.sets?.toString().padStart(2, '0') || '-'}</p>
          </div>
          <div className="flex md:flex-col justify-between items-center md:justify-center">
            <p className="text-[9px] opacity-40 uppercase font-black tracking-widest">Target</p>
            <p className="font-mono text-base md:text-xl">{exercise.reps || '-'}</p>
          </div>
        </div>

        <div className="col-span-2 text-right hidden md:block">
          <div className={`w-8 h-8 rounded-full ml-auto flex items-center justify-center transition-colors ${expanded ? 'bg-[#CCFF00] text-black border-transparent' : 'border border-white/20 hover:border-[#CCFF00] text-transparent hover:text-[#CCFF00]'}`}>
             {latestLog ? <Check className="w-4 h-4 text-emerald-500" /> : <TrendingUp className="w-4 h-4 text-white hover:text-black" />}
          </div>
        </div>
      </div>
      
      {expanded && (
        <div className="p-4 md:p-6 bg-white/5 border-b border-white/10 flex flex-col lg:flex-row gap-8">
           <div className="w-full lg:w-1/3 flex flex-col gap-3">
             <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest flex justify-between items-center">
               <span>Form Demonstration</span>
               {playVideo && (
                 <button 
                   onClick={(e) => {
                     e.stopPropagation();
                     setPlayVideo(false);
                   }}
                   className="text-[9px] font-black uppercase tracking-wider text-[#CCFF00] border-b border-[#CCFF00] leading-none"
                 >
                   Reset Loop
                 </button>
               )}
             </p>
             <div className="aspect-video bg-black border border-white/20 relative group flex items-center justify-center overflow-hidden" onClick={(e) => e.stopPropagation()}>
               {playVideo && exercise.videoUrl ? (
                 <iframe
                   className="w-full h-full border-0 absolute inset-0 bg-black z-20"
                   src={`${exercise.videoUrl}?autoplay=1&mute=1&playlist=${exercise.videoUrl.split('/embed/')[1]}&loop=1&controls=0&showinfo=0&rel=0`}
                   title={`${activeExerciseName} Form Drill`}
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                   allowFullScreen
                 ></iframe>
               ) : (
                 <>
                   <img src={`https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=640&auto=format&fit=crop`} alt="Form" className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale group-hover:opacity-50 transition-opacity" />
                   <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       setPlayVideo(true);
                     }}
                     className="w-12 h-12 text-[#CCFF00] hover:scale-110 transition-all z-10 flex items-center justify-center bg-black/60 border border-white/10 rounded-full"
                   >
                     <PlayCircle className="w-6 h-6" />
                   </button>
                   <div className="absolute bottom-2 left-2 flex gap-2 z-10">
                     <span className="bg-[#CCFF00] text-black text-[9px] font-bold uppercase px-2 py-0.5 rounded-sm">Play Form Guide</span>
                   </div>
                 </>
               )}
             </div>
             <p className="text-xs text-white/70 italic mt-2 border-l-2 border-[#CCFF00] pl-3">
               <span className="font-bold uppercase not-italic text-[#CCFF00] text-[10px] tracking-widest block mb-1">Execution Cue:</span>
               {isLight ? 'Focus on maximizing the stretch at the bottom and keeping constant tension.' : 'Control the eccentric (lowering) phase and explode on the concentric.'}
             </p>
           </div>
           
           <div className="w-full lg:w-2/3 flex flex-col gap-6" onClick={(e) => e.stopPropagation()}>
              <div>
                 <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mb-2">Algorithm Suggestion</p>
                 <div className="bg-[#CCFF00]/10 border-l-2 border-[#CCFF00] p-3 backdrop-blur-sm">
                   <p className="text-sm font-bold text-[#CCFF00] leading-snug">{suggestion}</p>
                 </div>
              </div>

              {/* Research Backed Alternatives Swapper */}
              {exercise.alternatives && exercise.alternatives.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Shuffle className="w-3.5 h-3.5 text-[#CCFF00]" />
                    <span>Research-Backed Alternatives for today</span>
                  </p>
                  <div className="flex flex-wrap gap-2 flex-row">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveExerciseName(exercise.name);
                        setPlayVideo(false);
                      }}
                      className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider transition-all border rounded-sm cursor-pointer ${
                        activeExerciseName === exercise.name
                          ? 'bg-[#CCFF00] text-black border-[#CCFF00]'
                          : 'border-white/10 text-white/70 hover:border-white/30 hover:bg-white/5'
                      }`}
                    >
                      Default: {exercise.name}
                    </button>
                    {exercise.alternatives.map((alt) => (
                      <button
                        key={alt}
                        type="button"
                        onClick={() => {
                          setActiveExerciseName(alt);
                          setPlayVideo(false);
                        }}
                        className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider transition-all border rounded-sm cursor-pointer ${
                          activeExerciseName === alt
                            ? 'bg-[#CCFF00] text-black border-[#CCFF00]'
                            : 'border-white/15 text-white/50 hover:border-white/30 hover:bg-white/5'
                        }`}
                      >
                        {alt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div>
                   <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mb-2 flex items-center justify-between">
                     <span>Weight (KG/LBS)</span>
                     {latestLog && <span className="opacity-50 lowercase">prev: {latestLog.weight}</span>}
                   </p>
                   <input 
                     type="number"
                     value={weightInput}
                     onChange={e => setWeightInput(e.target.value)}
                     className="w-full bg-black border border-white/20 p-3 font-mono text-xl text-[#CCFF00] focus:border-[#CCFF00] outline-none transition-colors"
                     placeholder="0"
                   />
                 </div>
                 <div>
                   <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mb-2 flex items-center justify-between">
                     <span>{exercise.reps.includes('sec') ? 'Seconds per Set' : 'Reps per Set'} ({exercise.sets || 1} sets)</span>
                     {latestLog && <span className="opacity-50 lowercase">prev: {latestLog.reps.join(',')}</span>}
                   </p>
                   <div className="flex flex-wrap sm:flex-nowrap gap-2 min-h-[48px]">
                     {repsInput.map((rep, rIdx) => (
                       <input 
                         key={rIdx}
                         type="number"
                         value={rep}
                         onChange={e => {
                           const newReps = [...repsInput];
                           newReps[rIdx] = e.target.value;
                           setRepsInput(newReps);
                         }}
                         className="flex-1 min-w-[44px] bg-black border border-white/20 p-2 font-mono text-center text-white focus:border-[#CCFF00] outline-none text-xl transition-colors h-12"
                         placeholder={exercise.reps.includes('sec') ? "s" : "-"}
                       />
                     ))}
                   </div>
                 </div>
              </div>

              {/* Timer Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between bg-black/40 border border-white/10 p-3 mt-4">
                <div className="flex items-center gap-2 mb-3 sm:mb-0">
                  <Timer className="w-4 h-4 text-zinc-500" />
                  <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Rest Timer</span>
                </div>
                <RestTimer defaultSeconds={isLight ? 90 : 180} />
              </div>

              <div className="mt-auto flex flex-col sm:flex-row items-center justify-end gap-3 w-full sm:w-auto pt-4 border-t border-white/5">
                 {latestLog && (
                   <span className="text-[10px] font-black uppercase tracking-widest text-[#CCFF00] bg-[#CCFF00]/10 border border-[#CCFF00]/20 px-3 py-1.5 text-center w-full sm:w-auto rounded-sm">
                     ✓ Performance Data Logged
                   </span>
                 )}
                 <button 
                   onClick={handleSave}
                   className="flex items-center justify-center gap-2 bg-[#CCFF00] text-black px-6 py-4 sm:py-3 font-black uppercase tracking-widest text-xs hover:bg-white transition-colors w-full sm:w-auto cursor-pointer"
                 >
                   <Save className="w-4 h-4" />
                   Save Performance
                 </button>
              </div>
           </div>
        </div>
      )}
    </>
  );
};

interface ScheduleSectionProps {
  logsManager: ReturnType<typeof useWorkoutLog>;
}

export function ScheduleSection({ logsManager }: ScheduleSectionProps) {
  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');

  const displayedDays = selectedDay === 'all' 
    ? planData.schedule 
    : planData.schedule.filter(d => d.day === selectedDay);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between border-b border-white/20 pb-4 gap-4">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2 md:mb-0">Training Log</h2>
          <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest hidden sm:block pb-1">7-Day Protocol</p>
        </div>
        
        {/* Mobile / Global Day Selector */}
        <div className="flex overflow-x-auto gap-2 hide-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
          <button 
            onClick={() => setSelectedDay('all')}
            className={`px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest whitespace-nowrap border transition-colors ${selectedDay === 'all' ? 'bg-[#CCFF00] text-black border-[#CCFF00]' : 'bg-transparent text-white/50 border-white/20 hover:border-white/50'}`}
          >
            All
          </button>
          {planData.schedule.map(d => (
            <button 
              key={d.day}
              onClick={() => setSelectedDay(d.day)}
              className={`px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest whitespace-nowrap border transition-colors flex items-center gap-2 ${selectedDay === d.day ? 'bg-[#CCFF00] text-black border-[#CCFF00]' : 'bg-transparent text-white/50 border-white/20 hover:border-white/50'}`}
            >
              Day {d.day}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col gap-8">
        {displayedDays.map((day) => {
          const isRecovery = day.type === 'Active Recovery';
          const isHeavy = day.type.includes('Heavy');
          const isLight = day.type.includes('Light');
          
          let headerColor = 'text-white';
          if (isRecovery) headerColor = 'text-white opacity-50';
          else if (isHeavy) headerColor = 'text-[#CCFF00]';
          else if (isLight) headerColor = 'text-[#CCFF00]';

          return (
            <div key={day.day} className="border border-white/20 flex flex-col lg:flex-row group bg-black">
               {/* Day Header - Left side on desktop */}
               <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-white/20 p-6 md:p-8 flex flex-col gap-8 flex-shrink-0">
                  <div>
                     <p className="text-[10px] uppercase tracking-tighter opacity-50 mb-1">Day</p>
                     <p className="text-6xl font-black leading-none">{day.day.toString().padStart(2, '0')}</p>
                  </div>
                  <div className="mt-auto">
                     <h3 className={`text-2xl font-black italic uppercase leading-none mb-4 ${headerColor}`}>
                       {day.type.replace(' (Stretch & Pump)', '')}
                     </h3>
                     {day.cardio && (
                        <div className="bg-white/5 px-3 py-2 border-l-2 border-[#CCFF00]">
                          <p className="text-[9px] uppercase opacity-50 mb-1">Cardio Int.</p>
                          <p className="text-xs font-bold uppercase">{day.cardio}</p>
                        </div>
                     )}
                  </div>
               </div>

               {/* Exercises List - Right side */}
               <div className="flex-1 bg-white/5 flex flex-col pt-0 lg:pt-0">
                  {day.exercises.length > 0 ? (
                    <div className="flex flex-col">
                      <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 border-b border-white/10 text-[10px] uppercase font-bold tracking-widest opacity-40 bg-black/40">
                         <div className="col-span-1">No.</div>
                         <div className="col-span-5">Movement</div>
                         <div className="col-span-2 text-center">Sets</div>
                         <div className="col-span-2 text-center">Reps</div>
                         <div className="col-span-2 text-right">Status</div>
                      </div>
                      <div className="px-0 p-4 md:px-4 md:py-0">
                        {day.exercises.map((ex, idx) => (
                          <ExerciseRow 
                            key={idx} 
                            exercise={ex} 
                            index={idx} 
                            dayType={day.type} 
                            dayId={day.day}
                            logsManager={logsManager}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center p-12 opacity-40 min-h-[200px]">
                      <p className="text-xl font-black uppercase tracking-widest text-center">No structural loading.</p>
                      <p className="text-xs font-bold uppercase mt-2">Active Recovery Only.</p>
                    </div>
                  )}
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
