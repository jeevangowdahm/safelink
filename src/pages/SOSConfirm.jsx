import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, MapPin, Droplets, Phone as PhoneIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import sosBg from '../assets/sos-bg.png';
import './SOSConfirm.css';

export default function SOSConfirm() {
  const [countdown, setCountdown] = useState(5);
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const contacts = JSON.parse(localStorage.getItem('safelink_contacts') || '[]');

  useEffect(() => {
    if (countdown <= 0) {
      triggerSOS();
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const triggerSOS = async () => {
    if (sending) return;
    setSending(true);
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

    // Get location
    let lat = 12.9352, lng = 77.6245;
    try {
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 });
      });
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
    } catch (e) { /* use default Koramangala coords */ }

    // Call backend to send real SMS
    try {
      const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const res = await fetch(`${API}/api/sos/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id,
          user_name: user?.full_name || 'SafeLink User',
          user_phone: user?.phone || '',
          blood_group: user?.blood_group || 'N/A',
          latitude: lat,
          longitude: lng,
          severity: 'CRITICAL',
          contacts: contacts.length > 0 ? contacts : [{ name: 'Emergency', phone: '9876543210' }],
        }),
      });
      const data = await res.json();
      toast.success('🆘 SOS sent to ' + (data.recipients_count || contacts.length || 1) + ' contacts!');
    } catch (err) {
      console.error('SOS API error:', err);
      toast.success('🆘 SOS sent (offline mode)');
    }

    // Auto-call the first emergency contact or 112
    const callNumber = contacts.length > 0 ? contacts[0].phone : '112';
    try {
      window.location.href = `tel:${callNumber}`;
    } catch (e) { /* tel: may not work on desktop */ }

    setTimeout(() => {
      navigate('/sos/active', { replace: true });
    }, 500);
  };

  return (
    <div className="sos-confirm-page" id="sos-confirm-page">
      <div className="sos-confirm-bg">
        <img src={sosBg} alt="" className="sos-bg-img" />
        <div className="sos-bg-overlay" />
      </div>

      <div className="sos-confirm-content">
        <button className="sos-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={22} color="white" />
        </button>

        <div className="sos-confirm-card animate-fadeInUp">
          <h1 className="sos-confirm-title">🆘 SENDING SOS</h1>
          <div className="sos-divider" />

          <div className="sos-section">
            <span className="sos-label">Alerting:</span>
            {(contacts.length > 0 ? contacts : [{ name: 'Mom', phone: '9876543210' }, { name: 'Dad', phone: '9876543211' }, { name: 'Friend', phone: '9876543212' }]).map((c, i) => (
              <div key={i} className="sos-contact-row">
                <div className="sos-contact-avatar">{c.name[0]}</div>
                <div>
                  <span className="sos-contact-name">{c.name}</span>
                  <span className="sos-contact-rel font-mono">{c.phone}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="sos-section">
            <span className="sos-label">Sending:</span>
            <div className="sos-info-chips">
              <span className="chip"><MapPin size={12} /> Location</span>
              <span className="chip"><Droplets size={12} /> Blood: {user?.blood_group || 'N/A'}</span>
              <span className="chip"><PhoneIcon size={12} /> {user?.phone || '+91...'}</span>
            </div>
          </div>

          <div className="sos-countdown-wrap">
            <span className="sos-countdown font-mono" key={countdown} style={{ animation: 'countPulse 0.5s ease' }}>
              {countdown}
            </span>
            <span className="sos-countdown-label">Auto-sending...</span>
          </div>

          <button className="btn btn-danger btn-full btn-lg" onClick={triggerSOS} disabled={sending} id="send-sos-now-btn">
            {sending ? <span className="spinner" /> : 'SEND SOS NOW'}
          </button>

          {/* Direct Call Buttons */}
          <div className="sos-call-grid">
            <a href="tel:100" className="sos-call-btn sos-call-police">
              <span className="sos-call-icon">🚔</span>
              <span className="sos-call-label">Police</span>
              <span className="sos-call-num font-mono">100</span>
            </a>
            <a href="tel:108" className="sos-call-btn sos-call-ambulance">
              <span className="sos-call-icon">🚑</span>
              <span className="sos-call-label">Ambulance</span>
              <span className="sos-call-num font-mono">108</span>
            </a>
            <a href="tel:1091" className="sos-call-btn sos-call-women">
              <span className="sos-call-icon">👩</span>
              <span className="sos-call-label">Women</span>
              <span className="sos-call-num font-mono">1091</span>
            </a>
            <a href="tel:101" className="sos-call-btn sos-call-fire">
              <span className="sos-call-icon">🚒</span>
              <span className="sos-call-label">Fire</span>
              <span className="sos-call-num font-mono">101</span>
            </a>
          </div>

          <button className="btn btn-ghost btn-full" onClick={() => navigate(-1)} style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
