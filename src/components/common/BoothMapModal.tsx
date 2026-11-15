import React from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import { POLICE_BOOTHS } from '../../data/booths';
import { PoliceBooth } from '../../types';
import {
  X,
  MapPin,
  Navigation,
  PhoneCall,
  ExternalLink,
  ShieldAlert,
  Info,
  Footprints,
  Compass
} from 'lucide-react';

interface BoothMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  boothId?: string;
  booth?: PoliceBooth;
  distanceMeters?: number;
}

export const BoothMapModal: React.FC<BoothMapModalProps> = ({
  isOpen,
  onClose,
  boothId,
  booth: customBooth,
  distanceMeters = 120,
}) => {
  const { language } = useTranslation();

  if (!isOpen) return null;

  const targetBooth =
    customBooth ||
    POLICE_BOOTHS.find((b) => b.id === boothId) ||
    POLICE_BOOTHS[0];

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${targetBooth.lat},${targetBooth.lng}&travelmode=walking`;
  const walkMinutes = Math.max(1, Math.round(distanceMeters / 60));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/75 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md max-h-[92vh] bg-white rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-4 bg-[#0f2942] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-800 text-amber-300">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-base leading-tight">
                  {language === 'te' ? 'నడక మార్గం & బూత్ మ్యాప్' : 'Walking Route & Booth Map'}
                </h3>
              </div>
              <p className="text-xs text-blue-200">
                బూత్ #{targetBooth.number} • {language === 'te' ? targetBooth.nameTelugu : targetBooth.name}
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

        {/* Prototype Disclaimer Banner */}
        <div className="px-3.5 py-2 bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 border-b border-amber-600 shadow-2xs">
          <ShieldAlert className="w-4 h-4 text-slate-950 shrink-0" />
          <span className="text-[11px] leading-tight">
            {language === 'te'
              ? 'డెమో ప్రదేశం: ఇది గోదావరి పుష్కరాలు 2027 హ్యాకథాన్ నమూనా మాత్రమే. నిజమైన పోలీసు బూత్ కాదు.'
              : 'DEMO LOCATION: Godavari Pushkaralu 2027 Hackathon Simulation. Not a verified real-world police booth.'}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-slate-800">
          {/* Interactive In-App Simulated SVG Map */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-900 shadow-inner">
            <div className="h-48 w-full relative flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-[#0b1926]">
              {/* Simulated River / Ghat Water Line */}
              <div className="absolute left-0 right-0 top-0 h-10 bg-blue-600/25 border-b border-blue-400/30 flex items-center px-4">
                <span className="text-[10px] uppercase font-mono tracking-widest text-blue-300">
                  {language === 'te' ? 'గోదావరి నది తీరం (Godavari River)' : 'Godavari Riverfront Ghat Line'}
                </span>
              </div>

              {/* Grid Roads */}
              <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

              {/* SVG Walking Path from User to Booth */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 360 190">
                <path
                  d="M 60 145 C 120 145, 140 100, 280 85"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="3.5"
                  strokeDasharray="6 4"
                  className="animate-pulse"
                />
              </svg>

              {/* User Marker (Pilgrim / Finder) */}
              <div className="absolute left-10 bottom-6 flex flex-col items-center">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg ring-4 ring-emerald-500/30 animate-bounce">
                    <Footprints className="w-5 h-5" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-white"></span>
                </div>
                <span className="text-[10px] font-bold text-white bg-slate-950/80 px-2 py-0.5 rounded-full mt-1 border border-slate-700">
                  {language === 'te' ? 'మీరు ఇక్కడ ఉన్నారు' : 'You (Finder / Parent)'}
                </span>
              </div>

              {/* Distance pill in middle */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950/90 border border-slate-700 px-2.5 py-1 rounded-full text-white text-[10px] font-mono font-bold flex items-center gap-1 shadow-md">
                <Compass className="w-3 h-3 text-cyan-400 animate-spin" />
                <span>{distanceMeters}m • ~{walkMinutes} min walk</span>
              </div>

              {/* Destination Police Booth Marker */}
              <div className="absolute right-8 top-12 flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-xl ring-4 ring-red-500/40">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <span className="text-[10px] font-bold text-amber-300 bg-slate-950/90 px-2 py-0.5 rounded-full mt-1 border border-amber-500/40">
                  బూత్ #{targetBooth.number}
                </span>
              </div>
            </div>

            {/* In-App Map Live Coordinates Footer */}
            <div className="p-2.5 bg-slate-950 text-slate-300 text-[11px] flex items-center justify-between border-t border-slate-800 font-mono">
              <span>Lat: {targetBooth.lat.toFixed(4)}°N</span>
              <span>Lng: {targetBooth.lng.toFixed(4)}°E</span>
              <span className="text-emerald-400 font-semibold">{language === 'te' ? 'ఆన్‌లైన్' : 'GPS Active'}</span>
            </div>
          </div>

          {/* Booth Details Box */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-full">
                {language === 'te' ? `పోలీస్ బూత్ నంబర్ #${targetBooth.number}` : `Police Bot Booth #${targetBooth.number}`}
              </span>
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <Footprints className="w-3.5 h-3.5" />
                ~{walkMinutes} {language === 'te' ? 'నిమిషాల నడక' : 'mins walk'}
              </span>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                {language === 'te' ? targetBooth.nameTelugu : targetBooth.name}
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <span>{language === 'te' ? targetBooth.landmarkTelugu : targetBooth.landmark}</span>
              </p>
              <p className="text-[11px] text-slate-500 pl-4.5 mt-0.5">
                {language === 'te' ? 'ఇన్‌ఛార్జ్ అధికారి:' : 'Officer in charge:'} {targetBooth.officerInCharge}
              </p>
            </div>
          </div>

          {/* Step-by-Step Walking Directions Guide */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-blue-700" />
              {language === 'te' ? 'నడక మార్గ సూచనలు:' : 'Walking Directions:'}
            </h5>
            <ol className="text-xs text-slate-600 space-y-2 pl-4 list-decimal">
              <li className="leading-relaxed">
                {language === 'te'
                  ? 'గోదావరి నదీ తీర వాకింగ్ మార్గంలో ప్రధాన ప్రవేశ గోపురం వైపు నడవండి.'
                  : 'Follow the main riverfront walkway towards the primary pilgrim holding arch.'}
              </li>
              <li className="leading-relaxed">
                {language === 'te'
                  ? `నీలి రంగు & నారింజ రంగు బోర్డు ఉన్న పోలీస్ బూత్ #${targetBooth.number} ను గుర్తించండి.`
                  : `Look for Police Bot Booth #${targetBooth.number} marked with blue and amber LED signs.`}
              </li>
              <li className="leading-relaxed">
                {language === 'te'
                  ? 'డ్యూటీ అధికారి వద్దకు వెళ్లి బిడ్డను లేదా కేస్ వివరాలను అప్పగించండి.'
                  : 'Report directly to the duty officer and present verification details.'}
              </li>
            </ol>
          </div>

          {/* External Map Link Button (Always working) */}
          <div className="space-y-2 pt-1">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[52px] py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all text-center"
            >
              <Navigation className="w-4 h-4" />
              <span>{language === 'te' ? 'గూగుల్ మ్యాప్స్‌లో తెరవండి (Live Navigation)' : 'Open in Google Maps / Navigation'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${targetBooth.phone}`}
                className="py-2.5 px-3 bg-[#0f2942] hover:bg-blue-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'te' ? 'బూత్‌కు కాల్' : 'Call Booth'}</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                {language === 'te' ? 'మూసివేయి' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
