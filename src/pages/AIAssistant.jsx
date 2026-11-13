import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Send, Bot, User, AlertTriangle, Phone as PhoneIcon, Search, Zap } from 'lucide-react';
import SeverityBadge from '../components/SeverityBadge';
import { mockAIAnalysis } from '../utils/api';
import toast from 'react-hot-toast';
import './AIAssistant.css';

const EXAMPLES = [
  { text: 'I feel unsafe walking home 🌙', icon: '🌙' },
  { text: 'I need medical help 🏥', icon: '🏥' },
  { text: 'Family emergency 👨‍👩‍👧', icon: '👨‍👩‍👧' },
];

export default function AIAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { type: 'user', text: msg, time: new Date() }]);
    setLoading(true);

    let result;
    try {
      const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const res = await fetch(`${API}/api/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: msg }),
      });
      const data = await res.json();
      result = data.analysis;
    } catch (err) {
      console.error('AI API error, using local:', err);
      result = mockAIAnalysis(msg);
    }

    setMessages(prev => [...prev, { type: 'ai', ...result, time: new Date() }]);
    setLoading(false);

    if (result.severity === 'CRITICAL') toast.error('⚠️ CRITICAL — Immediate action needed', { duration: 4000 });
  };

  const handleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast.error('Voice not supported');
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = 'en-IN';
    setListening(true);
    recognition.onresult = (e) => {
      const t = e.results[0][0].transcript;
      setListening(false);
      handleSend(t);
    };
    recognition.onerror = () => { setListening(false); toast.error('Voice failed'); };
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  return (
    <div className="ai-page" id="ai-assistant-page">
      {/* Header */}
      <div className="ai-header">
        <Bot size={20} color="var(--purple-400)" />
        <span className="ai-header-title">AI Safety Assistant</span>
      </div>

      {/* Chat Area */}
      <div className="ai-chat" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="ai-empty animate-fadeInUp">
            <div className="ai-empty-icon">🤖</div>
            <h3>Describe your situation</h3>
            <p className="text-muted">I understand context, not just keywords</p>
            <div className="ai-examples">
              {EXAMPLES.map((ex, i) => (
                <button key={i} className="chip" onClick={() => handleSend(ex.text)}>{ex.text}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          msg.type === 'user' ? (
            <div key={i} className="msg-user animate-fadeIn">
              <div className="msg-bubble msg-user-bubble">
                <p>{msg.text}</p>
              </div>
              <span className="msg-time font-mono">{msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          ) : (
            <div key={i} className="msg-ai animate-fadeIn">
              <div className="msg-bubble msg-ai-bubble">
                <div className="msg-ai-top">
                  <SeverityBadge severity={msg.severity} />
                  <span className="chip" style={{ fontSize: '0.625rem', padding: '2px 8px' }}>{msg.emergency_type}</span>
                </div>
                <p className="msg-ai-text">{msg.response_message}</p>
                <div className="msg-ai-actions">
                  {msg.severity === 'CRITICAL' && (
                    <button className="btn btn-danger" style={{ fontSize: '0.6875rem', padding: '7px 12px' }} onClick={() => navigate('/sos/confirm')}>
                      <Zap size={12} /> TRIGGER SOS
                    </button>
                  )}
                  {msg.relevant_helpline && (
                    <a href={`tel:${msg.relevant_helpline.number}`} className="btn btn-primary" style={{ fontSize: '0.6875rem', padding: '7px 12px' }}>
                      <PhoneIcon size={12} /> Call {msg.relevant_helpline.number}
                    </a>
                  )}
                  <button className="btn btn-secondary" style={{ fontSize: '0.6875rem', padding: '7px 12px' }} onClick={() => navigate('/find')}>
                    <Search size={12} /> Find Services
                  </button>
                </div>
              </div>
              <span className="msg-time font-mono">{msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          )
        ))}

        {loading && (
          <div className="msg-ai animate-fadeIn">
            <div className="msg-bubble msg-ai-bubble">
              <div className="typing-dots">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="ai-input-bar">
        <button className={`ai-voice-btn ${listening ? 'listening' : ''}`} onClick={handleVoice}>
          <Mic size={18} />
        </button>
        <input
          className="ai-text-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder={listening ? 'Listening...' : 'Describe your situation...'}
          disabled={listening}
          id="ai-input"
        />
        <button className="ai-send-btn" onClick={() => handleSend()} disabled={loading || !input.trim()}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
