import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { POLICE_BOOTHS } from '../data/booths';
import { X, PhoneCall, ShieldAlert, MapPin, Building2 } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  const { t, language } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md max-h-[85vh] bg-white rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-4 bg-red-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-amber-300" />
            <div>
              <h2 className="font-bold text-base leading-tight">
                {language === 'te' ? 'అత్యవసర పోలీసు హెల్ప్‌లైన్' : 'Emergency Police Helplines'}
              </h2>
              <p className="text-xs text-red-100">
                {language === 'te' ? 'గోదావరి పుష్కరాలు 2027 రాజమహేంద్రవరం' : 'Godavari Pushkaralu 2027'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-red-700 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-slate-800">
          {/* Quick Call Emergency Cards */}
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href="tel:112"
              className="p-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl flex flex-col items-center text-center transition-all active:scale-95 shadow-2xs"
            >
              <PhoneCall className="w-6 h-6 text-red-600 mb-1" />
              <span className="text-xl font-black text-red-700 tracking-wide">112</span>
              <span className="text-xs font-semibold text-slate-700">
                {language === 'te' ? 'పోలీస్ కంట్రోల్ రూమ్' : 'AP Police Emergency'}
              </span>
            </a>

            <a
              href="tel:1098"
              className="p-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl flex flex-col items-center text-center transition-all active:scale-95 shadow-2xs"
            >
              <PhoneCall className="w-6 h-6 text-amber-600 mb-1" />
              <span className="text-xl font-black text-amber-700 tracking-wide">1098</span>
              <span className="text-xs font-semibold text-slate-700">
                {language === 'te' ? 'చైల్డ్ లైన్ హెల్ప్' : 'Child Helpline'}
              </span>
            </a>
          </div>

          {/* Central Pushkaralu Control */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-blue-700" />
                {language === 'te' ? 'పుష్కరాల కేంద్ర కంట్రోల్ రూమ్' : 'Pushkaralu Main Control'}
              </p>
              <p className="text-xs text-slate-500 font-mono">0883-2471100 / 2471199</p>
            </div>
            <a
              href="tel:08832471100"
              className="px-3 py-1.5 bg-[#0f2942] text-white rounded-lg text-xs font-bold hover:bg-blue-900 active:scale-95 transition-all"
            >
              {language === 'te' ? 'కాల్ చేయండి' : 'Call'}
            </a>
          </div>

          {/* Booth Helplines List */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === 'te' ? '8 పోలీస్ బూత్ ప్రత్యక్ష నంబర్లు' : 'All 8 Police Bot Booth Helplines'}
            </h3>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {POLICE_BOOTHS.map((b) => (
                <div
                  key={b.id}
                  className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-blue-300 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5 max-w-[70%]">
                    <p className="font-bold text-slate-900 flex items-center gap-1">
                      <span className="inline-block w-4 h-4 rounded-full bg-blue-100 text-blue-800 text-center font-mono font-bold leading-4 text-[10px]">
                        {b.number}
                      </span>
                      {language === 'te' ? b.nameTelugu : b.name}
                    </p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{language === 'te' ? b.landmarkTelugu : b.landmark}</span>
                    </p>
                  </div>
                  <a
                    href={`tel:${b.phone}`}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 active:scale-95 transition-all text-xs border border-blue-200"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>{t('call_now')}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 text-white font-bold rounded-xl text-xs hover:bg-slate-900 active:scale-98 transition-all"
          >
            {t('close_btn')}
          </button>
        </div>
      </div>
    </div>
  );
};
