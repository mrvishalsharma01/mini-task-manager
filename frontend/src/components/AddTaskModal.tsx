import React, { useState } from 'react';
import { X, Plus, Sparkles, Loader2 } from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (taskData: { title: string; description: string }) => Promise<void>;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: { title?: string; description?: string } = {};
    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();

    if (!trimmedTitle) {
      newErrors.title = 'Title is required';
    } else if (trimmedTitle.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (trimmedTitle.length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }

    if (trimmedDesc.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onAdd({ title: title.trim(), description: description.trim() });
      setTitle('');
      setDescription('');
      setErrors({});
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.errors && Array.isArray(err.errors)) {
        const apiErrors: any = {};
        err.errors.forEach((e: any) => {
          if (e.field) {
            apiErrors[e.field] = e.message;
          }
        });
        setErrors(apiErrors);
      } else {
        setGeneralError(err.message || 'An error occurred while creating the task');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl transition-all duration-300">
        {/* Decorative background glow */}
        <div className="absolute -left-16 -top-16 -z-10 h-32 w-32 rounded-full bg-violet-600/10 blur-2xl" />
        <div className="absolute -right-16 -bottom-16 -z-10 h-32 w-32 rounded-full bg-teal-500/10 blur-2xl" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 rounded-xl p-1.5 text-slate-400 hover:bg-slate-850 hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-100">Create New Task</h3>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {generalError && (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-sm text-rose-400">
              {generalError}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-semibold text-slate-300">
              Task Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="e.g. Design Landing Page"
              className={`w-full rounded-xl border bg-slate-950 px-4 py-3 text-slate-100 placeholder-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                errors.title ? 'border-rose-500/50' : 'border-slate-800 hover:border-slate-700'
              }`}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-xs font-medium text-rose-400">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-semibold text-slate-300">
              Description <span className="text-xs font-normal text-slate-500">(Optional)</span>
            </label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
              }}
              placeholder="Describe the task in a few details..."
              className={`w-full rounded-xl border bg-slate-950 px-4 py-3 text-slate-100 placeholder-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                errors.description ? 'border-rose-500/50' : 'border-slate-800 hover:border-slate-700'
              }`}
              disabled={isSubmitting}
            />
            <div className="flex justify-between">
              {errors.description ? (
                <p className="text-xs font-medium text-rose-400">{errors.description}</p>
              ) : (
                <span />
              )}
              <span className="text-xs text-slate-500">
                {description.length}/500 chars
              </span>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-800 bg-slate-900 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-700"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
