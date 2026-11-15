import React, { useState } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import { storageService } from '../../services/storageService';
import {
  AlertOctagon,
  HeartHandshake,
  ShieldCheck,
  Search,
  Lock,
  PlayCircle,
  Sparkles,
  ArrowRight,
  MapPin,
  Clock,
  Radio,
  Building
} from 'lucide-react';

interface HomeScreenProps {
  onSelectRole: (role: 'parent_report' | 'finder_report' | 'police_login' | 'parent_status' | 'demo_mode') => void;
  onOpenPrivacy: () => void;
  onTrackCaseId: (caseId: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectRole,
  onOpenPrivacy,
  onTrackCaseId,
}) => {
  const { t, language } = useTranslation();
  const [caseSearchInput, setCaseSearchInput] = useState<string>('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (caseSearchInput.trim()) {
      onTrackCaseId(caseSearchInput.trim().toUpperCase());
    } else {
      onSelectRole('parent_status');
    }
  };

  const missingCases = storageService.getMissingCases();
  const activeCasesCount = missingCases.filter((c) => c.status === 'searching' || c.status === 'possible_match').length;

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      {/* Pushkaralu Live Alert Strip */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white px-3.5 py-2 rounded-xl flex items-center justify-between text-xs shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
          <span className="font-bold tracking-wide">
            {language === 'te' ? 'రాజమహేంద్రవరం పుష్కరాలు 2027 ప్రత్యక్ష సేవలు' : 'Rajamahendravaram Pushkaralu 2027'}
          </span>
        </div>
        <span className="text-[11px] font-medium opacity-90">
          8 {language === 'te' ? 'పోలీస్ బూత్‌లు' : 'Booths'}
        </span>
      </div>

      {/* Hero Headline */}
      <div className="text-center space-y-1.5 pt-1">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
          {t('home_headline')}
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
          {t('home_subheadline')}
        </p>
      </div>

      {/* Prominent Demo Mode Trigger Button */}
      <button
        onClick={() => onSelectRole('demo_mode')}
        className="w-full p-3.5 bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-950 text-white rounded-2xl border border-indigo-700/60 shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-between group"
      >
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-xs font-bold group-hover:scale-105 transition-transform">
            <PlayCircle className="w-5 h-5 text-indigo-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wide text-amber-300">
                {t('demo_mode_btn')}
              </span>
              <span className="text-[10px] bg-amber-400/20 text-amber-200 border border-amber-400/30 px-1.5 py-0.2 rounded font-semibold">
                Hackathon
              </span>
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-1">
              {t('demo_mode_desc')}
            </p>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-amber-300 group-hover:translate-x-1 transition-transform shrink-0" />
      </button>

      {/* 3 LARGE PRIMARY ACTION BUTTONS */}
      <div className="space-y-3 pt-1">
        {/* 1. REPORT MISSING CHILD (RED, MOST PROMINENT) */}
        <button
          onClick={() => onSelectRole('parent_report')}
          className="w-full min-h-[64px] p-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 active:scale-98 text-white rounded-2xl shadow-md border-2 border-red-500 flex items-center justify-between text-left transition-all group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0 border border-white/20">
              <AlertOctagon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="text-base font-bold tracking-wide block leading-tight">
                {t('report_missing_title')}
              </span>
              <span className="text-xs text-red-100 font-normal leading-tight line-clamp-1 mt-0.5">
                {t('report_missing_desc')}
              </span>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-red-200 group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
        </button>

        {/* 2. I FOUND A CHILD (EMERALD / TEAL) */}
        <button
          onClick={() => onSelectRole('finder_report')}
          className="w-full min-h-[64px] p-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 active:scale-98 text-white rounded-2xl shadow-md border-2 border-emerald-500 flex items-center justify-between text-left transition-all group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0 border border-white/20">
              <HeartHandshake className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="text-base font-bold tracking-wide block leading-tight">
                {t('found_child_title')}
              </span>
              <span className="text-xs text-emerald-100 font-normal leading-tight line-clamp-1 mt-0.5">
                {t('found_child_desc')}
              </span>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-emerald-200 group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
        </button>

        {/* 3. POLICE BOOTH LOGIN (DEEP NAVY / SLATE) */}
        <button
          onClick={() => onSelectRole('police_login')}
          className="w-full min-h-[58px] p-3.5 bg-[#0f2942] hover:bg-slate-900 active:scale-98 text-white rounded-2xl shadow-sm border border-slate-700 flex items-center justify-between text-left transition-all group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-800/60 flex items-center justify-center shrink-0 border border-blue-600/40">
              <Building className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white block leading-tight">
                  {t('police_login_title')}
                </span>
                <span className="text-[10px] bg-blue-500/30 text-blue-200 px-1.5 py-0.2 rounded font-mono">
                  booth01
                </span>
              </div>
              <span className="text-xs text-slate-300 font-normal leading-tight line-clamp-1 mt-0.5">
                {t('police_login_desc')}
              </span>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
        </button>
      </div>

      {/* QUICK STATUS TRACKING FORM */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-blue-700" />
            {t('check_status_title')}
          </span>
          <span className="text-[11px] font-semibold text-slate-500">
            {activeCasesCount} {language === 'te' ? 'యాక్టివ్ కేసులు' : 'Active Cases'}
          </span>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            type="text"
            value={caseSearchInput}
            onChange={(e) => setCaseSearchInput(e.target.value.toUpperCase())}
            placeholder={t('check_status_placeholder')}
            className="flex-1 px-3 py-2.5 border border-slate-300 rounded-xl text-xs font-mono font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-[#0f2942] hover:bg-blue-900 text-white rounded-xl text-xs font-bold shadow-2xs active:scale-95 transition-all"
          >
            {t('check_status_btn')}
          </button>
        </form>
      </div>

      {/* PRIVACY COMMITMENT CARD */}
      <div
        onClick={onOpenPrivacy}
        className="p-3.5 bg-blue-50/70 border border-blue-200 hover:border-blue-300 rounded-2xl flex items-start gap-3 cursor-pointer transition-colors group shadow-2xs"
      >
        <div className="p-2 rounded-xl bg-blue-100 text-blue-800 shrink-0 group-hover:bg-blue-200 transition-colors">
          <Lock className="w-4 h-4 text-blue-900" />
        </div>
        <div className="space-y-0.5 flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-900">
              {t('privacy_banner_title')}
            </h4>
            <span className="text-[11px] text-blue-700 font-semibold group-hover:underline">
              {language === 'te' ? 'వివరాలు →' : 'Details →'}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            {t('privacy_banner_desc')}
          </p>
        </div>
      </div>
    </div>
  );
};
