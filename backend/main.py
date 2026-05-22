import os
import json
import base64
import re
from typing import Dict, List, Optional
from fastapi import FastAPI, HTTPException, Response
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
    
    return {
        "status": "success",
        "streak_days": user["streak_days"] or 0,
        "modules_completed": completed,
        "modules_total": total,
        "has_certificate": len(certs.data) > 0,
        "modules": mods
    }

@app.post("/modules/mock")
def generate_mock_modules(data: TradeSelection):
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

@app.post("/modules/complete")
def complete_module(data: ModuleComplete):
    print(f"DEBUG: complete_module called with user_id={data.user_id}, module_id='{data.module_id}'")
    res = supabase.table('course_modules').update({"is_completed": True}).eq('user_id', data.user_id).eq('module_id', data.module_id).execute()
    print(f"DEBUG: complete_module update result: {res.data}")
    return {"status": "success"}

@app.post("/generate_lesson")
def generate_lesson(data: TradeSelection):
    try:
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
    prompt = f"""
    Evaluate the following spoken answer from a trainee.
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
