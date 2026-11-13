import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Hospital, Phone, Bot, Clock, Zap, MapPin, Mic, Send, ChevronRight, Map, PhoneCall } from 'lucide-react';
import SeverityBadge from '../components/SeverityBadge';
import { LOCAL_SERVICES, mockAIAnalysis, getCurrentPosition, getDistance, formatDistance } from '../utils/api';
import toast from 'react-hot-toast';
import './Home.css';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [aiInput, setAiInput] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [nearbyServices, setNearbyServices] = useState([]);
  const [checkinTimer, setCheckinTimer] = useState(null);

  useEffect(() => {
    loadNearby();
    const saved = localStorage.getItem('safelink_checkin');
    if (saved) {
      const timer = JSON.parse(saved);
      if (new Date(timer.due) > new Date()) setCheckinTimer(timer);
    }
  }, []);

  const loadNearby = async () => {
    const pos = await getCurrentPosition();
    const sorted = LOCAL_SERVICES
      .filter(s => s.category === 'hospital')
      .map(s => ({ ...s, distance: getDistance(pos.lat, pos.lng, s.lat, s.lng) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
    setNearbyServices(sorted);
  };

  const handleAISubmit = async () => {
    if (!aiInput.trim()) return;
    setAiLoading(true);
    let result;
    try {
      const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const res = await fetch(`${API}/api/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: aiInput }),
      });
      const data = await res.json();
      result = data.analysis;
    } catch {
      result = mockAIAnalysis(aiInput);
    }
    setAiResult(result);
    setAiLoading(false);
    if (result.severity === 'CRITICAL') {
      toast.error('⚠️ CRITICAL emergency detected!', { duration: 4000 });
    }
  };

  const handleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast.error('Voice not supported in this browser');
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = 'en-IN';
    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setAiInput(text);
      toast.success('Voice captured: "' + text.slice(0, 40) + '..."');
    };
    recognition.onerror = () => toast.error('Voice recognition failed');
    recognition.start();
    toast('🎤 Listening...', { duration: 2000 });
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const contacts = JSON.parse(localStorage.getItem('safelink_contacts') || '[]');

  return (
    <div className="home-page page page-enter ambient-bg" id="home-page">
      {/* Top Bar */}
      <div className="home-topbar">
        <div className="home-topbar-left">
          <Shield size={20} color="var(--red-400)" />
          <div>
            <span className="home-topbar-title">SafeLink <span className="text-red">Bangalore</span></span>
            <span className="home-topbar-loc font-mono">
              <MapPin size={10} /> {user?.area_name || 'Koramangala'}
            </span>
          </div>
        </div>
        <div className="home-topbar-right" onClick={() => navigate('/profile')}>
          <div className="home-avatar">{(user?.full_name || 'U')[0]}</div>
        </div>
      </div>

      <div className="page-content">
        {/* Greeting */}
        <div className="home-greeting animate-fadeInUp">
          <div>
            <h2 className="greeting-text font-serif">{greeting()}, {user?.full_name?.split(' ')[0] || 'User'} 👋</h2>
            <span className="greeting-status">
              <span className="status-dot-sm green" /> You're protected 🛡️
            </span>
          </div>
        </div>

        {/* SOS Button */}
        <button className="home-sos-btn animate-fadeInUp stagger-1" onClick={() => { if (navigator.vibrate) navigator.vibrate(100); navigate('/sos/confirm'); }} id="main-sos-btn">
          <div className="home-sos-left">
            <Zap size={24} />
            <div>
              <span className="home-sos-title">SOS — SEND HELP NOW</span>
              <span className="home-sos-sub">Alerts {contacts.length || 3} contacts + emergency services</span>
            </div>
          </div>
          <ChevronRight size={22} />
        </button>

        {/* Quick Actions */}
        <div className="home-actions animate-fadeInUp stagger-2">
          <button className="action-card" onClick={() => navigate('/find')} id="action-find">
            <div className="action-icon" style={{ background: 'rgba(37, 99, 235, 0.15)' }}><Hospital size={22} color="var(--blue-400)" /></div>
            <span className="action-label">Find Help</span>
            <span className="action-sub">Nearby services</span>
          </button>
          <button className="action-card" onClick={() => navigate('/helplines')} id="action-helplines">
            <div className="action-icon" style={{ background: 'rgba(22, 163, 74, 0.15)' }}><Phone size={22} color="var(--green-400)" /></div>
            <span className="action-label">Helplines</span>
            <span className="action-sub">20+ numbers</span>
          </button>
          <button className="action-card" onClick={() => navigate('/ai-check')} id="action-ai">
            <div className="action-icon" style={{ background: 'rgba(139, 92, 246, 0.15)' }}><Bot size={22} color="var(--purple-400)" /></div>
            <span className="action-label">AI Check</span>
            <span className="action-sub">Analyze situation</span>
          </button>
          <button className="action-card" onClick={() => navigate('/checkin')} id="action-checkin">
            <div className="action-icon" style={{ background: 'rgba(234, 88, 12, 0.15)' }}><Clock size={22} color="var(--orange-400)" /></div>
            <span className="action-label">Check-In</span>
            <span className="action-sub">Safety timer</span>
          </button>
          <button className="action-card" onClick={() => navigate('/safety-map')} id="action-heatmap">
            <div className="action-icon" style={{ background: 'rgba(239, 68, 68, 0.15)' }}><Map size={22} color="#F87171" /></div>
            <span className="action-label">Heatmap</span>
            <span className="action-sub">Danger zones</span>
          </button>
          <button className="action-card" onClick={() => window.__triggerFakeCall && window.__triggerFakeCall()} id="action-fakecall">
            <div className="action-icon" style={{ background: 'rgba(16, 185, 129, 0.15)' }}><PhoneCall size={22} color="#34D399" /></div>
            <span className="action-label">Fake Call</span>
            <span className="action-sub">Escape tool</span>
          </button>
        </div>

        {/* AI Quick Input */}
        <div className="home-ai-card card-solid animate-fadeInUp stagger-3">
          <div className="home-ai-header">
            <Bot size={16} color="var(--purple-400)" />
            <span>AI Safety Assistant</span>
          </div>
          <div className="home-ai-input-row">
            <button className="ai-mic-btn" onClick={handleVoice}><Mic size={16} /></button>
            <input
              className="home-ai-input"
              value={aiInput}
              onChange={e => setAiInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAISubmit()}
              placeholder="Describe your situation..."
              id="ai-quick-input"
            />
            <button className="ai-send-btn" onClick={handleAISubmit} disabled={aiLoading}>
              {aiLoading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : <Send size={16} />}
            </button>
          </div>
          {aiResult && (
            <div className="home-ai-result animate-fadeIn">
              <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                <SeverityBadge severity={aiResult.severity} />
                <span className="chip" style={{ fontSize: '0.6875rem' }}>{aiResult.emergency_type}</span>
              </div>
              <p style={{ fontSize: '0.8125rem', lineHeight: 1.5, marginBottom: 12 }}>{aiResult.response_message}</p>
              <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                {aiResult.severity === 'CRITICAL' && (
                  <button className="btn btn-danger" style={{ fontSize: '0.75rem', padding: '8px 14px' }} onClick={() => navigate('/sos/confirm')}>🆘 Trigger SOS</button>
                )}
                {aiResult.relevant_helpline && (
                  <a href={`tel:${aiResult.relevant_helpline.number}`} className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '8px 14px' }}>
                    📞 Call {aiResult.relevant_helpline.number}
                  </a>
                )}
                <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '8px 14px' }} onClick={() => navigate('/find')}>Find Services</button>
              </div>
            </div>
          )}
        </div>

        {/* Nearby Services */}
        <div className="home-section animate-fadeInUp stagger-4">
          <div className="section-header">
            <span className="section-title">Nearby Services</span>
            <button className="text-red" style={{ fontSize: '0.75rem', fontWeight: 600 }} onClick={() => navigate('/find')}>View all →</button>
          </div>
          <div className="nearby-scroll">
            {nearbyServices.map(s => (
              <div key={s.id} className="nearby-card card-solid">
                <span style={{ fontSize: '1.25rem' }}>{s.category === 'hospital' ? '🏥' : '🏢'}</span>
                <span className="nearby-name">{s.name}</span>
                <span className="nearby-dist font-mono">{formatDistance(s.distance)}</span>
                <a href={`tel:${s.phone}`} className="text-red" style={{ fontSize: '0.75rem' }}>📞 Call</a>
              </div>
            ))}
          </div>
        </div>

        {/* Check-in Status */}
        <div className="home-checkin animate-fadeInUp stagger-5">
          {checkinTimer ? (
            <div className="checkin-active-bar">
              <Clock size={16} color="var(--orange-400)" />
              <span>Check-in due: <strong className="font-mono">{new Date(checkinTimer.due).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></span>
              <button className="text-red" style={{ fontSize: '0.75rem', marginLeft: 'auto' }} onClick={() => navigate('/checkin')}>View →</button>
            </div>
          ) : (
            <div className="checkin-inactive-bar">
              <span className="text-muted">No active check-in. Stay safe 🛡️</span>
              <button className="text-red" style={{ fontSize: '0.75rem' }} onClick={() => navigate('/checkin')}>Set one →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
