import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { ShieldCheck, Lock, Phone } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenEmergency: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onOpenEmergency }) => {
  const { t } = useTranslation();

  return (
    <footer className="mt-auto bg-slate-900 text-slate-300 border-t border-slate-800 text-xs">
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* Privacy Highlight Badge */}
        <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-white">
              {t('privacy_banner_title')}
            </p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {t('privacy_banner_desc')}
            </p>
            <button
              onClick={onOpenPrivacy}
              className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium text-[11px] underline pt-0.5"
            >
              <Lock className="w-3 h-3" />
              <span>{t('privacy_title')}</span>
            </button>
          </div>
        </div>

        {/* Helpline Row */}
        <div className="flex items-center justify-between py-2 border-y border-slate-800 text-slate-400">
          <div className="flex items-center gap-1.5 font-medium text-slate-300">
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>24x7 Control Room:</span>
          </div>
          <button
            onClick={onOpenEmergency}
            className="text-amber-300 font-bold hover:underline"
          >
            0883-2471100 / 112
          </button>
        </div>

        {/* Govt Attribution */}
        <div className="text-center text-slate-400 space-y-1 pt-1 text-[11px]">
          <p className="font-medium text-slate-300">
            {t('govt_ap')} • {t('event_name')}
          </p>
          <p className="text-slate-400 text-[10px]">
            Designed for live field deployments across 8 Godavari Ghats. AI assists, human officer always verifies.
          </p>
        </div>
      </div>
    </footer>
  );
};
