import os
import json
import base64
import re
import shutil
import sys
import subprocess
from typing import Dict, List, Optional
from fastapi import FastAPI, HTTPException, Response, Form, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import supabase

# Load Env
from pathlib import Path
env_path = Path('.env')
if env_path.exists():
    with open(env_path, 'r') as f:
        for line in f:
            if '=' in line:
                k, v = line.strip().split('=', 1)
                os.environ[k] = v

from groq import Groq
from elevenlabs.client import ElevenLabs

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
GROQ_MODEL = os.environ.get("GROQ_MODEL", "llama-3.1-8b-instant")
ELEVENLABS_API_KEY = os.environ.get("ELEVENLABS_API_KEY")
ELEVENLABS_VOICE_ID = os.environ.get("ELEVENLABS_VOICE_ID")

groq_client = Groq(api_key=GROQ_API_KEY)
elevenlabs_client = ElevenLabs(api_key=ELEVENLABS_API_KEY)

app = FastAPI(title="SkillVoice API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserLogin(BaseModel):
    phone: str
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None

class EmployeeLogin(BaseModel):
    employee_id: str
    password: str

class ModuleComplete(BaseModel):
    user_id: int
    module_id: str

class TradeSelection(BaseModel):
    user_id: int
    domain: str
    language: str
    module_id: Optional[str] = None

class AnswerSubmission(BaseModel):
    lesson_id: str
    question_id: str
    user_answer: str

class TTSRequest(BaseModel):
    text: str
    language: str

@app.get("/")
def read_root():
    return {"message": "SkillVoice API is running"}

@app.post("/login")
def login(data: UserLogin):
    res = supabase.table('users').select('*').eq('phone', data.phone).execute()
    from datetime import date
    today = date.today().isoformat()
    
    if not res.data:
        insert_res = supabase.table('users').insert({
            "phone": data.phone, "name": data.name, "age": data.age,
            "gender": data.gender, "state": data.state, "district": data.district,
            "needs_diagnostic": False, "streak_days": 1, "last_login_date": today
        }).execute()
        user_id = insert_res.data[0]["id"]
        needs_diagnostic = False
    else:
        user = res.data[0]
        user_id = user["id"]
        needs_diagnostic = bool(user["needs_diagnostic"])
        last_login = user["last_login_date"]
        streak = user["streak_days"] or 0
        if last_login != today:
            streak += 1
            supabase.table('users').update({"streak_days": streak, "last_login_date": today}).eq("id", user_id).execute()
        
    return {"status": "success", "user_id": user_id, "needs_diagnostic": needs_diagnostic, "token": "mock_token_123"}

class BusinessLogin(BaseModel):
    company_name: str
    password: str

@app.post("/business/login")
def business_login(data: BusinessLogin):
    # For demonstration/mock purposes if companies table is empty, we allow any company
    res = supabase.table('companies').select('*').eq('name', data.company_name).eq('password', data.password).execute()
    
    if not res.data:
        # Auto-create the company for demo purposes if it doesn't exist
        try:
            new_company = supabase.table('companies').insert({"name": data.company_name, "password": data.password}).execute()
            company_id = new_company.data[0]['id']
        except:
            raise HTTPException(status_code=401, detail="Invalid Company Name or Password")
    else:
        company_id = res.data[0]['id']
        
    return {
        "status": "success", "company_id": company_id
    }

@app.post("/employee/login")
def employee_login(data: EmployeeLogin):
    res = supabase.table('users').select('*').eq('employee_id', data.employee_id).eq('password', data.password).execute()
    if not res.data:
        raise HTTPException(status_code=401, detail="Invalid Employee ID or Password")
    user = res.data[0]
    return {
        "status": "success", "user_id": user["id"], "needs_diagnostic": bool(user["needs_diagnostic"]),
        "trade_domain": user["trade_domain"], "preferred_language": user["preferred_language"]
    }

class EmployeeCreate(BaseModel):
    company_id: int
    name: str
    phone: str
    employee_id: str
    password: str
    role: str
    trade: str
    language: str

@app.get("/business/dashboard/{company_id}")
def business_dashboard(company_id: int):
    users_res = supabase.table('users').select('*').eq('company_id', company_id).execute()
    employees = users_res.data
    
    enriched = []
    total_certified = 0
    total_score = 0
    
    for emp in employees:
        cert_res = supabase.table('certificates').select('*').eq('user_id', emp['id']).execute()
        
        has_passed_cert = False
        latest_score = 0
        
        for c in cert_res.data:
            if c['id'].startswith('CERT-'):
                has_passed_cert = True
            latest_score = max(latest_score, c['score'])
            
        if has_passed_cert:
            status = "Certified"
        elif emp.get('needs_diagnostic', False):
            status = "Pending Diagnostic"
        else:
            status = "In Training"
            
        if has_passed_cert:
            total_certified += 1
            total_score += latest_score
            
        enriched.append({
            "id": emp['id'],
            "name": emp['name'],
            "role": emp['role'],
            "trade": emp['trade_domain'],
            "status": status,
            "employee_id": emp.get('employee_id', ''),
            "score": latest_score
        })
        
    metrics = {
        "total_employees": len(employees),
        "certified": total_certified,
        "pending": len(employees) - total_certified,
        "in_training": len(employees) - total_certified,
        "avg_score": round(total_score / total_certified) if total_certified > 0 else 0,
        "readiness_score": round((total_certified / len(employees)) * 100) if employees else 0
    }
    return {"status": "success", "metrics": metrics, "employees": enriched}

@app.post("/business/employees")
def add_employee(data: EmployeeCreate):
    new_user = {
        "company_id": data.company_id,
        "name": data.name,
        "phone": data.phone,
        "employee_id": data.employee_id,
        "password": data.password,
        "role": data.role,
        "trade_domain": data.trade,
        "preferred_language": data.language,
        "needs_diagnostic": True
    }
    supabase.table('users').insert(new_user).execute()
    return {"status": "success"}

@app.get("/worker/dashboard/{user_id}")
def worker_dashboard(user_id: int):
    users = supabase.table('users').select('*').eq('id', user_id).execute()
    if not users.data:
        raise HTTPException(status_code=404, detail="User not found")
    user = users.data[0]
    
    modules = supabase.table('course_modules').select('*').eq('user_id', user_id).order('id').execute()
    mods = modules.data
    completed = len([m for m in mods if m['is_completed']])
    total = len(mods)
    
    certs = supabase.table('certificates').select('*').eq('user_id', user_id).execute()
    valid_certs = [c for c in certs.data if c['id'].startswith('CERT-')]
    has_certificate = len(valid_certs) > 0
    
    # Attach topics to modules if available
    module_ids = [m['module_id'] for m in mods]
    db_module_ids = []
    for mid in module_ids:
        try:
            db_module_ids.append(int(mid))
        except ValueError:
            if len(mid) == 36 and '-' in mid:
                db_module_ids.append(mid)
                
    topics_map = {}
    if db_module_ids:
        try:
            topics_res = supabase.table('course_knowledge_base').select('module_id, chunk_text').in_('module_id', db_module_ids).like('chunk_text', '__TOPICS__:%').execute().data
            for r in topics_res:
                try:
                    topics_data = json.loads(r['chunk_text'][len("__TOPICS__:"):])
                    topics_map[str(r['module_id'])] = topics_data
                except Exception as e:
                    print("Error parsing topics:", e)
        except Exception as e:
            print("Error querying topics:", e)
            
    for m in mods:
        m['topics'] = topics_map.get(str(m['module_id']), None)
    
    return {
        "status": "success",
        "streak_days": user["streak_days"] or 0,
        "modules_completed": completed,
        "modules_total": total,
        "has_certificate": has_certificate,
        "modules": mods
    }

@app.post("/modules/mock")
def generate_mock_modules(data: TradeSelection):
    try:
        # Check if the domain has a custom course in the database
        course_res = supabase.table('edtech_courses').select('id').eq('trade_domain', data.domain).execute().data
        if course_res:
            course_id = course_res[0]['id']
            mod_res = supabase.table('edtech_modules').select('id, title').eq('course_id', course_id).order('module_number').execute().data
            if mod_res:
                mods = []
                for m in mod_res:
                    mods.append({
                        "user_id": data.user_id,
                        "module_id": str(m["id"]),
                        "title": m["title"],
                        "is_completed": False
                    })
                supabase.table('course_modules').delete().eq('user_id', data.user_id).execute()
                supabase.table('course_modules').insert(mods).execute()
                return {"status": "success"}
                
        # Fall back to default mock modules
        mods = [
            {"user_id": data.user_id, "module_id": "m1", "title": f"Intro to {data.domain}", "is_completed": False},
            {"user_id": data.user_id, "module_id": "m2", "title": "Safety Protocols", "is_completed": False},
            {"user_id": data.user_id, "module_id": "m3", "title": "Basic Diagnostics", "is_completed": False},
            {"user_id": data.user_id, "module_id": "m4", "title": "Advanced Repair", "is_completed": False},
            {"user_id": data.user_id, "module_id": "m5", "title": "Final Review & Checklist", "is_completed": False}
        ]
        supabase.table('course_modules').delete().eq('user_id', data.user_id).execute()
        supabase.table('course_modules').insert(mods).execute()
        return {"status": "success"}
    except Exception as e:
        print("Error setting course modules:", e)
        return {"status": "error", "message": str(e)}

@app.post("/modules/complete")
def complete_module(data: ModuleComplete):
    print(f"DEBUG: complete_module called with user_id={data.user_id}, module_id='{data.module_id}'")
    res = supabase.table('course_modules').update({"is_completed": True}).eq('user_id', data.user_id).eq('module_id', data.module_id).execute()
    print(f"DEBUG: complete_module update result: {res.data}")
    return {"status": "success"}

@app.post("/generate_lesson")
def generate_lesson(data: TradeSelection):
    try:
        db_module_id = None
        try:
            db_module_id = int(data.module_id)
        except:
            if data.module_id and len(data.module_id) == 36 and '-' in data.module_id:
                db_module_id = data.module_id
                
        if db_module_id is not None:
            chunks_res = supabase.table('course_knowledge_base').select('chunk_text').eq('module_id', db_module_id).execute().data
            if chunks_res:
                standard_chunks = []
                topics = []
                practice_question = None
                
                for r in chunks_res:
                    text = r['chunk_text']
                    if text.startswith('__TOPICS__:'):
                        try:
                            topics = json.loads(text[len('__TOPICS__:'):])
                        except:
                            pass
                    elif text.startswith('__PRACTICE_QUESTION__:'):
                        try:
                            practice_question = json.loads(text[len('__PRACTICE_QUESTION__:'):])
                        except:
                            pass
                    elif not text.startswith('__'):
                        standard_chunks.append(text)
                
                if standard_chunks:
                    mod_info = supabase.table('edtech_modules').select('title').eq('id', db_module_id).execute().data
                    title = mod_info[0]['title'] if mod_info else "Module Details"
                    
                    if not practice_question:
                        practice_question = {
                            "id": "q1",
                            "text": f"What is the main practice taught in the module: {title}?",
                            "expected_answer": "Standard safety rules and concepts."
                        }
                        
                    return {
                        "status": "success",
                        "lesson": {
                            "title": title,
                            "overview": f"This module covers: {', '.join(topics)}.",
                            "chunks": standard_chunks,
                            "question": practice_question
                        }
                    }

        course_res = supabase.table('edtech_courses').select('id').eq('trade_domain', data.domain).execute().data
        if not course_res: raise Exception("Course not found")
        course_id = course_res[0]['id']
        mod_res = supabase.table('edtech_modules').select('id').eq('course_id', course_id).execute().data
        mod_ids = [m['id'] for m in mod_res] if mod_res else []
        chunks_res = supabase.table('course_knowledge_base').select('chunk_text').in_('module_id', mod_ids).limit(5).execute().data
        official_text = "\n".join([c['chunk_text'] for c in chunks_res])
        
        prompt = f"""
        You are a vocational trainer. Create a short training module based on:
        "{official_text[:3000]}"
        Return ONLY strict JSON:
        {{
            "title": "<TITLE>",
            "overview": "<OVERVIEW>",
            "chunks": ["<PARAGRAPH 1>", "<PARAGRAPH 2>", "<PARAGRAPH 3>"],
            "question": {{"id": "q1", "text": "...", "expected_answer": "..."}}
        }}
        """
        chat_completion = groq_client.chat.completions.create(messages=[{"role": "user", "content": prompt}], model=GROQ_MODEL)
        text = chat_completion.choices[0].message.content.strip()
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match: text = match.group(0)
        return {"status": "success", "lesson": json.loads(text)}
    except Exception as e:
        print(e)
        return {"status": "error"}

@app.post("/generate_final_assessment")
def generate_final_assessment(data: TradeSelection):
    try:
        course_res = supabase.table('edtech_courses').select('id').eq('trade_domain', data.domain).execute().data
        if course_res:
            course_id = course_res[0]['id']
            mod_res = supabase.table('edtech_modules').select('id').eq('course_id', course_id).execute().data
            mod_ids = [m['id'] for m in mod_res] if mod_res else []
            if mod_ids:
                res = supabase.table('course_knowledge_base').select('chunk_text').in_('module_id', mod_ids).like('chunk_text', '__ASSESSMENT__:%').execute().data
                if res:
                    assessment_text = res[0]['chunk_text'][len('__ASSESSMENT__:'):]
                    assessment_json = json.loads(assessment_text)
                    
                    questions = []
                    for q in assessment_json.get("mcqs", []):
                        q["type"] = "mcq"
                        questions.append(q)
                    for q in assessment_json.get("descriptive", []):
                        q["type"] = "descriptive"
                        questions.append(q)
                        
                    return {
                        "status": "success",
                        "assessment": {
                            "title": f"Final Exam: {data.domain}",
                            "questions": questions
                        }
                    }

        course_res = supabase.table('edtech_courses').select('id').eq('trade_domain', data.domain).execute().data
        if not course_res: raise Exception("Course not found")
        course_id = course_res[0]['id']
        mod_res = supabase.table('edtech_modules').select('id').eq('course_id', course_id).execute().data
        mod_ids = [m['id'] for m in mod_res] if mod_res else []
        chunks_res = supabase.table('course_knowledge_base').select('chunk_text').in_('module_id', mod_ids).limit(5).execute().data
        official_text = "\n".join([c['chunk_text'] for c in chunks_res])
        
        prompt = f"""
        Generate a FINAL ASSESSMENT for the '{data.domain}' course based on:
        "{official_text[:3000]}"
        Generate EXACTLY 10 questions.
        Return ONLY strict JSON:
        {{
            "title": "<TRANSLATED TITLE>",
            "questions": [
                {{"id": "q1", "topic": "<SPECIFIC TOPIC>", "question": "...", "expected_answer": "..."}}
            ]
        }}
        """
        chat_completion = groq_client.chat.completions.create(messages=[{"role": "user", "content": prompt}], model=GROQ_MODEL)
        text = chat_completion.choices[0].message.content.strip()
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match: text = match.group(0)
        return {"status": "success", "assessment": json.loads(text)}
    except Exception as e:
        print(e)
        return {"status": "error"}

@app.post("/evaluate_answer")
def evaluate_answer(data: AnswerSubmission):
    question_text = ""
    expected_answer = ""
    try:
        res = supabase.table('course_knowledge_base').select('chunk_text').like('chunk_text', '__ASSESSMENT__:%').execute()
        for r in res.data:
            raw = r['chunk_text'].replace('__ASSESSMENT__:', '', 1)
            blocks = json.loads(raw)
            for q in blocks.get('mcqs', []):
                if q.get('id') == data.question_id:
                    question_text = q.get('question')
                    expected_answer = q.get('correct_option')
            for q in blocks.get('descriptive', []):
                if q.get('id') == data.question_id:
                    question_text = q.get('question')
                    expected_answer = q.get('expected_answer')
    except Exception as db_err:
        print("DB search error in evaluate_answer:", db_err)

    if question_text and expected_answer:
        prompt = f"""
        Evaluate the trainee's answer for the following question.
        Question: "{question_text}"
        Expected/Ideal answer: "{expected_answer}"
        Trainee's answer: "{data.user_answer}"
        
        Compare the trainee's answer to the expected answer. If it captures the core meaning, key points, or intent of the expected answer, grade it as correct (is_correct: true).
        Return strict JSON: {{"is_correct": true/false, "feedback": "Short encouraging feedback"}}
        """
    else:
        prompt = f"""
        Evaluate the following answer from a trainee.
        User's answer: "{data.user_answer}"
        Return strict JSON: {{"is_correct": true/false, "feedback": "Short encouraging feedback"}}
        """
        
    try:
        chat_completion = groq_client.chat.completions.create(messages=[{"role": "user", "content": prompt}], model=GROQ_MODEL)
        text = chat_completion.choices[0].message.content.strip()
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match: text = match.group(0)
        return {"status": "success", "evaluation": json.loads(text)}
    except Exception as e:
        print(e)
        return {"status": "success", "evaluation": {"is_correct": True, "feedback": "Good job!"}}

@app.post("/generate_audio")
def generate_audio(data: TTSRequest):
    try:
        audio = elevenlabs_client.generate(text=data.text, voice=ELEVENLABS_VOICE_ID, model="eleven_multilingual_v2")
        audio_bytes = b"".join(audio)
        return {"status": "success", "audio_base64": base64.b64encode(audio_bytes).decode('utf-8')}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="TTS generation failed")

@app.post("/generate_certificate")
def generate_certificate(user_id: int, domain: str, score: int, language: str):
    import uuid
    from datetime import date
    today = date.today().isoformat()
    
    if score >= 90:
        cert_id = f"CERT-{uuid.uuid4().hex[:8].upper()}"
    else:
        cert_id = f"FAIL-{uuid.uuid4().hex[:8].upper()}"
        
    supabase.table('certificates').insert({"id": cert_id, "user_id": user_id, "trade": domain, "language": language, "score": score, "date_certified": today}).execute()
    return {"status": "success", "certificate_id": cert_id}

@app.get("/verify/{cert_id}")
def verify_certificate(cert_id: str):
    res = supabase.table('certificates').select('*, users(name, phone, age, gender)').eq('id', cert_id).execute().data
    if not res: raise HTTPException(status_code=404, detail="Certificate not found")
    cert = res[0]
    user_data = cert.pop('users', {})
    cert['name'] = user_data.get('name')
    cert['phone'] = user_data.get('phone')
    cert['age'] = user_data.get('age')
    cert['gender'] = user_data.get('gender')
    return {"status": "success", "certificate": cert}

@app.get("/admin/workers")
def get_workers(domain: Optional[str] = None, state: Optional[str] = None, district: Optional[str] = None):
    q = supabase.table('certificates').select('id, trade, score, date_certified, users!inner(name, phone, state, district, company_id)').like('id', 'CERT-%').is_('users.company_id', 'null')
    if domain and domain != 'All': q = q.eq('trade', domain)
    if state and state != 'All': q = q.eq('users.state', state)
    if district and district != 'All': q = q.eq('users.district', district)
    results = q.execute().data
    formatted = []
    for r in results:
        u = r.get('users', {})
        formatted.append({"cert_id": r["id"], "trade": r["trade"], "score": r["score"], "date_certified": r["date_certified"], "name": u.get("name"), "phone": u.get("phone"), "state": u.get("state"), "district": u.get("district")})
    return {"status": "success", "workers": formatted}

class DiagnosticSubmission(BaseModel):
    user_id: int
    trade: str
    transcript: str
    override_result: Optional[str] = None

@app.post("/evaluate_gap_assessment")
def evaluate_gap_assessment(data: DiagnosticSubmission):
    if data.override_result == 'pass':
        score = 100
        weak_topics = []
    elif data.override_result == 'fail':
        score = 50
        weak_topics = ["Safety Procedures", "Fault Isolation"]
    else:
        prompt = f"""
        Evaluate this diagnostic assessment answer for a {data.trade}:
        "{data.transcript}"
        Return strict JSON: {{"score": integer_between_0_and_100, "weak_topics": ["<TOPIC 1>", "<TOPIC 2>"]}}
        If the score is >= 90, weak_topics can be empty. If score is < 90, provide 2-3 specific topics they need to study based on their answer or lack thereof.
        """
        try:
            chat_completion = groq_client.chat.completions.create(messages=[{"role": "user", "content": prompt}], model=GROQ_MODEL)
            text = chat_completion.choices[0].message.content.strip()
            match = re.search(r'\{.*\}', text, re.DOTALL)
            if match: text = match.group(0)
            result = json.loads(text)
            score = result.get("score", 0)
            weak_topics = result.get("weak_topics", [])
        except Exception as e:
            print(e)
            return {"status": "error"}
            
    passed = score >= 90

    # Mark user as no longer needing diagnostic
    supabase.table('users').update({"needs_diagnostic": False}).eq('id', data.user_id).execute()

    cert_id = None
    if passed:
        import uuid
        from datetime import date
        cert_id = f"CERT-{uuid.uuid4().hex[:8].upper()}"
        today = date.today().isoformat()
        supabase.table('certificates').insert({"id": cert_id, "user_id": data.user_id, "trade": data.trade, "language": "en", "score": score, "date_certified": today}).execute()

    return {"status": "success", "score": score, "passed": passed, "cert_id": cert_id, "weak_topics": weak_topics}

class RemedialRequest(BaseModel):
    user_id: int
    domain: str
    failed_topics: list[str]

@app.post("/generate_remedial_modules")
def generate_remedial_modules(data: RemedialRequest):
    try:
        supabase.table('course_modules').delete().eq('user_id', data.user_id).execute()
        
        mods = []
        for i, topic in enumerate(data.failed_topics[:5]):
            mods.append({
                "user_id": data.user_id,
                "module_id": f"r{i+1}",
                "title": f"Review: {topic}",
                "is_completed": False
            })
            
        if not mods:
            mods.append({
                "user_id": data.user_id,
                "module_id": "r1",
                "title": f"General Review for {data.domain}",
                "is_completed": False
            })
            
        mods.append({
            "user_id": data.user_id,
            "module_id": "final_retest",
            "title": "Final Remedial Retest",
            "is_completed": False
        })
            
        supabase.table('course_modules').insert(mods).execute()
        return {"status": "success", "message": "Remedial modules generated"}
    except Exception as e:
        print(e)
        return {"status": "error"}

@app.get("/courses")
def get_courses():
    try:
        res = supabase.table('edtech_courses').select('trade_domain').execute()
        # Default mock courses if table is empty
        courses = [c['trade_domain'] for c in res.data]
        if not courses:
            courses = ["AC Technician", "Electrician", "Plumber", "Welder", "Factory Operator"]
        return {"status": "success", "courses": courses}
    except Exception as e:
        print("Error fetching courses:", e)
        return {"status": "error", "courses": ["AC Technician", "Electrician", "Plumber", "Welder", "Factory Operator"]}

from fastembed import TextEmbedding
embedding_model = None

def get_embedding(text: str) -> List[float]:
    global embedding_model
    if embedding_model is None:
        print("Loading AI Embedding Model in main.py...")
        embedding_model = TextEmbedding()
    vectors = list(embedding_model.embed([text]))
    return vectors[0].tolist()

def extract_text_from_pdf(pdf_path: str) -> str:
    # 1. Try standard pypdf
    from pypdf import PdfReader
    text = ""
    try:
        reader = PdfReader(pdf_path)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    except Exception as e:
        print("Standard pypdf extraction failed:", e)
    
    # 2. OCR fallback
    if len(text.strip()) < 100:
        print("Extracted text is empty or too short. Attempting OCR fallback...")
        try:
            # Install easyocr dynamically if missing
            try:
                import easyocr
            except ImportError:
                print("Installing easyocr for OCR fallback...")
                import subprocess
                import sys
                subprocess.check_call([sys.executable, "-m", "pip", "install", "easyocr"])
                import easyocr
            
            reader = PdfReader(pdf_path)
            ocr_text = ""
            import tempfile
            
            ocr_reader = easyocr.Reader(['en'])
            for page_num, page in enumerate(reader.pages):
                print(f"Checking images on page {page_num + 1}...")
                for img_idx, image_file_object in enumerate(page.images):
                    with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as f:
                        f.write(image_file_object.data)
                        temp_path = f.name
                    
                    print(f"OCR reading image {img_idx+1} from page {page_num+1}...")
                    results = ocr_reader.readtext(temp_path, detail=0)
                    ocr_text += " ".join(results) + "\n"
                    
                    try:
                        os.unlink(temp_path)
                    except:
                        pass
            if len(ocr_text.strip()) > len(text.strip()):
                text = ocr_text
        except Exception as e:
            print("OCR fallback failed:", e)
            
    return text

@app.post("/admin/upload_course")
def upload_course(trade_domain: str = Form(...), file: UploadFile = File(...)):
    import tempfile
    
    # Save the file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
        shutil.copyfileobj(file.file, temp_file)
        temp_path = temp_file.name
        
    try:
        # Extract text from the PDF
        pdf_text = extract_text_from_pdf(temp_path)
        if len(pdf_text.strip()) < 100:
            raise HTTPException(status_code=400, detail="Could not extract enough text from the PDF. Please upload a readable PDF.")
            
        # Truncate text to fit context if very long
        pdf_text_truncated = pdf_text[:80000]
        
        prompt = f"""
        You are an expert vocational education curriculum designer. 
        Analyze the following text from a training manual and generate a complete structured course syllabus, training content, and exam questions.
        
        The course name (Trade Domain) is: "{trade_domain}"
        
        Your output must be a single, valid JSON object containing:
        1. "description": A high-level description of the course based on the manual.
        2. "modules": An array of modules. Determine the number of modules dynamically based on the PDF content structure. Each module should contain:
           - "module_number": Integer (1, 2, 3, etc.)
           - "title": Title of the module.
           - "topics": A list of 3-5 core topics covered in this module.
           - "content_chunks": A list of 3-5 detailed paragraphs/lessons (each 100-200 words) teaching the topics in sequence.
           - "question": A dict representing a simple practice question at the end of training for this module:
              - "id": String (e.g., "q_mod_1")
              - "text": The practice question.
              - "expected_answer": The expected answer.
        3. "assessment": A dict containing the final exam questions:
           - "mcqs": A list of multiple choice questions (generate 1-2 per module). Each MCQ must contain:
              - "id": String (e.g. "mcq1")
              - "question": Question text.
              - "options": A list of 4 options (e.g. ["A) ...", "B) ...", "C) ...", "D) ..."])
              - "correct_option": The correct option (either "A", "B", "C", or "D")
           - "descriptive": A list of descriptive questions (generate 1 per module). Each must contain:
              - "id": String (e.g. "desc1")
              - "question": Question text.
              - "expected_answer": Detailed guideline/expected answer for grading.
        
        Return ONLY the strict JSON object, with no markdown code blocks, no backticks, and no extra text.
        
        Manual Text:
        "{pdf_text_truncated}"
        """
        
        chat_completion = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}], 
            model=GROQ_MODEL,
            response_format={"type": "json_object"}
        )
        
        response_content = chat_completion.choices[0].message.content.strip()
        course_data = json.loads(response_content)
        
        # Clean up any existing course of the same name to prevent duplicates
        old_course = supabase.table('edtech_courses').select('id').eq('trade_domain', trade_domain).execute().data
        if old_course:
            course_id_to_del = old_course[0]['id']
            old_modules = supabase.table('edtech_modules').select('id').eq('course_id', course_id_to_del).execute().data
            mod_ids_to_del = [m['id'] for m in old_modules]
            if mod_ids_to_del:
                supabase.table('course_knowledge_base').delete().in_('module_id', mod_ids_to_del).execute()
                supabase.table('edtech_modules').delete().eq('course_id', course_id_to_del).execute()
            supabase.table('edtech_courses').delete().eq('id', course_id_to_del).execute()
            
        # Insert new course
        c_res = supabase.table('edtech_courses').insert({
            "trade_domain": trade_domain,
            "description": course_data.get("description", f"Course on {trade_domain}")
        }).execute()
        course_id = c_res.data[0]['id']
        
        # Loop through modules and insert them
        modules_list = course_data.get("modules", [])
        for m in modules_list:
            m_res = supabase.table('edtech_modules').insert({
                "course_id": course_id,
                "module_number": m["module_number"],
                "title": m["title"]
            }).execute()
            module_id = m_res.data[0]['id']
            
            # Save topics metadata
            topics_text = "__TOPICS__:" + json.dumps(m.get("topics", []))
            supabase.table('course_knowledge_base').insert({
                "module_id": module_id,
                "chunk_text": topics_text,
                "embedding": get_embedding(topics_text)
            }).execute()
            
            # Save practice question metadata
            practice_q = m.get("question", {
                "id": "q1",
                "text": f"What is the main practice taught in the module: {m['title']}?",
                "expected_answer": "Standard safety rules and concepts."
            })
            pq_text = "__PRACTICE_QUESTION__:" + json.dumps(practice_q)
            supabase.table('course_knowledge_base').insert({
                "module_id": module_id,
                "chunk_text": pq_text,
                "embedding": get_embedding(pq_text)
            }).execute()
            
            # Save lesson content chunks
            for chunk in m.get("content_chunks", []):
                supabase.table('course_knowledge_base').insert({
                    "module_id": module_id,
                    "chunk_text": chunk,
                    "embedding": get_embedding(chunk)
                }).execute()
                
        # Save assessment metadata under the first module
        if modules_list:
            first_module_res = supabase.table('edtech_modules').select('id').eq('course_id', course_id).eq('module_number', 1).execute().data
            if first_module_res:
                first_module_id = first_module_res[0]['id']
                assessment_text = "__ASSESSMENT__:" + json.dumps(course_data.get("assessment", {}))
                supabase.table('course_knowledge_base').insert({
                    "module_id": first_module_id,
                    "chunk_text": assessment_text,
                    "embedding": get_embedding(assessment_text)
                }).execute()
                
        return {"status": "success", "message": f"Successfully generated course '{trade_domain}' with {len(modules_list)} modules."}
        
    except Exception as e:
        print("Error uploading course:", e)
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        try:
            os.unlink(temp_path)
        except:
            pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
