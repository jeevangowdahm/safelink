# MASTER PROMPT — Copy everything below into Gamma.app / Beautiful.ai / Canva AI

---

Create a professional, dark-themed hackathon pitch deck (10 slides) for **"SafeLink Bangalore"** — an AI-powered emergency response PWA for women's safety in Bangalore. Use cinematic dark background (#050508), red (#DC2626) and purple (#8B5CF6) accents, modern serif headings, glassmorphism cards. Premium and bold — not generic.

---

## SLIDE 1: TITLE
**SafeLink Bangalore**
"The Safety Net Bangalore Deserves."
AI-Powered Emergency Response Platform | Hackathon 2026
Dark cityscape background with red glow accent.

---

## SLIDE 2: THE PROBLEM
**Bangalore's Safety Crisis**
- 5,000+ crimes against women annually (NCRB 2024)
- Average police response: 15-30 minutes
- 67% women feel unsafe in public transport after dark
- Existing apps need 10+ taps during panic — victims have < 3 seconds to act
- No app combines AI analysis + location intelligence + instant response

---

## SLIDE 3: OUR SOLUTION
**Emergency Intelligence in One Tap**
SafeLink combines 6 powerful features into one PWA:
1. 🆘 **One-Tap SOS** — Alert contacts + auto-call emergency services
2. 🧠 **AI Threat Analysis** — Llama 3.3 70B classifies severity in < 2 seconds
3. 🗺️ **Live Safety Heatmap** — Crime zone visualization across 20+ Bangalore areas
4. 📱 **Shake to SOS** — Trigger from pocket via accelerometer (3 shakes)
5. 📞 **Fake Call Escape** — Realistic incoming call to exit unsafe situations
6. ⌨️ **Panic Shortcut** — Triple "S" key press for silent desktop SOS

---

## SLIDE 4: HOW IT WORKS
**From Danger to Safety in Under 10 Seconds**
Step 1: Open SafeLink (PWA — no install needed)
Step 2: Tap SOS or Shake phone
Step 3: 5-second countdown auto-triggers
Step 4: GPS + blood group + medical info sent to all contacts
Step 5: Auto-calls first emergency contact or 112
Step 6: Quick-dial grid: Police 100, Ambulance 108, Women 1091, Fire 101
Also: AI assistant to describe situation → get severity + recommended action

---

## SLIDE 5: KEY FEATURES DEEP DIVE
Show 4 cards side by side:

**AI Threat Analysis** — Powered by Groq Llama 3.3 70B. Understands "someone is following me" vs "I fell down." Classifies LOW/MEDIUM/CRITICAL. Recommends specific helpline.

**Safety Heatmap** — 20+ real Bangalore crime hotspots on interactive Leaflet map. Heat layer with incident density. Real-time GPS tracking. Areas: Majestic, KR Market, Shivajinagar, Whitefield, Electronic City.

**Shake SOS** — Accelerometer-based (mobile) + Triple-S keyboard (desktop). Zero UI interaction. Works from pocket/bag. Auto-triggers full SOS flow.

**Fake Call** — Customizable caller (Mom/Boss/Friend). Adjustable delay (5s-60s). Real vibration + ring. Active call timer. Perfect for unsafe cab rides or uncomfortable meetings.

---

## SLIDE 6: REAL-WORLD IMPACT
**Scenarios Where SafeLink Saves Lives**

🚕 **Unsafe Cab Ride**: Route deviation detected → Shake SOS from pocket → GPS shared + police auto-called

🌙 **Walking Alone at Night**: Check heatmap → Avoid KR Market danger zone → Take safer route via Indiranagar

😰 **Uncomfortable Situation**: Trigger Fake Call (10s delay) → "Mom" calls → Exit naturally without confrontation

🏥 **Medical Emergency**: Describe to AI → "CRITICAL" → Ambulance 108 auto-called with GPS

---

## SLIDE 7: TECH ARCHITECTURE
**Production-Grade Stack**

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, Leaflet.js, PWA |
| Styling | Glassmorphism CSS, Playfair Display + Space Grotesk |
| Backend | Node.js, Express.js |
| AI | Google Gemini 2.0 Flash → Groq Llama 3.3 70B (fallback) → Mock (zero downtime) |
| SMS | Fast2SMS API |
| Database | Supabase (PostgreSQL) |
| Maps | OpenStreetMap + leaflet.heat |
| Device APIs | Geolocation, Accelerometer, Web Speech, Vibration |

Architecture: React PWA → Express API → Multi-provider AI + SMS + Supabase

---

## SLIDE 8: COMPETITIVE EDGE
| Feature | SafeLink | bSafe | Shake2Safety | 112 India |
|---|---|---|---|---|
| AI Analysis | ✅ Llama 3.3 | ❌ | ❌ | ❌ |
| Safety Heatmap | ✅ Live | ❌ | ❌ | ❌ |
| Shake SOS | ✅ | ❌ | ✅ | ❌ |
| Fake Call | ✅ | ✅ | ❌ | ❌ |
| Auto-Call | ✅ | ❌ | ❌ | ✅ |
| PWA (No Install) | ✅ | ❌ | ❌ | ❌ |
| Bangalore-specific | ✅ | ❌ | ❌ | Partial |

**SafeLink is the ONLY solution combining ALL these features.**

---

## SLIDE 9: ROADMAP & BUSINESS MODEL
**Next Steps:**
- Phase 2: Crowdsourced incident reports, Kannada/Hindi support, Wearable SOS
- Phase 3: Expand to all Tier-1 Indian cities, Predictive crime modeling, CCTV integration

**Revenue Model:**
- Free: SOS, Helplines, Heatmap, Limited AI
- Premium ₹99/mo: Unlimited AI, Live family tracking, Priority alerts
- Enterprise B2B: Corporate women employee safety packages
- Government: City-level deployment contracts
- TAM: 6.5M women in Bangalore → ₹200Cr+ market

---

## SLIDE 10: CLOSING
**SafeLink Bangalore**
"Because Every Second Counts."

- ⚡ Built in 48 hours
- 📱 PWA — works on any browser, no download
- 🧠 AI-powered, GPS-enabled, instant response
- 🛡️ 6 safety features in one platform

**Live Demo Available**

---

## DESIGN INSTRUCTIONS:
- DARK theme (#050508 background)
- Red (#DC2626) for emergency, Purple (#8B5CF6) for AI elements
- Serif headings (Playfair Display style), clean sans-serif body
- Glassmorphism frosted-glass cards with subtle borders
- Gradient glows behind key elements
- Minimal text per slide — heavy use of icons and visuals
- Include app mockup screenshots where possible
