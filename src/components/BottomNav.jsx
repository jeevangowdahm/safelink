import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Phone, User } from 'lucide-react';
import './BottomNav.css';

const tabs = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/find', icon: Search, label: 'Find' },
  { path: '/helplines', icon: Phone, label: 'Helplines' },
  { path: '/profile', icon: User, label: 'Me' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on landing, login, onboarding, SOS screens
  const hidePaths = ['/', '/login', '/onboarding', '/sos/confirm', '/sos/active'];
  if (hidePaths.includes(location.pathname)) return null;

  return (
    <nav className="bottom-nav safe-bottom" id="bottom-nav">
      {tabs.map(({ path, icon: Icon, label }) => {
        const isActive = location.pathname === path;
        return (
          <button
            key={path}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(path)}
            id={`nav-${label.toLowerCase()}`}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
            <span className="bottom-nav-label">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
