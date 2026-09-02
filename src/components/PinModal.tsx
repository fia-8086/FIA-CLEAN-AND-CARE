import React, { useState } from 'react';
import { Lock, KeyRound, Shield, Eye, EyeOff, X, CheckCircle2, ShieldCheck } from 'lucide-react';

interface PinModalProps {
  isOpen: boolean;
  appPin: string;
  onSuccess: () => void;
  onUpdatePin: (newPin: string) => void;
}

export const PinModal: React.FC<PinModalProps> = ({
  isOpen,
  appPin,
  onSuccess,
  onUpdatePin,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetMethod, setResetMethod] = useState<'current' | 'master'>('current');
  const [currentPinCheck, setCurrentPinCheck] = useState('');
  const [masterKey, setMasterKey] = useState('');
  const [newPinDirect, setNewPinDirect] = useState('');
  const [showResetNewPin, setShowResetNewPin] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      setPinInput('');
      setErrorMsg('');
      setShowPassword(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === appPin.trim()) {
      setErrorMsg('');
      setPinInput('');
      onSuccess();
    } else {
      setErrorMsg('തെറ്റായ പാസ്‌വേർഡ്! നിലവിലെ സിസ്റ്റം പാസ്‌വേർഡ് നൽകുക.');
    }
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    if (resetMethod === 'current') {
      if (currentPinCheck.trim() !== appPin.trim()) {
        setResetError('Current password does not match active system password!');
        return;
      }
    } else {
      if (masterKey.trim() !== 'FIA786') {
        setResetError('Invalid Master Recovery Key!');
        return;
      }
    }

    if (newPinDirect.trim().length < 2) {
      setResetError('New password must be at least 2 characters.');
      return;
    }

    const updatedPin = newPinDirect.trim();
    onUpdatePin(updatedPin);
    setResetSuccess(`Password updated successfully to "${updatedPin}"!`);
    setTimeout(() => {
      setShowResetModal(false);
      setCurrentPinCheck('');
      setMasterKey('');
      setNewPinDirect('');
      setResetSuccess('');
      setResetError('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-xl max-w-sm w-full p-6 shadow-2xl space-y-5 text-center">
        <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-6 h-6" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">FIA CLEAN & CARE</h2>
          <p className="text-xs text-slate-500 mt-1">Enter password to login to the system</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              value={pinInput}
              autoComplete="new-password"
              name="current_system_lock_password"
              onChange={(e) => {
                setPinInput(e.target.value);
                setErrorMsg('');
              }}
              autoFocus
              className="w-full text-center text-lg font-mono font-bold p-3 pr-10 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-indigo-600 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
              title={showPassword ? 'Hide Password' : 'Show Password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {errorMsg && (
            <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-xs font-bold text-rose-600 animate-in fade-in">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold text-xs tracking-wider shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>LOGIN</span>
          </button>
        </form>

        <div className="flex justify-between items-center text-xs text-slate-400 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              setShowResetModal(true);
              setResetError('');
              setResetSuccess('');
              setCurrentPinCheck('');
              setNewPinDirect('');
              setMasterKey('');
            }}
            className="text-indigo-600 hover:underline font-semibold flex items-center gap-1"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Change / Reset Password</span>
          </button>
          <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
            <Shield className="w-3 h-3 text-emerald-600" /> Active System PIN
          </span>
        </div>
      </div>

      {/* Change / Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-slate-950/90 z-60 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-sm w-full p-6 space-y-4 text-left shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-indigo-600" />
                <span>Update System Password</span>
              </h3>
              <button
                onClick={() => setShowResetModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Method switch: with current password OR with master key */}
            <div className="flex bg-slate-100 p-1 rounded-lg text-[11px] font-bold">
              <button
                type="button"
                onClick={() => {
                  setResetMethod('current');
                  setResetError('');
                }}
                className={`flex-1 py-1.5 rounded-md transition ${
                  resetMethod === 'current'
                    ? 'bg-white text-indigo-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Using Current Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setResetMethod('master');
                  setResetError('');
                }}
                className={`flex-1 py-1.5 rounded-md transition ${
                  resetMethod === 'master'
                    ? 'bg-white text-indigo-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Forgot? (Master Key)
              </button>
            </div>

            {resetError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs font-bold text-rose-700">
                {resetError}
              </div>
            )}

            {resetSuccess && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{resetSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePasswordUpdate} className="space-y-3">
              {resetMethod === 'current' ? (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Current Active Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    value={currentPinCheck}
                    onChange={(e) => setCurrentPinCheck(e.target.value)}
                    required
                    className="w-full border border-slate-300 p-2 rounded-lg text-xs font-mono outline-none focus:border-indigo-600"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Master Recovery Key</label>
                  <input
                    type="password"
                    placeholder="Default master key (FIA786)"
                    value={masterKey}
                    onChange={(e) => setMasterKey(e.target.value)}
                    required
                    className="w-full border border-slate-300 p-2 rounded-lg text-xs font-mono outline-none focus:border-indigo-600"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">New Password / PIN</label>
                <div className="relative">
                  <input
                    type={showResetNewPin ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={newPinDirect}
                    onChange={(e) => setNewPinDirect(e.target.value)}
                    required
                    className="w-full border border-slate-300 p-2 pr-9 rounded-lg text-xs font-mono outline-none focus:border-indigo-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetNewPin(!showResetNewPin)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showResetNewPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 shadow-xs"
                >
                  Save Active Password
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="px-3 bg-slate-100 text-slate-600 py-2 rounded-lg text-xs font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
