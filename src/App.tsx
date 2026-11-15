import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { EmergencyModal } from './components/EmergencyModal';
import { PrivacyInfoModal } from './components/PrivacyInfoModal';
import { BoothMapModal } from './components/common/BoothMapModal';
import { HomeScreen } from './components/home/HomeScreen';
import { ReportMissingChild } from './components/parent/ReportMissingChild';
import { FoundChildFlow } from './components/finder/FoundChildFlow';
import { CaseStatusView } from './components/parent/CaseStatusView';
import { PoliceLoginView } from './components/police/PoliceLoginView';
import { PoliceConsoleView } from './components/police/PoliceConsoleView';
import { MissingCase, FoundEntry } from './types';

type Screen = 'home' | 'parent_report' | 'finder_report' | 'parent_status' | 'police_login' | 'police_console' | 'demo_mode';

interface LoggedOfficer {
  username: string;
  name: string;
  boothId: string;
  boothName: string;
}

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);

  // Map Modal State for Walking Directions
  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);
  const [mapBoothId, setMapBoothId] = useState<string>('booth-1');

  // Police Session State (persisted in sessionStorage)
  const [officer, setOfficer] = useState<LoggedOfficer | null>(() => {
    try {
      const saved = sessionStorage.getItem('thodu_officer');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleOpenMap = (boothId?: string) => {
    if (boothId) setMapBoothId(boothId);
    setIsMapModalOpen(true);
  };

  const handleCaseCreated = (createdCase: MissingCase) => {
    setSelectedCaseId(createdCase.id);
    setCurrentScreen('parent_status');
  };

  const handleFoundCreated = (_entry: FoundEntry) => {
    // User stays on confirmation or can return to home
  };

  const handleTrackCaseId = (caseId: string) => {
    setSelectedCaseId(caseId);
    setCurrentScreen('parent_status');
  };

  const handleSelectRole = (role: 'parent_report' | 'finder_report' | 'police_login' | 'parent_status' | 'demo_mode') => {
    if (role === 'police_login') {
      if (officer) {
        setCurrentScreen('police_console');
      } else {
        setCurrentScreen('police_login');
      }
    } else {
      setCurrentScreen(role);
    }
  };

  const handlePoliceLoginSuccess = (loggedOfficer: LoggedOfficer) => {
    setOfficer(loggedOfficer);
    sessionStorage.setItem('thodu_officer', JSON.stringify(loggedOfficer));
    setCurrentScreen('police_console');
  };

  const handlePoliceLogout = () => {
    setOfficer(null);
    sessionStorage.removeItem('thodu_officer');
    setCurrentScreen('home');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900 antialiased">
      {/* Top Header */}
      <Header
        currentScreen={currentScreen}
        onNavigateHome={() => setCurrentScreen('home')}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 pb-10">
        {currentScreen === 'home' && (
          <HomeScreen
            onSelectRole={handleSelectRole}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
            onTrackCaseId={handleTrackCaseId}
          />
        )}

        {currentScreen === 'parent_report' && (
          <ReportMissingChild
            onCaseCreated={handleCaseCreated}
            onCancel={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'finder_report' && (
          <FoundChildFlow
            onFoundCreated={handleFoundCreated}
            onCancel={() => setCurrentScreen('home')}
            onOpenBoothMap={handleOpenMap}
          />
        )}

        {currentScreen === 'parent_status' && (
          <CaseStatusView
            initialCaseId={selectedCaseId}
            onNavigateHome={() => setCurrentScreen('home')}
            onOpenBoothMap={handleOpenMap}
          />
        )}

        {currentScreen === 'police_login' && (
          <PoliceLoginView
            onLoginSuccess={handlePoliceLoginSuccess}
            onCancel={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'police_console' && (
          officer ? (
            <PoliceConsoleView
              officer={officer}
              onLogout={handlePoliceLogout}
              onOpenBoothMap={handleOpenMap}
            />
          ) : (
            <PoliceLoginView
              onLoginSuccess={handlePoliceLoginSuccess}
              onCancel={() => setCurrentScreen('home')}
            />
          )
        )}

        {currentScreen === 'demo_mode' && (
          <div className="max-w-md mx-auto p-4 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold text-lg">
                ⚡
              </div>
              <h3 className="font-bold text-base text-slate-900">Live Demo Mode</h3>
              <p className="text-xs text-slate-600">
                Interactive step-by-step presentation script is scheduled for Phase 4. All Parent, Finder, and Police flows are fully active right now!
              </p>
              <button
                onClick={() => setCurrentScreen('home')}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Walking Directions & Booth Map Modal */}
      <BoothMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        boothId={mapBoothId}
      />

      {/* Emergency Helplines Modal */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />

      {/* Privacy Guarantee Modal */}
      <PrivacyInfoModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      {/* Official Footer */}
      <Footer
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
