const express = require('express');
const router = express.Router();

// Embedded Bangalore services data
const SERVICES = [
  { id: '1', name: 'Victoria Hospital', category: 'hospital', address: 'Fort Rd, Bangalore', ward: 'Shivajinagar', lat: 12.9634, lng: 77.5855, phone: '080-26701150', hours: '24/7', is_24h: true },
  { id: '2', name: 'Manipal Hospital', category: 'hospital', address: 'Old Airport Rd', ward: 'Domlur', lat: 12.9591, lng: 77.6388, phone: '080-25024444', hours: '24/7', is_24h: true },
  { id: '3', name: 'Koramangala Police Station', category: 'police', address: '80 Feet Rd, Koramangala', ward: 'Koramangala', lat: 12.9344, lng: 77.6269, phone: '080-25501100', hours: '24/7', is_24h: true },
  { id: '4', name: 'NIMHANS', category: 'mental_health', address: 'Hosur Rd', ward: 'Madivala', lat: 12.9389, lng: 77.5956, phone: '080-46110007', hours: '8am-6pm', is_24h: false },
  { id: '5', name: 'Sneha Sadana Women Shelter', category: 'shelter', address: 'Jayanagar', ward: 'Jayanagar', lat: 12.9308, lng: 77.5833, phone: '080-26765154', hours: '24/7', is_24h: true },
  { id: '6', name: "St. John's Hospital", category: 'hospital', address: 'Sarjapur Rd', ward: 'Koramangala', lat: 12.9280, lng: 77.6210, phone: '080-22065000', hours: '24/7', is_24h: true },
  { id: '7', name: 'Bowring Hospital', category: 'hospital', address: 'Shivaji Nagar', ward: 'Shivajinagar', lat: 12.9870, lng: 77.6050, phone: '080-25580433', hours: '24/7', is_24h: true },
  { id: '8', name: 'Indiranagar Police Station', category: 'police', address: '100 Feet Rd, Indiranagar', ward: 'Indiranagar', lat: 12.9716, lng: 77.6412, phone: '080-25285000', hours: '24/7', is_24h: true },
  { id: '9', name: 'Narayana Health City', category: 'hospital', address: 'Bommasandra', ward: 'Electronic City', lat: 12.8400, lng: 77.6680, phone: '080-71222222', hours: '24/7', is_24h: true },
  { id: '10', name: 'Fortis Hospital', category: 'hospital', address: 'Bannerghatta Rd', ward: 'JP Nagar', lat: 12.8896, lng: 77.5975, phone: '080-66214444', hours: '24/7', is_24h: true },
];

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// GET /api/services/search
router.get('/search', (req, res) => {
  const { category, ward, lat, lng } = req.query;
  let results = [...SERVICES];

  if (category) results = results.filter(s => s.category === category);
  if (ward) results = results.filter(s => s.ward.toLowerCase() === ward.toLowerCase());

  if (lat && lng) {
    results = results.map(s => ({ ...s, distance: haversine(+lat, +lng, s.lat, s.lng) }))
      .sort((a, b) => a.distance - b.distance);
  }

  res.json({ services: results.slice(0, 20), total: results.length });
});

// GET /api/services/:id
router.get('/:id', (req, res) => {
  const service = SERVICES.find(s => s.id === req.params.id);
  if (!service) return res.status(404).json({ error: 'Not found' });
  res.json({ service });
});

module.exports = router;
