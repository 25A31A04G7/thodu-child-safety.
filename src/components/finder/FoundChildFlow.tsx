import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import { storageService } from '../../services/storageService';
import { POLICE_BOOTHS, GHAT_LOCATIONS, findNearestBooth } from '../../data/booths';
import { DEMO_CHILD_FOUND_PHOTO, compressImage } from '../../services/imageUtils';
import { FoundEntry, PoliceBooth } from '../../types';
import {
  Camera,
  Upload,
  MapPin,
  Sparkles,
  PhoneCall,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  AlertCircle,
  WifiOff,
  RefreshCw,
  Heart
} from 'lucide-react';

interface FoundChildFlowProps {
  onFoundCreated: (entry: FoundEntry) => void;
  onCancel: () => void;
  onOpenBoothMap?: (boothId: string) => void;
}

export const FoundChildFlow: React.FC<FoundChildFlowProps> = ({
  onFoundCreated,
  onCancel,
  onOpenBoothMap,
}) => {
  const { t, language } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [approxAge, setApproxAge] = useState<number | ''>(5);
  const [clothing, setClothing] = useState<string>('');
  const [languageSpoken, setLanguageSpoken] = useState<string>('Telugu');

  // Location & Nearest Booth calculation
  const [selectedGhatId, setSelectedGhatId] = useState<string>('pushkar');
  const [nearestBooth, setNearestBooth] = useState<{ booth: PoliceBooth; distanceMeters: number }>({
    booth: POLICE_BOOTHS[0],
    distanceMeters: 80,
  });
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [gpsDetected, setGpsDetected] = useState<boolean>(true);

  // Offline simulation toggle
  const [isOfflineSimulated, setIsOfflineSimulated] = useState<boolean>(false);
  const [offlineQueued, setOfflineQueued] = useState<boolean>(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedEntry, setSubmittedEntry] = useState<FoundEntry | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Recalculate nearest booth whenever ghat changes
  useEffect(() => {
    const ghat = GHAT_LOCATIONS.find((g) => g.id === selectedGhatId);
    if (ghat) {
      const result = findNearestBooth(ghat.lat, ghat.lng);
      setNearestBooth(result);
    }
  }, [selectedGhatId]);

  // Attempt HTML5 Geolocation with graceful fallback
  const detectLiveGPS = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const result = findNearestBooth(lat, lng);
          setNearestBooth(result);
          setIsLocating(false);
          setGpsDetected(true);
        },
        () => {
          // Fallback to Pushkar Ghat
          setIsLocating(false);
          setGpsDetected(false);
        },
        { timeout: 4000 }
      );
    } else {
      setIsLocating(false);
      setGpsDetected(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 600, 0.75);
        setPhotoUrl(compressed);
        setErrors((prev) => ({ ...prev, photo: '' }));
      } catch (err) {
        console.error('Image compression error:', err);
      }
    }
  };

  // Quick Demo Auto-fill Helper
  const handleAutoFillDemo = () => {
    setPhotoUrl(DEMO_CHILD_FOUND_PHOTO);
    setApproxAge(5);
    setClothing('Yellow t-shirt, blue shorts');
    setLanguageSpoken('Telugu');
    setSelectedGhatId('pushkar');
    setErrors({});
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!photoUrl) {
      errs.photo = language === 'te' ? 'దయచేసి ఫోటో తీయండి లేదా నమూనా ఫోటో ఎంచుకోండి' : 'Photo is required for identification';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const ghat = GHAT_LOCATIONS.find((g) => g.id === selectedGhatId);
    const locationName = ghat
      ? (language === 'te' ? ghat.nameTe : ghat.nameEn)
      : 'Pushkar Ghat, Rajamahendravaram';

    if (isOfflineSimulated) {
      // Offline queue simulation
      setTimeout(() => {
        setIsSubmitting(false);
        setOfflineQueued(true);
      }, 500);
      return;
    }

    setTimeout(() => {
      const entry = storageService.saveFoundEntry({
        approxAge: Number(approxAge) || 5,
        photoUrl,
        clothesDescription: clothing.trim() || undefined,
        languageSpoken,
        foundLocation: locationName,
        foundGhatId: selectedGhatId,
        nearestBoothId: nearestBooth.booth.id,
      });

      setSubmittedEntry(entry);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
  };

  // Sync offline queued entry when user clicks retry/sync
  const handleSyncOffline = () => {
    setIsOfflineSimulated(false);
    setOfflineQueued(false);
    setIsSubmitting(true);

    const ghat = GHAT_LOCATIONS.find((g) => g.id === selectedGhatId);
    const locationName = ghat
      ? (language === 'te' ? ghat.nameTe : ghat.nameEn)
      : 'Pushkar Ghat, Rajamahendravaram';

    setTimeout(() => {
      const entry = storageService.saveFoundEntry({
        approxAge: Number(approxAge) || 5,
        photoUrl,
        clothesDescription: clothing.trim() || undefined,
        languageSpoken,
        foundLocation: locationName,
        foundGhatId: selectedGhatId,
        nearestBoothId: nearestBooth.booth.id,
      });

      setSubmittedEntry(entry);
      setIsSubmitting(false);
    }, 600);
  };

  // ================= POST-SUBMIT SUCCESS SCREEN =================
  if (submittedEntry) {
    const booth = nearestBooth.booth;

    return (
      <div className="max-w-md mx-auto p-4 space-y-4 animate-fadeIn">
        <div className="bg-white rounded-2xl p-6 text-center border-2 border-emerald-400 shadow-sm space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">
              {t('finder_success_title', { id: submittedEntry.id })}
            </h2>
            <p className="text-xs text-emerald-800 font-semibold flex items-center justify-center gap-1">
              <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
              {t('finder_thank_you')}
            </p>
          </div>

          {/* Action Instruction Box */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-left space-y-3">
            <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
              {language === 'te' ? 'తదుపరి తక్షణ చర్యలు:' : 'Immediate Next Steps:'}
            </h3>

            <div className="flex items-start gap-2.5 text-xs text-slate-800">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                1
              </span>
              <p className="font-semibold leading-relaxed">
                {t('finder_instruction_1', {
                  num: String(booth.number),
                  name: language === 'te' ? booth.nameTelugu : booth.name,
                })}
              </p>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-slate-800">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                2
              </span>
              <p className="leading-relaxed">
                {t('finder_instruction_2')}
              </p>
            </div>
          </div>

          {/* Nearest Booth Card */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold text-xs">
                {t('booth_number_badge', { num: String(booth.number) })}
              </span>
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <Navigation className="w-3 h-3" />
                {nearestBooth.distanceMeters}m ({Math.max(1, Math.round(nearestBooth.distanceMeters / 60))} min walk)
              </span>
            </div>

            <div>
              <p className="font-bold text-slate-900 text-sm">
                {language === 'te' ? booth.nameTelugu : booth.name}
              </p>
              <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                {language === 'te' ? booth.landmarkTelugu : booth.landmark}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <a
              href={`tel:${booth.phone}`}
              className="min-h-[52px] py-3 px-3 bg-[#0f2942] hover:bg-blue-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition-all"
            >
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>{t('call_now')}</span>
            </a>

            <button
              type="button"
              onClick={() => onOpenBoothMap && onOpenBoothMap(booth.id)}
              className="min-h-[52px] py-3 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>{t('get_directions')}</span>
            </button>
          </div>

          <button
            onClick={() => onFoundCreated(submittedEntry)}
            className="w-full py-2.5 text-xs text-slate-600 hover:text-slate-800 font-medium underline"
          >
            {t('return_home_btn')}
          </button>
        </div>
      </div>
    );
  }

  // ================= OFFLINE QUEUED SCREEN =================
  if (offlineQueued) {
    return (
      <div className="max-w-md mx-auto p-4 space-y-4 animate-fadeIn">
        <div className="bg-white rounded-2xl p-6 text-center border border-amber-300 shadow-sm space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
            <WifiOff className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">
              {language === 'te' ? 'ఆఫ్‌లైన్ క్యూలో భద్రపరచబడింది' : 'Queued Offline on Device'}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('queue_saved_offline')}
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-1">
            <p className="font-bold text-slate-800">
              {language === 'te' ? 'నిర్దేశిత బూత్:' : 'Assigned Nearest Booth:'}
            </p>
            <p className="text-blue-900 font-semibold">
              బూత్ #{nearestBooth.booth.number} - {language === 'te' ? nearestBooth.booth.nameTelugu : nearestBooth.booth.name}
            </p>
            <p className="text-slate-500 text-[11px]">
              {language === 'te' ? 'ఇంటర్నెట్ రాకపోయినా మీరు బిడ్డను నేరుగా బూత్ వద్దకు తీసుకువెళ్లవచ్చు.' : 'You can still escort the child to the booth immediately.'}
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={handleSyncOffline}
              className="w-full min-h-[52px] py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{language === 'te' ? 'నెట్‌వర్క్ పునఃప్రయత్నం (Sync Now)' : 'Retry & Sync Upload'}</span>
            </button>

            <button
              onClick={onCancel}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium"
            >
              {t('return_home_btn')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= MAIN FINDER FORM (<30 SECONDS) =================
  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      {/* Rapid Action Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <h2 className="text-lg font-bold text-slate-900">
              {t('found_child_title')}
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            {t('finder_tagline')}
          </p>
        </div>

        <button
          type="button"
          onClick={handleAutoFillDemo}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-300 text-xs font-semibold hover:bg-amber-100 active:scale-95 transition-all shadow-2xs"
          title="Auto-fill sample found child photo & data"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>{language === 'te' ? 'నమూనా నింపండి' : 'Demo Fill'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        {/* Step 1: Quick Photo Capture */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            {t('finder_step_photo')} <span className="text-red-600">*</span>
          </label>
          <p className="text-[11px] text-slate-500">
            {t('finder_step_photo_help')}
          </p>

          <div className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-emerald-300 rounded-2xl bg-emerald-50/40">
            {photoUrl ? (
              <div className="relative group">
                <img
                  src={photoUrl}
                  alt="Found Child"
                  className="w-36 h-36 rounded-2xl object-cover border-2 border-emerald-600 shadow-sm bg-white"
                />
                <button
                  type="button"
                  onClick={() => setPhotoUrl('')}
                  className="absolute -top-2 -right-2 p-1.5 rounded-full bg-red-600 text-white shadow-md text-xs hover:bg-red-700"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="text-center py-2 space-y-2.5 w-full">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Camera className="w-6 h-6" />
                </div>

                <div className="flex flex-col gap-2 w-full max-w-xs mx-auto">
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="user"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="w-full min-h-[50px] py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{t('take_photo_btn')}</span>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t('choose_gallery_btn')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPhotoUrl(DEMO_CHILD_FOUND_PHOTO);
                      setErrors((prev) => ({ ...prev, photo: '' }));
                    }}
                    className="text-xs text-blue-700 hover:text-blue-900 font-semibold underline"
                  >
                    {language === 'te' ? 'నమూనా బాలుని చిత్రం (రాజు)' : 'Use Demo Photo (Found Child)'}
                  </button>
                </div>
              </div>
            )}

            {errors.photo && (
              <p className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.photo}</span>
              </p>
            )}
          </div>
        </div>

        {/* Approximate Age & Language */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">
              {t('finder_approx_age')}
            </label>
            <input
              type="number"
              min="1"
              max="18"
              value={approxAge}
              onChange={(e) => setApproxAge(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 5"
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">
              {t('finder_language_label')}
            </label>
            <select
              value={languageSpoken}
              onChange={(e) => setLanguageSpoken(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
            >
              <option value="Telugu">{t('lang_telugu')}</option>
              <option value="Hindi">{t('lang_hindi')}</option>
              <option value="English">{t('lang_english')}</option>
              <option value="Other">{t('lang_other')}</option>
            </select>
          </div>
        </div>

        {/* Clothing Description (Optional) */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-800">
            {t('finder_clothing_label')}
          </label>
          <input
            type="text"
            value={clothing}
            onChange={(e) => setClothing(e.target.value)}
            placeholder={t('finder_clothing_placeholder')}
            className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
          />
        </div>

        {/* Geolocation & Nearest Police Booth Detection */}
        <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-red-600" />
              {gpsDetected ? t('gps_detected') : t('manual_location_fallback')}
            </span>
            <button
              type="button"
              onClick={detectLiveGPS}
              disabled={isLocating}
              className="text-[11px] text-blue-700 font-semibold hover:underline flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? t('gps_detecting') : 'GPS'}</span>
            </button>
          </div>

          {/* Ghat selector dropdown */}
          <select
            value={selectedGhatId}
            onChange={(e) => setSelectedGhatId(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-blue-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none"
          >
            {GHAT_LOCATIONS.map((g) => (
              <option key={g.id} value={g.id}>
                {language === 'te' ? g.nameTe : g.nameEn}
              </option>
            ))}
          </select>

          {/* Instant Nearest Booth Card */}
          <div className="p-2.5 bg-white rounded-xl border border-blue-200 text-xs shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 max-w-[70%]">
                <span className="font-bold text-slate-900 block truncate">
                  {t('booth_number_badge', { num: String(nearestBooth.booth.number) })} - {language === 'te' ? nearestBooth.booth.nameTelugu : nearestBooth.booth.name}
                </span>
                <p className="text-[11px] text-slate-500 truncate">
                  {language === 'te' ? nearestBooth.booth.landmarkTelugu : nearestBooth.booth.landmark}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-700">
                  ~{nearestBooth.distanceMeters}m
                </span>
                <p className="text-[10px] text-slate-500">
                  {Math.max(1, Math.round(nearestBooth.distanceMeters / 60))} min walk
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenBoothMap && onOpenBoothMap(nearestBooth.booth.id)}
              className="w-full py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 border border-blue-200 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{language === 'te' ? 'నడక మార్గం చూడండి (Preview Map)' : 'Preview Walking Route'}</span>
            </button>
          </div>
        </div>

        {/* Offline Queue Simulation Checkbox */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-slate-700">
            <input
              type="checkbox"
              checked={isOfflineSimulated}
              onChange={(e) => setIsOfflineSimulated(e.target.checked)}
              className="w-4 h-4 rounded-sm text-amber-600 focus:ring-amber-500"
            />
            <span className="text-[11px] font-medium">
              {language === 'te' ? 'ఆఫ్‌లైన్ నెట్‌వర్క్ డెమో టెస్ట్ (సిమ్యులేషన్)' : 'Simulate Offline Network Drop'}
            </span>
          </label>
          {isOfflineSimulated && (
            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
              Offline Test
            </span>
          )}
        </div>

        {/* Submit Button (min 56px height, high touch prominence) */}
        <div className="space-y-2 pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[56px] py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
          >
            <span>
              {isSubmitting
                ? t('loading')
                : t('finder_submit_btn')}
            </span>
            <Navigation className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs transition-colors"
          >
            {t('back_btn')}
          </button>
        </div>
      </form>
    </div>
  );
};
