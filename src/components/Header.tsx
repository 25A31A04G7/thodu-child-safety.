import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { PhoneCall, Globe, ArrowLeft, Shield } from 'lucide-react';

interface HeaderProps {
  currentScreen: string;
  onNavigateHome: () => void;
  onOpenEmergency: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigateHome,
  onOpenEmergency,
}) => {
  const { t, language, toggleLanguage } = useTranslation();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Govt Bar */}
      <div className="bg-[#0f2942] text-white px-3 py-1.5 flex items-center justify-between text-xs tracking-wide">
        <div className="flex items-center gap-1.5 font-medium">
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span className="truncate">{t('govt_ap')}</span>
          <span className="text-slate-400 hidden xs:inline">•</span>
          <span className="text-amber-300 font-semibold hidden xs:inline">{t('police_dept')}</span>
        </div>
        <div className="text-[11px] text-amber-200 font-medium">
          పుష్కరాలు 2027
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-md mx-auto px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {currentScreen !== 'home' && (
            <button
              onClick={onNavigateHome}
              aria-label="Back"
              className="p-2 -ml-1 text-slate-700 hover:text-slate-900 active:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0f2942] to-blue-700 flex items-center justify-center text-white shadow-xs">
              <span className="text-base font-bold font-serif">తో</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <h1 className="font-bold text-lg text-slate-900 tracking-tight">
                  {language === 'te' ? 'తోడు' : 'Thodu'}
                </h1>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-800 border border-amber-300">
                  {language === 'te' ? 'రక్షణ' : '2027'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                {language === 'te' ? 'పుష్కరాల రక్షణ వ్యవస్థ' : 'Pushkaralu Child Safety'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all shadow-2xs"
            aria-label="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-blue-700" />
            <span>{language === 'te' ? 'English' : 'తెలుగు'}</span>
          </button>

          {/* 112 Emergency Button */}
          <button
            onClick={onOpenEmergency}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold transition-all shadow-xs"
            aria-label="Call Emergency 112"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
            <span>112</span>
          </button>
        </div>
      </div>
    </header>
  );
};
