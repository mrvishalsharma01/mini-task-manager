import React from 'react';
import { Task } from '../types';
import { Check, Trash2, Calendar, Clock } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string, currentStatus: boolean) => void;
  onDeleteClick: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onDeleteClick,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border bg-slate-900/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        task.completed
          ? 'border-emerald-500/30 shadow-emerald-950/10'
          : 'border-slate-800 hover:border-slate-700 shadow-slate-950/20'
      }`}
    >
      {/* Decorative gradient overlay */}
      <div
        className={`absolute inset-0 -z-10 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
          task.completed
            ? 'from-emerald-500/5 to-transparent'
            : 'from-violet-500/5 to-transparent'
        }`}
      />

      <div className="flex items-start justify-between gap-4">
        {/* Toggle Button & Content */}
        <div className="flex items-start gap-4 flex-1">
          <button
            onClick={() => onToggleComplete(task.id, task.completed)}
            className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 ${
              task.completed
                ? 'border-emerald-500 bg-emerald-500 text-slate-950 focus:ring-emerald-500'
                : 'border-slate-700 hover:border-slate-500 focus:ring-violet-500'
            }`}
            aria-label={task.completed ? 'Mark task as pending' : 'Mark task as completed'}
          >
            {task.completed && <Check className="h-4 w-4 stroke-[3]" />}
          </button>

          <div className="flex-1 min-w-0">
            <h3
              className={`text-lg font-semibold tracking-tight transition-all duration-300 ${
                task.completed
                  ? 'text-slate-400 line-through decoration-slate-600'
                  : 'text-slate-100'
              }`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p
                className={`mt-2 text-sm leading-relaxed transition-all duration-300 ${
                  task.completed ? 'text-slate-500 line-through decoration-slate-600/50' : 'text-slate-400'
                }`}
              >
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onDeleteClick(task)}
          className="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-400 transition-all duration-200 hover:border-rose-500/30 hover:bg-rose-950/20 hover:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-slate-950"
          aria-label="Delete task"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Date metadata footer */}
      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-800/80 pt-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(task.createdAt)}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {formatTime(task.createdAt)}
        </span>
        {task.completed && (
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400 border border-emerald-500/20">
            Completed
          </span>
        )}
      </div>
    </div>
  );
};
