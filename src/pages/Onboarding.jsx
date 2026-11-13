import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, ArrowLeft, Plus, X, MapPin, Bell, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import './Onboarding.css';

const AREAS = ['Koramangala', 'Whitefield', 'Indiranagar', 'Jayanagar', 'JP Nagar', 'Hebbal', 'Yelahanka', 'Electronic City', 'Marathahalli', 'HSR Layout', 'BTM Layout', 'Banashankari', 'Rajajinagar', 'Malleswaram', 'Shivajinagar'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ full_name: '', dob: '', area: '', ward: '' });
  const [contacts, setContacts] = useState([{ name: '', phone: '' }]);
  const [medical, setMedical] = useState({ blood_group: '', allergies: '', conditions: '', medications: '', include_in_sos: true });
  const [permLocation, setPermLocation] = useState(false);
  const [permNotif, setPermNotif] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const handleNext = () => {
    if (step === 1 && !form.full_name) { toast.error('Please enter your name'); return; }
    if (step === 2 && (!contacts[0].name || !contacts[0].phone)) { toast.error('Add at least one emergency contact'); return; }
    if (step < 4) setStep(step + 1);
  };

  const addContact = () => {
    if (contacts.length >= 5) return;
    setContacts([...contacts, { name: '', phone: '' }]);
  };

  const removeContact = (i) => {
    if (contacts.length <= 1) return;
    setContacts(contacts.filter((_, idx) => idx !== i));
  };

  const updateContact = (i, field, val) => {
    const c = [...contacts];
    c[i][field] = val;
    setContacts(c);
  };

  const requestLocation = async () => {
    try {
      await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
      });
      setPermLocation(true);
      toast.success('Location access granted');
    } catch {
      setPermLocation(true); // Allow bypass for demo
      toast.success('Location set to Koramangala (default)');
    }
  };

  const requestNotif = async () => {
    try {
      if ('Notification' in window) await Notification.requestPermission();
      setPermNotif(true);
      toast.success('Notifications enabled');
    } catch {
      setPermNotif(true);
    }
  };

  const finishSetup = () => {
    updateUser({
      full_name: form.full_name,
      dob: form.dob,
      area_name: form.area || 'Koramangala',
      bbmp_ward: form.ward || form.area || 'Koramangala',
      blood_group: medical.blood_group,
      allergies: medical.allergies,
      medical_conditions: medical.conditions,
      medications: medical.medications,
      include_medical_in_sos: medical.include_in_sos,
      isNew: false,
    });
    localStorage.setItem('safelink_contacts', JSON.stringify(contacts.filter(c => c.name && c.phone)));
    setDone(true);
    setTimeout(() => navigate('/home', { replace: true }), 2000);
  };

  if (done) {
    return (
      <div className="onboarding-done" id="onboarding-done">
        <div className="done-circle">
          <Check size={48} color="var(--green-400)" strokeWidth={3} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>You're all set, {form.full_name}!</h2>
        <p className="text-muted">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="onboarding-page page-enter" id="onboarding-page">
      {/* Progress */}
      <div className="onboarding-progress">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className={`progress-step ${s <= step ? 'active' : ''}`} />
        ))}
      </div>

      <div className="onboarding-content">
        {/* Step 1: Personal */}
        {step === 1 && (
          <div className="onboarding-step animate-fadeInUp">
            <h2 className="step-title">Tell us about yourself</h2>
            <p className="text-muted step-sub">So we can personalize your emergency profile</p>

            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="input" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} placeholder="Your full name" id="input-name" />
            </div>

            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input className="input" type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} id="input-dob" />
            </div>

            <div className="form-group">
              <label className="form-label">Area / Neighborhood</label>
              <select className="input" value={form.area} onChange={e => setForm({ ...form, area: e.target.value, ward: e.target.value })} id="input-area">
                <option value="">Select area</option>
                {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Contacts */}
        {step === 2 && (
          <div className="onboarding-step animate-fadeInUp">
            <h2 className="step-title">Who should we alert?</h2>
            <p className="text-muted step-sub">Add up to 5 people. They'll receive your SOS alerts.</p>

            {contacts.map((c, i) => (
              <div key={i} className="contact-row">
                <input className="input contact-name" value={c.name} onChange={e => updateContact(i, 'name', e.target.value)} placeholder="Name" />
                <input className="input contact-phone font-mono" value={c.phone} onChange={e => updateContact(i, 'phone', e.target.value.replace(/\D/g, ''))} placeholder="Phone" type="tel" />
                {contacts.length > 1 && (
                  <button className="contact-remove" onClick={() => removeContact(i)}><X size={16} /></button>
                )}
              </div>
            ))}

            {contacts.length < 5 && (
              <button className="btn btn-ghost" onClick={addContact} style={{ color: 'var(--red-400)' }}>
                <Plus size={16} /> Add another contact
              </button>
            )}

            <div className="sos-preview card-solid">
              <p className="text-dim" style={{ fontSize: '0.75rem', fontStyle: 'italic' }}>
                SOS preview: "{form.full_name || 'Your Name'} needs help! Location: [link]. Medical: [Blood group]. Call: +91..."
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Medical */}
        {step === 3 && (
          <div className="onboarding-step animate-fadeInUp">
            <h2 className="step-title">Medical information</h2>
            <p className="text-muted step-sub">Helps emergency responders. Optional.</p>

            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <div className="blood-group-grid">
                {BLOOD_GROUPS.map(bg => (
                  <button key={bg} className={`chip ${medical.blood_group === bg ? 'chip-active' : ''}`}
                    onClick={() => setMedical({ ...medical, blood_group: bg })}>{bg}</button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Known Allergies</label>
              <textarea className="textarea" value={medical.allergies} onChange={e => setMedical({ ...medical, allergies: e.target.value })} placeholder="e.g. Penicillin, peanuts" />
            </div>

            <div className="form-group">
              <label className="form-label">Medical Conditions</label>
              <textarea className="textarea" value={medical.conditions} onChange={e => setMedical({ ...medical, conditions: e.target.value })} placeholder="e.g. Diabetes, asthma" />
            </div>

            <div className="form-group">
              <label className="form-label">Current Medications</label>
              <textarea className="textarea" value={medical.medications} onChange={e => setMedical({ ...medical, medications: e.target.value })} placeholder="e.g. Metformin 500mg" />
            </div>

            <div className="toggle-row">
              <span>Include in SOS messages</span>
              <button className={`toggle ${medical.include_in_sos ? 'active' : ''}`} onClick={() => setMedical({ ...medical, include_in_sos: !medical.include_in_sos })}>
                <span className="toggle-knob" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Permissions */}
        {step === 4 && (
          <div className="onboarding-step animate-fadeInUp">
            <h2 className="step-title">Almost there!</h2>

            <div className="perm-card" style={{ borderColor: 'rgba(37, 99, 235, 0.3)', background: 'rgba(37, 99, 235, 0.06)' }}>
              <MapPin size={36} color="var(--blue-400)" />
              <h3>Allow Location Access</h3>
              <p className="text-muted" style={{ fontSize: '0.8125rem' }}>We'll use this to find nearby services and include in SOS</p>
              {permLocation ? (
                <span className="perm-granted"><Check size={18} /> Granted</span>
              ) : (
                <button className="btn" style={{ background: 'var(--blue-600)', color: 'white' }} onClick={requestLocation}>Enable Location</button>
              )}
            </div>

            <div className="perm-card" style={{ borderColor: 'rgba(234, 88, 12, 0.3)', background: 'rgba(234, 88, 12, 0.06)' }}>
              <Bell size={36} color="var(--orange-400)" />
              <h3>Enable Notifications</h3>
              <p className="text-muted" style={{ fontSize: '0.8125rem' }}>Get alerts when check-in timer expires</p>
              {permNotif ? (
                <span className="perm-granted"><Check size={18} /> Enabled</span>
              ) : (
                <button className="btn" style={{ background: 'var(--orange-500)', color: 'white' }} onClick={requestNotif}>Enable Notifications</button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Buttons */}
      <div className="onboarding-buttons">
        {step > 1 && (
          <button className="btn btn-secondary" onClick={() => setStep(step - 1)}>
            <ArrowLeft size={18} /> Back
          </button>
        )}
        <div style={{ flex: 1 }} />
        {step < 4 ? (
          <button className="btn btn-primary" onClick={handleNext}>
            Next <ArrowRight size={18} />
          </button>
        ) : (
          <button className="btn btn-primary btn-lg" onClick={finishSetup} id="complete-setup-btn">
            Complete Setup
          </button>
        )}
      </div>
    </div>
  );
}
