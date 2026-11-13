# SafeLink Bangalore 🛡️
> **AI-Powered Emergency Response Platform for Women's Safety**

SafeLink Bangalore is a next-generation Progressive Web App (PWA) designed to provide instant, intelligent, and discreet emergency response. Engineered specifically for urban safety challenges in Bangalore, SafeLink reduces response time from minutes to under 10 seconds through automated multi-channel alerting, real-time threat intelligence, and zero-friction triggers.

---

## 🌟 Key Features

### 1. 🆘 One-Tap & Zero-Click SOS
- **Instant Activation**: Single tap initiates an emergency countdown with haptic feedback.
- **Shake-to-SOS (Mobile)**: Accelerometer-based detection triggers emergency flow with 3 rapid shakes without unlocking or looking at the screen.
- **Silent Panic Shortcut (Desktop)**: Triple-tap `S` key triggers emergency response discretely in browser environments.
- **Automated Dispatch**: Broadcasts live GPS coordinates, medical info, and blood group to emergency contacts via SMS and auto-dials emergency services (112 / 1091).

### 2. 🧠 AI Threat Analysis & Emergency Assistant
- **LLM-Powered Classification**: Integrated with Groq (Llama 3.3 70B) and Google Gemini to evaluate user-described situations in under 2 seconds.
- **Severity Scoring**: Categorizes incidents into `LOW`, `MEDIUM`, or `CRITICAL`.
- **Contextual Action Plan**: Provides immediate tactical guidance and pinpoints the exact specialized helpline required.

### 3. 🗺️ Live Safety Heatmap & Safe Navigation
- **Interactive Geospatial Visualization**: Powered by Leaflet with dynamic heat layers highlighting risk density across 20+ key Bangalore zones (Majestic, Whitefield, Indiranagar, Electronic City, Shivajinagar, etc.).
- **Live Location Tracking**: Continuous GPS tracking with safety radius indicators.

### 4. 📞 Fake Call Escape
- **Discrete Exit Strategy**: Simulates an authentic incoming call to help users safely exit uncomfortable or threatening scenarios (e.g. unsafe cab rides, harassment).
- **Customizable**: Configurable caller identity (Mom, Police, Office), audio simulation, adjustable delay timer (5s – 60s), and interactive call screen.

### 5. 🏥 24/7 Verified Emergency Service Finder
- **Nearby Directory**: Instant geospatial lookup of nearest open police stations, hospitals, Pink Police booths, and trauma centers.
- **One-Tap Direction & Dialing**: Integrated routing and direct phone connection.

### 6. ⏱️ Scheduled Safety Check-in
- **Journey Guard**: Set an expected travel duration; automatically triggers an SOS alert to emergency contacts if safety is not confirmed before the timer elapses.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React, Vite, React Router v7, Leaflet, React-Leaflet, Lucide Icons, Modern Glassmorphism CSS |
| **Backend** | Node.js, Express.js, CORS, Dotenv |
| **Database & Auth** | Supabase (PostgreSQL with Row Level Security) |
| **AI / LLM** | Groq SDK (Llama 3.3 70B Versatile), Google Generative AI (Gemini) |
| **Messaging & SMS** | Fast2SMS Gateway integration |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/jeevangowdahm/safelink.git
cd safelink
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your Supabase, Groq/Gemini, and Fast2SMS keys in .env
npm run dev
```
Backend runs by default at `http://localhost:3001`.

### 3. Frontend Setup
In the project root directory:
```bash
npm install
cp .env.example .env
npm run dev
```
Frontend runs at `http://localhost:5173`.

---

## 🔒 Security & Privacy
- **Client-Side Triggering**: Sensitive device sensor processing (accelerometer, keyboard shortcuts) is handled client-side in real-time.
- **Environment Isolation**: All server credentials and database keys are managed via environment variables and never exposed to the client.
- **Demo Fallback Mode**: The system includes graceful offline mock fallbacks for AI and SMS during demonstrations or network degradation.

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
