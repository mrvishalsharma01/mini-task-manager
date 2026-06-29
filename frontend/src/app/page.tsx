'use client';

import { useEffect, useState } from 'react';
import { Task, TaskFilter } from '../types';
import { taskService } from '../services/api';
import { TaskList } from '../components/TaskList';
import { AddTaskModal } from '../components/AddTaskModal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { Plus, CheckCircle, Clock, BarChart3, AlertCircle, RefreshCw } from 'lucide-react';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const fetchTasks = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setError(null);
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load tasks. Make sure the backend server is running.');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (taskData: { title: string; description: string }) => {
    await taskService.createTask(taskData);
    await fetchTasks(false);
  };

  const handleToggleComplete = async (id: string, currentStatus: boolean) => {
    const originalTasks = [...tasks];
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !currentStatus } : task
      )
    );

    try {
      await taskService.updateTask(id, { completed: !currentStatus });
    } catch (err) {
      console.error('Failed to toggle complete status:', err);
      setTasks(originalTasks);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;
    
    const idToDelete = taskToDelete.id;
    const originalTasks = [...tasks];
    setTasks(tasks.filter((task) => task.id !== idToDelete));
    setTaskToDelete(null);

    try {
      await taskService.deleteTask(idToDelete);
    } catch (err) {
      console.error('Failed to delete task:', err);
      setTasks(originalTasks);
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <main className="flex-1 bg-slate-950 text-slate-100 selection:bg-violet-500/30 selection:text-violet-200 min-h-screen">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-violet-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-20 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-teal-900/10 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Section */}
        <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-slate-900 pb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 via-purple-300 to-teal-300 bg-clip-text text-transparent">
              TaskSpace
            </h1>
            <p className="mt-2 text-slate-400 text-sm sm:text-base">
              A minimalist, premium workspace to organize your daily tasks.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => fetchTasks(true)}
              className="flex items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-700"
              aria-label="Refresh tasks"
            >
              <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-650 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/20 hover:from-violet-500 hover:to-indigo-600 transition-all duration-300 hover:shadow-xl hover:shadow-violet-900/30 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              <Plus className="h-5 w-5" />
              Add New Task
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="mt-8 grid gap-4 grid-cols-2 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <BarChart3 className="h-4 w-4 text-violet-400" />
              Total Tasks
            </div>
            <p className="mt-3 text-3xl font-extrabold text-slate-100">{totalTasks}</p>
          </div>

          <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <Clock className="h-4 w-4 text-amber-400" />
              Pending
            </div>
            <p className="mt-3 text-3xl font-extrabold text-slate-100">{pendingTasks}</p>
          </div>

          <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              Completed
            </div>
            <p className="mt-3 text-3xl font-extrabold text-slate-100">{completedTasks}</p>
          </div>

          <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-5 backdrop-blur-xl col-span-2 md:col-span-1">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span>Progress</span>
              <span className="text-teal-400 font-bold">{completionPercentage}%</span>
            </div>
            <div className="mt-4.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-950 border border-slate-900">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-550 to-teal-450 transition-all duration-500 ease-out"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </section>

        {/* Error State */}
        {error && (
          <div className="mt-8 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5 text-sm text-rose-400 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-200">Connection Error</h4>
              <p className="mt-1 text-rose-400/90 leading-relaxed">{error}</p>
              <button
                onClick={() => fetchTasks(true)}
                className="mt-3 rounded-lg border border-rose-500/30 px-3 py-1.5 text-xs font-semibold hover:bg-rose-500/10 transition-colors duration-200"
              >
                Try Reconnecting
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        {!error && (
          <section className="mt-8">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-slate-800 border-t-violet-500" />
                  <p className="text-sm font-medium text-slate-400">Loading your workspace...</p>
                </div>
              </div>
            ) : (
              <TaskList
                tasks={tasks}
                filter={filter}
                setFilter={setFilter}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onToggleComplete={handleToggleComplete}
                onDeleteClick={setTaskToDelete}
              />
            )}
          </section>
        )}
      </div>

      {/* Modals */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddTask}
      />

      <ConfirmationModal
        isOpen={taskToDelete !== null}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message={`Are you sure you want to delete the task "${taskToDelete?.title}"? This action cannot be undone.`}
      />
    </main>
  );
}
