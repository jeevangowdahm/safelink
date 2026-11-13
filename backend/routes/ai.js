const express = require('express');
const router = express.Router();
const { analyzeEmergency } = require('../utils/claude');

// POST /api/ai/analyze
router.post('/analyze', async (req, res) => {
  try {
    const { text, user_id, input_method } = req.body;
    if (!text) return res.status(400).json({ error: 'Text required' });

    console.log(`🤖 AI Analysis request: "${text.slice(0, 80)}..."`);
    const result = await analyzeEmergency(text);
    console.log(`   Result: ${result.severity} — ${result.emergency_type}`);

    res.json({
      success: true,
      analysis: result,
      sos_recommended: result.severity === 'CRITICAL',
    });
  } catch (err) {
    console.error('AI Error:', err.message);
    res.status(500).json({ error: 'AI analysis failed', fallback: true });
  }
});

module.exports = router;
