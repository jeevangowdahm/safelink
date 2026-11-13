import { useState } from 'react';
import { Search, Phone as PhoneIcon, Star } from 'lucide-react';
import { HELPLINES } from '../utils/api';
import './Helplines.css';

const CATEGORIES = ['all', 'police', 'medical', 'women', 'mental_health', 'children', 'utility', 'disaster', 'fire', 'accident', 'senior'];
const CAT_LABELS = { all: 'All', police: 'Police', medical: 'Medical', women: 'Women', mental_health: 'Mental Health', children: 'Children', utility: 'Utility', disaster: 'Disaster', fire: 'Fire', accident: 'Accident', senior: 'Senior' };
const CAT_COLORS = { police: '#374151', medical: '#2563EB', women: '#EC4899', mental_health: '#8B5CF6', children: '#EAB308', utility: '#14B8A6', disaster: '#EA580C', fire: '#DC2626', accident: '#F97316', senior: '#6B7280' };

export default function Helplines() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [saved, setSaved] = useState(() => {
    const s = localStorage.getItem('safelink_saved_helplines');
    return s ? JSON.parse(s) : [];
  });

  const filtered = HELPLINES.filter(h => {
    if (category !== 'all' && h.category !== category) return false;
    if (search && !h.name.toLowerCase().includes(search.toLowerCase()) && !h.number.includes(search)) return false;
    return true;
  });

  const toggleSave = (id) => {
    const newSaved = saved.includes(id) ? saved.filter(s => s !== id) : [...saved, id];
    setSaved(newSaved);
    localStorage.setItem('safelink_saved_helplines', JSON.stringify(newSaved));
  };

  const savedHelplines = HELPLINES.filter(h => saved.includes(h.id));

  return (
    <div className="helplines-page page page-enter" id="helplines-page">
      <div className="helplines-top">
        <div className="helplines-search-row">
          <Search size={18} color="var(--text-muted)" />
          <input className="helplines-search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search helplines..." id="helpline-search" />
        </div>
        <div className="helplines-cats">
          {CATEGORIES.map(c => (
            <button key={c} className={`chip ${category === c ? 'chip-active' : ''}`} onClick={() => setCategory(c)}>
              {CAT_LABELS[c] || c}
            </button>
          ))}
        </div>
      </div>

      <div className="page-content helplines-body">
        {savedHelplines.length > 0 && (
          <div className="saved-section animate-fadeInUp">
            <h3 className="saved-title">⭐ Your Saved Numbers</h3>
            <div className="saved-chips">
              {savedHelplines.map(h => (
                <a key={h.id} href={`tel:${h.number}`} className="saved-chip font-mono">{h.icon} {h.number}</a>
              ))}
            </div>
          </div>
        )}

        <div className="helplines-list">
          {filtered.map((h, i) => (
            <div key={h.id} className="helpline-card card-solid animate-fadeInUp" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="helpline-icon" style={{ background: `${CAT_COLORS[h.category] || '#6B7280'}20`, color: CAT_COLORS[h.category] || '#6B7280' }}>
                <span style={{ fontSize: '1.25rem' }}>{h.icon}</span>
              </div>
              <div className="helpline-info">
                <span className="helpline-name">{h.name}</span>
                <span className="helpline-desc text-muted">{h.description}</span>
              </div>
              <div className="helpline-actions">
                <span className="helpline-number font-mono">{h.number}</span>
                <div className="helpline-btns">
                  <a href={`tel:${h.number}`} className="helpline-call-btn" id={`call-${h.id}`}>
                    <PhoneIcon size={14} /> CALL
                  </a>
                  <button className={`helpline-save-btn ${saved.includes(h.id) ? 'saved' : ''}`} onClick={() => toggleSave(h.id)}>
                    <Star size={14} fill={saved.includes(h.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
