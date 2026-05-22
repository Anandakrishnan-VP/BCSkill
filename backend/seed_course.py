import os
from supabase import create_client, Client
from fastembed import TextEmbedding
from dotenv import load_dotenv

# Load Env
load_dotenv()
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Initialize Embedding Model
print("Loading AI Embedding Model (this might take a few seconds)...")
embedding_model = TextEmbedding()

# Sample course data
course_domain = "Electrician"

# 1. Insert Course
print(f"Creating Course: {course_domain}...")
try:
    res = supabase.table('edtech_courses').insert({
        "trade_domain": course_domain,
        "description": "Master class on electrical safety, wiring, and diagnostics."
    }).execute()
    course_id = res.data[0]['id']
except Exception as e:
    print(f"Course might already exist. Fetching it. Error: {e}")
    res = supabase.table('edtech_courses').select('id').eq('trade_domain', course_domain).execute()
    course_id = res.data[0]['id']

# 2. Insert Modules
modules_data = [
    {"module_number": 1, "title": "Introduction to Electrical Safety", "text": "Welcome to the Electrician course. Always wear insulated gloves. Ensure the main power breaker is turned off before touching any exposed wires. Never work in wet conditions. Safety is the number one priority."},
    {"module_number": 2, "title": "The Multimeter Basics", "text": "A multimeter is a device used to measure voltage, current, and resistance. Set the multimeter to AC voltage when checking wall outlets. Always test the multimeter on a known live circuit first to ensure it is working correctly. If the reading is zero, it might mean the power is off, or the meter is broken."},
    {"module_number": 3, "title": "Basic Diagnostics", "text": "When an appliance won't turn on, first check the plug and the outlet. Use your multimeter to verify power at the outlet. If power is present, check the appliance's internal fuse or circuit breaker. A blown fuse will have no continuity."},
    {"module_number": 4, "title": "Advanced Repair", "text": "When replacing a motor, ensure the new motor has the same voltage and amperage rating. Connect the ground wire firmly. The ground wire is usually green or bare copper. Never leave the ground wire disconnected."},
    {"module_number": 5, "title": "Final Review & Checklist", "text": "Always double check your connections. Turn the power back on only when you are completely clear of the appliance. Observe the appliance for normal operation. If it smells like burning, shut off power immediately."}
]

for m in modules_data:
    try:
        m_res = supabase.table('edtech_modules').insert({
            "course_id": course_id,
            "module_number": m["module_number"],
            "title": m["title"]
        }).execute()
        module_id = m_res.data[0]['id']
    except Exception as e:
        print(f"Module {m['module_number']} already exists. Fetching id. Error: {e}")
        m_res = supabase.table('edtech_modules').select('id').eq('course_id', course_id).eq('module_number', m["module_number"]).execute()
        module_id = m_res.data[0]['id']

    # 3. Generate Embeddings and Insert into Knowledge Base
    print(f"Embedding text for Module {m['module_number']}...")
    text_chunk = m["text"]
    
    # Generate vector (fastembed returns a generator of numpy arrays)
    vectors = list(embedding_model.embed([text_chunk]))
    vector_list = vectors[0].tolist() # Convert numpy array to standard list of floats
    
    # Insert to DB
    supabase.table('course_knowledge_base').insert({
        "module_id": module_id,
        "chunk_text": text_chunk,
        "embedding": vector_list
    }).execute()

print("✅ Successfully seeded Supabase with Vector RAG data!")
