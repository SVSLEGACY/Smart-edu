import React, { useState } from 'react';
import { Search, Bell, Check, ChevronDown, Sparkles, LogOut, GraduationCap, Flame } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { ThemeToggle } from '../common/ThemeToggle';
import { currentUser as defaultUser } from '../../data/mockData';
import { Course, UserProfile } from '../../types';

interface LearnifyHeaderProps {
  onSearch?: (query: string) => void;
  onSelectCourse?: (courseId: string) => void;
  onLaunchQuiz?: () => void;
  onOpenStreak?: () => void;
  currentUser?: UserProfile;
  onLogout?: () => void;
  streak?: number;
  completedTaskIds?: string[];
  courses: Course[];
}

export const LearnifyHeader: React.FC<LearnifyHeaderProps> = ({
  onSearch,
  onSelectCourse,
  onLaunchQuiz,
  onOpenStreak,
  currentUser = defaultUser,
  onLogout,
  streak,
  completedTaskIds = [],
  courses,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const filteredResults = searchQuery.trim()
    ? courses.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    onSearch?.(val);
  };

  const notifications = [
    { id: 1, title: 'New lesson available', desc: 'Chapter 03: Creating clear and engaging messages is now unlocked.', time: '10m ago' },
    { id: 2, title: 'Live Q&A tomorrow', desc: 'Saira Goodman is hosting a public speaking feedback workshop at 4 PM.', time: '2h ago' },
    { id: 3, title: 'Quiz completed', desc: 'You scored 100% on the Geographic Border challenge!', time: '1d ago' },
  ];

  return (
    <header className="relative w-full h-18 px-6 flex items-center justify-between border-b border-zinc-200/70 dark:border-zinc-800/80 bg-white/70 dark:bg-[#161619]/80 backdrop-blur-md z-20">
      {/* Left: Brand Welcome */}
      <div className="flex items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight select-none">
          <span className="text-zinc-500 dark:text-zinc-400 font-normal mr-1.5 text-base sm:text-lg">
            Welcome to
          </span>
          <span className="text-[#FF533D] font-black tracking-tight">RE:</span>
          <span className="text-zinc-900 dark:text-white font-black tracking-tight">LEARN</span>
        </h1>
      </div>

      {/* Right Controls: Search, View Mode, Theme, Notifications, Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search Bar matching screenshot */}
        <div className="relative">
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800/90 rounded-full pl-4 pr-1 py-1 border border-zinc-200/70 dark:border-zinc-700/60 focus-within:border-orange-500/60 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all w-48 sm:w-64 md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setIsSearching(true)}
              onBlur={() => setTimeout(() => setIsSearching(false), 200)}
              placeholder="Search courses, lessons, topics..."
              className="w-full bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-hidden"
            />
            {/* Orange search button squircle from screenshot */}
            <button
              onClick={() => onSearch?.(searchQuery)}
              aria-label="Search"
              className="w-8 h-8 rounded-full bg-[#FF533D] hover:bg-[#FF4128] text-white flex items-center justify-center shrink-0 shadow-xs cursor-pointer transition-all active:scale-95"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Search Dropdown Results */}
          {isSearching && searchQuery.trim() && (
            <div className="absolute top-12 left-0 right-0 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {filteredResults.length > 0 ? (
                <div className="flex flex-col gap-1">
                  <div className="px-3 py-1 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                    Matching Courses
                  </div>
                  {filteredResults.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        onSelectCourse?.(c.id);
                        setSearchQuery('');
                      }}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-orange-50 dark:hover:bg-zinc-700/60 text-left transition-colors cursor-pointer group"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-[#FF533D]">
                          {c.title}
                        </span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          {c.category} · {c.totalLessons} lessons
                        </span>
                      </div>
                      <span className="text-xs font-medium text-orange-600 dark:text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        Open →
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-center text-xs text-zinc-500 dark:text-zinc-400">
                  No courses matching "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Streak & Monthly Calendar Button */}
        <button
          onClick={() => onOpenStreak?.()}
          className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 dark:from-orange-950/40 dark:to-amber-950/40 dark:hover:from-orange-950/70 dark:hover:to-amber-950/70 border border-orange-200/80 dark:border-orange-800/60 text-orange-600 dark:text-orange-400 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 group shrink-0"
          title={`Active Learning Streak: ${streak ?? currentUser?.streak ?? 5} days 🔥 (Click to view Monthly Streak Calendar)`}
        >
          <span className="relative flex items-center justify-center">
            <Flame className="w-4 h-4 text-[#FF533D] fill-[#FF533D] group-hover:scale-110 transition-transform shrink-0" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping opacity-75" />
          </span>
          <span className="font-extrabold font-mono text-zinc-900 dark:text-white tabular-nums text-xs sm:text-sm">
            {streak ?? currentUser?.streak ?? 5}
          </span>
          <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 tracking-tight">
            Day Streak
          </span>
        </button>

        {/* Dark Mode Switcher */}
        <ThemeToggle />

        {/* Notification Bell matching screenshot */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="w-10 h-10 rounded-full border border-zinc-200/80 dark:border-zinc-700/70 bg-white dark:bg-zinc-800/90 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 flex items-center justify-center text-zinc-700 dark:text-zinc-200 shadow-xs transition-all relative cursor-pointer active:scale-95"
          >
            <Bell className="w-4 h-4" />
            {currentUser.notificationsCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FF533D] ring-2 ring-white dark:ring-zinc-800 animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-700">
                <span className="font-semibold text-xs text-zinc-900 dark:text-white">Notifications</span>
                <span className="text-[11px] text-orange-500 font-medium cursor-pointer hover:underline">
                  Mark all as read
                </span>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{n.title}</span>
                      <span className="text-[10px] text-zinc-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill matching screenshot (Avatar + Kacie Velasquez + @k_velasquez) */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left cursor-pointer"
          >
            <Avatar name={currentUser.name} size="sm" />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{currentUser.name}</span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                {currentUser.rollNumber || currentUser.handle}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 ml-0.5" />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-64 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-xl p-2 z-50">
              <div className="px-3 py-2.5 border-b border-zinc-100 dark:border-zinc-700">
                <p className="text-xs font-bold text-zinc-900 dark:text-white">{currentUser.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400">
                    {currentUser.rollNumber || 'PY-STUDENT'}
                  </span>
                  <span className="text-[10px] text-zinc-400 truncate">{currentUser.handle}</span>
                </div>
                {currentUser.department && (
                  <p className="text-[10px] text-zinc-400 mt-1 truncate">{currentUser.department}</p>
                )}
              </div>
              <div className="py-1">
                <div className="px-3 py-1.5 text-xs text-zinc-500 dark:text-zinc-400 flex justify-between">
                  <span>Enrolled Tracks</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">4 Python Topics</span>
                </div>
                <div className="px-3 py-1.5 text-xs text-zinc-500 dark:text-zinc-400 flex justify-between">
                  <span>Portal Status</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Active Student</span>
                  </span>
                </div>
              </div>
              {onLogout && (
                <div className="pt-1.5 border-t border-zinc-100 dark:border-zinc-700">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                    className="w-full px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log out / Switch Student</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
