import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Shield, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import './Login.css';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      toast.error('Enter a valid 10-digit number');
      return;
    }
    setLoading(true);
    // Simulate OTP send
    await new Promise(r => setTimeout(r, 1200));
    setOtpSent(true);
    setLoading(false);
    toast.success('OTP sent to +91 ' + phone);
  };

  const handleOTPChange = (index, value) => {
    if (value.length > 1) value = value[value.length - 1];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Auto-focus next
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      if (next) next.focus();
    }
  };

  const handleOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      if (prev) prev.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      toast.error('Enter the 6-digit OTP');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));

    // Check if user exists in localStorage (returning user)
    const existingUser = localStorage.getItem('safelink_user');
    if (existingUser) {
      const userData = JSON.parse(existingUser);
      login(userData);
      toast.success('Welcome back, ' + userData.full_name + '!');
      navigate('/home', { replace: true });
    } else {
      // New user - demo login
      login({
        id: 'demo-' + Date.now(),
        phone: '+91' + phone,
        full_name: '',
        isNew: true,
      });
      navigate('/onboarding', { replace: true });
    }
    setLoading(false);
  };

  return (
    <div className="login-page" id="login-page">
      {/* Top Section */}
      <div className="login-top">
        <button className="login-back" onClick={() => navigate('/')}>
          <ArrowLeft size={22} color="white" />
        </button>
        <div className="login-logo">
          <Shield size={44} color="white" strokeWidth={1.5} />
        </div>
        <h1 className="login-heading font-serif">Welcome back</h1>
        <p className="login-sub">Your safety companion</p>
      </div>

      {/* Bottom Card */}
      <div className="login-card">
        {!otpSent ? (
          <form onSubmit={handleSendOTP}>
            <h2 className="login-card-title">Enter your phone number</h2>

            <div className="phone-input-group">
              <div className="phone-prefix font-mono">+91</div>
              <input
                type="tel"
                className="phone-input font-mono"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="98765 43210"
                maxLength={10}
                autoFocus
                id="phone-input"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading || phone.length < 10}
              id="send-otp-btn"
            >
              {loading ? <span className="spinner" /> : <>Send OTP →</>}
            </button>
          </form>
        ) : (
          <div className="otp-section animate-fadeInUp">
            <h2 className="login-card-title">Enter verification code</h2>
            <p className="text-muted" style={{ fontSize: '0.8125rem', marginBottom: '20px' }}>
              Sent to +91 {phone}
            </p>

            <div className="otp-inputs">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="tel"
                  className="otp-box font-mono"
                  value={digit}
                  onChange={e => handleOTPChange(i, e.target.value)}
                  onKeyDown={e => handleOTPKeyDown(i, e)}
                  maxLength={1}
                  autoFocus={i === 0}
                />
              ))}
            </div>

            <button
              className="btn btn-primary btn-full btn-lg"
              onClick={handleVerify}
              disabled={loading}
              id="verify-otp-btn"
            >
              {loading ? <span className="spinner" /> : 'Verify & Continue'}
            </button>

            <button
              className="btn btn-ghost btn-full"
              onClick={() => { setOtpSent(false); setOtp(['', '', '', '', '', '']); }}
              style={{ marginTop: '8px' }}
            >
              ← Change number
            </button>
          </div>
        )}

        <p className="login-bottom-text">
          {otpSent ? (
            <span className="text-dim">Didn't receive? <span className="text-red" style={{ cursor: 'pointer' }}>Resend OTP</span></span>
          ) : (
            <span className="text-dim">New to SafeLink? <span className="text-red" style={{ cursor: 'pointer' }} onClick={() => navigate('/login')}>Sign up →</span></span>
          )}
        </p>
      </div>
    </div>
  );
}
