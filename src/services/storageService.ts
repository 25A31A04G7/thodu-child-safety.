import { MissingCase, FoundEntry, MatchRecord, AuditLog } from '../types';
import { DEMO_CHILD_PARENT_PHOTO, DEMO_CHILD_FOUND_PHOTO, DEMO_CHILD_PRIYA_PHOTO } from './imageUtils';

const STORAGE_KEYS = {
  MISSING_CASES: 'thodu_missing_cases_v1',
  FOUND_ENTRIES: 'thodu_found_entries_v1',
  MATCHES: 'thodu_matches_v1',
  AUDIT_LOGS: 'thodu_audit_logs_v1',
  OFFLINE_QUEUE: 'thodu_offline_queue_v1',
  ACTIVE_CASE_ID: 'thodu_last_parent_case_id',
};

// Initial Seed Data for immediate testing & demo
const SEED_MISSING_CASES: MissingCase[] = [
  {
    id: 'TH-2027-00101',
    createdAt: Date.now() - 3600000 * 2, // 2 hrs ago
    childName: 'Priya Reddy',
    approxAge: 4,
    gender: 'girl',
    photoUrl: DEMO_CHILD_PRIYA_PHOTO,
    clothesDescription: 'Pink dress with white polka dots, pink hair clips',
    specialMarks: 'Tiny mole under right eye',
    languageSpoken: 'Telugu',
    lastSeenLocation: 'Kotilingala Ghat (కోటిలింగాల ఘాట్)',
    lastSeenGhatId: 'kotilingala',
    lastSeenTime: '1 to 2 hours ago',
    parentName: 'R. Koteswara Rao',
    parentPhone: '9848022334',
    status: 'searching',
  },
  {
    id: 'TH-2027-00102',
    createdAt: Date.now() - 3600000 * 4,
    childName: 'Sai Tarun',
    approxAge: 6,
    gender: 'boy',
    photoUrl: DEMO_CHILD_PARENT_PHOTO,
    clothesDescription: 'Blue kurtha, white pajama',
    specialMarks: 'Scar on left elbow',
    languageSpoken: 'Telugu',
    lastSeenLocation: 'Gowthami Ghat (గౌతమి ఘాట్)',
    lastSeenGhatId: 'gowthami',
    lastSeenTime: 'More than 2 hours ago',
    parentName: 'K. Padma',
    parentPhone: '9440112233',
    status: 'searching',
  }
];

const SEED_FOUND_ENTRIES: FoundEntry[] = [
  {
    id: 'FD-2027-00201',
    createdAt: Date.now() - 1800000,
    approxAge: 4,
    gender: 'girl',
    photoUrl: DEMO_CHILD_PRIYA_PHOTO,
    clothesDescription: 'Pink dress with polka dots',
    languageSpoken: 'Telugu',
    foundLocation: 'Kotilingala Ghat Promenade',
    foundGhatId: 'kotilingala',
    nearestBoothId: 'booth-2',
    finderPhone: '9123456780',
    finderName: 'Anil Kumar (Seva Dal Volunteer)',
    arrivedAtBooth: true,
    arrivedAtTime: Date.now() - 1200000,
    status: 'at_booth',
    assignedOfficer: 'SI P. Srinivas Rao',
  }
];

// Initial match between Priya and Found child
const SEED_MATCHES: MatchRecord[] = [
  {
    id: 'MT-0091',
    missingCaseId: 'TH-2027-00101',
    foundEntryId: 'FD-2027-00201',
    confidenceScore: 94,
    aiReasons: [
      'Facial profile and approximate age match (~4 years)',
      'Specific clothing matched: Pink polka dot dress',
      'Location proximity: Kotilingala Ghat promenade to Booth #2'
    ],
    attributesBreakdown: [
      { category: 'facial', score: 92, description: 'High visual facial feature alignment' },
      { category: 'clothing', score: 98, description: 'Exact match: Pink polka dot dress' },
      { category: 'location', score: 95, description: 'Found within 250m of last seen area' },
      { category: 'age', score: 90, description: 'Reported 4 yrs, estimated 4 yrs' }
    ],
    status: 'pending_review',
  }
];

const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'AUD-001',
    timestamp: Date.now() - 1200000,
    action: 'match_generated',
    officerId: 'AI-SYSTEM',
    officerName: 'Gemini Pushkaralu AI Engine',
    boothId: 'booth-2',
    caseId: 'TH-2027-00101',
    details: 'Automated 94% confidence match generated for case TH-2027-00101',
  },
  {
    id: 'AUD-002',
    timestamp: Date.now() - 600000,
    action: 'photo_view',
    officerId: 'AP-RJY-108',
    officerName: 'SI P. Srinivas Rao',
    boothId: 'booth-2',
    caseId: 'TH-2027-00101',
    details: 'Officer accessed missing and found photos for manual match review',
  }
];

class StorageService {
  private listeners: (() => void)[] = [];

  constructor() {
    this.initSeedData();
  }

  private initSeedData() {
    if (!localStorage.getItem(STORAGE_KEYS.MISSING_CASES)) {
      localStorage.setItem(STORAGE_KEYS.MISSING_CASES, JSON.stringify(SEED_MISSING_CASES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.FOUND_ENTRIES)) {
      localStorage.setItem(STORAGE_KEYS.FOUND_ENTRIES, JSON.stringify(SEED_FOUND_ENTRIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MATCHES)) {
      localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(SEED_MATCHES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(SEED_AUDIT_LOGS));
    }
  }

  public subscribe(callback: () => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.error('Storage listener error:', err);
      }
    });
  }

  // Missing Cases
  public getMissingCases(): MissingCase[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MISSING_CASES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public getMissingCaseById(id: string): MissingCase | undefined {
    return this.getMissingCases().find((c) => c.id.toUpperCase() === id.toUpperCase());
  }

  public saveMissingCase(caseData: Omit<MissingCase, 'id' | 'createdAt' | 'status'> & { id?: string }): MissingCase {
    const cases = this.getMissingCases();
    const count = cases.length + 103;
    const id = caseData.id || `TH-2027-${String(count).padStart(5, '0')}`;
    
    const newCase: MissingCase = {
      ...caseData,
      id,
      createdAt: Date.now(),
      status: 'searching',
    };

    cases.unshift(newCase);
    localStorage.setItem(STORAGE_KEYS.MISSING_CASES, JSON.stringify(cases));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_CASE_ID, id);

    this.addAuditLog({
      action: 'case_created',
      officerId: 'CITIZEN-PORTAL',
      officerName: 'Parent Self-Report',
      boothId: 'ONLINE',
      caseId: id,
      details: `New missing child report filed for ${newCase.childName} (${newCase.approxAge} yrs).`,
    });

    this.notify();
    return newCase;
  }

  public updateMissingCase(id: string, updates: Partial<MissingCase>): MissingCase | null {
    const cases = this.getMissingCases();
    const index = cases.findIndex((c) => c.id === id);
    if (index === -1) return null;

    cases[index] = { ...cases[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.MISSING_CASES, JSON.stringify(cases));
    this.notify();
    return cases[index];
  }

  public getActiveCaseId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_CASE_ID);
  }

  // Found Entries
  public getFoundEntries(): FoundEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FOUND_ENTRIES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public getFoundEntryById(id: string): FoundEntry | undefined {
    return this.getFoundEntries().find((f) => f.id === id);
  }

  public saveFoundEntry(entryData: Omit<FoundEntry, 'id' | 'createdAt' | 'status' | 'arrivedAtBooth'>): FoundEntry {
    const entries = this.getFoundEntries();
    const count = entries.length + 203;
    const id = `FD-2027-${String(count).padStart(5, '0')}`;

    const newEntry: FoundEntry = {
      ...entryData,
      id,
      createdAt: Date.now(),
      arrivedAtBooth: false,
      status: 'pending_arrival',
    };

    entries.unshift(newEntry);
    localStorage.setItem(STORAGE_KEYS.FOUND_ENTRIES, JSON.stringify(entries));

    this.addAuditLog({
      action: 'case_created',
      officerId: 'SAMARITAN-PORTAL',
      officerName: 'Finder Report',
      boothId: entryData.nearestBoothId,
      details: `Found child reported at ${entryData.foundLocation}. Directing to ${entryData.nearestBoothId}.`,
    });

    this.notify();
    return newEntry;
  }

  public markChildArrivedAtBooth(foundId: string, officerName: string): boolean {
    const entries = this.getFoundEntries();
    const index = entries.findIndex((e) => e.id === foundId);
    if (index === -1) return false;

    entries[index].arrivedAtBooth = true;
    entries[index].arrivedAtTime = Date.now();
    entries[index].status = 'at_booth';
    entries[index].assignedOfficer = officerName;

    localStorage.setItem(STORAGE_KEYS.FOUND_ENTRIES, JSON.stringify(entries));
    this.notify();
    return true;
  }

  // Matches
  public getMatches(): MatchRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MATCHES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public saveMatch(match: Omit<MatchRecord, 'id'>): MatchRecord {
    const matches = this.getMatches();
    const id = `MT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newMatch: MatchRecord = { ...match, id };
    matches.unshift(newMatch);
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
    this.notify();
    return newMatch;
  }

  public updateMatchStatus(matchId: string, status: 'confirmed' | 'rejected', officerName: string, notes?: string): boolean {
    const matches = this.getMatches();
    const matchIndex = matches.findIndex((m) => m.id === matchId);
    if (matchIndex === -1) return false;

    matches[matchIndex].status = status;
    matches[matchIndex].reviewedByOfficer = officerName;
    matches[matchIndex].reviewedAt = Date.now();
    matches[matchIndex].officerNotes = notes;

    const targetMatch = matches[matchIndex];

    if (status === 'confirmed') {
      // Find found entry to assign booth
      const foundEntry = this.getFoundEntryById(targetMatch.foundEntryId);
      const boothId = foundEntry?.nearestBoothId || 'booth-1';
      const otp = String(Math.floor(1000 + Math.random() * 9000));

      this.updateMissingCase(targetMatch.missingCaseId, {
        status: 'possible_match',
        matchedFoundId: targetMatch.foundEntryId,
        matchedBoothId: boothId,
        handoverOtp: otp,
      });

      this.addAuditLog({
        action: 'match_confirmed',
        officerId: officerName,
        officerName,
        boothId,
        caseId: targetMatch.missingCaseId,
        details: `Police officer confirmed match between Case ${targetMatch.missingCaseId} and Found ${targetMatch.foundEntryId}. Parent alerted with OTP.`,
      });
    }

    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
    this.notify();
    return true;
  }

  // Complete Handover & Privacy Photo Deletion
  public completeHandover(missingCaseId: string, officerName: string, idType: string, idNumber: string): boolean {
    const targetCase = this.getMissingCaseById(missingCaseId);
    if (!targetCase) return false;

    // Purge photos permanently for privacy
    this.updateMissingCase(missingCaseId, {
      status: 'reunited',
      photoUrl: '',
      photoDeleted: true,
      handoverCompletedAt: Date.now(),
      handoverOfficerName: officerName,
      handoverIdType: idType,
      handoverIdNumber: idNumber,
    });

    if (targetCase.matchedFoundId) {
      const founds = this.getFoundEntries();
      const fIdx = founds.findIndex((f) => f.id === targetCase.matchedFoundId);
      if (fIdx !== -1) {
        founds[fIdx].status = 'reunited';
        founds[fIdx].photoUrl = '';
        founds[fIdx].photoDeleted = true;
        localStorage.setItem(STORAGE_KEYS.FOUND_ENTRIES, JSON.stringify(founds));
      }
    }

    this.addAuditLog({
      action: 'handover_completed',
      officerId: officerName,
      officerName,
      boothId: targetCase.matchedBoothId || 'booth-1',
      caseId: missingCaseId,
      details: `Safe child handover completed to verified parent. Verified with ${idType} (${idNumber}). Photos purged permanently.`,
    });

    this.addAuditLog({
      action: 'photos_purged',
      officerId: 'PRIVACY-SYSTEM',
      officerName: 'Auto-Purge Protocol',
      boothId: targetCase.matchedBoothId || 'booth-1',
      caseId: missingCaseId,
      details: `Photos for Case ${missingCaseId} successfully scrubbed per Pushkaralu privacy guidelines.`,
    });

    this.notify();
    return true;
  }

  // Audit Logs
  public getAuditLogs(): AuditLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>) {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      ...log,
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: Date.now(),
    };
    logs.unshift(newLog);
    // Keep last 100 audit entries
    if (logs.length > 100) logs.pop();
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
    this.notify();
  }

  // Reset demo state if desired
  public resetToDefaultSeed() {
    localStorage.removeItem(STORAGE_KEYS.MISSING_CASES);
    localStorage.removeItem(STORAGE_KEYS.FOUND_ENTRIES);
    localStorage.removeItem(STORAGE_KEYS.MATCHES);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    this.initSeedData();
    this.notify();
  }
}

export const storageService = new StorageService();
