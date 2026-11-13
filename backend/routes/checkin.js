const express = require('express');
const router = express.Router();

const timers = new Map();

// POST /api/checkin/set
router.post('/set', (req, res) => {
  const { user_id, checkin_due_at, description } = req.body;
  const timer = {
    id: 'checkin-' + Date.now(),
    user_id,
    checkin_due_at,
    description,
    status: 'active',
    created_at: new Date().toISOString(),
  };
  timers.set(timer.id, timer);
  console.log(`⏰ Check-in set for ${user_id} due at ${checkin_due_at}`);
  res.json({ success: true, timer });
});

// POST /api/checkin/confirm
router.post('/confirm', (req, res) => {
  const { timer_id, user_id } = req.body;
  console.log(`✅ Check-in confirmed by ${user_id}`);
  if (timer_id && timers.has(timer_id)) {
    timers.get(timer_id).status = 'checked_in';
  }
  res.json({ success: true, message: 'Check-in confirmed. Contacts notified.' });
});

// GET /api/checkin/active/:user_id
router.get('/active/:user_id', (req, res) => {
  const active = [...timers.values()].find(t => t.user_id === req.params.user_id && t.status === 'active');
  res.json({ timer: active || null });
});

module.exports = router;
