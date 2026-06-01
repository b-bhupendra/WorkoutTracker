import React, { useState } from 'react';
import { useWorkoutLog, DayHistoryData } from '../hooks/useWorkoutLog';
import { planData } from '../data';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Trash2, Dumbbell, AlertTriangle } from 'lucide-react';

interface CalendarSectionProps {
  logsManager: ReturnType<typeof useWorkoutLog>;
}

export function CalendarSection({ logsManager }: CalendarSectionProps) {
  const { history, saveHistoricalLog, deleteHistoricalLog } = logsManager;
  
  // Current date anchor is May 31, 2026
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(4); // 0-indexed, 4 = May
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(new Date().toISOString().split('T')[0]);
  const [selectedDayTemplate, setSelectedDayTemplate] = useState<number>(1);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Calculate days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get index of first day of week (0 = Sunday, 1 = Monday ...)
  const getFirstDayOfWeek = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfWeek(currentYear, currentMonth);

  // Month navigation
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // Build calendar matrix
  const daysArray: (number | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(i);
  }

  const selectedDayLog: DayHistoryData | undefined = selectedDateStr ? history[selectedDateStr] : undefined;

  // Handles adding empty workout structure or custom logging directly on that day
  const handleLogCustomWorkout = () => {
    if (!selectedDateStr) return;
    const template = planData.schedule.find(s => s.day === selectedDayTemplate);
    if (!template) return;

    // Log with empty fields to instantiate logs for editing
    template.exercises.forEach(ex => {
      const emptyReps = Array.from({ length: ex.sets || 3 }, () => 0);
      saveHistoricalLog(selectedDateStr, selectedDayTemplate, ex.name, 0, emptyReps);
    });
  };

  return (
    <div className="space-y-8">
      {/* Title block */}
      <div className="flex items-end justify-between border-b border-white/20 pb-4">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter leading-none mb-2">Consistency Calendar</h2>
          <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Marking off completed cycles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Calendar Matrix Side */}
        <div className="lg:col-span-7 border border-white/20 p-4 sm:p-6 md:p-8 bg-black">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <span className="font-mono text-xs uppercase font-bold tracking-widest opacity-50 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[#CCFF00]" />
              Workout Timeline Map
            </span>
            <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
              <button 
                onClick={prevMonth}
                className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center border border-white/20 hover:border-[#CCFF00] text-white hover:text-[#CCFF00] transition-all"
              >
                <ChevronLeft className="w-5 h-5 sm:w-4 sm:h-4" />
              </button>
              <span className="font-black uppercase italic tracking-tight text-sm sm:text-lg text-[#CCFF00] px-2 sm:px-4 min-w-[120px] sm:min-w-[140px] text-center">
                {monthNames[currentMonth]} {currentYear}
              </span>
              <button 
                onClick={nextMonth}
                className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center border border-white/20 hover:border-[#CCFF00] text-white hover:text-[#CCFF00] transition-all"
              >
                <ChevronRight className="w-5 h-5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Days labels */}
          <div className="grid grid-cols-7 text-center text-[10px] font-black uppercase tracking-wider opacity-40 pb-3 border-b border-white/10 mb-4">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Days Grid - Adjusted padding/size for mobile */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {daysArray.map((dayNum, idx) => {
              if (dayNum === null) {
                return <div key={`empty-${idx}`} className="aspect-square"></div>;
              }

              const numStr = dayNum.toString().padStart(2, '0');
              const dateKey = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${numStr}`;
              const isLogged = !!history[dateKey];
              const isSelected = selectedDateStr === dateKey;
              
              const isToday = () => {
                const now = new Date();
                return now.getFullYear() === currentYear && (now.getMonth() === currentMonth) && now.getDate() === dayNum;
              };

              let borderStyle = "border-white/10 text-white/70 hover:border-white/40";
              let bgStyle = "bg-transparent";

              if (isLogged) {
                borderStyle = "border-[#CCFF00] text-[#CCFF00] font-bold";
                bgStyle = "bg-[#CCFF00]/10";
              }
              if (isToday()) {
                borderStyle = "border-amber-500 text-amber-500 font-bold";
              }
              if (isSelected) {
                borderStyle = "border-white text-white font-black scale-[1.02] shadow-lg";
                bgStyle = isLogged ? "bg-[#CCFF00]/20" : "bg-white/10";
              }

              const workoutDayTemplate = history[dateKey]?.day;

              return (
                <button
                  key={`day-${dayNum}`}
                  onClick={() => setSelectedDateStr(dateKey)}
                  className={`aspect-square border flex flex-col justify-between p-1.5 sm:p-3 transition-all relative ${borderStyle} ${bgStyle}`}
                >
                  <span className="font-mono text-sm sm:text-lg font-black leading-none">{dayNum}</span>
                  {workoutDayTemplate !== undefined && (
                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-tighter text-zinc-400 block truncate max-w-full">
                      <span className="xs:hidden">D{workoutDayTemplate}</span>
                      <span className="hidden xs:inline">Day {workoutDayTemplate}</span>
                    </span>
                  )}
                  {isLogged && (
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2 w-1 sm:h-1.5 sm:w-1.5 h-1 rounded-full bg-[#CCFF00]"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Detail Drawer */}
        <div className="lg:col-span-5 border border-white/20 p-5 sm:p-6 md:p-8 bg-white/5 flex flex-col justify-between min-h-[420px]">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div>
                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Focus Date</p>
                <h3 className="text-xl sm:text-2xl font-black italic uppercase text-white tracking-tight mt-0.5">
                  {selectedDateStr ? new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'No Date Selected'}
                </h3>
              </div>
              <CalendarIcon className="w-6 h-6 text-white/30" />
            </div>

            {selectedDayLog ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-black/40 p-3 border-l-2 border-[#CCFF00]">
                  <div>
                    <span className="text-[9px] uppercase opacity-50 tracking-widest block font-bold">Planned Split</span>
                    <span className="text-xs sm:text-sm font-black uppercase text-[#CCFF00]">
                      Day {selectedDayLog.day}: {planData.schedule.find(s => s.day === selectedDayLog.day)?.type}
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      if (selectedDateStr && confirm("Delete entry?")) {
                        deleteHistoricalLog(selectedDateStr);
                      }
                    }}
                    className="p-2 border border-white/10 text-white/50 hover:text-red-400 hover:border-red-400/50 transition-colors"
                    title="Delete workout entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Logs for this session:</p>
                  <div className="divide-y divide-white/10 border-t border-b border-white/10">
                    {Object.entries(selectedDayLog.exercises).map(([exName, log]) => {
                      const typedLog = log as any;
                      return (
                        <div key={exName} className="py-2.5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1.5 group">
                          <div className="flex items-center gap-2 max-w-full">
                            <Dumbbell className="w-4 h-4 text-[#CCFF00] opacity-60 flex-shrink-0" />
                            <span className="text-xs font-bold uppercase tracking-tight text-white/90 group-hover:text-white transition-colors leading-snug">{exName}</span>
                          </div>
                          <div className="text-left sm:text-right flex-shrink-0 pl-6 sm:pl-0">
                            <span className="font-mono font-bold text-[#CCFF00] text-xs sm:text-sm">{typedLog.weight}kg </span>
                            <span className="font-mono text-white/60 text-[11px] sm:text-xs">[{typedLog.reps.join(', ')}] reps</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 flex flex-col items-center justify-center gap-4 text-center">
                <span className="p-4 rounded-full bg-white/5 border border-white/10">
                  <AlertTriangle className="w-8 h-8 text-white/30" />
                </span>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-zinc-400">No session logged for this date</p>
                  <p className="text-xs text-zinc-500 mt-1 max-w-[280px] mx-auto leading-relaxed">
                    You can pick a workout day blueprint below and establish a performance log for this date:
                  </p>
                </div>

                {/* Day Selection dropdown */}
                <div className="w-full max-w-xs mt-3 flex flex-col gap-2">
                  <select
                    value={selectedDayTemplate}
                    onChange={(e) => setSelectedDayTemplate(parseInt(e.target.value))}
                    className="w-full bg-black border border-white/20 p-3 text-xs font-bold uppercase tracking-wider text-white hover:border-white/40 focus:border-[#CCFF00] outline-none h-12"
                  >
                    {planData.schedule.map((d) => (
                      <option key={d.day} value={d.day}>
                        Day {d.day} - {d.type.split(' (')[0]}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleLogCustomWorkout}
                    className="w-full bg-[#CCFF00] text-black px-4 py-3 font-black uppercase text-xs tracking-wider hover:bg-white transition-colors h-12 flex items-center justify-center font-bold"
                  >
                    Log Date Blueprint
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-white/10 pt-6 mt-8 flex justify-between items-center text-[10px] font-mono">
            <span className="opacity-40 uppercase">Total Logged: {Object.keys(history).length} Sessions</span>
            <span className="text-[#CCFF00] uppercase font-bold">100% Client-Owned</span>
          </div>
        </div>

      </div>
    </div>
  );
}
