const { GoogleGenerativeAI } = require('@google/generative-ai');
const Groq = require('groq-sdk');

let geminiModel = null;
let groqClient = null;

// Initialize Gemini
const geminiKey = process.env.GEMINI_API_KEY;
if (geminiKey && geminiKey !== 'placeholder') {
  const genAI = new GoogleGenerativeAI(geminiKey);
  geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
  console.log('✅ Gemini AI ready (gemini-2.0-flash-lite)');
}

// Initialize Groq (free backup)
const groqKey = process.env.GROQ_API_KEY;
if (groqKey && groqKey !== 'placeholder') {
  groqClient = new Groq.default({ apiKey: groqKey });
  console.log('✅ Groq AI ready (llama-3.3-70b)');
}

if (!geminiModel && !groqClient) {
  console.log('⚠️  No AI configured — using smart mock');
}

const SYSTEM_PROMPT = `You are SafeLink, an emergency response AI for Bangalore, India.
Analyze user messages to detect emergencies and provide guidance.

BANGALORE CONTEXT:
- Hospitals: Victoria, Manipal, Narayana, Fortis, St. John's, NIMHANS
- Emergency: Police 100, Ambulance 108, Fire 101, Women 1091
- Mental health: NIMHANS, iCall 9152987821, Vandrevala 9999666555

SEVERITY: LOW (minor) | MEDIUM (needs help soon) | CRITICAL (life-threatening)
TYPES: medical, safety, mental_health, domestic_violence, accident, disaster, none

Respond ONLY with valid JSON:
{"severity":"LOW|MEDIUM|CRITICAL","emergency_type":"type","detected_signals":["signals"],"recommended_action":"action","relevant_helpline":{"name":"name","number":"number"},"response_message":"2-3 sentence warm response"}

When in doubt, escalate. Never be dismissive.`;

async function analyzeWithGemini(text) {
  const result = await geminiModel.generateContent({
    contents: [{ role: 'user', parts: [{ text: `${SYSTEM_PROMPT}\n\nUser: "${text}"` }] }],
    generationConfig: { temperature: 0.3, maxOutputTokens: 500, responseMimeType: 'application/json' },
  });
  const raw = result.response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(raw);
}

async function analyzeWithGroq(text) {
  const completion = await groqClient.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: text },
    ],
    temperature: 0.3,
    max_tokens: 500,
    response_format: { type: 'json_object' },
  });
  return JSON.parse(completion.choices[0].message.content);
}

async function analyzeEmergency(text) {
  // Try Gemini first
  if (geminiModel) {
    try {
      const result = await analyzeWithGemini(text);
      console.log('   [Gemini] ✓');
      return result;
    } catch (err) {
      console.error('   [Gemini] failed:', err.message.slice(0, 80));
    }
  }

  // Try Groq as backup
  if (groqClient) {
    try {
      const result = await analyzeWithGroq(text);
      console.log('   [Groq] ✓');
      return result;
    } catch (err) {
      console.error('   [Groq] failed:', err.message.slice(0, 80));
    }
  }

  // Fallback to mock
  console.log('   [Mock] ✓');
  return mockAnalysis(text);
}

function mockAnalysis(text) {
  const lower = text.toLowerCase();
  const critical = ['heart attack', "can't breathe", 'bleeding', 'unconscious', 'dying', 'suicide', "don't want to live", 'killing', 'stabbed', 'shot'];
  const medium = ['fell', 'hurt', 'scared', 'unsafe', 'followed', 'pain', 'accident', 'dizzy', 'lost', 'threatened'];

  if (critical.some(w => lower.includes(w))) {
    const isMental = ['suicide', "don't want to live"].some(w => lower.includes(w));
    return {
      severity: 'CRITICAL',
      emergency_type: isMental ? 'mental_health' : 'medical',
      detected_signals: critical.filter(w => lower.includes(w)),
      recommended_action: isMental ? 'Call Vandrevala Foundation at 9999666555 now' : 'Call 108 for ambulance immediately',
      relevant_helpline: isMental ? { name: 'Vandrevala Foundation', number: '9999666555' } : { name: 'CATS Ambulance', number: '108' },
      response_message: isMental
        ? 'I hear you, and your feelings matter. Please call 9999666555 right now — trained counselors are available 24/7. You are not alone.'
        : 'This sounds very serious and time-critical. Please call 108 for an ambulance immediately. Stay with the person if possible.',
    };
  }
  if (medium.some(w => lower.includes(w))) {
    const isSafety = ['unsafe', 'scared', 'followed', 'threatened'].some(w => lower.includes(w));
    return {
      severity: 'MEDIUM',
      emergency_type: isSafety ? 'safety' : 'medical',
      detected_signals: medium.filter(w => lower.includes(w)),
      recommended_action: isSafety ? 'Move to a safe area and call 100' : 'Visit nearest hospital or call 104',
      relevant_helpline: isSafety ? { name: 'Police', number: '100' } : { name: 'Health Helpline', number: '104' },
      response_message: isSafety
        ? 'Your safety is the priority. Move to a well-lit, populated area immediately. Call 100 if you feel threatened.'
        : 'I understand you need help. If pain is worsening, please visit the nearest hospital or call 104 for guidance.',
    };
  }
  return {
    severity: 'LOW',
    emergency_type: 'none',
    detected_signals: [],
    recommended_action: 'Browse local services or helplines',
    relevant_helpline: { name: 'BBMP Control Room', number: '080-22660000' },
    response_message: 'I don\'t detect an immediate emergency, but I\'m here to help. You can search for local services, browse helplines, or tell me more about your situation.',
  };
}

module.exports = { analyzeEmergency };
