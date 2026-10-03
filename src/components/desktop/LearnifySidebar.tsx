import React from 'react';
import {
  Code2,
  Edit3,
  MessageSquare,
  Bookmark,
  Settings,
  LogOut,
  Sparkles,
  LayoutGrid,
} from 'lucide-react';
import { ScreenType } from '../../types';

interface LearnifySidebarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  onLogout?: () => void;
}

export const LearnifySidebar: React.FC<LearnifySidebarProps> = ({
  currentScreen,
  onNavigate,
  onLogout,
}) => {
  return (
    <aside className="w-16 sm:w-20 bg-[#1E1E21] text-zinc-400 flex flex-col items-center py-5 justify-between shrink-0 select-none z-30 border-r border-zinc-800/80">
      {/* Top Section */}
      <div className="flex flex-col items-center gap-4">
        {/* Logo / Brand mark */}
        <button
          onClick={() => onNavigate('dashboard')}
          aria-label="Re:Learn Platform"
          className="w-10 h-10 rounded-2xl bg-[#FF533D] text-white flex items-center justify-center font-black text-sm shadow-md shadow-orange-500/30 cursor-pointer mb-2"
        >
          RE
        </button>

        {/* Primary Nav Items */}
        <nav className="flex flex-col items-center gap-3">
          {/* Dashboard / All Topics */}
          <button
            onClick={() => onNavigate('dashboard')}
            aria-label="Dashboard"
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-sm relative group ${
              currentScreen === 'dashboard'
                ? 'bg-[#FED867] text-zinc-950 font-bold shadow-amber-400/20 shadow-md scale-105'
                : 'hover:bg-zinc-800/80 hover:text-zinc-100 text-zinc-400'
            }`}
            title="Curriculum Dashboard"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>

          {/* Central Quiz Workspace */}
          <button
            onClick={() => onNavigate('quiz-workspace')}
            aria-label="Quiz Workspace"
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer relative text-zinc-400 hover:text-white hover:bg-zinc-800/60 ${
              currentScreen === 'quiz-workspace'
                ? 'bg-[#FF533D] text-white shadow-md shadow-orange-500/20 scale-105'
                : ''
            }`}
            title="Adaptive Quiz Workspace"
          >
            <Code2 className="w-5 h-5" />
          </button>

          {/* Quick Quiz Engine */}
          <button
            onClick={() => onNavigate('quiz-engine')}
            aria-label="Python Topic Quizzes"
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer text-zinc-400 hover:text-white hover:bg-zinc-800/60 ${
              currentScreen === 'quiz-engine' ? 'bg-zinc-800 text-white' : ''
            }`}
            title="Topic Quiz Engine"
          >
            <Sparkles className="w-5 h-5 text-amber-400" />
          </button>

          {/* Notes / Misconception Log */}
          <button
            onClick={() => onNavigate('notes')}
            aria-label="Misconception Notes"
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer text-zinc-400 hover:text-white hover:bg-zinc-800/60 ${
              currentScreen === 'notes' ? 'bg-zinc-800 text-white' : ''
            }`}
            title="Misconception Notes"
          >
            <Edit3 className="w-5 h-5" />
          </button>

          {/* Discussion */}
          <button
            onClick={() => onNavigate('messages')}
            aria-label="Discussions"
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer relative text-zinc-400 hover:text-white hover:bg-zinc-800/60 ${
              currentScreen === 'messages' ? 'bg-zinc-800 text-white' : ''
            }`}
            title="Tutor Q&A"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-orange-500" />
          </button>

          {/* Bookmarks */}
          <button
            onClick={() => onNavigate('bookmarks')}
            aria-label="Saved Challenges"
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer text-zinc-400 hover:text-white hover:bg-zinc-800/60 ${
              currentScreen === 'bookmarks' ? 'bg-zinc-800 text-white' : ''
            }`}
            title="Saved Problems"
          >
            <Bookmark className="w-5 h-5" />
          </button>
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col items-center gap-3">
        {/* Settings */}
        <button
          onClick={() => onNavigate('settings')}
          aria-label="Settings"
          className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer text-zinc-400 hover:text-white hover:bg-zinc-800/60 ${
            currentScreen === 'settings' ? 'bg-zinc-800 text-white' : ''
          }`}
          title="Settings & Preferences"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* Exit / Log Out Icon */}
        <button
          onClick={() => {
            if (onLogout) {
              onLogout();
            } else {
              onNavigate('dashboard');
            }
          }}
          aria-label="Sign out"
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-rose-400 hover:bg-zinc-800/60 transition-all cursor-pointer"
          title="Sign Out / Switch Student"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
};
