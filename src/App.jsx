import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import SOSConfirm from './pages/SOSConfirm';
import SOSActive from './pages/SOSActive';
import ServiceFinder from './pages/ServiceFinder';
import Helplines from './pages/Helplines';
import AIAssistant from './pages/AIAssistant';
import CheckIn from './pages/CheckIn';
import Profile from './pages/Profile';
import SafetyMap from './pages/SafetyMap';
import BottomNav from './components/BottomNav';
import SOSButton from './components/SOSButton';
import ShakeDetector from './components/ShakeDetector';
import FakeCall from './components/FakeCall';
import ScrollReveal from './components/ScrollReveal';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppContent() {
  const { user } = useAuth();
  const [showFakeCall, setShowFakeCall] = useState(false);

  // Expose fake call trigger globally
  window.__triggerFakeCall = () => setShowFakeCall(true);

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/sos/confirm" element={<ProtectedRoute><SOSConfirm /></ProtectedRoute>} />
        <Route path="/sos/active" element={<ProtectedRoute><SOSActive /></ProtectedRoute>} />
        <Route path="/find" element={<ProtectedRoute><ServiceFinder /></ProtectedRoute>} />
        <Route path="/helplines" element={<Helplines />} />
        <Route path="/ai-check" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
        <Route path="/checkin" element={<ProtectedRoute><CheckIn /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/safety-map" element={<ProtectedRoute><SafetyMap /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {user && <SOSButton />}
      {user && <BottomNav />}
      {user && <ShakeDetector />}
      <ScrollReveal />
      {showFakeCall && <FakeCall onClose={() => setShowFakeCall(false)} />}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(20, 20, 30, 0.95)',
            color: '#F1F1F3',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '12px',
            fontSize: '0.875rem',
          },
        }}
      />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
