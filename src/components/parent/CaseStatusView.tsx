import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import { storageService } from '../../services/storageService';
import { POLICE_BOOTHS } from '../../data/booths';
import { MissingCase, PoliceBooth } from '../../types';
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  PhoneCall,
  ShieldCheck,
  AlertTriangle,
  KeyRound,
  Navigation,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface CaseStatusViewProps {
  initialCaseId?: string;
  onNavigateHome: () => void;
  onOpenBoothMap?: (boothId: string) => void;
}

export const CaseStatusView: React.FC<CaseStatusViewProps> = ({
  initialCaseId,
  onNavigateHome: _onNavigateHome,
  onOpenBoothMap,
}) => {
  const { t, language } = useTranslation();
  const [searchId, setSearchId] = useState<string>(initialCaseId || '');
  const [currentCase, setCurrentCase] = useState<MissingCase | null>(null);
  const [matchedBooth, setMatchedBooth] = useState<PoliceBooth | null>(null);
  const [searchAttempted, setSearchAttempted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const loadCase = (id: string) => {
    if (!id.trim()) return;
    const found = storageService.getMissingCaseById(id.trim());
    if (found) {
      setCurrentCase(found);
      setErrorMsg('');
      if (found.matchedBoothId) {
        const b = POLICE_BOOTHS.find((item) => item.id === found.matchedBoothId);
        setMatchedBooth(b || POLICE_BOOTHS[0]);
      } else {
        setMatchedBooth(null);
      }
    } else {
      setCurrentCase(null);
      setMatchedBooth(null);
      setErrorMsg(
        language === 'te'
          ? 'కేస్ నంబర్ కనుగొనబడలేదు. దయచేసి సరైన నంబర్ నమోదు చేయండి.'
          : 'Case ID not found. Please verify and try again.'
      );
    }
    setSearchAttempted(true);
  };

  useEffect(() => {
    if (initialCaseId) {
      loadCase(initialCaseId);
    } else {
      // Auto-load last active case or first seed case for convenience
      const lastId = storageService.getActiveCaseId();
      if (lastId) {
        setSearchId(lastId);
        loadCase(lastId);
      } else {
        const cases = storageService.getMissingCases();
        if (cases.length > 0) {
          setSearchId(cases[0].id);
          loadCase(cases[0].id);
        }
      }
    }

    const unsub = storageService.subscribe(() => {
      if (searchId) {
        const updated = storageService.getMissingCaseById(searchId);
        if (updated) {
          setCurrentCase(updated);
          if (updated.matchedBoothId) {
            const b = POLICE_BOOTHS.find((item) => item.id === updated.matchedBoothId);
            setMatchedBooth(b || POLICE_BOOTHS[0]);
          }
        }
      }
    });

    return unsub;
  }, [initialCaseId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadCase(searchId);
  };

  // Sample quick select buttons for quick testing
  const allCases = storageService.getMissingCases();

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      {/* Title */}
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          {t('case_status_title')}
        </h2>
        <p className="text-xs text-slate-500">
          {language === 'te'
            ? 'మీ కేస్ నంబర్ ద్వారా ప్రత్యక్ష స్థితిని తెలుసుకోండి'
            : 'Live child search progress across all Pushkaralu booths'}
        </p>
      </div>

      {/* Case Search Form */}
      <form onSubmit={handleSearchSubmit} className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value.toUpperCase())}
              placeholder={t('check_status_placeholder')}
              className="w-full pl-9 pr-3 py-3 border border-slate-300 rounded-xl text-sm font-mono font-bold tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-600 uppercase"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-3 bg-[#0f2942] hover:bg-blue-900 text-white font-bold rounded-xl text-xs shadow-xs active:scale-95 transition-all"
          >
            {t('check_status_btn')}
          </button>
        </div>

        {/* Quick chip selector for testing */}
        {allCases.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-[11px] text-slate-500 font-medium shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              {language === 'te' ? 'ఉదాహరణ కేసులు:' : 'Recent Cases:'}
            </span>
            {allCases.slice(0, 3).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setSearchId(c.id);
                  loadCase(c.id);
                }}
                className={`text-[11px] px-2 py-1 rounded-lg font-mono font-semibold transition-all shrink-0 ${
                  c.id === searchId
                    ? 'bg-blue-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {c.id} ({c.childName.split(' ')[0]})
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* CASE STATUS DETAILS */}
      {currentCase && (
        <div className="space-y-4 animate-fadeIn">
          {/* Main Status Header Card */}
          <div className={`p-4 rounded-2xl border shadow-xs space-y-3 ${
            currentCase.status === 'possible_match'
              ? 'bg-emerald-50 border-emerald-300'
              : currentCase.status === 'reunited'
              ? 'bg-blue-50 border-blue-300'
              : 'bg-amber-50/70 border-amber-300'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-white/80 border text-slate-700">
                {currentCase.id}
              </span>
              <span className="text-[11px] font-medium text-slate-500">
                {new Date(currentCase.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* Status Visual Banner */}
            {currentCase.status === 'searching' && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-amber-800">
                  <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center animate-spin">
                    <Clock className="w-4 h-4 text-amber-800" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-amber-900">
                      {t('case_status_searching')}
                    </h3>
                    <p className="text-[11px] text-amber-700 leading-tight">
                      {t('case_status_searching_desc')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentCase.status === 'possible_match' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 text-emerald-900">
                  <div className="w-9 h-9 rounded-full bg-emerald-200 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-800" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-emerald-950">
                      {t('case_status_matched')}
                    </h3>
                    <p className="text-xs text-emerald-800 leading-tight">
                      {t('case_status_matched_desc')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentCase.status === 'reunited' && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-blue-900">
                  <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-blue-800" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-blue-950">
                      {t('case_status_reunited')}
                    </h3>
                    <p className="text-[11px] text-blue-700 leading-tight">
                      {t('case_status_reunited_desc')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* WHEN MATCHED: Show Police Bot Booth Card with Handover OTP & Walking Directions */}
          {currentCase.status === 'possible_match' && matchedBooth && (
            <div className="bg-white rounded-2xl border-2 border-emerald-400 p-4 shadow-sm space-y-4">
              {/* Handover OTP Highlight */}
              <div className="p-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl shadow-xs space-y-1 text-center">
                <span className="text-[11px] font-semibold text-emerald-100 uppercase tracking-wider flex items-center justify-center gap-1">
                  <KeyRound className="w-3.5 h-3.5" />
                  {t('handover_otp_title')}
                </span>
                <div className="text-3xl font-black font-mono tracking-widest text-amber-200">
                  {currentCase.handoverOtp || '4821'}
                </div>
                <p className="text-[11px] text-emerald-100 leading-tight">
                  {t('handover_otp_desc')}
                </p>
              </div>

              {/* Booth Information */}
              <div className="space-y-2 pt-1">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold text-xs mb-1">
                      {t('booth_number_badge', { num: String(matchedBooth.number) })}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {language === 'te' ? matchedBooth.nameTelugu : matchedBooth.name}
                    </h4>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <p className="flex items-center gap-1.5 font-medium text-slate-800">
                    <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                    <span>
                      {t('booth_landmark', {
                        landmark: language === 'te' ? matchedBooth.landmarkTelugu : matchedBooth.landmark,
                      })}
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-500 pl-5">
                    {language === 'te' ? 'డ్యూటీ అధికారి:' : 'Duty Officer:'} {matchedBooth.officerInCharge}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Directions & Direct Call */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <a
                  href={`tel:${matchedBooth.phone}`}
                  className="min-h-[50px] py-2.5 px-3 bg-[#0f2942] hover:bg-blue-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition-all"
                >
                  <PhoneCall className="w-4 h-4 text-amber-400" />
                  <span>{t('call_now')}</span>
                </a>

                <button
                  type="button"
                  onClick={() => onOpenBoothMap && onOpenBoothMap(matchedBooth.id)}
                  className="min-h-[50px] py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition-all"
                >
                  <Navigation className="w-4 h-4" />
                  <span>{t('get_directions')}</span>
                </button>
              </div>

              {/* Privacy Reminder */}
              <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  {language === 'te'
                    ? 'పోలీస్ అధికారికి మీ ఆధార్/ఓటర్ ఐడీ మరియు పై OTP చూపించి బిడ్డను సురక్షితంగా అందుకోండి.'
                    : 'Show your official Govt ID card and the OTP above to the duty officer for handover.'}
                </span>
              </div>
            </div>
          )}

          {/* Child Registered Details Summary (NO photos of other children) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === 'te' ? 'రిపోర్ట్ చేయబడిన వివరాలు' : 'Reported Details'}
            </h4>

            <div className="flex items-start gap-3">
              {currentCase.photoDeleted ? (
                <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400 text-center p-1">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 mb-0.5" />
                  <span className="text-[9px] font-bold text-emerald-700">
                    {language === 'te' ? 'తొలగించబడింది' : 'Purged'}
                  </span>
                </div>
              ) : (
                <img
                  src={currentCase.photoUrl}
                  alt={currentCase.childName}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 bg-slate-50"
                />
              )}

              <div className="text-xs space-y-1 flex-1">
                <p className="text-base font-bold text-slate-900">
                  {currentCase.childName}
                </p>
                <p className="text-slate-600 font-medium">
                  {currentCase.approxAge} {language === 'te' ? 'సంవత్సరాలు' : 'Years'} •{' '}
                  {currentCase.gender === 'boy' ? t('gender_boy') : t('gender_girl')}
                </p>
                <p className="text-slate-500 text-[11px] leading-tight">
                  <span className="font-semibold">{language === 'te' ? 'దుస్తులు:' : 'Clothes:'}</span>{' '}
                  {currentCase.clothesDescription}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1">
              <p>
                <span className="font-semibold text-slate-800">
                  {language === 'te' ? 'చివరిగా కనిపించిన ప్రదేశం:' : 'Last Seen Place:'}
                </span>{' '}
                {currentCase.lastSeenLocation}
              </p>
              <p>
                <span className="font-semibold text-slate-800">
                  {language === 'te' ? 'తల్లి/తండ్రి:' : 'Parent:'}
                </span>{' '}
                {currentCase.parentName} (+91 {currentCase.parentPhone})
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State when no search done */}
      {!currentCase && !searchAttempted && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-slate-500 space-y-2">
          <Clock className="w-8 h-8 mx-auto text-slate-400" />
          <p className="text-xs">
            {language === 'te'
              ? 'కేస్ వివరాలను వీక్షించడానికి పైన మీ కేస్ నంబర్‌ను నమోదు చేయండి'
              : 'Enter your Case ID above to track ongoing search and booth match status.'}
          </p>
        </div>
      )}
    </div>
  );
};
