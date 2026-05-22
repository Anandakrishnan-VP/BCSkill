# SkillVoice B2B & Learner Platform

SkillVoice is a comprehensive, voice-first upskilling platform and verified talent marketplace designed for the next billion users.

## 🚀 Quick Start Guide

To run this project locally, you will need to start both the Python Backend and the React Frontend.

### 1. Backend Setup (Python)

The backend uses FastAPI and SQLite.

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate
   
   # Mac/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file inside the `backend` folder and add your AI keys (Groq and ElevenLabs are used for the voice and diagnostic assessments):
   ```env
   GROQ_API_KEY=your_groq_key_here
   ELEVENLABS_API_KEY=your_elevenlabs_key_here
   ELEVENLABS_VOICE_ID=your_voice_id_here
   ```
5. Run the server:
   ```bash
   python main.py
   ```
   *The API will start at `http://localhost:8000`. The database (`skillvoice.db`) will be created automatically.*

---

### 2. Frontend Setup (React/Vite)

The frontend is a Vite + React application.

1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install the necessary Node modules:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The web app will be available at `http://localhost:5173`.*

---

## 🏛️ Platform Portals

Once everything is running, you can access the three main portals from the landing page:
- **Individual Learner**: Where workers take diagnostic voice assessments, learn modules, and earn certificates.
- **Company**: Where businesses manage their workforce, manually add employees, and monitor readiness scores.
- **Employer**: Where companies can view and filter the verified talent pool (by state, district, and trade) to hire certified workers.
