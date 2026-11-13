const express = require('express');
const router = express.Router();
const { sendSOS, sendSafeAlert } = require('../utils/sms');

// POST /api/sos/trigger
router.post('/trigger', async (req, res) => {
  try {
    const { user_id, latitude, longitude, severity, notes, user_name, user_phone, blood_group, contacts } = req.body;

    console.log(`\n🆘 SOS TRIGGERED by ${user_name || 'Unknown'}`);
    console.log(`   Location: ${latitude}, ${longitude}`);
    console.log(`   Severity: ${severity || 'CRITICAL'}`);

    const recipients = [];
    const contactList = contacts || [];

    for (const contact of contactList) {
      const result = sendSOS(contact.phone, contact.name, user_name || 'SafeLink User', user_phone || '', latitude || 0, longitude || 0, blood_group || '');
      recipients.push({ ...contact, status: result.success ? 'sent' : 'failed' });
    }

    const sosEvent = {
      id: 'sos-' + Date.now(),
      user_id,
      trigger_type: 'button',
      severity: severity || 'CRITICAL',
      latitude, longitude,
      status: 'sent',
      created_at: new Date().toISOString(),
      recipients,
    };

    console.log(`   ✅ SOS sent to ${recipients.length} contacts\n`);
    res.json({ success: true, sos_event: sosEvent, recipients_count: recipients.length });
  } catch (err) {
    console.error('SOS Error:', err.message);
    res.status(500).json({ error: 'SOS trigger failed' });
  }
});

// PUT /api/sos/:id/cancel
router.put('/:id/cancel', async (req, res) => {
  try {
    const { contacts, user_name } = req.body;
    console.log(`✅ SOS ${req.params.id} cancelled by ${user_name}`);

    if (contacts) {
      contacts.forEach(c => sendSafeAlert(c.phone, user_name || 'User'));
    }

    res.json({ success: true, message: 'SOS cancelled, contacts notified' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
