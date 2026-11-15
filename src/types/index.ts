export type Language = 'te' | 'en';

export type ChildGender = 'boy' | 'girl' | 'other';

export type CaseStatus = 
  | 'searching' 
  | 'possible_match' 
  | 'reunited' 
  | 'closed';

export interface PoliceBooth {
  id: string;
  number: number;
  name: string;
  nameTelugu: string;
  landmark: string;
  landmarkTelugu: string;
  lat: number;
  lng: number;
  phone: string;
  officerInCharge: string;
  activeCasesCount: number;
  status: 'normal' | 'busy' | 'critical';
}

export interface MissingCase {
  id: string; // TH-2027-xxxxx
  createdAt: number;
  childName: string;
  approxAge: number;
  gender: ChildGender;
  photoUrl: string;
  photoDeleted?: boolean;
  clothesDescription: string;
  specialMarks?: string;
  languageSpoken: string;
  lastSeenLocation: string;
  lastSeenGhatId?: string;
  lastSeenTime: string;
  parentName: string;
  parentPhone: string;
  status: CaseStatus;
  matchedFoundId?: string;
  matchedBoothId?: string;
  handoverOtp?: string; // 4-digit code shown to parent
  handoverCompletedAt?: number;
  handoverOfficerName?: string;
  handoverIdType?: string;
  handoverIdNumber?: string;
}

export interface FoundEntry {
  id: string; // FD-2027-xxxxx
  createdAt: number;
  approxAge: number;
  gender?: ChildGender;
  photoUrl: string;
  photoDeleted?: boolean;
  clothesDescription?: string;
  languageSpoken?: string;
  foundLocation: string;
  foundGhatId?: string;
  nearestBoothId: string;
  finderPhone?: string;
  finderName?: string;
  arrivedAtBooth: boolean;
  arrivedAtTime?: number;
  status: 'pending_arrival' | 'at_booth' | 'matched' | 'reunited';
  assignedOfficer?: string;
}

export interface MatchConfidenceReason {
  category: string; // 'clothing' | 'facial' | 'location' | 'age' | 'language';
  score: number;
  description: string;
}

export interface MatchRecord {
  id: string; // MT-xxxxx
  missingCaseId: string;
  foundEntryId: string;
  confidenceScore: number; // 0-100
  aiReasons: string[];
  attributesBreakdown?: MatchConfidenceReason[];
  status: 'pending_review' | 'confirmed' | 'rejected';
  reviewedByOfficer?: string;
  reviewedAt?: number;
  officerNotes?: string;
  notifiedParentAt?: number;
}

export interface AuditLog {
  id: string;
  timestamp: number;
  action: 'photo_view' | 'case_created' | 'match_generated' | 'match_confirmed' | 'handover_completed' | 'photos_purged';
  officerId: string;
  officerName: string;
  boothId: string;
  caseId?: string;
  details: string;
}

export interface GhatLocation {
  id: string;
  nameEn: string;
  nameTe: string;
  lat: number;
  lng: number;
  boothNumber: number;
}
