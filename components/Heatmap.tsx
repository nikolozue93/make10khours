import { format, subDays } from 'date-fns';

export function Heatmap({ sessions }: { sessions: any[] }) {
  const today = new Date();
  // 365 days history
  const days = Array.from({ length: 365 }, (_, i) => {
    const date = subDays(today, 364 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const niceDate = format(date, 'MMM do, yyyy'); // e.g. "Jan 1st, 2024"
    
    // Filter sessions for this specific day
    const daySessions = sessions.filter((s) => s.date.startsWith(dateStr));
    const totalMinutes = daySessions.reduce((acc, s) => acc + s.duration, 0);
    const hours = (totalMinutes / 60).toFixed(1);
    
    // Calculate intensity color
    let level = 0;
    if (totalMinutes > 0) level = 1;
    if (totalMinutes > 60) level = 2; // > 1 hr
    if (totalMinutes > 180) level = 3; // > 3 hrs
    if (totalMinutes > 300) level = 4; // > 5 hrs

    return { date: dateStr, niceDate, level, count: totalMinutes, hours };
  });

  const getColor = (level: number) => {
    const colors = [
      'bg-zinc-100 dark:bg-zinc-800', 
      'bg-emerald-200',
      'bg-emerald-300',
      'bg-emerald-400',
      'bg-emerald-600',
    ];
    return colors[level];
  };

  return (
    <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm mb-8 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Focus History</h3>
        <span className="text-xs text-zinc-500">Last 365 Days</span>
      </div>
      
      <div className="flex gap-1 min-w-max pb-2">
         {/* Simple visualization (We need to improve this with more complex css) */}
         <div className="grid grid-rows-7 grid-flow-col gap-1">
           {days.map((day) => (
             <div 
               key={day.date} 
               // NATIVE TOOLTIP: This shows the date and hours on hover
               title={`${day.niceDate}: ${day.hours} hrs (${day.count} mins)`}
               className={`w-3 h-3 rounded-sm ${getColor(day.level)} hover:ring-2 ring-black/20 dark:ring-white/20 transition-all cursor-help`}
             />
           ))}
        </div>
      </div>
    </div>
  );
}