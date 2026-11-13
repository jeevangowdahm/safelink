import { useState, useEffect, useRef } from 'react';
import { X, Phone as PhoneIcon, PhoneOff } from 'lucide-react';
import './FakeCall.css';

const CALLERS = [
  { name: 'Mom', avatar: '👩', number: '+91 98765 43210' },
  { name: 'Dad', avatar: '👨', number: '+91 98765 43211' },
  { name: 'Boss', avatar: '👔', number: '+91 80456 78900' },
  { name: 'Roommate', avatar: '🏠', number: '+91 77889 90011' },
];

export default function FakeCall({ onClose }) {
  const [phase, setPhase] = useState('setup'); // setup | ringing | active | ended
  const [caller, setCaller] = useState(CALLERS[0]);
  const [delay, setDelay] = useState(5);
  const [callDuration, setCallDuration] = useState(0);
  const [customName, setCustomName] = useState('');
  const intervalRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timerRef.current);
    };
  }, []);

  const startFakeCall = () => {
    if (customName) setCaller({ ...caller, name: customName });
    setPhase('waiting');

    timerRef.current = setTimeout(() => {
      setPhase('ringing');
      if (navigator.vibrate) {
        // Realistic phone ring vibration pattern
        navigator.vibrate([800, 400, 800, 400, 800, 400, 800, 400, 800]);
      }
    }, delay * 1000);
  };

  const acceptCall = () => {
    setPhase('active');
    if (navigator.vibrate) navigator.vibrate(0); // stop vibration
    intervalRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const endCall = () => {
    setPhase('ended');
    clearInterval(intervalRef.current);
    if (navigator.vibrate) navigator.vibrate(0);
    setTimeout(() => onClose(), 1000);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (phase === 'setup') {
    return (
      <div className="fakecall-overlay">
        <div className="fakecall-setup animate-fadeInUp">
          <button className="fakecall-close" onClick={onClose}><X size={20} /></button>
          <h2>📞 Fake Call</h2>
          <p className="text-muted">Generate a realistic incoming call to escape an unsafe situation</p>

          <div className="form-group">
            <label className="form-label">Caller</label>
            <div className="fakecall-callers">
              {CALLERS.map((c, i) => (
                <button key={i} className={`fakecall-caller-btn ${caller.name === c.name ? 'active' : ''}`} onClick={() => setCaller(c)}>
                  <span>{c.avatar}</span> {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Custom name (optional)</label>
            <input className="input" placeholder="e.g. Priya" value={customName} onChange={e => setCustomName(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Ring in {delay} seconds</label>
            <input type="range" min="3" max="30" value={delay} onChange={e => setDelay(+e.target.value)} className="fakecall-slider" />
          </div>

          <button className="btn btn-primary btn-full btn-lg" onClick={startFakeCall}>
            Schedule Call
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'waiting') {
    return (
      <div className="fakecall-overlay">
        <div className="fakecall-waiting animate-fadeInUp">
          <div className="fakecall-spinner" />
          <p>Call coming in {delay}s...</p>
          <p className="text-muted">Put your phone face-up</p>
          <button className="btn btn-ghost" onClick={() => { clearTimeout(timerRef.current); onClose(); }}>Cancel</button>
        </div>
      </div>
    );
  }

  if (phase === 'ringing') {
    return (
      <div className="fakecall-fullscreen">
        <div className="fakecall-ring-bg" />
        <div className="fakecall-ring-content">
          <div className="fakecall-avatar-ring">
            <span className="fakecall-avatar-big">{caller.avatar}</span>
          </div>
          <h1 className="fakecall-caller-name">{customName || caller.name}</h1>
          <p className="fakecall-caller-number font-mono">{caller.number}</p>
          <p className="fakecall-status">Incoming call...</p>

          <div className="fakecall-actions">
            <button className="fakecall-decline" onClick={endCall}>
              <PhoneOff size={28} />
            </button>
            <button className="fakecall-accept" onClick={acceptCall}>
              <PhoneIcon size={28} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'active') {
    return (
      <div className="fakecall-fullscreen fakecall-active-bg">
        <div className="fakecall-active-content">
          <span className="fakecall-avatar-big">{caller.avatar}</span>
          <h2>{customName || caller.name}</h2>
          <p className="fakecall-timer font-mono">{formatTime(callDuration)}</p>
          <div className="fakecall-active-status">
            <span className="fakecall-dot" /> Connected
          </div>
          <button className="fakecall-end-btn" onClick={endCall}>
            <PhoneOff size={24} />
          </button>
        </div>
      </div>
    );
  }

  return null;
}
