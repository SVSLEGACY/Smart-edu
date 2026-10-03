import React, { useState } from 'react';
import { Bookmark, Edit3, Plus, Trash2, CheckCircle2, ChevronLeft, Search } from 'lucide-react';
import { Course } from '../../types';

interface NotesAndBookmarksViewProps {
  type: 'notes' | 'bookmarks' | 'messages' | 'settings';
  courses: Course[];
  onSelectCourse: (courseId: string) => void;
  onBack: () => void;
}

export const NotesAndBookmarksView: React.FC<NotesAndBookmarksViewProps> = ({
  type,
  courses,
  onSelectCourse,
  onBack,
}) => {
  const [notes, setNotes] = useState([
    { id: 1, title: 'Speech Opening Formulas', content: 'Hook with an unexpected statistic or personal vulnerability in the first 15 seconds.', date: 'Today' },
    { id: 2, title: 'Adobe Illustrator Pen Tool Tips', content: 'Hold Shift for 45° angle constraints; Alt/Option to break handle symmetry for sharp curves.', date: 'Yesterday' },
    { id: 3, title: 'Story Arc Essentials', content: 'Inciting incident -> Rising stakes -> Dark night of the soul -> Transformation climax.', date: '3 days ago' },
  ]);

  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddNote = () => {
    if (!newNoteTitle.trim()) return;
    setNotes([
      {
        id: Date.now(),
        title: newNoteTitle.trim(),
        content: newNoteContent.trim() || 'No additional content',
        date: 'Just now',
      },
      ...notes,
    ]);
    setNewNoteTitle('');
    setNewNoteContent('');
    setIsAdding(false);
  };

  return (
    <div className="flex-1 p-6 sm:p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 group cursor-pointer text-left"
        >
          <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300 group-hover:bg-zinc-100 transition-colors shadow-xs">
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white font-heading tracking-tight capitalize">
            {type === 'notes' && 'Study Notes & Summaries'}
            {type === 'bookmarks' && 'Bookmarked Courses'}
            {type === 'messages' && 'Course Community & Discussions'}
            {type === 'settings' && 'Account & Platform Settings'}
          </h2>
        </button>
      </div>

      {type === 'notes' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Personal timestamped notes captured during interactive lectures:
            </p>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="px-4 py-2 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Note</span>
            </button>
          </div>

          {isAdding && (
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-md flex flex-col gap-3">
              <input
                type="text"
                placeholder="Note title..."
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                className="w-full text-sm font-bold bg-transparent border-b border-zinc-200 dark:border-zinc-700 pb-2 focus:outline-hidden"
              />
              <textarea
                placeholder="Note details, citations, or speech reminders..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                rows={3}
                className="w-full text-xs bg-transparent focus:outline-hidden resize-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-500 hover:text-zinc-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNote}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#FF533D] text-white cursor-pointer"
                >
                  Save Note
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-5 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-[11px] font-mono text-zinc-400">{note.date}</span>
                    <button
                      onClick={() => setNotes(notes.filter((n) => n.id !== note.id))}
                      className="text-zinc-400 hover:text-rose-500 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-1.5">
                    {note.title}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {note.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {type === 'bookmarks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectCourse(c.id)}
              className="p-5 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 cursor-pointer hover:shadow-md transition-shadow flex flex-col justify-between h-48"
            >
              <div>
                <span className="text-xs font-semibold text-zinc-400">{c.category}</span>
                <h4 className="text-base font-bold text-zinc-900 dark:text-white mt-1">
                  {c.title}
                </h4>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-700">
                <span className="text-xs text-zinc-500 font-mono">
                  {c.progressLessons}/{c.totalLessons} Lessons
                </span>
                <span className="text-xs font-bold text-[#FF533D]">Continue →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {type === 'messages' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-700">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Active Course Discussion</h3>
              <p className="text-xs text-zinc-400">Public Speaking & Leadership Cohort #4</p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-1 rounded-full font-bold">
              18 Online
            </span>
          </div>

          <div className="flex flex-col gap-3 py-2">
            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-700/40 text-xs">
              <span className="font-bold text-zinc-900 dark:text-white">Conner Garcia (Teacher):</span>
              <p className="mt-1 text-zinc-600 dark:text-zinc-300">
                Remember to pause right after your opening dilemma. It builds anticipation for the resolution!
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-700/40 text-xs">
              <span className="font-bold text-zinc-900 dark:text-white">Saira Goodman:</span>
              <p className="mt-1 text-zinc-600 dark:text-zinc-300">
                The slides from today's workshop are uploaded in the Materials tab!
              </p>
            </div>
          </div>
        </div>
      )}

      {type === 'settings' && (
        <div className="max-w-xl p-6 rounded-3xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex flex-col gap-4">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">User Preferences</h3>
          <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-700">
            <div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Email Lesson Reminders</h4>
              <p className="text-[11px] text-zinc-400">Receive calendar schedule alerts for study blocks</p>
            </div>
            <input type="checkbox" defaultChecked className="accent-orange-500 w-4 h-4 cursor-pointer" />
          </div>
          <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-700">
            <div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Auto-advance Next Lecture</h4>
              <p className="text-[11px] text-zinc-400">Play consecutive chapter upon video completion</p>
            </div>
            <input type="checkbox" defaultChecked className="accent-orange-500 w-4 h-4 cursor-pointer" />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white">High Quality Streaming</h4>
              <p className="text-[11px] text-zinc-400">Prefer 1080p 60fps lectures</p>
            </div>
            <input type="checkbox" defaultChecked className="accent-orange-500 w-4 h-4 cursor-pointer" />
          </div>
        </div>
      )}
    </div>
  );
};
