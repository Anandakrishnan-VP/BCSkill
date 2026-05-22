import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle, ChevronDown } from 'lucide-react';

export default function TrainingSession() {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const domain = localStorage.getItem('trade_domain') || 'AC Technician';
        const lang = localStorage.getItem('preferred_language') || 'en';
        const moduleId = localStorage.getItem('current_module_id');
        
        const uid = localStorage.getItem('user_id') || 1;
        
        const res = await fetch('http://localhost:8000/generate_lesson', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({user_id: parseInt(uid), domain, language: lang, module_id: moduleId})
        });
        const data = await res.json();
        
        if (data.status === 'success') {
          setLesson(data.lesson);
          localStorage.setItem('current_lesson', JSON.stringify(data.lesson));
        } else {
          setErrorMsg(data.message || 'Failed to generate lesson.');
        }
        setLoading(false);
      } catch (e) {
        console.error(e);
        setErrorMsg('Network error. Failed to generate lesson.');
        setLoading(false);
      }
    };
    fetchLesson();
  }, []);

  if (loading) {
    return <div className="page-content content-center animate-fade-in">
      <div className="loader-container">
        <div className="neon-spinner"></div>
        <p style={{fontSize: '20px', fontWeight: '600', color: 'var(--primary)'}}>Generating Lesson Curriculum...</p>
      </div>
    </div>;
  }

  if (errorMsg) {
    return (
      <div className="page-content content-center animate-fade-in" style={{paddingBottom: '120px'}}>
        <div className="card" style={{borderColor: 'var(--error)', background: 'rgba(255, 50, 50, 0.1)', textAlign: 'center'}}>
          <h2 style={{color: 'var(--error)', fontSize: '24px', marginBottom: '16px'}}>Error</h2>
          <p style={{fontSize: '18px', color: 'white'}}>{errorMsg}</p>
          <button className="btn-secondary" style={{marginTop: '24px'}} onClick={() => navigate('/syllabus')}>Go Back</button>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="page-content content-center animate-fade-in" style={{paddingBottom: '120px'}}>
        <div className="card" style={{borderColor: 'var(--error)', background: 'rgba(255, 50, 50, 0.1)', textAlign: 'center'}}>
          <h2 style={{color: 'var(--error)', fontSize: '24px', marginBottom: '16px'}}>Error</h2>
          <p style={{fontSize: '18px', color: 'white'}}>Failed to load the module content. Please refresh or try again.</p>
          <button className="btn-secondary" style={{marginTop: '24px'}} onClick={() => navigate('/syllabus')}>Back to Syllabus</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content animate-fade-in" style={{paddingBottom: '120px'}}>
      <div style={{maxWidth: '800px', margin: '0 auto', width: '100%'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px'}}>
          <div style={{background: 'rgba(0, 242, 255, 0.1)', padding: '16px', borderRadius: '50%'}}>
            <BookOpen size={32} color="var(--primary)" />
          </div>
          <h2 className="title-large" style={{marginBottom: 0}}>{lesson.title || 'Training Module'}</h2>
        </div>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
          {(lesson.chunks || []).map((chunk, idx) => (
             <div key={idx} className="animate-fade-in" style={{
               padding: '32px', 
               background: 'var(--glass-bg)',
               backdropFilter: 'blur(24px)',
               WebkitBackdropFilter: 'blur(24px)',
               border: '1px solid var(--glass-border)',
               borderRadius: 'var(--radius-lg)',
               fontSize: '20px',
               lineHeight: '1.6',
               color: 'white',
               boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
               animationDelay: `${idx * 0.1}s`
             }}>
                {chunk}
             </div>
          ))}
        </div>
        
        <div style={{marginTop: '64px', display: 'flex', justifyContent: 'center'}}>
          <button className="btn-primary" style={{height: '64px', fontSize: '20px', padding: '0 48px'}} onClick={async () => {
            const uid = localStorage.getItem('user_id') || 1;
            const mid = localStorage.getItem('current_module_id');
            await fetch('http://localhost:8000/modules/complete', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({user_id: parseInt(uid), module_id: mid})
            });
            
            // Check if all modules are now complete
            try {
              const dashRes = await fetch(`http://localhost:8000/worker/dashboard/${uid}?t=${Date.now()}`);
              const dashData = await dashRes.json();
              if (dashData.status === 'success' && dashData.modules_total > 0 && dashData.modules_completed === dashData.modules_total) {
                localStorage.setItem('all_modules_completed', 'true');
                navigate('/assessment');
                return;
              }
            } catch (e) {
              console.error(e);
            }
            navigate('/syllabus');
          }}>
            <CheckCircle size={24} style={{marginRight: '12px'}} />
            Mark Module Complete
          </button>
        </div>
      </div>
    </div>
  );
}
