import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { X, EyeOff, KeyRound, Trash2, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface PrivacyInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyInfoModal: React.FC<PrivacyInfoModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/75 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md max-h-[90vh] bg-white rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-4 bg-[#0f2942] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-800/80 text-amber-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight">
                {t('privacy_title')}
              </h2>
              <p className="text-xs text-blue-200">
                {t('govt_ap')} • Godavari Pushkaralu 2027
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-3.5 text-slate-800">
          {/* Reassurance Alert */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-medium flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {t('privacy_ai_statement')}
            </p>
          </div>

          {/* 4 Privacy Rules Cards */}
          <div className="space-y-2.5">
            {/* Rule 1 */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-red-100 text-red-700">
                  <EyeOff className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">
                  {t('privacy_rule_1_title')}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-8">
                {t('privacy_rule_1_desc')}
              </p>
            </div>

            {/* Rule 2 */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">
                  {t('privacy_rule_2_title')}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-8">
                {t('privacy_rule_2_desc')}
              </p>
            </div>

            {/* Rule 3 */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                  <Trash2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">
                  {t('privacy_rule_3_title')}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-8">
                {t('privacy_rule_3_desc')}
              </p>
            </div>

            {/* Rule 4 */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">
                  {t('privacy_rule_4_title')}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-8">
                {t('privacy_rule_4_desc')}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#0f2942] text-white font-bold rounded-xl text-xs hover:bg-slate-900 active:scale-98 transition-all"
          >
            {t('close_btn')}
          </button>
        </div>
      </div>
    </div>
  );
};
