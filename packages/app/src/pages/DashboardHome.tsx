import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { LayoutDashboard, MapPin, ShoppingCart, BarChart2, Users, Loader2, CheckCircle2, XCircle } from 'lucide-react';

export const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    api.get('/health')
      .then(() => setApiStatus('online'))
      .catch(() => setApiStatus('offline'));
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-teal-600/10 border border-emerald-500/20">
        <h1 className="text-3xl font-black text-white tracking-tight">
          Welcome back, {user?.name || 'User'}
        </h1>
        <p className="text-slate-400 mt-2 text-sm">
          Logged in as <strong className="text-emerald-400">{user?.email}</strong> • Role: <strong className="text-white capitalize">{user?.role}</strong>
        </p>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase">Backend API Status</span>
          <div className="flex items-center gap-2">
            {apiStatus === 'checking' && <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />}
            {apiStatus === 'online' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {apiStatus === 'offline' && <XCircle className="w-5 h-5 text-rose-400" />}
            <span className="text-lg font-bold text-white capitalize">{apiStatus}</span>
          </div>
          <span className="text-xs text-slate-500">Cloudflare Workers Edge API</span>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase">Your Role</span>
          <span className="text-lg font-bold text-white capitalize">{user?.role || 'Unknown'}</span>
          <span className="text-xs text-slate-500">Current active profile</span>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase">Session</span>
          <span className="text-lg font-bold text-emerald-400">Active & Secure</span>
          <span className="text-xs text-slate-500">Better-Auth encrypted session</span>
        </div>
      </div>

      {/* Quick Actions Placeholder */}
      <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
        <LayoutDashboard className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">Dashboard Coming Soon</h3>
        <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
          This dashboard will show real-time campaign performance, booking status, and revenue metrics once the next modules are built.
        </p>
      </div>
    </div>
  );
};
