import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { AlertTriangle, Shield, Eye, Clock, Navigation, Filter } from 'lucide-react';
import { getCurrentPosition } from '../utils/api';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import './SafetyMap.css';

// Comprehensive Bangalore safety data with granular incident points
const ZONES = [
  { name: 'Majestic / KR Market', lat: 12.9767, lng: 77.5713, risk: 'high', type: 'theft', incidents: 47, desc: 'High pickpocket & chain snatching zone', area: 'Central' },
  { name: 'Shivajinagar Bus Stand', lat: 12.9857, lng: 77.6057, risk: 'high', type: 'assault', incidents: 31, desc: 'Eve-teasing & crowding reports', area: 'Central' },
  { name: 'KR Puram Railway', lat: 13.0074, lng: 77.6941, risk: 'high', type: 'robbery', incidents: 28, desc: 'Late-night vehicle theft hotspot', area: 'East' },
  { name: 'Peenya Industrial Area', lat: 13.0300, lng: 77.5200, risk: 'high', type: 'assault', incidents: 25, desc: 'Isolated stretches after dark', area: 'North' },
  { name: 'Kalasipalya', lat: 12.9650, lng: 77.5750, risk: 'high', type: 'theft', incidents: 35, desc: 'Market area — bag snatching', area: 'Central' },
  { name: 'Yeshwanthpur Station', lat: 13.0200, lng: 77.5400, risk: 'medium', type: 'theft', incidents: 19, desc: 'Station area theft', area: 'North' },
  { name: 'Whitefield ITPL', lat: 12.9698, lng: 77.7500, risk: 'medium', type: 'cybercrime', incidents: 22, desc: 'Online fraud cluster', area: 'East' },
  { name: 'Marathahalli Bridge', lat: 12.9591, lng: 77.7009, risk: 'medium', type: 'accident', incidents: 33, desc: 'Major traffic accident zone', area: 'East' },
  { name: 'Electronic City Phase 1', lat: 12.8440, lng: 77.6630, risk: 'medium', type: 'stalking', incidents: 14, desc: 'Late-night stalking near hostels', area: 'South' },
  { name: 'Silk Board Junction', lat: 12.9177, lng: 77.6233, risk: 'medium', type: 'accident', incidents: 41, desc: 'Deadliest junction in Bangalore', area: 'South' },
  { name: 'Hebbal Flyover', lat: 13.0350, lng: 77.5970, risk: 'medium', type: 'accident', incidents: 18, desc: 'Flyover pile-up zone', area: 'North' },
  { name: 'Madiwala Market', lat: 12.9220, lng: 77.6170, risk: 'medium', type: 'theft', incidents: 15, desc: 'Crowded market theft', area: 'South' },
  { name: 'Yelahanka Air Force', lat: 13.1007, lng: 77.5963, risk: 'low', type: 'none', incidents: 3, desc: 'Military presence — very safe', area: 'North' },
  { name: 'Koramangala 4th Block', lat: 12.9352, lng: 77.6245, risk: 'low', type: 'theft', incidents: 8, desc: 'Generally safe, minor incidents', area: 'South' },
  { name: 'Indiranagar 100ft Road', lat: 12.9716, lng: 77.6412, risk: 'low', type: 'none', incidents: 5, desc: 'Well-patrolled, safe nightlife', area: 'East' },
  { name: 'Jayanagar 4th Block', lat: 12.9308, lng: 77.5833, risk: 'low', type: 'none', incidents: 4, desc: 'Residential, very safe', area: 'South' },
  { name: 'HSR Layout Sector 2', lat: 12.9116, lng: 77.6389, risk: 'low', type: 'none', incidents: 6, desc: 'Safe residential zone', area: 'South' },
  { name: 'JP Nagar 6th Phase', lat: 12.9063, lng: 77.5857, risk: 'low', type: 'none', incidents: 3, desc: 'Family area, very safe', area: 'South' },
  { name: 'Sadashivanagar', lat: 13.0050, lng: 77.5780, risk: 'low', type: 'none', incidents: 2, desc: 'Premium area — high security', area: 'Central' },
  { name: 'Malleshwaram', lat: 13.0035, lng: 77.5680, risk: 'low', type: 'none', incidents: 4, desc: 'Traditional area — safe', area: 'Central' },
];

// Generate dense heatmap points from zone data
function generateHeatPoints(zones) {
  const points = [];
  zones.forEach(z => {
    const intensity = z.risk === 'high' ? 1.0 : z.risk === 'medium' ? 0.5 : 0.1;
    const count = z.risk === 'high' ? 12 : z.risk === 'medium' ? 6 : 2;
    for (let i = 0; i < count; i++) {
      const jitterLat = (Math.random() - 0.5) * 0.012;
      const jitterLng = (Math.random() - 0.5) * 0.012;
      points.push([z.lat + jitterLat, z.lng + jitterLng, intensity]);
    }
  });
  return points;
}

const RISK_COLORS = {
  high: '#DC2626',
  medium: '#F59E0B',
  low: '#22C55E',
};

// Custom icons
const userIcon = L.divIcon({
  className: 'user-marker',
  html: '<div style="width:16px;height:16px;background:#3B82F6;border:3px solid white;border-radius:50%;box-shadow:0 0 12px rgba(59,130,246,0.6)"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const zoneIcon = (risk) => L.divIcon({
  className: 'zone-marker',
  html: `<div style="width:10px;height:10px;background:${RISK_COLORS[risk]};border:2px solid rgba(255,255,255,0.5);border-radius:50%;box-shadow:0 0 8px ${RISK_COLORS[risk]}80"></div>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

// Heat layer component
function HeatLayer({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    const heat = L.heatLayer(points, {
      radius: 35,
      blur: 25,
      maxZoom: 15,
      max: 1.0,
      gradient: {
        0.0: '#000004',
        0.2: '#420A68',
        0.4: '#932667',
        0.6: '#DD513A',
        0.8: '#FCA50A',
        1.0: '#FCFFA4',
      },
    }).addTo(map);
    return () => map.removeLayer(heat);
  }, [map, points]);
  return null;
}

function FlyToUser({ pos }) {
  const map = useMap();
  useEffect(() => { map.flyTo([pos.lat, pos.lng], 12, { duration: 1.5 }); }, [pos]);
  return null;
}

export default function SafetyMap() {
  const [pos, setPos] = useState({ lat: 12.9352, lng: 77.6245 });
  const [filter, setFilter] = useState('all');
  const [showHeat, setShowHeat] = useState(true);
  const [showZones, setShowZones] = useState(true);
  const now = new Date().getHours();
  const isNight = now >= 20 || now <= 5;

  useEffect(() => { getCurrentPosition().then(setPos); }, []);

  const filtered = useMemo(() =>
    ZONES.filter(z => filter === 'all' || z.risk === filter),
    [filter]
  );

  const heatPoints = useMemo(() => generateHeatPoints(
    filter === 'all' ? ZONES.filter(z => z.risk !== 'low') : filtered.filter(z => z.risk !== 'low')
  ), [filter, filtered]);

  const stats = {
    high: ZONES.filter(z => z.risk === 'high').length,
    medium: ZONES.filter(z => z.risk === 'medium').length,
    low: ZONES.filter(z => z.risk === 'low').length,
    total: ZONES.reduce((s, z) => s + z.incidents, 0),
  };

  return (
    <div className="safetymap-page page page-enter" id="safety-map-page">
      {/* Header */}
      <div className="safetymap-header">
        <div className="safetymap-title-row">
          <Eye size={18} color="var(--purple-400)" />
          <h2>Bangalore Safety Heatmap</h2>
          {isNight && <span className="chip chip-red blink" style={{ fontSize: '0.6rem' }}>🌙 NIGHT</span>}
        </div>

        <div className="safetymap-stats">
          <div className="stat-pill stat-total">📊 {stats.total} incidents</div>
          <div className="stat-pill stat-danger">🔴 {stats.high}</div>
          <div className="stat-pill stat-warning">🟡 {stats.medium}</div>
          <div className="stat-pill stat-safe">🟢 {stats.low}</div>
        </div>

        <div className="safetymap-controls">
          <div className="safetymap-filters">
            {['all', 'high', 'medium', 'low'].map(f => (
              <button key={f} className={`chip ${filter === f ? 'chip-active' : ''}`} onClick={() => setFilter(f)}>
                {f === 'all' ? '🗺️ All' : f === 'high' ? '🔴 Danger' : f === 'medium' ? '🟡 Caution' : '🟢 Safe'}
              </button>
            ))}
          </div>
          <div className="safetymap-toggles">
            <button className={`toggle-mini ${showHeat ? 'on' : ''}`} onClick={() => setShowHeat(!showHeat)}>🔥 Heat</button>
            <button className={`toggle-mini ${showZones ? 'on' : ''}`} onClick={() => setShowZones(!showZones)}>📍 Zones</button>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="safetymap-map">
        <MapContainer
          center={[pos.lat, pos.lng]}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          <FlyToUser pos={pos} />

          {/* Heat layer */}
          {showHeat && <HeatLayer points={heatPoints} />}

          {/* User location */}
          <Marker position={[pos.lat, pos.lng]} icon={userIcon}>
            <Popup><strong>📍 Your Location</strong></Popup>
          </Marker>

          {/* Zone markers with labels */}
          {showZones && filtered.map((zone, i) => (
            <Marker key={i} position={[zone.lat, zone.lng]} icon={zoneIcon(zone.risk)}>
              <Tooltip direction="top" offset={[0, -8]} permanent={false} className="zone-tooltip">
                <strong>{zone.name}</strong>
              </Tooltip>
              <Popup>
                <div className="zone-popup">
                  <div className="zone-popup-header">
                    <span className="zone-risk-dot" style={{ background: RISK_COLORS[zone.risk] }} />
                    <strong>{zone.name}</strong>
                  </div>
                  <p className="zone-popup-desc">{zone.desc}</p>
                  <div className="zone-popup-stats">
                    <span>📊 {zone.incidents} incidents (30d)</span>
                    <span>🏷️ {zone.type}</span>
                    <span>📍 {zone.area}</span>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${zone.lat},${zone.lng}`}
                    target="_blank" rel="noopener"
                    className="zone-popup-dir"
                  >
                    <Navigation size={10} /> View on Google Maps
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Risk radius circles */}
          {showZones && filtered.filter(z => z.risk !== 'low').map((zone, i) => (
            <Circle
              key={`c-${i}`}
              center={[zone.lat, zone.lng]}
              radius={zone.risk === 'high' ? 500 : 350}
              pathOptions={{
                fillColor: RISK_COLORS[zone.risk],
                color: RISK_COLORS[zone.risk],
                fillOpacity: 0.08,
                weight: 1,
                dashArray: '4 4',
              }}
            />
          ))}
        </MapContainer>

        {/* Floating info */}
        <div className="map-floating-info">
          <span className="font-mono" style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
            LIVE • {new Date().toLocaleTimeString()} • {filtered.length} zones
          </span>
        </div>
      </div>

      {/* Bottom zone list */}
      <div className="safetymap-bottom">
        <div className="zone-list-scroll">
          {filtered.slice(0, 5).map((z, i) => (
            <div key={i} className="zone-mini-card">
              <span className="zone-mini-dot" style={{ background: RISK_COLORS[z.risk] }} />
              <div className="zone-mini-info">
                <span className="zone-mini-name">{z.name}</span>
                <span className="zone-mini-type">{z.type} • {z.incidents} reports</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
