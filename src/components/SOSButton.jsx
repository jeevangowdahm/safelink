import { useNavigate, useLocation } from 'react-router-dom';
import './SOSButton.css';

export default function SOSButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on SOS screens, landing, login, onboarding
  const hidePaths = ['/', '/login', '/onboarding', '/sos/confirm', '/sos/active'];
  if (hidePaths.includes(location.pathname)) return null;

  return (
    <button
      className="sos-fab"
      onClick={() => {
        if (navigator.vibrate) navigator.vibrate(100);
        navigate('/sos/confirm');
      }}
      id="sos-floating-btn"
      aria-label="Emergency SOS"
    >
      <span className="sos-fab-ring" />
      <span className="sos-fab-ring ring-2" />
      <span className="sos-fab-icon">SOS</span>
    </button>
  );
}
