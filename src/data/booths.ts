import { PoliceBooth, GhatLocation } from '../types';

export const POLICE_BOOTHS: PoliceBooth[] = [
  {
    id: 'booth-1',
    number: 1,
    name: 'Pushkar Ghat Central Booth',
    nameTelugu: 'పుష్కర్ ఘాట్ ప్రధాన పోలీస్ బూత్',
    landmark: 'Near VIP Entry Tower & River Stairs',
    landmarkTelugu: 'వీఐపీ ప్రవేశ గోపురం & నదీ మెట్ల వద్ద',
    lat: 17.0005,
    lng: 81.7770,
    phone: '0883-2471101',
    officerInCharge: 'SI K. Ramanjaneyulu (ID: AP-RJY-104)',
    activeCasesCount: 1,
    status: 'normal',
  },
  {
    id: 'booth-2',
    number: 2,
    name: 'Kotilingala Ghat Booth',
    nameTelugu: 'కోటిలింగాల ఘాట్ పోలీస్ బూత్',
    landmark: 'Near Shiva Temple Arch',
    landmarkTelugu: 'శివాలయం ఆర్చ్ సమీపంలో',
    lat: 17.0090,
    lng: 81.7725,
    phone: '0883-2471102',
    officerInCharge: 'SI P. Srinivas Rao (ID: AP-RJY-108)',
    activeCasesCount: 0,
    status: 'normal',
  },
  {
    id: 'booth-3',
    number: 3,
    name: 'Gowthami Ghat Booth',
    nameTelugu: 'గౌతమి ఘాట్ పోలీస్ బూత్',
    landmark: 'Near ISKCON Temple Roundabout',
    landmarkTelugu: 'ఇస్కాన్ ఆలయ కూడలి వద్ద',
    lat: 16.9930,
    lng: 81.7820,
    phone: '0883-2471103',
    officerInCharge: 'Insp. M. Lakshmi Prasanna (ID: AP-RJY-215)',
    activeCasesCount: 2,
    status: 'busy',
  },
  {
    id: 'booth-4',
    number: 4,
    name: 'Markandeya Ghat Booth',
    nameTelugu: 'మార్కండేయ ఘాట్ పోలీస్ బూత్',
    landmark: 'Behind Old Municipal Office',
    landmarkTelugu: 'పాత మునిసిపల్ కార్యాలయం వెనుక',
    lat: 17.0042,
    lng: 81.7750,
    phone: '0883-2471104',
    officerInCharge: 'SI Ch. Venkata Ratnam (ID: AP-RJY-119)',
    activeCasesCount: 0,
    status: 'normal',
  },
  {
    id: 'booth-5',
    number: 5,
    name: 'Saraswathi Ghat Booth',
    nameTelugu: 'సరస్వతి ఘాట్ పోలీస్ బూత్',
    landmark: 'Beside Havelock Bridge Promenade',
    landmarkTelugu: 'హేవ్‌లాక్ బ్రిడ్జ్ నడక మార్గం ప్రక్కన',
    lat: 16.9975,
    lng: 81.7795,
    phone: '0883-2471105',
    officerInCharge: 'SI G. Apparao (ID: AP-RJY-132)',
    activeCasesCount: 0,
    status: 'normal',
  },
  {
    id: 'booth-6',
    number: 6,
    name: 'Subrahmanya Maidan Transit Booth',
    nameTelugu: 'సుబ్రహ్మణ్య మైదానం హోల్డింగ్ బూత్',
    landmark: 'Pilgrim Holding Area 2 - West Gate',
    landmarkTelugu: 'భక్తుల హోల్డింగ్ ఏరియా 2 - పశ్చిమ ద్వారం',
    lat: 17.0020,
    lng: 81.7890,
    phone: '0883-2471106',
    officerInCharge: 'SI B. Suryanarayana (ID: AP-RJY-145)',
    activeCasesCount: 1,
    status: 'normal',
  },
  {
    id: 'booth-7',
    number: 7,
    name: 'Rajahmundry Railway Station Booth',
    nameTelugu: 'రైల్వే స్టేషన్ పోలీస్ సహాయ బూత్',
    landmark: 'Platform 1 Main Exit & Help Desk',
    landmarkTelugu: 'ప్లాట్‌ఫారమ్ 1 ప్రధాన నిష్క్రమణ & సహాయ కేంద్రం',
    lat: 16.9950,
    lng: 81.7915,
    phone: '0883-2471107',
    officerInCharge: 'Insp. R. Subba Rao (ID: AP-RJY-302)',
    activeCasesCount: 1,
    status: 'busy',
  },
  {
    id: 'booth-8',
    number: 8,
    name: 'APSRTC Central Bus Stand Booth',
    nameTelugu: 'సెంట్రల్ ఆర్టీసీ బస్టాండ్ పోలీస్ బూత్',
    landmark: 'Depot Gate 1 Passenger Concourse',
    landmarkTelugu: 'డిపో గేట్ 1 ప్రయాణీకుల ప్రాంగణం',
    lat: 17.0140,
    lng: 81.7960,
    phone: '0883-2471108',
    officerInCharge: 'SI T. Rajeshwari (ID: AP-RJY-178)',
    activeCasesCount: 0,
    status: 'normal',
  },
];

export const GHAT_LOCATIONS: GhatLocation[] = [
  { id: 'pushkar', nameEn: 'Pushkar Ghat (పుష్కర్ ఘాట్)', nameTe: 'పుష్కర్ ఘాట్', lat: 17.0005, lng: 81.7770, boothNumber: 1 },
  { id: 'kotilingala', nameEn: 'Kotilingala Ghat (కోటిలింగాల ఘాట్)', nameTe: 'కోటిలింగాల ఘాట్', lat: 17.0090, lng: 81.7725, boothNumber: 2 },
  { id: 'gowthami', nameEn: 'Gowthami Ghat (గౌతమి ఘాట్)', nameTe: 'గౌతమి ఘాట్', lat: 16.9930, lng: 81.7820, boothNumber: 3 },
  { id: 'markandeya', nameEn: 'Markandeya Ghat (మార్కండేయ ఘాట్)', nameTe: 'మార్కండేయ ఘాట్', lat: 17.0042, lng: 81.7750, boothNumber: 4 },
  { id: 'saraswathi', nameEn: 'Saraswathi Ghat (సరస్వతి ఘాట్)', nameTe: 'సరస్వతి ఘాట్', lat: 16.9975, lng: 81.7795, boothNumber: 5 },
  { id: 'subrahmanya', nameEn: 'Subrahmanya Maidan Camp (సుబ్రహ్మణ్య మైదానం)', nameTe: 'సుబ్రహ్మణ్య మైదానం', lat: 17.0020, lng: 81.7890, boothNumber: 6 },
  { id: 'railway', nameEn: 'Rajahmundry Railway Station (రైల్వే స్టేషన్)', nameTe: 'రైల్వే స్టేషన్', lat: 16.9950, lng: 81.7915, boothNumber: 7 },
  { id: 'busstand', nameEn: 'APSRTC Central Bus Stand (ఆర్టీసీ బస్టాండ్)', nameTe: 'ఆర్టీసీ బస్టాండ్', lat: 17.0140, lng: 81.7960, boothNumber: 8 },
];

export function findNearestBooth(lat: number, lng: number): { booth: PoliceBooth; distanceMeters: number } {
  let closest = POLICE_BOOTHS[0];
  let minDistance = calculateDistance(lat, lng, closest.lat, closest.lng);

  for (let i = 1; i < POLICE_BOOTHS.length; i++) {
    const d = calculateDistance(lat, lng, POLICE_BOOTHS[i].lat, POLICE_BOOTHS[i].lng);
    if (d < minDistance) {
      minDistance = d;
      closest = POLICE_BOOTHS[i];
    }
  }

  return { booth: closest, distanceMeters: Math.round(minDistance) };
}

// Haversine formula
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
