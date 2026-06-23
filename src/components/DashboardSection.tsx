import React, { useState, useMemo } from 'react';
import { useWorkoutLog } from '../hooks/useWorkoutLog';
import { planData } from '../data';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid 
} from 'recharts';
import { TrendingUp, BarChart2, Download, Upload, Info, FileSpreadsheet, Clipboard } from 'lucide-react';

interface DashboardSectionProps {
  logsManager: ReturnType<typeof useWorkoutLog>;
}

export function DashboardSection({ logsManager }: DashboardSectionProps) {
  const { history, importHistory } = logsManager;
  const [selectedExercise, setSelectedExercise] = useState<string>(
    planData.schedule[0]?.exercises[0]?.name || ""
  );

  // Extract all unique exercises in split
  const allExercises = useMemo(() => {
    const list = new Set<string>();
    planData.schedule.forEach(day => {
      day.exercises.forEach(ex => {
        if (ex.name) list.add(ex.name);
      });
    });
    return Array.from(list).sort();
  }, []);

  // Format One-Rep Max History for Recharts LineChart
  const exerciseHistoryData = useMemo(() => {
    const dates = Object.keys(history).sort((a, b) => a.localeCompare(b));
    const data: { date: string; dateLabel: string; weight: number; reps: number; oneRepMax: number }[] = [];

    dates.forEach(d => {
      const exercLog = history[d]?.exercises[selectedExercise];
      if (exercLog && exercLog.weight > 0 && exercLog.reps.some(r => r > 0)) {
        // Find best set reps (max reps count)
        const validReps = exercLog.reps.filter(r => r > 0);
        const maxReps = Math.max(...validReps);
        
        // Epley Formula: 1RM = Weight * (1 + (Reps / 30))
        // If reps is 1, 1RM is just weight. If reps = 0, skip.
        const calculated1RM = maxReps > 0 
          ? parseFloat((exercLog.weight * (1 + maxReps / 30)).toFixed(1))
          : exercLog.weight;

        // Parse date for a cleaner visualization label (e.g. "May 14")
        const dateObj = new Date(d + 'T00:00:00');
        const formattedLabel = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        data.push({
          date: d,
          dateLabel: formattedLabel,
          weight: exercLog.weight,
          reps: maxReps,
          oneRepMax: calculated1RM
        });
      }
    });
    return data;
  }, [history, selectedExercise]);

  // Volume history (total weight moved per session) - Last 30 days
  const sessionVolumeData = useMemo(() => {
    const dates = Object.keys(history).sort((a, b) => a.localeCompare(b));
    
    // Filter to last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

    const filteredDates = dates.filter(d => d >= thirtyDaysAgoStr);
    
    // Fallback to something if no logs (or just map normally)
    const data: { dateLabel: string; totalVolume: number; date: string }[] = [];

    filteredDates.forEach(d => {
      let totalVolume = 0;
      const dayData = history[d];
      if (dayData) {
        Object.values(dayData.exercises).forEach((ex: any) => {
          if (ex.weight > 0) {
            ex.reps.forEach((rep: number) => {
              totalVolume += (ex.weight * rep);
            });
          }
        });
      }

      if (totalVolume > 0) {
        const dateObj = new Date(d + 'T00:00:00');
        const formattedLabel = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        data.push({
          date: d,
          dateLabel: formattedLabel,
          totalVolume
        });
      }
    });
    return data;
  }, [history]);

  // Export logs to CSV mapping to Google Sheets / MS Excel
  const handleExportCSV = () => {
    const dates = Object.keys(history).sort((a, b) => a.localeCompare(b));
    
    // CSV Header row
    let csvRows = ["Date,Template Day,Exercise,Weight(kg),Reps Structure"];

    dates.forEach(date => {
      const dayData = history[date];
      if (dayData) {
        Object.entries(dayData.exercises).forEach(([exName, log]: [string, any]) => {
          const repsStr = `"${log.reps.join('-')}"`;
          csvRows.push(`${date},Day ${dayData.day},"${exName.replace(/"/g, '""')}",${log.weight},${repsStr}`);
        });
      }
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `6_day_workout_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Importer mapping to local history storage
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      try {
        const lines = text.split('\n');
        const imported: typeof history = {};

        // Parse csv lines (Date,Template Day,Exercise,Weight(kg),Reps Structure)
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          // Simple CSV splitter handling double quotes for reps strings/exercise names
          const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
          if (matches.length < 5) continue;

          const date = matches[0].trim().replace(/^"|"$/g, '');
          const dayStr = matches[1].trim().replace(/^"|"$/g, '');
          const exName = matches[2].trim().replace(/^"|"$/g, '').replace(/""/g, '"');
          const weight = parseFloat(matches[3].trim().replace(/^"|"$/g, '')) || 0;
          const repsStr = matches[4].trim().replace(/^"|"$/g, '');

          const dayNum = parseInt(dayStr.replace(/\D/g, '')) || 1;
          const reps = repsStr.split('-').map(r => parseInt(r) || 0);

          if (!imported[date]) {
            imported[date] = {
              day: dayNum,
              exercises: {}
            };
          }
          imported[date].exercises[exName] = { weight, reps };
        }

        if (Object.keys(imported).length > 0) {
          importHistory(imported);
          alert(`Successfully imported ${Object.keys(imported).length} sessions of historical workout data!`);
        } else {
          alert("Invalid CSV format. Please verify the headers matches our export template.");
        }
      } catch (err) {
        alert("An error occurred while parsing the CSV spreadsheet file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-12">
      
      {/* Overview Block */}
      <div className="flex flex-col lg:flex-row divide-x-0 lg:divide-x divide-y lg:divide-y-0 divide-white/20 border border-white/20 bg-black">
        <div className="p-6 md:p-8 flex-1">
          <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mb-1">Spreadsheet Synergy</p>
          <h2 className="text-3xl font-black italic uppercase text-white mb-4">Google Sheets & Excel Integration</h2>
          <p className="text-sm text-zinc-400 leading-relaxed mb-6">
            Lifting programs belong in direct control of the user. You can seamlessly copy-paste your logged stats, export them as industry-standard spreadsheet files, or upload backups to keep spreadsheets safe across devices with no tracking filters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-2 bg-[#CCFF00] text-black px-6 py-3 font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Excel File
            </button>
            <label className="flex items-center justify-center gap-2 border border-white/20 hover:border-white text-white px-6 py-3 font-bold uppercase tracking-widest text-xs transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              Upload Backup (CSV)
              <input 
                type="file"
                accept=".csv"
                onChange={handleImportCSV}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="p-6 md:p-8 w-full lg:w-96 bg-white/5 flex flex-col justify-between">
          <div className="space-y-4">
             <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#CCFF00] flex items-center gap-2">
               <FileSpreadsheet className="w-4 h-4" />
               Raw Copy Format
             </span>
             <p className="text-xs text-zinc-400">
               Direct copy-paste pattern compatible with Google Sheets formula sheets:
             </p>
             <div className="bg-black/85 p-3 rounded-sm border border-white/10 font-mono text-[11px] leading-relaxed text-zinc-300">
                Date,Day,Exercise,Weight,Reps<br />
                2026-05-31,Day 1,Hack Squat,150,8-8-7-6
             </div>
          </div>
          <div className="mt-6 flex items-start gap-2.5 text-[10px] text-zinc-500 bg-black/40 p-3">
             <Info className="w-4 h-4 text-[#CCFF00] shrink-0" />
             <span>Importing updates progression algorithms automatically so suggestions calibrate instantly.</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: One-Rep Max Tracking */}
        <div className="border border-white/20 p-6 md:p-8 bg-black">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
               <span className="font-mono text-xs uppercase font-bold tracking-widest opacity-50 flex items-center gap-2 mb-1">
                 <TrendingUp className="w-4 h-4 text-[#CCFF00]" />
                 Strength Trend Metrics
               </span>
               <h3 className="text-2xl font-black italic uppercase text-white">Estimated 1RM Speed</h3>
            </div>
            
            {/* Dynamic Exercise Picker */}
            <select
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
              className="bg-black border border-white/20 text-xs font-bold uppercase tracking-wider text-white p-2.5 focus:border-[#CCFF00] outline-none max-w-[240px]"
            >
              {allExercises.map(ex => (
                <option key={ex} value={ex}>{ex}</option>
              ))}
            </select>
          </div>

          {exerciseHistoryData.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={exerciseHistoryData} margin={{ left: -10, right: 10, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <XAxis dataKey="dateLabel" stroke="#666" tick={{ fill: '#888', fontSize: 11 }} />
                  <YAxis stroke="#666" label={{ value: '1RM (kg)', angle: -90, position: 'insideLeft', fill: '#888', fontSize: 11 }} tick={{ fill: '#888', fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }}
                    labelStyle={{ fontWeight: 'bold', color: '#CCFF00' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="oneRepMax" 
                    stroke="#CCFF00" 
                    strokeWidth={3} 
                    dot={{ fill: '#000', stroke: '#CCFF00', strokeWidth: 2, r: 5 }} 
                    activeDot={{ r: 7, strokeWidth: 0, fill: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex justify-between text-[10px] font-mono opacity-40 uppercase mt-4">
                 <span>Peak Weight: {Math.max(...exerciseHistoryData.map(d => d.weight))}kg</span>
                 <span>Peak 1RM: {Math.max(...exerciseHistoryData.map(d => d.oneRepMax))}kg</span>
              </div>
            </div>
          ) : (
            <div className="h-[300px] flex flex-col items-center justify-center text-center opacity-40">
              <TrendingUp className="w-12 h-12 mb-4 text-zinc-500" />
              <p className="text-sm font-bold uppercase tracking-wider">No Performance History Logged</p>
              <p className="text-xs text-zinc-400 max-w-[240px] mt-1">Please log weights and reps for "{selectedExercise}" inside the split to draw progression.</p>
            </div>
          )}
        </div>

        {/* Chart 2: Volume Tracking */}
        <div className="border border-white/20 p-6 md:p-8 bg-black">
          <div className="mb-8">
             <span className="font-mono text-xs uppercase font-bold tracking-widest opacity-50 flex items-center gap-2 mb-1">
               <BarChart2 className="w-4 h-4 text-[#CCFF00]" />
               Structural Volume Map
             </span>
             <h3 className="text-2xl font-black italic uppercase text-white">Lifting Session Tonnage</h3>
          </div>

          {sessionVolumeData.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sessionVolumeData} margin={{ left: -10, right: 10, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <XAxis dataKey="dateLabel" stroke="#666" tick={{ fill: '#888', fontSize: 11 }} />
                  <YAxis stroke="#666" label={{ value: 'Tonnage (kg)', angle: -90, position: 'insideLeft', fill: '#888', fontSize: 11 }} tick={{ fill: '#888', fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }}
                    labelStyle={{ fontWeight: 'bold', color: '#CCFF00' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="totalVolume" 
                    name="Moved Mass (kg)" 
                    stroke="#ffffff" 
                    strokeWidth={3} 
                    dot={{ fill: '#000', stroke: '#ffffff', strokeWidth: 2, r: 5 }} 
                    activeDot={{ r: 7, strokeWidth: 0, fill: '#CCFF00' }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex justify-between text-[10px] font-mono opacity-40 uppercase mt-4">
                 <span>Baseline Session: {sessionVolumeData[0]?.totalVolume.toFixed(0)}kg</span>
                 <span>Most Recent Session: {sessionVolumeData[sessionVolumeData.length - 1]?.totalVolume.toFixed(0)}kg</span>
              </div>
            </div>
          ) : (
            <div className="h-[300px] flex flex-col items-center justify-center text-center opacity-40">
              <BarChart2 className="w-12 h-12 mb-4 text-zinc-500" />
              <p className="text-sm font-bold uppercase tracking-wider">No Tonnage Data Rendered</p>
              <p className="text-xs text-zinc-400 max-w-[240px] mt-1">Consistency calendar logs generate overall session volume graphs automatically.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
