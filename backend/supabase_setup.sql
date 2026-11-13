-- ============================================
-- SAFELINK BANGALORE — DATABASE SETUP
-- Run this in Supabase SQL Editor (supabase.com → SQL Editor → New Query)
-- ============================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  full_name TEXT,
  dob DATE,
  area_name TEXT,
  bbmp_ward TEXT,
  blood_group TEXT,
  allergies TEXT,
  medical_conditions TEXT,
  medications TEXT,
  include_medical_in_sos BOOLEAN DEFAULT true,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. EMERGENCY CONTACTS
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  relationship TEXT,
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. LOCAL SERVICES
CREATE TABLE IF NOT EXISTS local_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  address TEXT,
  ward TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  phone TEXT,
  hours TEXT,
  is_24h BOOLEAN DEFAULT false,
  services TEXT[],
  verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. HELPLINES
CREATE TABLE IF NOT EXISTS helplines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  number TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  is_toll_free BOOLEAN DEFAULT true,
  available_24_7 BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. SOS EVENTS
CREATE TABLE IF NOT EXISTS sos_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  trigger_type TEXT DEFAULT 'button',
  severity TEXT DEFAULT 'CRITICAL',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  notes TEXT,
  status TEXT DEFAULT 'sent',
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. AI ANALYSIS LOG
CREATE TABLE IF NOT EXISTS ai_analysis_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  input_text TEXT NOT NULL,
  input_method TEXT DEFAULT 'text',
  severity TEXT,
  emergency_type TEXT,
  detected_signals JSONB,
  recommended_action TEXT,
  response_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. CHECKIN TIMERS
CREATE TABLE IF NOT EXISTS checkin_timers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  description TEXT,
  checkin_due_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'active',
  checked_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- SEED DATA — BANGALORE LOCAL SERVICES (20+)
-- ============================================

INSERT INTO local_services (name, category, address, ward, lat, lng, phone, hours, is_24h, services) VALUES
('Victoria Hospital', 'hospital', 'Fort Rd, Bangalore', 'Shivajinagar', 12.9634, 77.5855, '080-26701150', '24/7', true, ARRAY['Emergency', 'ICU', 'Blood Bank']),
('Manipal Hospital', 'hospital', 'Old Airport Rd', 'Domlur', 12.9591, 77.6388, '080-25024444', '24/7', true, ARRAY['Emergency', 'ICU', 'Neurology']),
('St. Johns Hospital', 'hospital', 'Sarjapur Rd', 'Koramangala', 12.9280, 77.6210, '080-22065000', '24/7', true, ARRAY['Emergency', 'Trauma', 'ICU']),
('Bowring Hospital', 'hospital', 'Shivaji Nagar', 'Shivajinagar', 12.9870, 77.6050, '080-25580433', '24/7', true, ARRAY['Emergency', 'General']),
('Narayana Health City', 'hospital', 'Bommasandra', 'Electronic City', 12.8400, 77.6680, '080-71222222', '24/7', true, ARRAY['Emergency', 'Cardiac', 'ICU']),
('Fortis Hospital', 'hospital', 'Bannerghatta Rd', 'JP Nagar', 12.8896, 77.5975, '080-66214444', '24/7', true, ARRAY['Emergency', 'Multi-specialty']),
('Bangalore Baptist Hospital', 'hospital', 'Bellary Rd, Hebbal', 'Hebbal', 13.0250, 77.5900, '080-22042222', '24/7', true, ARRAY['Emergency', 'ICU', 'Maternity']),
('Columbia Asia Hospital', 'hospital', 'Whitefield', 'Whitefield', 12.9680, 77.7480, '080-67163333', '24/7', true, ARRAY['Emergency', 'ICU']),
('Koramangala Police Station', 'police', '80 Feet Rd, Koramangala', 'Koramangala', 12.9344, 77.6269, '080-25501100', '24/7', true, ARRAY['FIR', 'Emergency']),
('Indiranagar Police Station', 'police', '100 Feet Rd, Indiranagar', 'Indiranagar', 12.9716, 77.6412, '080-25285000', '24/7', true, ARRAY['FIR', 'Emergency']),
('Jayanagar Police Station', 'police', '11th Main, Jayanagar', 'Jayanagar', 12.9250, 77.5830, '080-26534555', '24/7', true, ARRAY['FIR', 'Emergency']),
('HSR Police Station', 'police', 'HSR Layout', 'HSR Layout', 12.9150, 77.6350, '080-25730400', '24/7', true, ARRAY['FIR', 'Emergency']),
('Whitefield Police Station', 'police', 'ITPL Main Rd', 'Whitefield', 12.9698, 77.7500, '080-28452800', '24/7', true, ARRAY['FIR', 'Emergency']),
('Yelahanka Police Station', 'police', 'Yelahanka New Town', 'Yelahanka', 13.1007, 77.5963, '080-28460000', '24/7', true, ARRAY['FIR', 'Emergency']),
('NIMHANS', 'mental_health', 'Hosur Rd', 'Madivala', 12.9389, 77.5956, '080-46110007', '8am-6pm', false, ARRAY['Psychiatry', 'Counseling', 'Crisis']),
('Sneha Sadana Women Shelter', 'shelter', 'Jayanagar', 'Jayanagar', 12.9308, 77.5833, '080-26765154', '24/7', true, ARRAY['Shelter', 'Legal Aid', 'Counseling']),
('Parikrama Humanity Foundation', 'shelter', 'Jayanagar', 'Jayanagar', 12.9280, 77.5860, '080-26530960', '24/7', true, ARRAY['Shelter', 'Education']),
('Apollo Pharmacy - Koramangala', 'pharmacy', '4th Block, Koramangala', 'Koramangala', 12.9352, 77.6245, '1800-108-1010', '24/7', true, ARRAY['Pharmacy', 'Emergency Meds']),
('MedPlus Pharmacy - HSR', 'pharmacy', 'HSR Layout Sector 2', 'HSR Layout', 12.9116, 77.6389, '040-67006700', '8am-11pm', false, ARRAY['Pharmacy', 'OTC']),
('Akshaya Patra Foundation', 'food', 'Rajajinagar', 'Rajajinagar', 12.9900, 77.5500, '080-30143400', '9am-5pm', false, ARRAY['Food Distribution', 'Meals']);

-- ============================================
-- SEED DATA — HELPLINES (20+)
-- ============================================

INSERT INTO helplines (name, number, category, description, icon, is_toll_free, available_24_7) VALUES
('Police Emergency', '100', 'police', 'Police Emergency', '👮', true, true),
('CATS Ambulance', '108', 'medical', 'Ambulance Service', '🚑', true, true),
('Fire Emergency', '101', 'fire', 'Fire Department', '🔥', true, true),
('Women Helpline', '1091', 'women', 'Women Safety Helpline', '🛡️', true, true),
('Women in Distress', '181', 'women', 'Sakhi One-Stop Centre', '💜', true, true),
('Childline India', '1098', 'children', 'Child Safety & Protection', '👶', true, true),
('Elder Helpline', '14567', 'senior', 'Senior Citizen Support', '👴', true, true),
('Mental Health (iCall)', '9152987821', 'mental_health', 'Mental Health Counseling', '🧠', false, false),
('Road Accident', '1073', 'accident', 'Road Accident Emergency', '🚗', true, true),
('Disaster Management', '1070', 'disaster', 'Disaster Response', '🌊', true, true),
('Poison Control', '1800-11-6117', 'medical', 'Anti-Poison Helpline', '☠️', true, true),
('Cyber Crime', '1930', 'police', 'Cyber Crime Reporting', '💻', true, true),
('Health Helpline', '104', 'medical', 'General Health / COVID', '🏥', true, true),
('Vandrevala Foundation', '9999 666 555', 'mental_health', 'Suicide Prevention', '💚', true, true),
('BBMP Control Room', '080-22660000', 'utility', 'Bangalore Municipal Corp', '🏛️', false, true),
('BESCOM', '1912', 'utility', 'Power Emergency', '⚡', true, true),
('BWSSB', '1916', 'utility', 'Water Emergency', '💧', true, true),
('National Emergency', '112', 'police', 'Unified Emergency Number', '🆘', true, true),
('Blood Emergency', '104', 'medical', 'Blood Bank Emergency', '🩸', true, true),
('Domestic Violence', '181', 'women', 'Sakhi Helpline', '🏠', true, true);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sos_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analysis_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkin_timers ENABLE ROW LEVEL SECURITY;

-- Public read access for services and helplines
ALTER TABLE local_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE helplines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Services are public" ON local_services FOR SELECT USING (true);
CREATE POLICY "Helplines are public" ON helplines FOR SELECT USING (true);

-- Users can read/update their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Contacts: user can manage their own
CREATE POLICY "Users manage own contacts" ON emergency_contacts FOR ALL USING (auth.uid() = user_id);

-- SOS: user can create and read their own
CREATE POLICY "Users manage own SOS" ON sos_events FOR ALL USING (auth.uid() = user_id);

-- AI log: user can create and read their own
CREATE POLICY "Users manage own AI logs" ON ai_analysis_log FOR ALL USING (auth.uid() = user_id);

-- Checkin: user can manage their own
CREATE POLICY "Users manage own checkins" ON checkin_timers FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- DONE! Your database is ready.
-- ============================================
