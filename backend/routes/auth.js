const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabase');

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp_token } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone required' });

    // Demo mode
    if (!supabase) {
      return res.json({
        user: { id: 'demo-' + Date.now(), phone },
        isNewUser: true,
        token: 'demo-token-' + Date.now(),
      });
    }

    const { data, error } = await supabase.auth.verifyOtp({ phone, token: otp_token, type: 'sms' });
    if (error) return res.status(400).json({ error: error.message });

    const { data: profile } = await supabase.from('users').select('*').eq('phone', phone).single();
    res.json({ user: profile || data.user, isNewUser: !profile, token: data.session?.access_token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/update-profile
router.post('/update-profile', async (req, res) => {
  try {
    const userData = req.body;
    if (!supabase) return res.json({ success: true, user: userData });

    const { data, error } = await supabase.from('users').upsert(userData).select().single();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ success: true, user: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!supabase || !token) return res.json({ user: { id: 'demo', full_name: 'Demo User' } });

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) return res.status(401).json({ error: 'Unauthorized' });

    const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single();
    res.json({ user: profile || user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
