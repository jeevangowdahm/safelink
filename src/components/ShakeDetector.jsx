import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const SHAKE_THRESHOLD = 30;
const SHAKE_COUNT_TRIGGER = 3;
const SHAKE_RESET_MS = 1500;
const KEY_TRIGGER = 's'; // Press 'S' 3 times rapidly
const KEY_RESET_MS = 1000;

export default function ShakeDetector() {
  const navigate = useNavigate();
  const location = useLocation();
  const shakeCount = useRef(0);
  const lastShake = useRef(0);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const lastZ = useRef(0);
  const keyCount = useRef(0);
  const lastKeyPress = useRef(0);
  const [enabled] = useState(() => {
    return localStorage.getItem('safelink_shake_sos') !== 'false';
  });

  const triggerSOS = () => {
    if (location.pathname.includes('/sos')) return;
    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);
    toast('🆘 Panic trigger! Launching SOS...', {
      icon: '🚨',
      style: { background: '#991B1B', color: '#fff', fontWeight: 700 },
      duration: 2000,
    });
    setTimeout(() => navigate('/sos/confirm'), 500);
  };

  // Mobile: Shake detection
  useEffect(() => {
    if (!enabled || !window.DeviceMotionEvent) return;

    const handleMotion = (e) => {
      const { x, y, z } = e.accelerationIncludingGravity || {};
      if (x == null) return;

      const now = Date.now();
      const dx = Math.abs(x - lastX.current);
      const dy = Math.abs(y - lastY.current);
      const dz = Math.abs(z - lastZ.current);

      lastX.current = x;
      lastY.current = y;
      lastZ.current = z;

      if (dx + dy + dz > SHAKE_THRESHOLD) {
        if (now - lastShake.current < SHAKE_RESET_MS) {
          shakeCount.current++;
        } else {
          shakeCount.current = 1;
        }
        lastShake.current = now;

        if (shakeCount.current >= SHAKE_COUNT_TRIGGER) {
          shakeCount.current = 0;
          triggerSOS();
        }
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [enabled, navigate, location.pathname]);

  // Desktop: Press 'S' 3 times rapidly
  useEffect(() => {
    if (!enabled) return;

    const handleKey = (e) => {
      // Don't trigger in input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key.toLowerCase() === KEY_TRIGGER) {
        const now = Date.now();
        if (now - lastKeyPress.current < KEY_RESET_MS) {
          keyCount.current++;
        } else {
          keyCount.current = 1;
        }
        lastKeyPress.current = now;

        if (keyCount.current >= SHAKE_COUNT_TRIGGER) {
          keyCount.current = 0;
          triggerSOS();
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [enabled, navigate, location.pathname]);

  return null;
}
