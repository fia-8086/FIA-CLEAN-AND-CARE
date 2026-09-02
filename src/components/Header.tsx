import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cloud, Settings, Download, LogOut, RefreshCw, KeyRound, Phone } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenBackup: () => void;
  onLogout: () => void;
  onManualSync: () => void;
  syncStatus: { connected: boolean; message: string };
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onOpenBackup,
  onLogout,
  onManualSync,
  syncStatus,
}) => {
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }) +
          ' ' +
          now.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-indigo-950 text-white border-b border-indigo-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Brand matching user exact request */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 text-white rounded-lg flex items-center justify-center font-black text-xl tracking-wider shadow-inner">
            F
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight uppercase">
                FIA CLEAN AND CARE
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-mono uppercase bg-indigo-900 border border-indigo-700 px-2 py-0.5 rounded text-indigo-200">
                PRO
              </span>
            </div>
            <p className="text-xs text-indigo-300 font-semibold flex flex-wrap items-center gap-1.5 mt-0.5">
              <span>Wholesale and Retail</span>
              <span className="text-indigo-500">•</span>
              <span>Edathanattukara</span>
              <span className="text-indigo-500">•</span>
              <span className="font-mono text-indigo-200 flex items-center gap-1">
                <Phone className="w-3 h-3 text-indigo-400 inline" /> Mob: 8086452106
              </span>
            </p>
          </div>
        </div>

        {/* Center / Status */}
        <div className="flex items-center gap-3 text-xs">
          <div className="hidden lg:flex items-center gap-2 bg-indigo-900/60 border border-indigo-800 px-3 py-1.5 rounded text-indigo-200 font-mono">
            <span>{timeString}</span>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-semibold ${
              syncStatus.connected
                ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                : 'bg-amber-950/80 border-amber-700 text-amber-300'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                syncStatus.connected ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span className="hidden sm:inline">{syncStatus.message}</span>
            <span className="sm:hidden">{syncStatus.connected ? 'Cloud OK' : 'Local'}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onManualSync}
            title="Sync Data"
            className="p-2 text-indigo-200 hover:text-white hover:bg-indigo-900 rounded-lg transition border border-transparent hover:border-indigo-700"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenBackup}
            title="Backup / Restore"
            className="p-2 text-indigo-200 hover:text-white hover:bg-indigo-900 rounded-lg transition border border-transparent hover:border-indigo-700"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenSettings}
            title="Settings"
            className="p-2 text-indigo-200 hover:text-white hover:bg-indigo-900 rounded-lg transition border border-transparent hover:border-indigo-700"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={onLogout}
            title="Lock App"
            className="flex items-center gap-1.5 bg-indigo-900/50 hover:bg-rose-900/70 text-indigo-200 hover:text-rose-200 border border-indigo-800 hover:border-rose-800 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lock</span>
          </button>
        </div>
      </div>
    </header>
  );
};
