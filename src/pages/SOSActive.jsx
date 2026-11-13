import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, MapPin, Phone as PhoneIcon, X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getCurrentPosition } from '../utils/api';
import toast from 'react-hot-toast';
import sosBg from '../assets/sos-bg.png';
import 'leaflet/dist/leaflet.css';
import './SOSActive.css';

export default function SOSActive() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pos, setPos] = useState({ lat: 12.9352, lng: 77.6245 });
  const [showCancel, setShowCancel] = useState(false);
  const contacts = JSON.parse(localStorage.getItem('safelink_contacts') || '[]');
  const displayContacts = contacts.length > 0 ? contacts : [
    { name: 'Mom', phone: '+1555-0102' },
    { name: 'Dad', phone: '+1555-0103' },
    { name: 'Aunt Sarah', phone: '+1555-0104' },
  ];
  const statuses = ['DELIVERED', 'DELIVERED', 'SENT'];
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  useEffect(() => {
    getCurrentPosition().then(p => setPos(p));
  }, []);

  const handleCancel = () => {
    toast.success("Contacts notified you're safe ✓");
    navigate('/home', { replace: true });
  };

  return (
    <div className="sos-active-page" id="sos-active-page">
      {/* SOS Sent Header */}
      <div className="sos-active-header">
        <img src={sosBg} alt="" className="sos-active-header-bg" />
        <div className="sos-active-header-overlay" />
        <div className="sos-active-header-content animate-fadeInUp">
          <div className="sos-shield-icon">
            <Shield size={32} color="white" fill="rgba(220,38,38,0.5)" />
          </div>
          <h1 className="sos-sent-title">SOS SENT</h1>
          <p className="sos-sent-sub">{displayContacts.length} contacts alerted</p>
        </div>
      </div>

      <div className="sos-active-body page-content">
        {/* Emergency Contacts */}
        <div className="card-solid sos-contacts-card animate-fadeInUp stagger-1">
          <h3 className="sos-card-title">Emergency Contacts</h3>
          {displayContacts.map((c, i) => (
            <div key={i} className="sos-recipient-row">
              <div className="sos-contact-avatar">{c.name[0]}</div>
              <div className="sos-recipient-info">
                <span className="sos-recipient-name">{c.name}</span>
                <span className="sos-recipient-phone font-mono">{c.phone}</span>
              </div>
              <span className={`sos-status-badge ${statuses[i] === 'DELIVERED' ? 'delivered' : 'sent'}`}>
                <span className="status-indicator" /> {statuses[i]}
              </span>
            </div>
          ))}
        </div>

        {/* Location Map */}
        <div className="sos-map-card card-solid animate-fadeInUp stagger-2">
          <div className="sos-map-container">
            <MapContainer center={[pos.lat, pos.lng]} zoom={15} style={{ height: '180px', width: '100%', borderRadius: '12px' }} zoomControl={false} attributionControl={false}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[pos.lat, pos.lng]}>
                <Popup>Your current location</Popup>
              </Marker>
            </MapContainer>
          </div>
          <div className="sos-location-bar">
            <MapPin size={18} color="var(--blue-400)" />
            <div>
              <span className="font-tech" style={{ fontSize: '0.625rem', color: 'var(--blue-400)', letterSpacing: '2px' }}>CURRENT LOCATION SHARING</span>
              <span style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600 }}>{user?.area_name || 'Koramangala'}, Bangalore</span>
            </div>
          </div>
        </div>

        {/* Emergency Services */}
        <div className="animate-fadeInUp stagger-3">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>Emergency Services</h3>
          <div className="emergency-call-grid">
            <a href="tel:108" className="emergency-call-btn medical">
              <span style={{ fontSize: '1.5rem' }}>🚑</span>
              <span className="font-mono" style={{ fontSize: '1.375rem', fontWeight: 700 }}>108</span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Medical</span>
            </a>
            <a href="tel:100" className="emergency-call-btn police">
              <span style={{ fontSize: '1.5rem' }}>👮</span>
              <span className="font-mono" style={{ fontSize: '1.375rem', fontWeight: 700 }}>100</span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Police</span>
            </a>
            <a href="tel:101" className="emergency-call-btn fire">
              <span style={{ fontSize: '1.5rem' }}>🔥</span>
              <span className="font-mono" style={{ fontSize: '1.375rem', fontWeight: 700 }}>101</span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Fire</span>
            </a>
          </div>
        </div>

        {/* Cancel */}
        <button className="btn btn-secondary btn-full btn-lg animate-fadeInUp stagger-4" onClick={() => setShowCancel(true)} style={{ marginTop: '16px', borderColor: 'rgba(255,255,255,0.15)' }} id="cancel-sos-btn">
          I'm safe — Cancel SOS
        </button>

        {/* Cancel Confirmation Modal */}
        {showCancel && (
          <div className="sos-cancel-modal animate-fadeIn">
            <div className="sos-cancel-card card-glass">
              <h3>Are you sure?</h3>
              <p className="text-muted" style={{ fontSize: '0.8125rem', marginBottom: '16px' }}>Your contacts will be notified that you're safe.</p>
              <div className="flex gap-3">
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowCancel(false)}>No, keep SOS</button>
                <button className="btn btn-success" style={{ flex: 1 }} onClick={handleCancel}>Yes, I'm safe</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
