import React, { useState } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import { Shield, Lock, User, AlertCircle, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface PoliceLoginViewProps {
  onLoginSuccess: (officer: { username: string; name: string; boothId: string; boothName: string }) => void;
  onCancel: () => void;
}

export const PoliceLoginView: React.FC<PoliceLoginViewProps> = ({
  onLoginSuccess,
  onCancel,
}) => {
  const { language } = useTranslation();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleQuickFillDemo = () => {
    setUsername('booth01');
    setPassword('demo123');
    setError('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError(
        language === 'te'
          ? 'యూజర్‌నేమ్ మరియు పాస్‌వర్డ్ రెండూ నమోదు చేయండి'
          : 'Please enter both username and password'
      );
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Validate credentials strictly: booth01 / demo123
      if (username.trim().toLowerCase() === 'booth01' && password === 'demo123') {
        setIsLoading(false);
        onLoginSuccess({
          username: 'booth01',
          name: 'SI K. Ramanjaneyulu (AP-RJY-104)',
          boothId: 'booth-1',
          boothName: 'Pushkar Ghat Central Booth (బూత్ #1)',
        });
      } else {
        setIsLoading(false);
        setError(
          language === 'te'
            ? 'సరైన వివరాలు కావు! దయచేసి డెమో వివరాలు ఉపయోగించండి: booth01 / demo123'
            : 'Invalid credentials! Please use official demo login: booth01 / demo123'
        );
      }
    }, 400);
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4 animate-fadeIn">
      {/* Top Back Nav */}
      <div className="flex items-center gap-2">
        <button
          onClick={onCancel}
          className="p-2 -ml-2 text-slate-700 hover:text-slate-900 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {language === 'te' ? 'పోలీస్ బూత్ అధికారిక లాగిన్' : 'Police Booth Officer Login'}
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'te' ? 'గోదావరి పుష్కరాలు 2027 • డ్యూటీ కన్సోల్' : 'Godavari Pushkaralu 2027 • Duty Console'}
          </p>
        </div>
      </div>

      {/* Demo Credentials Quick Fill Banner */}
      <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{language === 'te' ? 'హ్యాకథాన్ డెమో లాగిన్ వివరాలు' : 'Hackathon Demo Credentials'}</span>
          </div>
          <button
            type="button"
            onClick={handleQuickFillDemo}
            className="text-[11px] font-bold bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-2.5 py-1 rounded-lg transition-all"
          >
            {language === 'te' ? 'ఆటో-ఫిల్ చేయండి' : 'Quick Auto-Fill'}
          </button>
        </div>
        <div className="text-xs text-slate-700 font-mono space-y-0.5 bg-white p-2.5 rounded-xl border border-blue-200">
          <p>
            <span className="text-slate-500 font-sans">{language === 'te' ? 'యూజర్‌నేమ్:' : 'Username:'}</span>{' '}
            <strong className="text-blue-900">booth01</strong>
          </p>
          <p>
            <span className="text-slate-500 font-sans">{language === 'te' ? 'పాస్‌వర్డ్:' : 'Password:'}</span>{' '}
            <strong className="text-blue-900">demo123</strong>
          </p>
        </div>
      </div>

      {/* Login Form */}
      <form
        onSubmit={handleLoginSubmit}
        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4"
      >
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#0f2942] text-amber-400 flex items-center justify-center shadow-md">
          <Shield className="w-7 h-7" />
        </div>

        <div className="text-center space-y-0.5">
          <h3 className="font-bold text-base text-slate-900">
            {language === 'te' ? 'అధికారిక లాగిన్' : 'Officer Authentication'}
          </h3>
          <p className="text-xs text-slate-500">
            {language === 'te' ? 'పుష్కరాల ఘాట్ బూత్ ఆపరేటర్ల కొరకు మాత్రమే' : 'Authorized for AP Police pushkaralu booth personnel'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium">{error}</p>
          </div>
        )}

        {/* Username */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-800">
            {language === 'te' ? 'యూజర్‌నేమ్ / ఆఫీసర్ ఐడీ' : 'Officer ID / Username'}
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. booth01"
              className="w-full pl-9 pr-3 py-3 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-800">
            {language === 'te' ? 'పాస్‌వర్డ్' : 'Password'}
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-14 py-3 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="space-y-2 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full min-h-[56px] py-3.5 bg-[#0f2942] hover:bg-blue-900 active:scale-98 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Shield className="w-4 h-4 text-amber-400" />
            <span>
              {isLoading
                ? (language === 'te' ? 'ధృవీకరిస్తోంది...' : 'Authenticating...')
                : (language === 'te' ? 'పోలీస్ కన్సోల్‌లోకి లాగిన్ అవ్వండి' : 'Sign In to Police Console')}
            </span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            {language === 'te' ? 'హోమ్ పేజీకి తిరిగి వెళ్లండి' : 'Cancel & Return Home'}
          </button>
        </div>

        {/* Privacy & Protocol Guarantee */}
        <div className="pt-2 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5 border-t border-slate-100">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Every access is audited with Officer ID</span>
        </div>
      </form>
    </div>
  );
};
