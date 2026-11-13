import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Edit3, Plus, Trash2, LogOut, Shield, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import './Profile.css';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...user });
  const [contacts, setContacts] = useState(() => {
    const c = localStorage.getItem('safelink_contacts');
    return c ? JSON.parse(c) : [];
  });

  const handleSave = () => {
    updateUser(form);
    setEditing(false);
    toast.success('Profile updated');
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="profile-page page page-enter" id="profile-page">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-avatar-lg">{(user?.full_name || 'U')[0]}</div>
        <h2 className="profile-name">{user?.full_name || 'User'}</h2>
        <span className="profile-phone font-mono">{user?.phone || '+91...'}</span>
      </div>

      <div className="page-content">
        {/* Personal Info */}
        <div className="profile-section card-solid">
          <div className="profile-section-header">
            <h3>Personal Info</h3>
            <button className="btn btn-ghost" onClick={() => setEditing(!editing)} style={{ fontSize: '0.75rem' }}>
              <Edit3 size={14} /> {editing ? 'Cancel' : 'Edit'}
            </button>
          </div>
          {editing ? (
            <div className="profile-form">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input className="input" value={form.full_name || ''} onChange={e => setForm({...form, full_name: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Area</label>
                <input className="input" value={form.area_name || ''} onChange={e => setForm({...form, area_name: e.target.value})} />
              </div>
              <button className="btn btn-primary btn-full" onClick={handleSave}>Save Changes</button>
            </div>
          ) : (
            <div className="profile-info-list">
              <div className="info-row"><span className="text-muted">Name</span><span>{user?.full_name}</span></div>
              <div className="info-row"><span className="text-muted">Area</span><span>{user?.area_name || '—'}</span></div>
              <div className="info-row"><span className="text-muted">Ward</span><span>{user?.bbmp_ward || '—'}</span></div>
            </div>
          )}
        </div>

        {/* Emergency Contacts */}
        <div className="profile-section card-solid">
          <div className="profile-section-header">
            <h3>Emergency Contacts</h3>
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>{contacts.length}/5</span>
          </div>
          {contacts.map((c, i) => (
            <div key={i} className="contact-item">
              <div className="contact-item-avatar">{c.name[0]}</div>
              <div className="contact-item-info">
                <span>{c.name}</span>
                <span className="font-mono text-muted" style={{ fontSize: '0.75rem' }}>{c.phone}</span>
              </div>
            </div>
          ))}
          {contacts.length === 0 && <p className="text-muted" style={{ fontSize: '0.8125rem', padding: '8px 0' }}>No contacts added</p>}
        </div>

        {/* Medical */}
        <div className="profile-section card-solid">
          <div className="profile-section-header">
            <h3>Medical Profile</h3>
          </div>
          <div className="profile-info-list">
            <div className="info-row"><span className="text-muted">Blood Group</span><span className="chip chip-red" style={{ padding: '2px 10px', fontSize: '0.75rem' }}>{user?.blood_group || '—'}</span></div>
            <div className="info-row"><span className="text-muted">Allergies</span><span>{user?.allergies || '—'}</span></div>
            <div className="info-row"><span className="text-muted">Conditions</span><span>{user?.medical_conditions || '—'}</span></div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="profile-section card-solid">
          <button className="profile-link" onClick={() => navigate('/helplines')}>
            <span>Saved Helplines</span><ChevronRight size={16} />
          </button>
          <button className="profile-link" onClick={() => navigate('/checkin')}>
            <span>Check-In Settings</span><ChevronRight size={16} />
          </button>
        </div>

        {/* Logout */}
        <button className="btn btn-full profile-logout" onClick={handleLogout} id="logout-btn">
          <LogOut size={16} /> Log Out
        </button>

        <p className="profile-version text-dim">SafeLink Bangalore v1.0 • Hackathon 2026</p>
      </div>
    </div>
  );
}
