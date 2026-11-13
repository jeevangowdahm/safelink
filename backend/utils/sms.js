const axios = require('axios');

const FAST2SMS_KEY = process.env.FAST2SMS_API_KEY;
const isDemoMode = process.env.NODE_ENV === 'demo';

if (FAST2SMS_KEY && FAST2SMS_KEY !== 'placeholder') {
  console.log('✅ Fast2SMS ready (50 free SMS)');
} else {
  console.log('⚠️  Fast2SMS not configured — SMS simulated');
}

async function sendSOS(contactPhone, contactName, userName, userPhone, lat, lng, medicalInfo) {
  // Clean phone number — Fast2SMS needs 10-digit Indian number only
  let cleanPhone = String(contactPhone).replace(/[\s\-\+\(\)]/g, '');
  if (cleanPhone.startsWith('91') && cleanPhone.length === 12) cleanPhone = cleanPhone.slice(2);
  if (cleanPhone.length !== 10) {
    console.error(`📱 ❌ Invalid phone: "${contactPhone}" → "${cleanPhone}" (need 10 digits)`);
    return { success: false, error: 'Invalid phone number' };
  }

  const message = `SOS ALERT! ${userName} (${userPhone}) needs help! Location: https://maps.google.com/?q=${lat},${lng} | Blood: ${medicalInfo || 'N/A'} | SafeLink Bangalore`;

  // Demo mode — simulate
  if (isDemoMode || !FAST2SMS_KEY) {
    console.log(`📱 [DEMO SMS] To: ${contactName} (${cleanPhone})`);
    console.log(`   Message: ${message}`);
    return { success: true, demo: true, messageId: 'demo-' + Date.now() };
  }

  // Real SMS via Fast2SMS
  try {
    console.log(`📱 Sending SMS to ${contactName} (${cleanPhone})...`);
    const response = await axios.post('https://www.fast2sms.com/dev/bulkV2', null, {
      params: {
        route: 'q',
        message: message,
        language: 'english',
        flash: 0,
        numbers: cleanPhone,
      },
      headers: {
        'authorization': FAST2SMS_KEY,
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      },
    });

    console.log('📱 Fast2SMS response:', JSON.stringify(response.data));

    if (response.data.return === true) {
      console.log(`📱 ✅ SMS DELIVERED to ${contactName} (${cleanPhone})`);
      return { success: true, messageId: response.data.request_id };
    } else {
      console.error(`📱 ❌ SMS rejected:`, response.data.message || response.data);
      return { success: false, error: response.data.message };
    }
  } catch (err) {
    const errData = err.response?.data || err.message;
    console.error(`📱 ❌ SMS error:`, JSON.stringify(errData));
    return { success: false, error: JSON.stringify(errData), messageId: 'failed-' + Date.now() };
  }
}

async function sendOTP(phone, otp) {
  let cleanPhone = String(phone).replace(/[\s\-\+\(\)]/g, '');
  if (cleanPhone.startsWith('91') && cleanPhone.length === 12) cleanPhone = cleanPhone.slice(2);
  const message = `Your SafeLink OTP is: ${otp}. Do not share. - SafeLink Bangalore`;

  if (isDemoMode || !FAST2SMS_KEY) {
    console.log(`📱 [DEMO OTP] To: ${cleanPhone} → ${otp}`);
    return { success: true, demo: true };
  }

  try {
    const response = await axios.post('https://www.fast2sms.com/dev/bulkV2', null, {
      params: {
        route: 'q',
        message: message,
        language: 'english',
        flash: 0,
        numbers: cleanPhone,
      },
      headers: { 'authorization': FAST2SMS_KEY },
    });
    console.log(`📱 OTP sent to ${cleanPhone}:`, response.data.return);
    return { success: response.data.return === true };
  } catch (err) {
    console.error('OTP SMS error:', err.response?.data || err.message);
    return { success: false, error: err.message };
  }
}

function sendSafeAlert(contactPhone, userName) {
  let cleanPhone = String(contactPhone).replace(/[\s\-\+\(\)]/g, '');
  if (cleanPhone.startsWith('91') && cleanPhone.length === 12) cleanPhone = cleanPhone.slice(2);
  const message = `SAFE: ${userName} is safe. SOS cancelled. - SafeLink Bangalore`;

  if (isDemoMode || !FAST2SMS_KEY) {
    console.log(`📱 [SAFE] To: ${cleanPhone}`);
    return { success: true, demo: true };
  }

  axios.post('https://www.fast2sms.com/dev/bulkV2', null, {
    params: { route: 'q', message: message, language: 'english', flash: 0, numbers: cleanPhone },
    headers: { 'authorization': FAST2SMS_KEY },
  }).catch(err => console.error('Safe SMS error:', err.response?.data || err.message));

  return { success: true };
}

module.exports = { sendSOS, sendOTP, sendSafeAlert };
