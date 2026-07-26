import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard, MapPin, Calculator, Layers, Car, Video,
  LogOut, User, Sun, Moon, ShieldAlert, Image as ImageIcon
} from 'lucide-react';

const ROLE_LABELS: Record<string, string> = {
  advertiser: 'Advertiser',
  owner: 'Asset Owner',
  earner: 'Micro-Earner',
  creator: 'Creator',
  enterprise: 'Enterprise',
  admin: 'Super-Admin',
};

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  shortLabel: string;
  roles: string[];
}

const NAV_ITEMS: NavItem[] = [
  { to: '/',          icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard',         shortLabel: 'Home',     roles: ['advertiser', 'owner', 'earner', 'creator', 'enterprise', 'admin'] },
  { to: '/explore',   icon: <MapPin className="w-5 h-5" />,          label: 'Explore Inventory',  shortLabel: 'Explore',  roles: ['advertiser', 'owner', 'enterprise', 'admin'] },
  { to: '/planner',   icon: <Calculator className="w-5 h-5" />,      label: 'Campaign Planner',   shortLabel: 'Planner',  roles: ['advertiser', 'enterprise', 'admin'] },
  { to: '/creatives', icon: <ImageIcon className="w-5 h-5" />,       label: 'Creative Studio',    shortLabel: 'Studio',   roles: ['advertiser', 'owner', 'enterprise', 'admin'] },
  { to: '/owner',     icon: <Layers className="w-5 h-5" />,          label: 'My Assets',          shortLabel: 'Assets',   roles: ['owner', 'admin'] },
  { to: '/earner',    icon: <Car className="w-5 h-5" />,             label: 'Earn Tasks',         shortLabel: 'Earn',     roles: ['earner', 'admin'] },
  { to: '/creator',   icon: <Video className="w-5 h-5" />,           label: 'Creator Hub',        shortLabel: 'Create',   roles: ['creator', 'admin'] },
  { to: '/admin',     icon: <ShieldAlert className="w-5 h-5 text-rose-400" />, label: 'Admin Panel', shortLabel: 'Admin', roles: ['admin'] },
];

const navLinkClasses = (isActive: boolean) =>
  isActive
    ? 'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600/15 text-emerald-400 border border-emerald-500/20'
    : 'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors';

export const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const role = user?.role || 'advertiser';
  const filteredItems = NAV_ITEMS.filter(item => item.roles.includes(role));
  const mobileItems = filteredItems.slice(0, 5);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[240px] shrink-0 border-r border-slate-800 bg-slate-950 sticky top-0 h-dvh overflow-y-auto">
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-sm shadow-md">
              OG
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-white tracking-tight">OMNI-GRID</h1>
              <span className="text-[10px] text-emerald-400 font-semibold">PAKISTAN</span>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div className="px-5 mb-4">
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{ROLE_LABELS[user.role] || user.role}</p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 px-3 space-y-0.5">
          {filteredItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => navLinkClasses(isActive)}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-xs">
            OG
          </div>
          <span className="text-sm font-extrabold text-white">OMNI-GRID</span>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-400"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-sm border-t border-slate-800 pb-safe">
        <nav className="flex items-center justify-around px-1 pt-1.5 pb-1">
          {mobileItems.map(item => {
            const isActive = item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to);
            return (
              <NavLink key={item.to} to={item.to} className="flex flex-col items-center gap-0.5 py-1 px-2">
                <div className={isActive ? 'text-emerald-400' : 'text-slate-500'}>{item.icon}</div>
                <span className={`text-[10px] font-semibold ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {item.shortLabel}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </>
  );
};
