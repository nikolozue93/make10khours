"use client";

import { useEffect, useState } from 'react';
import { MetricsCards } from '@/components/MetricsCards';
import { Heatmap } from '@/components/Heatmap';
import { TaskLogger } from '@/components/TaskLogger';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, Legend } from 'recharts';

const defaultData = {
  sessions: [],
  projects: [],
  metrics: { totalHours: 0, totalTasks: 0 },
  charts: { projectDistribution: [] },
};

export default function Dashboard() {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch('/api/dashboard', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        if (active) setData(json);
      } catch (err) {
        console.error('Dashboard fetch error', err);
        if (active) setData(defaultData);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const pieData = data.charts?.projectDistribution ?? [];

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Make10000Hours <span className="text-emerald-500">Local Pro</span></h1>
            <p className="text-zinc-500 mt-1">Mastery requires consistency. Track your journey locally.</p>
          </div>
          <div className="flex gap-2">
             {/* Example Placeholder for settings/export */}
             <button className="px-4 py-2 text-sm border rounded-md hover:bg-zinc-100">Export JSON</button>
          </div>
        </header>

        <MetricsCards data={data} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
             <TaskLogger projects={data.projects} />
             <Heatmap sessions={data.sessions} />
             
             {/* Transaction Log */}
             <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {loading && <div className="text-sm text-zinc-500">Loading sessions…</div>}
                  {!loading && data.sessions.length === 0 && (
                    <div className="text-sm text-zinc-500">No sessions logged yet.</div>
                  )}
                  {data.sessions.map((session: any) => (
                    <div key={session.id} className="flex justify-between items-center py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                      <div>
                        <div className="font-medium">{session.description || 'No description'}</div>
                        <div className="text-xs text-zinc-500 flex gap-2 mt-1">
                          <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                             {session.project?.name}
                          </span>
                          <span>{new Date(session.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="font-mono font-medium">{session.duration}m</div>
                    </div>
                  ))}
                </div>
             </div>
          </div>

          <div className="lg:col-span-1">
            {/* Pie Chart Card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm p-6 h-[400px]">
              <h3 className="text-lg font-semibold mb-4">Project Breakdown</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ReTooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
