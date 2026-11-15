import React, { useState, useRef } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import { storageService } from '../../services/storageService';
import { GHAT_LOCATIONS } from '../../data/booths';
import { DEMO_CHILD_PARENT_PHOTO, compressImage, createSyntheticAvatarSvg } from '../../services/imageUtils';
import { ChildGender, MissingCase } from '../../types';
import {
  Upload,
  User,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Copy,
  AlertCircle,
  ShieldCheck,
  Check,
  ImageIcon
} from 'lucide-react';

interface ReportMissingChildProps {
  onCaseCreated: (createdCase: MissingCase) => void;
  onCancel: () => void;
}

export const ReportMissingChild: React.FC<ReportMissingChildProps> = ({
  onCaseCreated,
  onCancel,
}) => {
  const { t, language } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Steps: 1, 2, 3, or 'success'
  const [step, setStep] = useState<1 | 2 | 3 | 'success'>(1);
  const [createdCase, setCreatedCase] = useState<MissingCase | null>(null);
  const [copied, setCopied] = useState(false);

  // Form State
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [childName, setChildName] = useState<string>('');
  const [approxAge, setApproxAge] = useState<number | ''>('');
  const [gender, setGender] = useState<ChildGender>('boy');

  const [clothesDescription, setClothesDescription] = useState<string>('');
  const [specialMarks, setSpecialMarks] = useState<string>('');
  const [languageSpoken, setLanguageSpoken] = useState<string>('Telugu');
  const [lastSeenGhatId, setLastSeenGhatId] = useState<string>('pushkar');
  const [lastSeenTime, setLastSeenTime] = useState<string>('Within last 15 minutes');

  const [parentName, setParentName] = useState<string>('');
  const [parentPhone, setParentPhone] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('4821');
  const [consentGiven, setConsentGiven] = useState<boolean>(true);

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Quick Demo Auto-fill Helper
  const handleAutoFillDemo = () => {
    setPhotoUrl(DEMO_CHILD_PARENT_PHOTO);
    setChildName('Raju Varma');
    setApproxAge(5);
    setGender('boy');
    setClothesDescription('Yellow t-shirt with lion cartoon, dark blue denim shorts, brown sandals');
    setSpecialMarks('Small birthmark near right ear, black sacred thread on left ankle');
    setLanguageSpoken('Telugu');
    setLastSeenGhatId('pushkar');
    setLastSeenTime('Within last 15 minutes');
    setParentName('V. Venkata Subba Rao');
    setParentPhone('9849012345');
    setOtpCode('4821');
    setConsentGiven(true);
    setErrors({});
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

  // Step 1 Validation (Photo is now optional)
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!childName.trim()) {
      newErrors.childName = language === 'te' ? 'బిడ్డ పేరు నమోదు చేయండి' : 'Child name is required';
    }
    if (!approxAge || approxAge < 1 || approxAge > 18) {
      newErrors.approxAge = language === 'te' ? 'సరైన వయస్సును నమోదు చేయండి (1-18)' : 'Valid age (1-18) is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!clothesDescription.trim()) {
      newErrors.clothes = language === 'te' ? 'దుస్తుల వివరాలు నమోదు చేయండి' : 'Clothing description helps identification';
    }
    if (!lastSeenGhatId) {
      newErrors.ghat = language === 'te' ? 'చివరిగా కనిపించిన ఘాట్‌ను ఎంచుకోండి' : 'Please select last seen location';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 3 Validation
  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!parentName.trim()) {
      newErrors.parentName = language === 'te' ? 'తల్లి/తండ్రి పేరు నమోదు చేయండి' : 'Parent name is required';
    }
    if (!parentPhone.trim() || parentPhone.replace(/\D/g, '').length < 10) {
      newErrors.parentPhone = language === 'te' ? '10 అంకెల మొబైల్ నంబర్ తప్పనిసరి' : 'Valid 10-digit mobile number required';
    }
    if (!otpCode || otpCode.length !== 4) {
      newErrors.otp = language === 'te' ? '4 అంకెల OTP అవసరం' : '4-digit OTP is required';
    }
    if (!consentGiven) {
      newErrors.consent = language === 'te' ? 'దయచేసి నిబంధనలను అంగీకరించండి' : 'Consent is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 2 && validateStep2()) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsSubmitting(true);

    const selectedGhat = GHAT_LOCATIONS.find((g) => g.id === lastSeenGhatId);
    const locationName = selectedGhat
      ? (language === 'te' ? selectedGhat.nameTe : selectedGhat.nameEn)
      : 'Pushkar Ghat, Rajamahendravaram';

    // If parent did not provide a photo, generate a clean synthetic avatar
    const finalPhotoUrl =
      photoUrl ||
      createSyntheticAvatarSvg(
        childName.trim() || 'Child',
        gender === 'girl' ? 'girl' : 'boy',
        gender === 'boy' ? '#3B82F6' : '#EC4899'
      );

    setTimeout(() => {
      const newCase = storageService.saveMissingCase({
        childName: childName.trim(),
        approxAge: Number(approxAge),
        gender,
        photoUrl: finalPhotoUrl,
        clothesDescription: clothesDescription.trim(),
        specialMarks: specialMarks.trim() || undefined,
        languageSpoken,
        lastSeenLocation: locationName,
        lastSeenGhatId,
        lastSeenTime,
        parentName: parentName.trim(),
        parentPhone: parentPhone.trim(),
      });

      setCreatedCase(newCase);
      setIsSubmitting(false);
      setStep('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  const handleCopyCaseId = () => {
    if (createdCase?.id) {
      navigator.clipboard.writeText(createdCase.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // SUCCESS CONFIRMATION SCREEN
  if (step === 'success' && createdCase) {
    return (
      <div className="max-w-md mx-auto p-4 space-y-4 animate-fadeIn">
        <div className="bg-white rounded-2xl p-6 text-center border border-slate-200 shadow-sm space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">
              {t('case_registered_title')}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('case_registered_subtitle')}
            </p>
          </div>

          {/* Case ID Box */}
          <div className="p-4 bg-slate-50 border-2 border-dashed border-blue-300 rounded-xl space-y-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('case_id_label')}
            </span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-black text-blue-900 font-mono tracking-wider">
                {createdCase.id}
              </span>
              <button
                onClick={handleCopyCaseId}
                className="p-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 transition-colors"
                title="Copy Case ID"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              {t('save_case_id_tip')}
            </p>
          </div>

          {/* Child Details Card */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3 text-left">
            <img
              src={createdCase.photoUrl}
              alt={createdCase.childName}
              className="w-14 h-14 rounded-lg object-cover border border-slate-200 bg-white"
            />
            <div className="text-xs space-y-0.5">
              <p className="font-bold text-slate-900 text-sm">{createdCase.childName}</p>
              <p className="text-slate-600">
                {createdCase.approxAge} {language === 'te' ? 'సంవత్సరాలు' : 'Years'} •{' '}
                {createdCase.gender === 'boy' ? t('gender_boy') : t('gender_girl')}
              </p>
              <p className="text-slate-500 truncate max-w-[200px]">{createdCase.lastSeenLocation}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => onCaseCreated(createdCase)}
              className="w-full min-h-[56px] py-3.5 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
            >
              <span>{t('track_case_btn')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={onCancel}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs transition-colors"
            >
              {t('return_home_btn')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      {/* Title & Quick Demo Fill */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {t('report_missing_title')}
          </h2>
          <p className="text-xs text-slate-500">
            {t('step_indicator', { step: String(step) })}
          </p>
        </div>

        <button
          type="button"
          onClick={handleAutoFillDemo}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-300 text-xs font-semibold hover:bg-amber-100 active:scale-95 transition-all shadow-2xs"
          title="Fills realistic test data for demonstration"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>{language === 'te' ? 'నమూనా డేటా నింపండి' : 'Demo Auto-Fill'}</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
        <div
          className="bg-red-600 h-full transition-all duration-300"
          style={{ width: `${((step === 'success' ? 3 : step) / 3) * 100}%` }}
        />
      </div>

      {/* Step Pills */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
        <span className={step === 'success' || step >= 1 ? 'text-red-700' : ''}>{t('parent_step_1')}</span>
        <span className={step === 'success' || step >= 2 ? 'text-red-700' : ''}>{t('parent_step_2')}</span>
        <span className={step === 'success' || step >= 3 ? 'text-red-700' : ''}>{t('parent_step_3')}</span>
      </div>

      {/* FORM BODY */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            {/* Child Photo Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {language === 'te' ? 'చిన్నారి ఫోటో (ఐచ్ఛికం)' : 'Child Photo (Optional)'}
                </label>
                <span className="text-[11px] text-slate-500 font-medium">
                  {language === 'te' ? 'లేకపోయినా సమర్పించవచ్చు' : 'Can submit without photo'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {language === 'te'
                  ? 'మీ పరికరం నుండి ఫోటోను అప్‌లోడ్ చేయవచ్చు, లేదా ఫోటో లేకుండానే నేరుగా తదుపరి దశకు వెళ్లవచ్చు.'
                  : 'Upload an existing photo from your device, use a demo photo, or proceed directly without one.'}
              </p>

              {/* Photo Preview & Options */}
              <div className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-slate-100/60 transition-colors">
                {photoUrl ? (
                  <div className="relative group text-center space-y-1">
                    <img
                      src={photoUrl}
                      alt="Child Preview"
                      className="w-36 h-36 mx-auto rounded-2xl object-cover border-2 border-blue-600 shadow-sm bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-semibold pt-1"
                    >
                      <span>{language === 'te' ? 'ఫోటో తొలగించు' : 'Remove Photo'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-3 space-y-2.5 w-full">
                    <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                      <ImageIcon className="w-6 h-6" />
                    </div>

                    <div className="flex flex-col gap-2 w-full max-w-xs mx-auto">
                      {/* File upload input (Device gallery / files only, NO camera capture) */}
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
                        className="w-full py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition-all"
                      >
                        <Upload className="w-4 h-4 text-slate-500" />
                        <span>{t('choose_gallery_btn')}</span>
                      </button>

                      {/* Synthetic Sample Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoUrl(DEMO_CHILD_PARENT_PHOTO);
                          setErrors((prev) => ({ ...prev, photo: '' }));
                        }}
                        className="text-xs text-blue-700 hover:text-blue-900 font-semibold underline pt-0.5"
                      >
                        {t('use_sample_photo')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Child Full Name */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">
                {t('child_name_label')} <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => {
                    setChildName(e.target.value);
                    if (errors.childName) setErrors((prev) => ({ ...prev, childName: '' }));
                  }}
                  placeholder={t('child_name_placeholder')}
                  className="w-full pl-9 pr-3 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                />
              </div>
              {errors.childName && (
                <p className="text-xs text-red-600 font-medium">{errors.childName}</p>
              )}
            </div>

            {/* Age & Gender Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Age */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  {t('child_age_label')} <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="18"
                  value={approxAge}
                  onChange={(e) => {
                    setApproxAge(e.target.value === '' ? '' : Number(e.target.value));
                    if (errors.approxAge) setErrors((prev) => ({ ...prev, approxAge: '' }));
                  }}
                  placeholder="e.g. 5"
                  className="w-full px-3 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                />
                {errors.approxAge && (
                  <p className="text-xs text-red-600 font-medium">{errors.approxAge}</p>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  {t('child_gender_label')}
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as ChildGender)}
                  className="w-full px-3 py-3 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                >
                  <option value="boy">{t('gender_boy')}</option>
                  <option value="girl">{t('gender_girl')}</option>
                  <option value="other">{t('gender_other')}</option>
                </select>
              </div>
            </div>

            {/* Next Step 1 Button */}
            <button
              type="button"
              onClick={handleNext}
              className="w-full min-h-[56px] py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
            >
              <span>{t('next_btn', { step: '2' })}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            {/* Clothing Description */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">
                {t('clothes_label')} <span className="text-red-600">*</span>
              </label>
              <textarea
                rows={2}
                value={clothesDescription}
                onChange={(e) => {
                  setClothesDescription(e.target.value);
                  if (errors.clothes) setErrors((prev) => ({ ...prev, clothes: '' }));
                }}
                placeholder={t('clothes_placeholder')}
                className="w-full p-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              />
              {errors.clothes && (
                <p className="text-xs text-red-600 font-medium">{errors.clothes}</p>
              )}
            </div>

            {/* Special Marks */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">
                {t('marks_label')}
              </label>
              <input
                type="text"
                value={specialMarks}
                onChange={(e) => setSpecialMarks(e.target.value)}
                placeholder={t('marks_placeholder')}
                className="w-full px-3 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              />
            </div>

            {/* Language Spoken */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">
                {t('language_label')}
              </label>
              <select
                value={languageSpoken}
                onChange={(e) => setLanguageSpoken(e.target.value)}
                className="w-full px-3 py-3 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              >
                <option value="Telugu">{t('lang_telugu')}</option>
                <option value="Hindi">{t('lang_hindi')}</option>
                <option value="English">{t('lang_english')}</option>
                <option value="Odia">{t('lang_oriya')}</option>
                <option value="Kannada">{t('lang_kannada')}</option>
                <option value="Other">{t('lang_other')}</option>
              </select>
            </div>

            {/* Last Seen Ghat */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">
                {t('last_seen_place_label')} <span className="text-red-600">*</span>
              </label>
              <select
                value={lastSeenGhatId}
                onChange={(e) => {
                  setLastSeenGhatId(e.target.value);
                  if (errors.ghat) setErrors((prev) => ({ ...prev, ghat: '' }));
                }}
                className="w-full px-3 py-3 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              >
                {GHAT_LOCATIONS.map((ghat) => (
                  <option key={ghat.id} value={ghat.id}>
                    {language === 'te' ? ghat.nameTe : ghat.nameEn} (బూత్ #{ghat.boothNumber})
                  </option>
                ))}
              </select>
              {errors.ghat && (
                <p className="text-xs text-red-600 font-medium">{errors.ghat}</p>
              )}
            </div>

            {/* Last Seen Time */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">
                {t('last_seen_time_label')}
              </label>
              <select
                value={lastSeenTime}
                onChange={(e) => setLastSeenTime(e.target.value)}
                className="w-full px-3 py-3 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              >
                <option value="Within last 15 minutes">{t('time_just_now')}</option>
                <option value="30 - 60 minutes ago">{t('time_30_min')}</option>
                <option value="1 to 2 hours ago">{t('time_1_to_2_hr')}</option>
                <option value="More than 2 hours ago">{t('time_more_than_2_hr')}</option>
              </select>
            </div>

            {/* Navigation buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="min-h-[56px] py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm flex items-center justify-center gap-1.5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t('back_btn')}</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="min-h-[56px] py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all"
              >
                <span>{t('next_btn', { step: '3' })}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            {/* Parent Name */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">
                {t('parent_name_label')} <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={parentName}
                onChange={(e) => {
                  setParentName(e.target.value);
                  if (errors.parentName) setErrors((prev) => ({ ...prev, parentName: '' }));
                }}
                placeholder={t('parent_name_placeholder')}
                className="w-full px-3 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              />
              {errors.parentName && (
                <p className="text-xs text-red-600 font-medium">{errors.parentName}</p>
              )}
            </div>

            {/* Parent Phone */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">
                {t('parent_phone_label')} <span className="text-red-600">*</span>
              </label>
              <div className="flex gap-2">
                <span className="inline-flex items-center px-3 py-3 bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-700">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={parentPhone}
                  onChange={(e) => {
                    setParentPhone(e.target.value);
                    if (errors.parentPhone) setErrors((prev) => ({ ...prev, parentPhone: '' }));
                  }}
                  placeholder={t('parent_phone_placeholder')}
                  className="w-full px-3 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium tracking-wider"
                />
              </div>
              {errors.parentPhone && (
                <p className="text-xs text-red-600 font-medium">{errors.parentPhone}</p>
              )}
            </div>

            {/* Mock OTP Verification */}
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-blue-900">
                  {t('verify_otp_label')}
                </label>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Verified
                </span>
              </div>
              <input
                type="text"
                maxLength={4}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-blue-300 rounded-lg text-center font-mono font-bold text-lg tracking-widest text-blue-900"
              />
              <p className="text-[11px] text-blue-700">
                {t('otp_help_text')}
              </p>
            </div>

            {/* Privacy Consent Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded-sm border-slate-300 text-blue-700 focus:ring-blue-600"
                />
                <span className="leading-relaxed">
                  {t('consent_checkbox')}
                </span>
              </label>
              {errors.consent && (
                <p className="text-xs text-red-600 font-medium mt-1">{errors.consent}</p>
              )}
            </div>

            {/* Privacy Guarantee Note */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 text-slate-600 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {language === 'te'
                  ? 'మీ బిడ్డ ఫోటో ఏ బహిరంగ గ్యాలరీలోనూ కనిపించదు. కేవలం AI మ్యాచింగ్ కోసమే ఉపయోగిస్తాము.'
                  : 'Your child’s photo is strictly confidential and never displayed in any public gallery.'}
              </span>
            </div>

            {/* Submit & Back buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="min-h-[56px] py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm flex items-center justify-center gap-1.5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t('back_btn')}</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="min-h-[56px] py-3.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all"
              >
                <span>{isSubmitting ? t('submitting') : t('submit_report_btn')}</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
