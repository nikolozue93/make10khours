'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ProjectManager } from './ProjectManager'; // Import the new component

export function TaskLogger({ projects }: { projects: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    projectId: '', // Start empty
    description: '',
    duration: '',
    date: new Date().toISOString().split('T')[0]
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.projectId) {
      alert("Please select a project first!");
      return;
    }
    
    setLoading(true);
    await fetch('/api/dashboard', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    setLoading(false);
    
    // Reset form but keep date
    setFormData({ ...formData, description: '', duration: '' });
    
    // FORCE UPDATE: This makes the log appear immediately
    router.refresh(); 
  }

  return (
    <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm mb-8">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5" /> Log Session
      </h3>
      
      {/* Logic to handle no projects */}
      {projects.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-zinc-500 mb-2">You need a project to start tracking.</p>
          <ProjectManager />
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium mb-1">Project</label>
              <select 
                className="w-full p-2 rounded-md border border-zinc-300 dark:bg-zinc-800 dark:border-zinc-700"
                value={formData.projectId}
                onChange={(e) => setFormData({...formData, projectId: e.target.value})}
              >
                <option value="">-- Select --</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-[2] w-full">
              <label className="block text-sm font-medium mb-1">Task</label>
              <input 
                type="text" 
                required
                className="w-full p-2 rounded-md border border-zinc-300 dark:bg-zinc-800 dark:border-zinc-700"
                placeholder="What did you do?"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="w-32">
              <label className="block text-sm font-medium mb-1">Minutes</label>
              <input 
                type="number" 
                required
                min="1"
                className="w-full p-2 rounded-md border border-zinc-300 dark:bg-zinc-800 dark:border-zinc-700"
                placeholder="60"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
              />
            </div>

            <button 
              disabled={loading}
              className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              {loading ? 'Saving...' : 'Log It'}
            </button>
          </form>
          
          {/* Allow adding more projects even if some exist */}
          <div className="mt-2">
            <ProjectManager />
          </div>
        </>
      )}
    </div>
  );
}