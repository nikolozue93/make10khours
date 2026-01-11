'use client';
import { useState } from 'react';
import { FolderPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ProjectManager() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3b82f6'); // Default blue

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/dashboard', {
      method: 'POST',
      body: JSON.stringify({ type: 'CREATE_PROJECT', name, color }),
    });
    setName('');
    setIsOpen(false);
    router.refresh(); // Updates the page data immediately
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1 mt-2"
      >
        <FolderPlus className="w-4 h-4" /> New Project
      </button>
    );
  }

  return (
    <div className="mt-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
      <h4 className="text-sm font-semibold mb-2">Create New Project</h4>
      <form onSubmit={handleCreate} className="flex gap-2">
        <input 
          autoFocus
          type="text" 
          placeholder="Project Name"
          className="flex-1 p-2 text-sm rounded border border-zinc-300 dark:bg-zinc-800 dark:border-zinc-700"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input 
          type="color" 
          className="w-10 h-9 p-0.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 cursor-pointer"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <button className="px-3 py-1 bg-black text-white text-sm rounded hover:opacity-80">Add</button>
        <button 
          type="button"
          onClick={() => setIsOpen(false)}
          className="px-3 py-1 text-zinc-500 text-sm hover:text-zinc-800"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}