const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('safelink_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'API Error');
    return data;
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err);
    throw err;
  }
}

/* ── Helplines Data (embedded for crash-safety) ── */
export const HELPLINES = [
  { id: '1', name: 'Police Emergency', number: '100', category: 'police', icon: '👮', description: 'Police Emergency', is_toll_free: true, available_24_7: true },
  { id: '2', name: 'CATS Ambulance', number: '108', category: 'medical', icon: '🚑', description: 'Ambulance Service', is_toll_free: true, available_24_7: true },
  { id: '3', name: 'Fire Emergency', number: '101', category: 'fire', icon: '🔥', description: 'Fire Department', is_toll_free: true, available_24_7: true },
  { id: '4', name: 'Women Helpline', number: '1091', category: 'women', icon: '🛡️', description: 'Women Safety Helpline', is_toll_free: true, available_24_7: true },
  { id: '5', name: 'Women in Distress', number: '181', category: 'women', icon: '💜', description: 'Sakhi One-Stop Centre', is_toll_free: true, available_24_7: true },
  { id: '6', name: 'Childline India', number: '1098', category: 'children', icon: '👶', description: 'Child Safety & Protection', is_toll_free: true, available_24_7: true },
  { id: '7', name: 'Elder Helpline', number: '14567', category: 'senior', icon: '👴', description: 'Senior Citizen Support', is_toll_free: true, available_24_7: true },
  { id: '8', name: 'Mental Health (iCall)', number: '9152987821', category: 'mental_health', icon: '🧠', description: 'Mental Health Counseling', is_toll_free: false, available_24_7: false },
  { id: '9', name: 'Road Accident', number: '1073', category: 'accident', icon: '🚗', description: 'Road Accident Emergency', is_toll_free: true, available_24_7: true },
  { id: '10', name: 'Disaster Management', number: '1070', category: 'disaster', icon: '🌊', description: 'Disaster Response', is_toll_free: true, available_24_7: true },
  { id: '11', name: 'Poison Control', number: '1800-11-6117', category: 'medical', icon: '☠️', description: 'Anti-Poison Helpline', is_toll_free: true, available_24_7: true },
  { id: '12', name: 'Cyber Crime', number: '1930', category: 'police', icon: '💻', description: 'Cyber Crime Reporting', is_toll_free: true, available_24_7: true },
  { id: '13', name: 'Health Helpline', number: '104', category: 'medical', icon: '🏥', description: 'General Health / COVID', is_toll_free: true, available_24_7: true },
  { id: '14', name: 'Blood Emergency', number: '104', category: 'medical', icon: '🩸', description: 'Blood Bank Emergency', is_toll_free: true, available_24_7: true },
  { id: '15', name: 'Vandrevala Foundation', number: '9999 666 555', category: 'mental_health', icon: '💚', description: 'Suicide Prevention', is_toll_free: true, available_24_7: true },
  { id: '16', name: 'BBMP Control Room', number: '080-22660000', category: 'utility', icon: '🏛️', description: 'Bangalore Municipal Corp', is_toll_free: false, available_24_7: true },
  { id: '17', name: 'BESCOM', number: '1912', category: 'utility', icon: '⚡', description: 'Power Emergency', is_toll_free: true, available_24_7: true },
  { id: '18', name: 'BWSSB', number: '1916', category: 'utility', icon: '💧', description: 'Water Emergency', is_toll_free: true, available_24_7: true },
  { id: '19', name: 'National Emergency', number: '112', category: 'police', icon: '🆘', description: 'Unified Emergency Number', is_toll_free: true, available_24_7: true },
  { id: '20', name: 'Domestic Violence', number: '181', category: 'women', icon: '🏠', description: 'Sakhi Helpline', is_toll_free: true, available_24_7: true },
];

/* ── Local Services Data (embedded for crash-safety) ── */
export const LOCAL_SERVICES = [
  { id: '1', name: 'Victoria Hospital', category: 'hospital', address: 'Fort Rd, Bangalore', ward: 'Shivajinagar', lat: 12.9634, lng: 77.5855, phone: '080-26701150', hours: '24/7', is_24h: true, services: ['Emergency', 'ICU', 'Blood Bank'] },
  { id: '2', name: 'Manipal Hospital', category: 'hospital', address: 'Old Airport Rd, Bangalore', ward: 'Domlur', lat: 12.9591, lng: 77.6388, phone: '080-25024444', hours: '24/7', is_24h: true, services: ['Emergency', 'ICU', 'Neurology'] },
  { id: '3', name: 'Koramangala Police Station', category: 'police', address: '80 Feet Rd, Koramangala', ward: 'Koramangala', lat: 12.9344, lng: 77.6269, phone: '080-25501100', hours: '24/7', is_24h: true, services: ['FIR', 'Emergency'] },
  { id: '4', name: 'NIMHANS', category: 'mental_health', address: 'Hosur Rd, Bangalore', ward: 'Madivala', lat: 12.9389, lng: 77.5956, phone: '080-46110007', hours: '8am-6pm', is_24h: false, services: ['Psychiatry', 'Counseling', 'Crisis'] },
  { id: '5', name: 'Sneha Sadana Women Shelter', category: 'shelter', address: 'Jayanagar, Bangalore', ward: 'Jayanagar', lat: 12.9308, lng: 77.5833, phone: '080-26765154', hours: '24/7', is_24h: true, services: ['Shelter', 'Legal Aid', 'Counseling'] },
  { id: '6', name: 'St. John\'s Hospital', category: 'hospital', address: 'Sarjapur Rd, Bangalore', ward: 'Koramangala', lat: 12.9280, lng: 77.6210, phone: '080-22065000', hours: '24/7', is_24h: true, services: ['Emergency', 'Trauma', 'ICU'] },
  { id: '7', name: 'Bowring Hospital', category: 'hospital', address: 'Shivaji Nagar, Bangalore', ward: 'Shivajinagar', lat: 12.9870, lng: 77.6050, phone: '080-25580433', hours: '24/7', is_24h: true, services: ['Emergency', 'General'] },
  { id: '8', name: 'Indiranagar Police Station', category: 'police', address: '100 Feet Rd, Indiranagar', ward: 'Indiranagar', lat: 12.9716, lng: 77.6412, phone: '080-25285000', hours: '24/7', is_24h: true, services: ['FIR', 'Emergency'] },
  { id: '9', name: 'Jayanagar Police Station', category: 'police', address: '11th Main, Jayanagar', ward: 'Jayanagar', lat: 12.9250, lng: 77.5830, phone: '080-26534555', hours: '24/7', is_24h: true, services: ['FIR', 'Emergency'] },
  { id: '10', name: 'Narayana Health City', category: 'hospital', address: 'Bommasandra, Bangalore', ward: 'Electronic City', lat: 12.8400, lng: 77.6680, phone: '080-71222222', hours: '24/7', is_24h: true, services: ['Emergency', 'Cardiac', 'ICU'] },
  { id: '11', name: 'Fortis Hospital', category: 'hospital', address: 'Bannerghatta Rd', ward: 'JP Nagar', lat: 12.8896, lng: 77.5975, phone: '080-66214444', hours: '24/7', is_24h: true, services: ['Emergency', 'Multi-specialty'] },
  { id: '12', name: 'Whitefield Police Station', category: 'police', address: 'ITPL Main Rd, Whitefield', ward: 'Whitefield', lat: 12.9698, lng: 77.7500, phone: '080-28452800', hours: '24/7', is_24h: true, services: ['FIR', 'Emergency'] },
  { id: '13', name: 'Akshaya Patra Foundation', category: 'food', address: 'Rajajinagar, Bangalore', ward: 'Rajajinagar', lat: 12.9900, lng: 77.5500, phone: '080-30143400', hours: '9am-5pm', is_24h: false, services: ['Food Distribution', 'Meals'] },
  { id: '14', name: 'Bangalore Baptist Hospital', category: 'hospital', address: 'Bellary Rd, Hebbal', ward: 'Hebbal', lat: 13.0250, lng: 77.5900, phone: '080-22042222', hours: '24/7', is_24h: true, services: ['Emergency', 'ICU', 'Maternity'] },
  { id: '15', name: 'Apollo Pharmacy - Koramangala', category: 'pharmacy', address: '4th Block, Koramangala', ward: 'Koramangala', lat: 12.9352, lng: 77.6245, phone: '1800-108-1010', hours: '24/7', is_24h: true, services: ['Pharmacy', 'Emergency Meds'] },
  { id: '16', name: 'MedPlus Pharmacy - HSR', category: 'pharmacy', address: 'HSR Layout Sector 2', ward: 'HSR Layout', lat: 12.9116, lng: 77.6389, phone: '040-67006700', hours: '8am-11pm', is_24h: false, services: ['Pharmacy', 'OTC'] },
  { id: '17', name: 'Parikrama Humanity Foundation', category: 'shelter', address: 'Jayanagar, Bangalore', ward: 'Jayanagar', lat: 12.9280, lng: 77.5860, phone: '080-26530960', hours: '24/7', is_24h: true, services: ['Shelter', 'Education'] },
  { id: '18', name: 'HSR Police Station', category: 'police', address: 'HSR Layout', ward: 'HSR Layout', lat: 12.9150, lng: 77.6350, phone: '080-25730400', hours: '24/7', is_24h: true, services: ['FIR', 'Emergency'] },
  { id: '19', name: 'Columbia Asia Hospital', category: 'hospital', address: 'Whitefield, Bangalore', ward: 'Whitefield', lat: 12.9680, lng: 77.7480, phone: '080-67163333', hours: '24/7', is_24h: true, services: ['Emergency', 'ICU'] },
  { id: '20', name: 'Yelahanka Police Station', category: 'police', address: 'Yelahanka New Town', ward: 'Yelahanka', lat: 13.1007, lng: 77.5963, phone: '080-28460000', hours: '24/7', is_24h: true, services: ['FIR', 'Emergency'] },
];

/* ── Utility Functions ── */
export function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatDistance(km) {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
}

export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      resolve({ lat: 12.9352, lng: 77.6245 }); // Koramangala fallback
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve({ lat: 12.9352, lng: 77.6245 }), // Fallback
      { enableHighAccuracy: true, timeout: 5000 }
    );
  });
}

/* ── Mock AI Analysis (when no backend) ── */
export function mockAIAnalysis(text) {
  const lower = text.toLowerCase();
  const criticalWords = ['heart attack', 'can\'t breathe', 'bleeding', 'unconscious', 'dying', 'kill', 'suicide', 'don\'t want to live', 'hopeless'];
  const mediumWords = ['fell', 'hurt', 'scared', 'unsafe', 'followed', 'pain', 'accident', 'dizzy', 'lost', 'hungry', 'haven\'t eaten'];
  const isCritical = criticalWords.some(w => lower.includes(w));
  const isMedium = mediumWords.some(w => lower.includes(w));

  if (isCritical) {
    return {
      severity: 'CRITICAL',
      emergency_type: lower.includes('suicide') || lower.includes('hopeless') ? 'mental_health' : 'medical',
      detected_signals: criticalWords.filter(w => lower.includes(w)),
      recommended_action: lower.includes('suicide') ? 'Call 9152987821 (iCall) or 9999666555 immediately' : 'Call 108 immediately for ambulance',
      relevant_helpline: lower.includes('suicide') ? { name: 'Vandrevala Foundation', number: '9999 666 555' } : { name: 'CATS Ambulance', number: '108' },
      response_message: lower.includes('suicide')
        ? 'I hear you, and your feelings matter. Please reach out to a trained counselor right now — you don\'t have to face this alone. Call the Vandrevala Foundation at 9999 666 555.'
        : 'This sounds very serious and time-critical. Please call 108 for an ambulance immediately. If someone is with you, ask them to help while you wait.',
    };
  }

  if (isMedium) {
    return {
      severity: 'MEDIUM',
      emergency_type: lower.includes('unsafe') || lower.includes('scared') || lower.includes('followed') ? 'safety' : 'medical',
      detected_signals: mediumWords.filter(w => lower.includes(w)),
      recommended_action: lower.includes('unsafe') ? 'Move to a safe location and call 100 or 1091' : 'Visit nearest hospital or call 108 if needed',
      relevant_helpline: lower.includes('unsafe') ? { name: 'Women Helpline', number: '1091' } : { name: 'Health Helpline', number: '104' },
      response_message: lower.includes('unsafe')
        ? 'Your safety is the priority. Try to move to a well-lit, populated area. If you feel threatened, call 100 (police) or 1091 (women helpline) immediately.'
        : 'I understand you\'re in pain. If the situation is worsening, please visit the nearest hospital. Shall I help you find one nearby?',
    };
  }

  return {
    severity: 'LOW',
    emergency_type: 'none',
    detected_signals: [],
    recommended_action: 'Browse local services or helplines for guidance',
    relevant_helpline: { name: 'BBMP Control Room', number: '080-22660000' },
    response_message: 'I don\'t detect an immediate emergency, but I\'m here to help. You can search for local services, browse helplines, or describe your situation in more detail.',
  };
}
