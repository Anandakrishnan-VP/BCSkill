# SkillVoice: Interactive Upskilling and AI-Verified Hiring Platform

SkillVoice is an interactive platform engineered to streamline blue-collar upskilling and automate verified talent acquisition. The system leverages conversational voice evaluations, natural language processing, and cryptographic credentials to eliminate screening bottlenecks and verify field safety logic.

---

## Technical Stack & Architecture

### Frontend
- **Framework**: React (Vite-powered SPA)
- **Styling**: Modern Neo-Brutalist design system (vanilla CSS variables, high-contrast layouts)
- **State Management & Routing**: React Router DOM (v6)
- **Icons**: Lucide React
- **Asset Bundling**: PWA-ready with Vite offline asset manifest support

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **Database**: SQLite (local development storage) & Supabase Integration (remote user synchronization)
- **AI Engine**: Groq Inference (Llama 3.1) & ElevenLabs TTS
- **Vector Search / RAG**: FastEmbed semantic vector representations for manual analysis

---

## Prerequisites

Ensure you have the following installed on your system:
- Node.js (v18 or higher)
- Python (v3.10 or higher)
- Git

---

## Installation & Setup

### 1. Backend Service Configuration

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the `backend/` directory:
   ```env
   GROQ_API_KEY=your_groq_api_key
   ELEVENLABS_API_KEY=your_elevenlabs_api_key
   ELEVENLABS_VOICE_ID=your_elevenlabs_voice_id
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_KEY=your_supabase_anon_key
   ```

5. Start the FastAPI development server:
   ```bash
   python main.py
   ```
   The backend API service will run on `http://localhost:8000`.

---

### 2. Frontend Application Configuration

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install the Node modules:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   The client application will run on `http://localhost:5173`.

---

## Core System Portals

The application is structured around four target workflows:

### 1. Individual Learner Portal
Allows blue-collar workers to perform localized-language trade learning:
- **Interactive Syllabus**: Step-by-step progress tracking for technical safety manuals.
- **Voice-First Diagnostics**: Natural language evaluation with AI scoring to measure diagnostic field logic.
- **Crypto-secure Certifications**: Instant generation of unique verification certificates equipped with scannable QR credentials.

### 2. Enterprise Business Portal
Enables businesses to manage internal workforce diagnostics:
- **Employee Roster**: Register internal team members and assign targeted technical trades.
- **Analytics Dashboard**: Monitor workforce readiness scores, certified employee metrics, and training progress.

### 3. Public Verification Portal
Provides a public-facing page (`/verify/:id`) to confirm worker credentials:
- Scannable QR destinations link directly to database-backed verification pages.
- Real-time display of certified domains, completion timestamps, and scoring tiers.

### 4. System Super Admin Dashboard
Enables administrators to dynamically inject training curricula:
- **PDF Upload Engine**: Upload standard field safety manuals.
- **Curriculum Generator**: Translates raw safety documentation into structured interactive modules and assessments.
