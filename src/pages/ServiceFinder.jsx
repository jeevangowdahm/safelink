import { useState, useEffect } from 'react';
import { Search, List, Map as MapIcon, Phone as PhoneIcon, Navigation, Clock } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LOCAL_SERVICES, getCurrentPosition, getDistance, formatDistance } from '../utils/api';
import 'leaflet/dist/leaflet.css';
import './ServiceFinder.css';

const CATEGORIES = [
  { key: 'all', label: 'All', icon: '🔍' },
  { key: 'hospital', label: 'Hospital', icon: '🏥' },
  { key: 'police', label: 'Police', icon: '🚓' },
  { key: 'shelter', label: 'Shelter', icon: '🏠' },
  { key: 'food', label: 'Food', icon: '🍱' },
  { key: 'pharmacy', label: 'Pharmacy', icon: '💊' },
  { key: 'mental_health', label: 'Mental Health', icon: '🧠' },
];

export default function ServiceFinder() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [view, setView] = useState('list');
  const [pos, setPos] = useState({ lat: 12.9352, lng: 77.6245 });
  const [services, setServices] = useState([]);

  useEffect(() => {
    getCurrentPosition().then(p => setPos(p));
  }, []);

  useEffect(() => {
    let filtered = LOCAL_SERVICES;
    if (category !== 'all') filtered = filtered.filter(s => s.category === category);
    if (search) filtered = filtered.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase()));
    const withDist = filtered.map(s => ({ ...s, distance: getDistance(pos.lat, pos.lng, s.lat, s.lng) })).sort((a, b) => a.distance - b.distance);
    setServices(withDist);
  }, [category, search, pos]);

  return (
    <div className="finder-page page page-enter" id="service-finder-page">
      {/* Top */}
      <div className="finder-top">
        <div className="finder-search-row">
          <Search size={18} color="var(--text-muted)" />
          <input className="finder-search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search hospitals, shelters, police..." id="service-search" />
        </div>

        <div className="finder-cats">
          {CATEGORIES.map(c => (
            <button key={c.key} className={`chip ${category === c.key ? 'chip-active' : ''}`} onClick={() => setCategory(c.key)}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        <div className="finder-view-toggle">
          <button className={`toggle-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}><List size={16} /> List</button>
          <button className={`toggle-btn ${view === 'map' ? 'active' : ''}`} onClick={() => setView('map')}><MapIcon size={16} /> Map</button>
        </div>
      </div>

      {/* Content */}
      <div className="finder-content page-content">
        {view === 'map' ? (
          <div className="finder-map-wrap">
            <MapContainer center={[pos.lat, pos.lng]} zoom={13} style={{ height: '400px', width: '100%', borderRadius: '16px' }} zoomControl={false} attributionControl={false}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[pos.lat, pos.lng]}><Popup>You are here</Popup></Marker>
              {services.map(s => (
                <Marker key={s.id} position={[s.lat, s.lng]}>
                  <Popup>
                    <strong>{s.name}</strong><br />{s.address}<br />
                    <a href={`tel:${s.phone}`}>📞 {s.phone}</a>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        ) : (
          <div className="finder-list">
            {services.map(s => (
              <div key={s.id} className="service-card card-solid">
                <div className="service-card-top">
                  <div className="service-icon-wrap">
                    <span style={{ fontSize: '1.25rem' }}>
                      {s.category === 'hospital' ? '🏥' : s.category === 'police' ? '🚓' : s.category === 'shelter' ? '🏠' : s.category === 'food' ? '🍱' : s.category === 'pharmacy' ? '💊' : '🧠'}
                    </span>
                  </div>
                  <div className="service-info">
                    <span className="service-name">{s.name}</span>
                    <span className="service-addr text-muted">{s.address}</span>
                    <span className="service-hours text-dim"><Clock size={10} /> {s.hours}</span>
                  </div>
                  <div className="service-right">
                    <span className="service-dist font-mono">{formatDistance(s.distance)}</span>
                    <a href={`tel:${s.phone}`} className="service-call-btn"><PhoneIcon size={14} /></a>
                  </div>
                </div>
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`} target="_blank" rel="noopener" className="service-directions">
                  <Navigation size={12} /> Get Directions →
                </a>
              </div>
            ))}
            {services.length === 0 && <p className="text-muted text-center" style={{ padding: '40px 0' }}>No services found</p>}
          </div>
        )}
      </div>
    </div>
  );
}
