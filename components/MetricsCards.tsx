import { Clock, CheckCircle, Flame, Calendar } from 'lucide-react';

export function MetricsCards({ data }: { data: any }) {
  const cards = [
    { label: 'Total Hours', value: data.metrics.totalHours, icon: Clock, color: 'text-blue-500' },
    { label: 'Sessions', value: data.metrics.totalTasks, icon: CheckCircle, color: 'text-green-500' },
    // Mock logic for streak/rate for simplicity in this snippet
    { label: 'Day Streak', value: '12', icon: Flame, color: 'text-orange-500' }, 
    { label: 'Completion', value: '94%', icon: Calendar, color: 'text-purple-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => (
        <div key={card.label} className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-zinc-500">{card.label}</p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{card.value}</h3>
            </div>
            <card.icon className={`w-8 h-8 ${card.color}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
