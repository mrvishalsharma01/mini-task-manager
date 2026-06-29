import React from 'react';
import { Task, TaskFilter } from '../types';
import { TaskCard } from './TaskCard';
import { CheckCircle2, Circle, ClipboardList, Inbox, Search } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onToggleComplete: (id: string, currentStatus: boolean) => void;
  onDeleteClick: (task: Task) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  filter,
  setFilter,
  searchQuery,
  setSearchQuery,
  onToggleComplete,
  onDeleteClick,
}) => {
  const filteredTasksBySearch = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const finalTasks = filteredTasksBySearch.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = totalCount - completedCount;

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-800 bg-slate-900/50 py-3 pl-12 pr-4 text-slate-200 placeholder-slate-500 backdrop-blur-xl transition-all duration-200 focus:border-slate-750 focus:outline-none focus:ring-2 focus:ring-violet-500/25"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex rounded-xl bg-slate-900/80 p-1.5 border border-slate-800/80 backdrop-blur-xl shrink-0">
          <button
            onClick={() => setFilter('all')}
            className={`flex items-center gap-2 rounded-lg px-4.5 py-2 text-sm font-semibold transition-all duration-200 ${
              filter === 'all'
                ? 'bg-slate-800 text-slate-100'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            All
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-slate-400">
              {totalCount}
            </span>
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`flex items-center gap-2 rounded-lg px-4.5 py-2 text-sm font-semibold transition-all duration-200 ${
              filter === 'pending'
                ? 'bg-slate-800 text-slate-100'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Circle className="h-3.5 w-3.5" />
            Pending
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-slate-400">
              {pendingCount}
            </span>
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`flex items-center gap-2 rounded-lg px-4.5 py-2 text-sm font-semibold transition-all duration-200 ${
              filter === 'completed'
                ? 'bg-slate-800 text-slate-100'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Completed
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-slate-400">
              {completedCount}
            </span>
          </button>
        </div>
      </div>

      {/* Task Cards Grid */}
      {finalTasks.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {finalTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDeleteClick={onDeleteClick}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/20 py-16 px-4 text-center backdrop-blur-xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-slate-500 border border-slate-800 shadow-inner">
            <Inbox className="h-7 w-7" />
          </div>
          <h3 className="mt-5 text-lg font-bold text-slate-300">No tasks found</h3>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            {searchQuery
              ? `No tasks match your search query: "${searchQuery}"`
              : filter === 'completed'
              ? "You haven't completed any tasks yet. Keep going!"
              : filter === 'pending'
              ? 'Hooray! No pending tasks remaining.'
              : 'Get started by creating your first task! Click the button above.'}
          </p>
        </div>
      )}
    </div>
  );
};
