-- ============================================
-- SAFELINK — FIX RLS POLICIES (run if first script errored on policies)
-- ============================================

-- Drop existing policies first, then recreate
DROP POLICY IF EXISTS "Services are public" ON local_services;
DROP POLICY IF EXISTS "Helplines are public" ON helplines;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users manage own contacts" ON emergency_contacts;
DROP POLICY IF EXISTS "Users manage own SOS" ON sos_events;
DROP POLICY IF EXISTS "Users manage own AI logs" ON ai_analysis_log;
DROP POLICY IF EXISTS "Users manage own checkins" ON checkin_timers;

-- Recreate all policies
CREATE POLICY "Services are public" ON local_services FOR SELECT USING (true);
CREATE POLICY "Helplines are public" ON helplines FOR SELECT USING (true);
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users manage own contacts" ON emergency_contacts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own SOS" ON sos_events FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own AI logs" ON ai_analysis_log FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own checkins" ON checkin_timers FOR ALL USING (auth.uid() = user_id);

-- DONE ✅
