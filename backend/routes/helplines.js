const express = require('express');
const router = express.Router();

const HELPLINES = [
  { id: '1', name: 'Police Emergency', number: '100', category: 'police', description: 'Police Emergency', icon: '👮' },
  { id: '2', name: 'CATS Ambulance', number: '108', category: 'medical', description: 'Ambulance Service', icon: '🚑' },
  { id: '3', name: 'Fire Emergency', number: '101', category: 'fire', description: 'Fire Department', icon: '🔥' },
  { id: '4', name: 'Women Helpline', number: '1091', category: 'women', description: 'Women Safety', icon: '🛡️' },
  { id: '5', name: 'Women in Distress', number: '181', category: 'women', description: 'Sakhi Centre', icon: '💜' },
  { id: '6', name: 'Childline India', number: '1098', category: 'children', description: 'Child Safety', icon: '👶' },
  { id: '7', name: 'Elder Helpline', number: '14567', category: 'senior', description: 'Senior Support', icon: '👴' },
  { id: '8', name: 'iCall Mental Health', number: '9152987821', category: 'mental_health', description: 'Counseling', icon: '🧠' },
  { id: '9', name: 'Road Accident', number: '1073', category: 'accident', description: 'Road Emergency', icon: '🚗' },
  { id: '10', name: 'Disaster Mgmt', number: '1070', category: 'disaster', description: 'Disaster Response', icon: '🌊' },
  { id: '11', name: 'National Emergency', number: '112', category: 'police', description: 'Unified Emergency', icon: '🆘' },
  { id: '12', name: 'Cyber Crime', number: '1930', category: 'police', description: 'Cyber Crime', icon: '💻' },
  { id: '13', name: 'Health Helpline', number: '104', category: 'medical', description: 'General Health', icon: '🏥' },
  { id: '14', name: 'Vandrevala Foundation', number: '9999666555', category: 'mental_health', description: 'Suicide Prevention', icon: '💚' },
  { id: '15', name: 'BBMP Control Room', number: '080-22660000', category: 'utility', description: 'Municipal Corp', icon: '🏛️' },
  { id: '16', name: 'BESCOM', number: '1912', category: 'utility', description: 'Power Emergency', icon: '⚡' },
  { id: '17', name: 'BWSSB', number: '1916', category: 'utility', description: 'Water Emergency', icon: '💧' },
];

router.get('/', (req, res) => {
  res.json({ helplines: HELPLINES });
});

router.get('/category/:category', (req, res) => {
  const filtered = HELPLINES.filter(h => h.category === req.params.category);
  res.json({ helplines: filtered });
});

module.exports = router;
