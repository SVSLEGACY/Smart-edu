import React from 'react';
import {
  Folder,
  Edit3,
  MessageSquare,
  Bookmark,
  Headphones,
  Settings,
  LogOut,
  LayoutGrid,
  Sparkles,
} from 'lucide-react';
import { ScreenType } from '../../types';

interface LearnifySidebarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export const LearnifySidebar: React.FC<LearnifySidebarProps> = ({
  currentScreen,
  onNavigate,
}) => {
  const isCoursesActive = currentScreen === 'dashboard' || currentScreen === 'course-player';

  return (
    <aside className="w-16 sm:w-20 bg-[#1E1E21] text-zinc-400 flex flex-col items-center py-5 justify-between shrink-0 select-none z-30 border-r border-zinc-800/80">
      {/* Top Brand / Grid Logo */}
      <div className="flex flex-col items-center gap-6">
        <button
          onClick={() => onNavigate('dashboard')}
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-all cursor-pointer"
          title="RE:LEARN Home"
        >
          {/* 4 dots grid icon from screenshot */}
          <div className="grid grid-cols-2 gap-1.5 p-1">
            <span className="w-2 h-2 rounded-full border-2 border-current" />
            <span className="w-2 h-2 rounded-full border-2 border-current" />
            <span className="w-2 h-2 rounded-full border-2 border-current" />
            <span className="w-2 h-2 rounded-full border-2 border-current" />
          </div>
        </button>

        {/* Primary Nav Items */}
        <nav className="flex flex-col items-center gap-3">
          {/* Courses Folder (Active in screenshot with yellow rounded squircle #FED867) */}
          <button
            onClick={() => onNavigate('dashboard')}
            aria-label="Courses"
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-sm relative group ${
              isCoursesActive
                ? 'bg-[#FED867] text-zinc-950 font-bold shadow-amber-400/20 shadow-md scale-105'
                : 'hover:bg-zinc-800/80 hover:text-zinc-100 text-zinc-400'
            }`}
          >
            <Folder className={`w-6 h-6 ${isCoursesActive ? 'fill-zinc-950 text-zinc-950' : ''}`} />
            <span className="sr-only">My Courses</span>
          </button>

          {/* Notes / Notebook */}
          <button
            onClick={() => onNavigate('notes')}
            aria-label="Notes"
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer text-zinc-400 hover:text-white hover:bg-zinc-800/60 ${
              currentScreen === 'notes' ? 'bg-zinc-800 text-white' : ''
            }`}
            title="Study Notes"
          >
            <Edit3 className="w-5 h-5" />
          </button>

          {/* Chat / Messages */}
          <button
            onClick={() => onNavigate('messages')}
            aria-label="Messages"
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer relative text-zinc-400 hover:text-white hover:bg-zinc-800/60 ${
              currentScreen === 'messages' ? 'bg-zinc-800 text-white' : ''
            }`}
            title="Discussion & Chat"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-orange-500" />
          </button>

          {/* Widgets / 4 squares */}
          <button
            onClick={() => onNavigate('dashboard')}
            aria-label="Overview"
            className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer text-zinc-400 hover:text-white hover:bg-zinc-800/60"
            title="Widgets & Overview"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>

          {/* Bookmarks */}
          <button
            onClick={() => onNavigate('bookmarks')}
            aria-label="Saved Courses"
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer text-zinc-400 hover:text-white hover:bg-zinc-800/60 ${
              currentScreen === 'bookmarks' ? 'bg-zinc-800 text-white' : ''
            }`}
            title="Saved & Bookmarked"
          >
            <Bookmark className="w-5 h-5" />
          </button>

          {/* Audio / Podcasts */}
          <button
            onClick={() => onNavigate('dashboard')}
            aria-label="Audio Learning"
            className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer text-zinc-400 hover:text-white hover:bg-zinc-800/60"
            title="Audio Learning & Podcasts"
          >
            <Headphones className="w-5 h-5" />
          </button>

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
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col items-center gap-3">
        {/* Exit / Log Out Icon */}
        <button
          onClick={() => onNavigate('dashboard')}
          aria-label="Sign out"
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-rose-400 hover:bg-zinc-800/60 transition-all cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
};
