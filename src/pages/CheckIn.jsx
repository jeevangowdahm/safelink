import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Clock, Check, Timer } from 'lucide-react';
import toast from 'react-hot-toast';
import './CheckIn.css';

export default function CheckIn() {
  const { user } = useAuth();
  const [timer, setTimer] = useState(null);
  const [remaining, setRemaining] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [description, setDescription] = useState('');
  const [history, setHistory] = useState(() => {
    const h = localStorage.getItem('safelink_checkin_history');
    return h ? JSON.parse(h) : [];
  });

  useEffect(() => {
    const saved = localStorage.getItem('safelink_checkin');
    if (saved) {
      const t = JSON.parse(saved);
      if (new Date(t.due) > new Date()) setTimer(t);
    }
  }, []);

  useEffect(() => {
    if (!timer) return;
    const interval = setInterval(() => {
      const diff = new Date(timer.due) - new Date();
      if (diff <= 0) {
        clearInterval(interval);
        handleMissed();
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleSetTimer = () => {
    if (!dueTime) { toast.error('Select a time'); return; }
    const due = new Date(dueTime);
    if (due <= new Date()) { toast.error('Select a future time'); return; }
    const t = { due: due.toISOString(), description, createdAt: new Date().toISOString() };
    setTimer(t);
    localStorage.setItem('safelink_checkin', JSON.stringify(t));
    toast.success('Check-in timer set!');
  };

  const handleCheckIn = () => {
    const entry = { ...timer, status: 'checked_in', checkedAt: new Date().toISOString() };
    const newHistory = [entry, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem('safelink_checkin_history', JSON.stringify(newHistory));
    localStorage.removeItem('safelink_checkin');
    setTimer(null);
    toast.success('✅ Contacts notified you\'re safe!');
  };

  const handleMissed = () => {
    const entry = { ...timer, status: 'missed', missedAt: new Date().toISOString() };
    const newHistory = [entry, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem('safelink_checkin_history', JSON.stringify(newHistory));
    localStorage.removeItem('safelink_checkin');
    setTimer(null);
    toast.error('⚠️ Check-in missed! Contacts have been alerted.', { duration: 5000 });
  };

  return (
    <div className="checkin-page page page-enter" id="checkin-page">
      <div className="page-content">
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, padding: '20px 0 16px' }}>Safe Check-In</h1>

        {/* Active Timer */}
        {timer && (
          <div className="checkin-timer-card animate-fadeInUp">
            <Clock size={40} color="var(--orange-400)" />
            <span className="checkin-label">Check-in due at:</span>
            <span className="checkin-time font-mono">{new Date(timer.due).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="checkin-remaining">{remaining} remaining</span>
            <div className="checkin-progress">
              <div className="checkin-progress-fill" />
            </div>
            <button className="btn btn-success btn-full btn-lg" onClick={handleCheckIn} id="checkin-now-btn">
              <Check size={20} /> I'M SAFE — CHECK IN NOW
            </button>
          </div>
        )}

        {/* Set Timer */}
        <div className="checkin-set-card card-solid animate-fadeInUp stagger-1">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
            {timer ? 'Update Check-In' : 'Set a check-in'}
          </h3>
          <div className="form-group">
            <label className="form-label">Due Time</label>
            <input className="input" type="datetime-local" value={dueTime} onChange={e => setDueTime(e.target.value)} id="checkin-time-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Where are you going? (optional)</label>
            <input className="input" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Late meeting in Whitefield" />
          </div>
          <div className="checkin-preview">
            <p className="text-dim" style={{ fontSize: '0.75rem', fontStyle: 'italic' }}>
              If you don't check in by the set time, we'll send:<br />
              "{user?.full_name || 'User'} was supposed to check in. Last location: [link]"
            </p>
          </div>
          <button className="btn btn-primary btn-full" onClick={handleSetTimer} id="set-timer-btn">
            <Timer size={16} /> {timer ? 'Update Timer' : 'Start Check-In Timer'}
          </button>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="checkin-history animate-fadeInUp stagger-2">
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '10px' }}>Past Check-Ins</h3>
            {history.map((h, i) => (
              <div key={i} className="history-row">
                <span className="font-mono" style={{ fontSize: '0.75rem' }}>
                  {new Date(h.createdAt).toLocaleDateString()} {new Date(h.due).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className={`history-status ${h.status}`}>
                  {h.status === 'checked_in' ? '✓ Checked In' : '✗ Missed'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
