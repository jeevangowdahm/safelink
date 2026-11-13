import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Zap, Brain, MapPin, Phone, ArrowRight, Sparkles } from 'lucide-react';
import heroBg from '../assets/hero-bg.png';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) return <Navigate to="/home" replace />;

  return (
    <div className="landing" id="landing-page">
      {/* Film grain overlay */}
      <div className="grain-overlay" />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <img src={heroBg} alt="" className="hero-bg-img" />
          <div className="hero-bg-gradient" />
        </div>

        {/* Floating particles */}
        <div className="particles">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`} />
          ))}
        </div>

        <nav className="landing-nav animate-fadeInUp">
          <div className="nav-brand">
            <div className="nav-logo animate-glow">
              <Shield size={18} />
            </div>
            <span className="nav-name">SafeLink</span>
          </div>
          <button className="nav-cta" onClick={() => navigate('/login')}>
            Get Started <ArrowRight size={14} />
          </button>
        </nav>

        <div className="hero-content">
          <div className="hero-badge animate-fadeInUp">
            <Sparkles size={12} />
            <span>AI-Powered Emergency Intelligence</span>
          </div>

          <h1 className="hero-title animate-fadeInUp stagger-1">
            The Safety Net<br />
            <span className="hero-title-accent">Bangalore Deserves.</span>
          </h1>

          <p className="hero-subtitle animate-fadeInUp stagger-2">
            One tap connects you to emergency services, AI-powered threat detection, 
            and your trusted circle. Engineered for when seconds matter.
          </p>

          <div className="hero-actions animate-fadeInUp stagger-3">
            <button className="hero-btn-primary" onClick={() => navigate('/login')}>
              <Zap size={18} />
              Launch SafeLink
            </button>
            <button className="hero-btn-secondary" onClick={() => navigate('/helplines')}>
              <Phone size={16} />
              Emergency Helplines
            </button>
          </div>

          <div className="hero-stats animate-fadeInUp stagger-4">
            <div className="hero-stat">
              <span className="hero-stat-number font-serif">108</span>
              <span className="hero-stat-label">Ambulance</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-number font-serif">100</span>
              <span className="hero-stat-label">Police</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-number font-serif">1091</span>
              <span className="hero-stat-label">Women</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-number font-serif">101</span>
              <span className="hero-stat-label">Fire</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-inner">
          <h2 className="section-heading animate-fadeInUp font-serif">
            Pro features.<br /><em>Zero complexity.</em>
          </h2>

          <div className="features-grid">
            <div className="feature-card animate-fadeInUp stagger-1">
              <div className="feature-icon-wrap">
                <Brain size={24} />
              </div>
              <h3 className="font-serif">AI Threat Analysis</h3>
              <p>Powered by Llama 3.3 70B. Understands context, not just keywords. Classifies severity in real-time.</p>
            </div>

            <div className="feature-card animate-fadeInUp stagger-2">
              <div className="feature-icon-wrap feature-icon-green">
                <MapPin size={24} />
              </div>
              <h3 className="font-serif">Safety Heatmap</h3>
              <p>Live danger zone mapping of Bangalore. Crime data, safe corridors, and time-based risk assessment.</p>
            </div>

            <div className="feature-card animate-fadeInUp stagger-3">
              <div className="feature-icon-wrap feature-icon-blue">
                <Zap size={24} />
              </div>
              <h3 className="font-serif">Shake to SOS</h3>
              <p>Aggressive shake or triple-tap triggers an emergency broadcast to your circle with GPS coordinates.</p>
            </div>

            <div className="feature-card animate-fadeInUp stagger-4">
              <div className="feature-icon-wrap feature-icon-purple">
                <Phone size={24} />
              </div>
              <h3 className="font-serif">Fake Call Escape</h3>
              <p>Generate a realistic incoming call to exit uncomfortable situations. Customizable caller and delay.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-inner animate-fadeInUp">
          <h2 className="font-serif">Your safety.<br /><em>Our mission.</em></h2>
          <p>Built for Bangalore. Built for you.</p>
          <button className="hero-btn-primary" onClick={() => navigate('/login')}>
            <Shield size={18} /> Get Protected Now
          </button>
        </div>
      </section>
    </div>
  );
}
