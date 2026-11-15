import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import { storageService } from '../../services/storageService';
import { POLICE_BOOTHS } from '../../data/booths';
import { MissingCase, FoundEntry, MatchRecord, AuditLog } from '../../types';
import {
  Shield,
  LogOut,
  AlertTriangle,
  UserCheck,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  PhoneCall,
  KeyRound,
  FileText,
  Trash2,
  Sparkles,
  Check,
  Eye,
  BadgeAlert,
  HelpCircle,
  Footprints,
  Layers,
  HeartHandshake
} from 'lucide-react';

interface PoliceConsoleViewProps {
  officer: { username: string; name: string; boothId: string; boothName: string };
  onLogout: () => void;
  onOpenBoothMap?: (boothId: string) => void;
}

type ConsoleTab = 'missing' | 'found' | 'matches' | 'handover' | 'audit';

export const PoliceConsoleView: React.FC<PoliceConsoleViewProps> = ({
  officer,
  onLogout,
  onOpenBoothMap: _onOpenBoothMap,
}) => {
  const { language } = useTranslation();
  const [activeTab, setActiveTab] = useState<ConsoleTab>('missing');

  // Real-time state from shared storageService
  const [missingCases, setMissingCases] = useState<MissingCase[]>([]);
  const [foundEntries, setFoundEntries] = useState<FoundEntry[]>([]);
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Handover form state
  const [handoverCaseId, setHandoverCaseId] = useState<string>('');
  const [handoverOtp, setHandoverOtp] = useState<string>('');
  const [idType, setIdType] = useState<string>('Aadhaar Card (ఆధార్ కార్డు)');
  const [idNumber, setIdNumber] = useState<string>('');
  const [handoverSuccessMsg, setHandoverSuccessMsg] = useState<string>('');
  const [handoverError, setHandoverError] = useState<string>('');

  // Search filters
  const [searchQuery, setSearchQuery] = useState<string>('');

  const refreshData = () => {
    setMissingCases(storageService.getMissingCases());
    setFoundEntries(storageService.getFoundEntries());
    setMatches(storageService.getMatches());
    setAuditLogs(storageService.getAuditLogs());
  };

  useEffect(() => {
    refreshData();
    const unsub = storageService.subscribe(() => {
      refreshData();
    });
    return unsub;
  }, []);

  // Officer confirms child arrival at booth
  const handleConfirmArrival = (foundId: string) => {
    storageService.markChildArrivedAtBooth(foundId, officer.name);
    storageService.addAuditLog({
      action: 'case_created',
      officerId: officer.username,
      officerName: officer.name,
      boothId: officer.boothId,
      details: `Officer confirmed child arrived physically at ${officer.boothName}. Found ID: ${foundId}`,
    });
  };

  // Officer confirms or rejects AI match
  const handleReviewMatch = (matchId: string, status: 'confirmed' | 'rejected') => {
    storageService.updateMatchStatus(matchId, status, officer.name, 'Officer visual and attribute inspection completed.');
    refreshData();
  };

  // Officer processes child handover
  const handleProcessHandover = (e: React.FormEvent) => {
    e.preventDefault();
    setHandoverError('');
    setHandoverSuccessMsg('');

    if (!handoverCaseId.trim()) {
      setHandoverError(language === 'te' ? 'దయచేసి కేస్ నంబర్ ఎంచుకోండి లేదా నమోదు చేయండి' : 'Please select or enter a Case ID');
      return;
    }

    const targetCase = storageService.getMissingCaseById(handoverCaseId.trim());
    if (!targetCase) {
      setHandoverError(language === 'te' ? 'కేస్ నంబర్ కనుగొనబడలేదు' : 'Case ID not found in system');
      return;
    }

    if (targetCase.status === 'reunited') {
      setHandoverError(language === 'te' ? 'ఈ కేసు ఇప్పటికే ముగిసింది మరియు బిడ్డ అప్పగించబడ్డారు' : 'This case is already closed and reunited');
      return;
    }

    // OTP Verification (Check case handoverOtp or fallback demo OTP)
    const validOtp = targetCase.handoverOtp || '4821';
    if (handoverOtp.trim() !== validOtp) {
      setHandoverError(
        language === 'te'
          ? `OTP తప్పు! తల్లిదండ్రుల సరైన OTP నమోదు చేయండి (డెమో OTP: ${validOtp})`
          : `Invalid OTP! Please enter parent's OTP (Demo OTP: ${validOtp})`
      );
      return;
    }

    if (!idNumber.trim()) {
      setHandoverError(language === 'te' ? 'దయచేసి గుర్తింపు కార్డు నంబర్ నమోదు చేయండి' : 'Please enter parent Govt ID number');
      return;
    }

    // Complete handover and purge photos permanently
    storageService.completeHandover(targetCase.id, officer.name, idType, idNumber.trim());
    setHandoverSuccessMsg(
      language === 'te'
        ? `సురక్షిత అప్పగింత పూర్తయింది! కేస్ ${targetCase.id} విజయవంతంగా ముగిసింది. గోప్యతా నిబంధనల ప్రకారం ఫోటోలు శాశ్వతంగా తొలగించబడ్డాయి.`
        : `Safe handover completed! Case ${targetCase.id} resolved. Photos purged permanently per privacy protocol.`
    );
    setHandoverCaseId('');
    setHandoverOtp('');
    setIdNumber('');
    refreshData();
  };

  // Metrics
  const activeMissingCount = missingCases.filter((c) => c.status === 'searching' || c.status === 'possible_match').length;
  const pendingArrivalCount = foundEntries.filter((f) => !f.arrivedAtBooth && f.status !== 'reunited').length;
  const pendingMatchesCount = matches.filter((m) => m.status === 'pending_review').length;
  const reunitedCount = missingCases.filter((c) => c.status === 'reunited').length;

  return (
    <div className="max-w-md mx-auto p-4 space-y-4 animate-fadeIn">
      {/* Officer Status Card & Logout */}
      <div className="bg-[#0f2942] text-white p-3.5 rounded-2xl shadow-sm space-y-2 border border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-800 text-amber-300">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                {language === 'te' ? 'పోలీస్ బూత్ కన్సోల్' : 'Police Booth Console'}
              </span>
              <h2 className="text-sm font-bold text-white truncate max-w-[210px]">
                {officer.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-red-600/90 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all active:scale-95 shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{language === 'te' ? 'లాగౌట్' : 'Logout'}</span>
          </button>
        </div>

        <div className="text-[11px] text-blue-200 flex items-center justify-between pt-1 border-t border-blue-900/80">
          <span className="flex items-center gap-1 font-medium">
            <MapPin className="w-3 h-3 text-amber-400" />
            {officer.boothName}
          </span>
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono text-[10px] font-bold">
            ● Duty Live
          </span>
        </div>
      </div>

      {/* Mandatory Demo / Simulation Environment Banner */}
      <div className="p-3 bg-amber-500 text-slate-950 rounded-xl border border-amber-600 flex items-start gap-2 text-xs font-semibold shadow-2xs">
        <AlertTriangle className="w-4 h-4 text-slate-950 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold text-slate-950 uppercase text-[10px] tracking-wider">
            {language === 'te' ? 'డెమో / నమూనా వాతావరణం' : 'Demo / Simulation Prototype'}
          </p>
          <p className="text-[11px] text-slate-900 leading-relaxed font-normal">
            {language === 'te'
              ? 'ఇది గోదావరి పుష్కరాలు 2027 హ్యాకథాన్ ప్రోటోటైప్. డేటా వాస్తవ పోలీసు విభాగాలకు పంపబడదు. అన్ని నివేదికలు డెమో సిమ్యులేషన్ మాత్రమే.'
              : 'This is a Godavari Pushkaralu 2027 hackathon demonstration prototype. Reports are simulated and not connected to active field emergency services.'}
          </p>
        </div>
      </div>

      {/* Top 4 Quick Metric Badges */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-lg font-black text-red-600 block leading-tight">{activeMissingCount}</span>
          <span className="text-[10px] font-semibold text-slate-500">
            {language === 'te' ? 'మిస్సింగ్' : 'Missing'}
          </span>
        </div>
        <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-lg font-black text-amber-600 block leading-tight">{foundEntries.length}</span>
          <span className="text-[10px] font-semibold text-slate-500">
            {language === 'te' ? 'లభ్యమైనవి' : 'Found'}
          </span>
        </div>
        <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-lg font-black text-blue-600 block leading-tight">{pendingMatchesCount}</span>
          <span className="text-[10px] font-semibold text-slate-500">
            {language === 'te' ? 'మ్యాచులు' : 'Matches'}
          </span>
        </div>
        <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-lg font-black text-emerald-600 block leading-tight">{reunitedCount}</span>
          <span className="text-[10px] font-semibold text-slate-500">
            {language === 'te' ? 'చేరినవి' : 'Reunited'}
          </span>
        </div>
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex bg-slate-200/80 p-1 rounded-xl gap-1 text-xs font-bold text-slate-600 overflow-x-auto">
        <button
          onClick={() => setActiveTab('missing')}
          className={`flex-1 py-2 px-2.5 rounded-lg whitespace-nowrap transition-all flex items-center justify-center gap-1 ${
            activeTab === 'missing'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'hover:text-slate-900'
          }`}
        >
          <span>{language === 'te' ? 'మిస్సింగ్ కేసులు' : 'Missing Cases'}</span>
          <span className="bg-red-100 text-red-700 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
            {missingCases.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('found')}
          className={`flex-1 py-2 px-2.5 rounded-lg whitespace-nowrap transition-all flex items-center justify-center gap-1 ${
            activeTab === 'found'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'hover:text-slate-900'
          }`}
        >
          <span>{language === 'te' ? 'లభ్యమైన పిల్లలు' : 'Found Entries'}</span>
          <span className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
            {foundEntries.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('matches')}
          className={`flex-1 py-2 px-2.5 rounded-lg whitespace-nowrap transition-all flex items-center justify-center gap-1 ${
            activeTab === 'matches'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'hover:text-slate-900'
          }`}
        >
          <span>{language === 'te' ? 'మ్యాచింగ్ రివ్యూ' : 'Review Queue'}</span>
          {pendingMatchesCount > 0 && (
            <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold animate-pulse">
              {pendingMatchesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('handover')}
          className={`flex-1 py-2 px-2.5 rounded-lg whitespace-nowrap transition-all flex items-center justify-center gap-1 ${
            activeTab === 'handover'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'hover:text-slate-900'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
          <span>{language === 'te' ? 'అప్పగింత' : 'Handover'}</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex-1 py-2 px-2.5 rounded-lg whitespace-nowrap transition-all flex items-center justify-center gap-1 ${
            activeTab === 'audit'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-blue-600" />
          <span>{language === 'te' ? 'ఆడిట్' : 'Audit'}</span>
        </button>
      </div>

      {/* ================= TAB 1: MISSING CASES ================= */}
      {activeTab === 'missing' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600 px-1">
            <span className="font-semibold">
              {language === 'te' ? 'తల్లిదండ్రుల నుండి నమోదైన నివేదికలు' : 'All Registered Missing Reports'}
            </span>
            <span className="text-[11px] font-mono text-slate-500">Total: {missingCases.length}</span>
          </div>

          {missingCases.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 space-y-2">
              <Search className="w-8 h-8 mx-auto text-slate-400" />
              <p className="font-semibold text-xs text-slate-800">
                {language === 'te' ? 'ఎటువంటి మిస్సింగ్ కేసులు నమోదు కాలేదు' : 'No missing cases recorded yet'}
              </p>
              <p className="text-[11px] text-slate-500">
                {language === 'te' ? 'తల్లిదండ్రుల ఫ్లో ద్వారా కొత్త కేసు నమోదు చేయండి.' : 'New reports submitted by parents will appear here automatically.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {missingCases.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 transition-all hover:border-blue-300"
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {c.id}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        c.status === 'reunited'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.status === 'possible_match'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {c.status === 'reunited'
                          ? (language === 'te' ? 'బిడ్డ అప్పగించబడ్డారు' : 'Reunited & Closed')
                          : c.status === 'possible_match'
                          ? (language === 'te' ? 'మ్యాచింగ్ దొరికింది' : 'Possible Match')
                          : (language === 'te' ? 'గాలింపు జరుగుతోంది' : 'Active Searching')}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Child Main Info with Photo / Silhouette */}
                  <div className="flex items-start gap-3">
                    {c.photoDeleted ? (
                      <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400 text-center p-1 shrink-0">
                        <Trash2 className="w-5 h-5 text-emerald-600 mb-0.5" />
                        <span className="text-[9px] font-bold text-emerald-700">
                          {language === 'te' ? 'తొలగించబడింది' : 'Purged'}
                        </span>
                      </div>
                    ) : c.photoUrl ? (
                      <img
                        src={c.photoUrl}
                        alt={c.childName}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-xs font-bold shrink-0">
                        {c.childName[0]}
                      </div>
                    )}

                    <div className="text-xs space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm text-slate-900">{c.childName}</h3>
                        <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                          {c.approxAge} {language === 'te' ? 'సం.' : 'yrs'} • {c.gender === 'boy' ? 'Boy' : 'Girl'}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-tight">
                        <strong className="text-slate-800">{language === 'te' ? 'దుస్తులు:' : 'Clothes:'}</strong>{' '}
                        {c.clothesDescription}
                      </p>

                      {c.specialMarks && (
                        <p className="text-[11px] text-slate-500 leading-tight">
                          <strong>{language === 'te' ? 'గుర్తులు:' : 'Marks:'}</strong> {c.specialMarks}
                        </p>
                      )}

                      <p className="text-[11px] text-slate-500">
                        <strong>{language === 'te' ? 'భాష:' : 'Language:'}</strong> {c.languageSpoken}
                      </p>
                    </div>
                  </div>

                  {/* Last Seen & Parent Contact */}
                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 grid grid-cols-2 gap-2 bg-slate-50/80 p-2.5 rounded-xl">
                    <div>
                      <span className="text-slate-400 block">{language === 'te' ? 'కనిపించని ప్రదేశం:' : 'Last Seen Area:'}</span>
                      <strong className="text-slate-800 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                        {c.lastSeenLocation}
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block">{language === 'te' ? 'తల్లిదండ్రులు:' : 'Parent Contact:'}</span>
                      <strong className="text-slate-800 flex items-center gap-1 truncate">
                        <PhoneCall className="w-3 h-3 text-emerald-600 shrink-0" />
                        {c.parentName} ({c.parentPhone})
                      </strong>
                    </div>
                  </div>

                  {/* Actions for this case */}
                  {c.status !== 'reunited' && (
                    <div className="pt-1 flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setHandoverCaseId(c.id);
                          setHandoverOtp(c.handoverOtp || '4821');
                          setActiveTab('handover');
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                      >
                        <KeyRound className="w-3 h-3" />
                        <span>{language === 'te' ? 'అప్పగింత నమోదు' : 'Process Handover'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: FOUND ENTRIES ================= */}
      {activeTab === 'found' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600 px-1">
            <span className="font-semibold">
              {language === 'te' ? 'లభ్యమైన పిల్లల నివేదికలు' : 'Good Samaritan & Field Found Entries'}
            </span>
            <span className="text-[11px] font-mono text-slate-500">Total: {foundEntries.length}</span>
          </div>

          {foundEntries.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 space-y-2">
              <HeartHandshake className="w-8 h-8 mx-auto text-slate-400" />
              <p className="font-semibold text-xs text-slate-800">
                {language === 'te' ? 'ఎటువంటి లభ్యమైన పిల్లల నివేదికలు లేవు' : 'No found children entries logged'}
              </p>
              <p className="text-[11px] text-slate-500">
                {language === 'te' ? 'ఫైండర్ ఫ్లో ద్వారా కొత్త ఎంట్రీని నమోదు చేయండి.' : 'Entries submitted by citizens or patrol officers will appear here.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {foundEntries.map((f) => {
                const assignedBooth = POLICE_BOOTHS.find((b) => b.id === f.nearestBoothId) || POLICE_BOOTHS[0];

                return (
                  <div
                    key={f.id}
                    className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 transition-all hover:border-emerald-300"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-black text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {f.id}
                        </span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          f.status === 'reunited'
                            ? 'bg-blue-100 text-blue-800'
                            : f.arrivedAtBooth
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800 animate-pulse'
                        }`}>
                          {f.status === 'reunited'
                            ? (language === 'te' ? 'పునఃకలయిక పూర్తయింది' : 'Reunited')
                            : f.arrivedAtBooth
                            ? (language === 'te' ? 'బూత్‌కు చేరారు' : 'Arrived at Booth')
                            : (language === 'te' ? 'బూత్ వైపు వస్తున్నారు' : 'En Route to Booth')}
                        </span>
                      </div>

                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {new Date(f.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Photo & Details */}
                    <div className="flex items-start gap-3">
                      {f.photoDeleted ? (
                        <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400 text-center p-1 shrink-0">
                          <Trash2 className="w-5 h-5 text-emerald-600 mb-0.5" />
                          <span className="text-[9px] font-bold text-emerald-700">
                            {language === 'te' ? 'తొలగించబడింది' : 'Purged'}
                          </span>
                        </div>
                      ) : (
                        <img
                          src={f.photoUrl}
                          alt="Found Child"
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0"
                        />
                      )}

                      <div className="text-xs space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">
                            {language === 'te' ? 'చిన్నారి (సుమారు వయస్సు)' : 'Approximate Age:'}{' '}
                            <strong className="text-blue-900 font-extrabold">{f.approxAge} yrs</strong>
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {f.languageSpoken || 'Telugu'}
                          </span>
                        </div>

                        {f.clothesDescription && (
                          <p className="text-[11px] text-slate-600 leading-tight">
                            <strong>{language === 'te' ? 'దుస్తులు:' : 'Clothes:'}</strong> {f.clothesDescription}
                          </p>
                        )}

                        <p className="text-[11px] text-slate-600 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                          <span><strong>{language === 'te' ? 'ప్రదేశం:' : 'Found at:'}</strong> {f.foundLocation}</span>
                        </p>
                      </div>
                    </div>

                    {/* Assigned Booth details & Confirmation Button */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs bg-slate-50/70 p-2.5 rounded-xl">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">
                          {language === 'te' ? 'కేటాయించిన బూత్:' : 'Assigned Booth:'}
                        </span>
                        <strong className="text-slate-800 text-[11px]">
                          బూత్ #{assignedBooth.number} • {assignedBooth.name}
                        </strong>
                      </div>

                      {!f.arrivedAtBooth && f.status !== 'reunited' ? (
                        <button
                          onClick={() => handleConfirmArrival(f.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all shadow-2xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{language === 'te' ? 'బూత్ వద్ద హాజరు ధృవీకరించండి' : 'Confirm Arrival'}</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {language === 'te' ? 'హాజరయ్యారు' : 'At Booth'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: MATCH REVIEW QUEUE ================= */}
      {activeTab === 'matches' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600 px-1">
            <span className="font-semibold">
              {language === 'te' ? 'AI సరిపోలిక పరిశీలన' : 'AI Multimodal Match Review Queue'}
            </span>
            <span className="text-[11px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-bold">
              Human Officer Verification Required
            </span>
          </div>

          {matches.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 space-y-2">
              <Layers className="w-8 h-8 mx-auto text-slate-400" />
              <p className="font-semibold text-xs text-slate-800">
                {language === 'te' ? 'పరిశీలించవలసిన మ్యాచులు లేవు' : 'No matches pending review'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {matches.map((m) => {
                const missingCase = storageService.getMissingCaseById(m.missingCaseId);
                const foundEntry = storageService.getFoundEntryById(m.foundEntryId);

                if (!missingCase || !foundEntry) return null;

                return (
                  <div
                    key={m.id}
                    className="bg-white rounded-2xl border-2 border-blue-300 p-4 shadow-sm space-y-3"
                  >
                    {/* Confidence Score Pill */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-mono font-bold text-blue-900">
                          Match #{m.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-2.5 py-1 rounded-full text-xs font-black shadow-2xs">
                        <span>{m.confidenceScore}%</span>
                        <span className="text-[10px] font-normal uppercase tracking-wider">Confidence</span>
                      </div>
                    </div>

                    {/* Side-by-Side Photos Comparison */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      {/* Left: Missing Child Reported */}
                      <div className="text-center space-y-1">
                        <span className="text-[10px] font-bold text-red-700 block uppercase">
                          {language === 'te' ? 'తల్లిదండ్రుల రిపోర్ట్' : 'Reported Missing'}
                        </span>
                        {missingCase.photoUrl ? (
                          <img
                            src={missingCase.photoUrl}
                            alt="Missing"
                            className="w-24 h-24 mx-auto rounded-xl object-cover border border-red-300 bg-white"
                          />
                        ) : (
                          <div className="w-24 h-24 mx-auto rounded-xl bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                            No Photo
                          </div>
                        )}
                        <p className="text-xs font-bold text-slate-900 truncate">{missingCase.childName}</p>
                        <p className="text-[10px] text-slate-500">{missingCase.approxAge} yrs • {missingCase.clothesDescription}</p>
                      </div>

                      {/* Right: Found Child Uploaded */}
                      <div className="text-center space-y-1 border-l border-slate-200 pl-2">
                        <span className="text-[10px] font-bold text-emerald-700 block uppercase">
                          {language === 'te' ? 'లభ్యమైన చిన్నారి' : 'Found Samaritan'}
                        </span>
                        {foundEntry.photoUrl ? (
                          <img
                            src={foundEntry.photoUrl}
                            alt="Found"
                            className="w-24 h-24 mx-auto rounded-xl object-cover border border-emerald-300 bg-white"
                          />
                        ) : (
                          <div className="w-24 h-24 mx-auto rounded-xl bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                            No Photo
                          </div>
                        )}
                        <p className="text-xs font-bold text-slate-900 truncate">Found #{foundEntry.id}</p>
                        <p className="text-[10px] text-slate-500">{foundEntry.approxAge} yrs • {foundEntry.clothesDescription}</p>
                      </div>
                    </div>

                    {/* AI Matching Reasons */}
                    <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-200 space-y-1">
                      <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block">
                        {language === 'te' ? 'AI విశ్లేషణ కారణాలు:' : 'AI Alignment Signals:'}
                      </span>
                      <ul className="text-[11px] text-slate-700 space-y-0.5 list-disc pl-4">
                        {m.aiReasons.map((reason, idx) => (
                          <li key={idx}>{reason}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Officer Action Buttons */}
                    {m.status === 'pending_review' ? (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => handleReviewMatch(m.id, 'rejected')}
                          className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                        >
                          {language === 'te' ? 'సరిపోలడం లేదు (Reject)' : 'Not a Match'}
                        </button>

                        <button
                          onClick={() => handleReviewMatch(m.id, 'confirmed')}
                          className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1"
                        >
                          <Check className="w-4 h-4" />
                          <span>{language === 'te' ? 'మ్యాచింగ్ ఖరారు (Confirm)' : 'Confirm Match'}</span>
                        </button>
                      </div>
                    ) : (
                      <div className="p-2 bg-slate-100 rounded-lg text-center text-xs font-bold text-slate-700">
                        {m.status === 'confirmed' ? '✓ Verified by Officer' : '✕ Rejected as Not a Match'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 4: HANDOVER ================= */}
      {activeTab === 'handover' && (
        <form
          onSubmit={handleProcessHandover}
          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4"
        >
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                {language === 'te' ? 'సురక్షిత అప్పగింత & OTP ధృవీకరణ' : 'Parent Verification & Safe Handover'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {language === 'te' ? 'పోలీస్ అధికారి సమక్షంలో తనిఖీ' : 'Strict protocol before releasing child to parents'}
              </p>
            </div>
          </div>

          {handoverSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="font-medium leading-relaxed">{handoverSuccessMsg}</p>
            </div>
          )}

          {handoverError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="font-medium leading-relaxed">{handoverError}</p>
            </div>
          )}

          {/* Select Case to Handover */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">
              {language === 'te' ? 'కేస్ నంబర్ ఎంచుకోండి' : 'Select Case ID'}
            </label>
            <select
              value={handoverCaseId}
              onChange={(e) => {
                const cid = e.target.value;
                setHandoverCaseId(cid);
                const c = missingCases.find((item) => item.id === cid);
                if (c && c.handoverOtp) {
                  setHandoverOtp(c.handoverOtp);
                }
              }}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs font-mono font-bold bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">-- {language === 'te' ? 'కేసును ఎంచుకోండి' : 'Select Case'} --</option>
              {missingCases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} - {c.childName} ({c.status})
                </option>
              ))}
            </select>
          </div>

          {/* Parent OTP */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">
              {language === 'te' ? 'తల్లిదండ్రుల 4-అంకెల OTP' : 'Parent’s 4-Digit Handover OTP'}
            </label>
            <input
              type="text"
              maxLength={4}
              value={handoverOtp}
              onChange={(e) => setHandoverOtp(e.target.value)}
              placeholder="e.g. 4821"
              className="w-full px-3 py-3 border border-slate-300 rounded-xl text-center font-mono font-bold text-xl tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Govt ID Type & ID Number */}
          <div className="space-y-2">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">
                {language === 'te' ? 'తల్లిదండ్రుల గుర్తింపు కార్డు రకం' : 'Parent Government ID Type'}
              </label>
              <select
                value={idType}
                onChange={(e) => setIdType(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs font-medium bg-white focus:outline-none"
              >
                <option value="Aadhaar Card (ఆధార్ కార్డు)">Aadhaar Card (ఆధార్ కార్డు)</option>
                <option value="Voter ID Card (ఓటర్ ఐడీ)">Voter ID Card (ఓటర్ ఐడీ)</option>
                <option value="Driving License (డ్రైవింగ్ లైసెన్స్)">Driving License</option>
                <option value="Ration Card (రేషన్ కార్డు)">Ration Card</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">
                {language === 'te' ? 'గుర్తింపు కార్డు నంబర్' : 'Parent ID Number'}
              </label>
              <input
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="e.g. 5482 1290 8472"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs font-medium uppercase font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Privacy Protocol Notice */}
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-900 space-y-1">
            <span className="font-bold flex items-center gap-1 text-red-950">
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
              {language === 'te' ? 'గోప్యతా నిబంధన: ఫోటోల శాశ్వత తొలగింపు' : 'Privacy Mandate: Permanent Photo Purge'}
            </span>
            <p className="leading-relaxed">
              {language === 'te'
                ? 'అప్పగింత పూర్తయిన మరుక్షణమే సర్వర్ల నుండి అన్ని చిన్నారి ఫోటోలు శాశ్వతంగా తొలగించబడతాయి మరియు ఆడిట్ లాగ్ రాయబడుతుంది.'
                : 'Completing handover will immediately delete all photos from the database and seal the case in audit records.'}
            </p>
          </div>

          {/* Complete Handover Button */}
          <button
            type="submit"
            className="w-full min-h-[56px] py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5 text-amber-200" />
            <span>{language === 'te' ? 'అప్పగింత పూర్తి చేయండి & కేసు ముగించండి' : 'Complete Handover & Close Case'}</span>
          </button>
        </form>
      )}

      {/* ================= TAB 5: AUDIT LOGS ================= */}
      {activeTab === 'audit' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600 px-1">
            <span className="font-semibold">
              {language === 'te' ? 'పోలీస్ యాక్సెస్ ఆడిట్ లాగ్‌లు' : 'Officer Photo Access & Audit Log'}
            </span>
            <span className="text-[11px] font-mono text-slate-500">Immutable Records: {auditLogs.length}</span>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="bg-white rounded-xl border border-slate-200 p-3 text-xs space-y-1 shadow-2xs font-mono"
              >
                <div className="flex items-center justify-between text-slate-400 text-[10px]">
                  <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  <span className="font-bold text-blue-900 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                    {log.action}
                  </span>
                </div>
                <p className="text-slate-800 font-sans text-xs">{log.details}</p>
                <p className="text-[10px] text-slate-500">
                  Officer: <strong className="text-slate-700">{log.officerName}</strong> ({log.officerId})
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
