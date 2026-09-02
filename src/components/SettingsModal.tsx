import React, { useState } from 'react';
import {
  X,
  Download,
  Upload,
  Database,
  CheckCircle2,
  AlertCircle,
  Trash2,
  AlertTriangle,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import { exportJSONBackup } from '../utils/formatters';

interface SettingsModalProps {
  isOpen: boolean;
  allData: unknown;
  onClose: () => void;
  onRestoreBackup: (data: any) => void;
  onClearAllData?: () => void;
  appPin?: string;
  onUpdatePin?: (newPin: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  allData,
  onClose,
  onRestoreBackup,
  onClearAllData,
  appPin,
  onUpdatePin,
}) => {
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');
  const [showPinInput, setShowPinInput] = useState(false);
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);

  if (!isOpen) return null;

  const handleDownloadBackup = () => {
    try {
      const dateStr = new Date().toISOString().split('T')[0];
      const filename = `FIA_CLEAN_CARE_BACKUP_${dateStr}.json`;
      exportJSONBackup(
        {
          backupVersion: 2,
          app: 'FIA CLEAN & CARE',
          createdAt: new Date().toISOString(),
          data: allData,
        },
        filename
      );
      setStatusMessage({
        type: 'success',
        text: 'Backup file downloaded successfully!',
      });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: 'Failed to download backup file.',
      });
    }
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = String(event.target?.result || '').trim();
        const json = JSON.parse(text);
        const data = json.data || json;
        onRestoreBackup(data);
        setStatusMessage({
          type: 'success',
          text: 'Backup restored successfully! All data updated.',
        });
        setTimeout(() => {
          setStatusMessage(null);
          onClose();
        }, 1200);
      } catch (err) {
        console.error(err);
        setStatusMessage({
          type: 'error',
          text: 'Invalid backup file. Please choose a valid JSON file.',
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-xl max-w-sm w-full p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Data Backup & Restore
              </h3>
              <p className="text-[11px] text-slate-500">Manage your business data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Message Notification */}
        {statusMessage && (
          <div
            className={`p-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Actions Container */}
        <div className="space-y-3">
          {/* Download JSON Backup */}
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Download JSON Backup</span>
            </button>
            <p className="text-[10px] text-slate-500 text-center">
              Saves full copy of all invoices, products, customers & day book
            </p>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-2 text-[10px] font-bold text-slate-400 uppercase">OR</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Restore from File */}
          <div className="space-y-1.5">
            <label className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 px-4 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs">
              <Upload className="w-4 h-4" />
              <span>Restore from File</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleRestoreFile}
                className="hidden"
              />
            </label>
            <p className="text-[10px] text-slate-500 text-center">
              Restore previously downloaded JSON backup file
            </p>
          </div>

          {/* Security PIN / Password Settings */}
          {onUpdatePin && (
            <div className="pt-3 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                    <span>System Lock Password / PIN</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Active password required when unlocking after logout
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowPinInput(!showPinInput);
                    setNewPinInput('');
                  }}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
                >
                  {showPinInput ? 'Cancel' : 'Change Password'}
                </button>
              </div>

              {/* Current Active Password display */}
              <div className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 text-xs">
                <span className="text-[11px] text-slate-600 font-medium">Currently Active Password:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 tracking-wider">
                    {showCurrentPin ? (appPin || 'None') : '••••••••'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowCurrentPin(!showCurrentPin)}
                    className="text-slate-500 hover:text-slate-800 p-0.5"
                    title={showCurrentPin ? 'Hide Password' : 'Show Password'}
                  >
                    {showCurrentPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {showPinInput && (
                <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-200 space-y-2.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">
                      Enter New System Password / PIN:
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPin ? 'text' : 'password'}
                        placeholder="Enter new password"
                        value={newPinInput}
                        onChange={(e) => setNewPinInput(e.target.value)}
                        className="w-full bg-white border border-slate-300 p-2 pr-9 rounded text-xs font-mono font-bold tracking-wider outline-none focus:border-indigo-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPin(!showNewPin)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      >
                        {showNewPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const trimmed = newPinInput.trim();
                      if (trimmed.length < 2) {
                        setStatusMessage({
                          type: 'error',
                          text: 'Password must be at least 2 characters.',
                        });
                        return;
                      }
                      onUpdatePin(trimmed);
                      setShowPinInput(false);
                      setNewPinInput('');
                      setStatusMessage({
                        type: 'success',
                        text: `Active password updated to "${trimmed}"! Use this for future sign-in/unlock.`,
                      });
                      setTimeout(() => setStatusMessage(null), 3500);
                    }}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Save & Update Active Password</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Reset / Clear Data to Empty FIA Slate */}
          {onClearAllData && (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              {!showClearConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(true)}
                  className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset / Clear All Records (Fresh Start)</span>
                </button>
              ) : (
                <div className="bg-rose-50 p-3 rounded-lg border border-rose-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Clear all data and start completely fresh?</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    This will clear all stock, bills, customers, and day book entries. Make sure you have downloaded a backup if needed.
                  </p>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        onClearAllData();
                        setShowClearConfirm(false);
                        setStatusMessage({
                          type: 'success',
                          text: 'All records cleared. System is completely clean!',
                        });
                        setTimeout(() => {
                          setStatusMessage(null);
                          onClose();
                        }, 1200);
                      }}
                      className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-1.5 rounded text-xs font-bold shadow-xs transition"
                    >
                      Yes, Clear All
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowClearConfirm(false)}
                      className="px-3 bg-white text-slate-700 border border-slate-300 py-1.5 rounded text-xs font-semibold hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info & close */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-mono">FIA Clean & Care v2.0</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
