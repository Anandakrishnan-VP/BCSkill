import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle } from 'lucide-react';

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
    return (
      <div className="page-content content-center animate-fade-in" style={{ background: 'var(--bg-void)' }}>
        <div className="loader-container">
          <div className="neon-spinner"></div>
          <p style={{ fontSize: '20px', fontWeight: '900', color: '#000000', textTransform: 'uppercase' }}>Generating Lesson Curriculum...</p>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="page-content content-center animate-fade-in" style={{ paddingBottom: '120px', background: 'var(--bg-void)' }}>
        <div style={{
          border: '3px solid #000000', 
          background: 'var(--danger)', 
          textAlign: 'center',
          padding: '32px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-main)',
          maxWidth: '480px'
        }}>
          <h2 style={{ color: '#FFFFFF', fontSize: '28px', marginBottom: '16px', fontWeight: '900', textTransform: 'uppercase' }}>Error</h2>
          <p style={{ fontSize: '18px', color: '#FFFFFF', fontWeight: '700' }}>{errorMsg}</p>
          <button className="btn-secondary" style={{ marginTop: '24px', background: '#FFFFFF', color: '#000000' }} onClick={() => navigate('/syllabus')}>Go Back</button>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="page-content content-center animate-fade-in" style={{ paddingBottom: '120px', background: 'var(--bg-void)' }}>
        <div style={{
          border: '3px solid #000000', 
          background: 'var(--danger)', 
          textAlign: 'center',
          padding: '32px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-main)',
          maxWidth: '480px'
        }}>
          <h2 style={{ color: '#FFFFFF', fontSize: '28px', marginBottom: '16px', fontWeight: '900', textTransform: 'uppercase' }}>Error</h2>
          <p style={{ fontSize: '18px', color: '#FFFFFF', fontWeight: '700' }}>Failed to load the module content. Please refresh or try again.</p>
          <button className="btn-secondary" style={{ marginTop: '24px', background: '#FFFFFF', color: '#000000' }} onClick={() => navigate('/syllabus')}>Back to Syllabus</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content animate-fade-in" style={{ paddingBottom: '120px', background: 'var(--bg-void)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
          <div style={{ 
            background: 'var(--secondary)', 
            padding: '16px', 
            borderRadius: 'var(--radius-md)',
            border: '3px solid #000000',
            boxShadow: '2px 2px 0px #000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BookOpen size={32} color="#000000" />
          </div>
          <h2 className="title-large" style={{ marginBottom: 0, textTransform: 'uppercase' }}>{lesson.title || 'Training Module'}</h2>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {(lesson.chunks || []).map((chunk, idx) => (
             <div key={idx} className="animate-fade-in" style={{
               padding: '32px', 
               background: '#FFFFFF',
               border: '3px solid #000000',
               borderRadius: 'var(--radius-md)',
               fontSize: '20px',
               lineHeight: '1.6',
               color: '#000000',
               fontWeight: '700',
               boxShadow: 'var(--shadow-main)',
               animationDelay: `${idx * 0.1}s`
             }}>
                {chunk}
             </div>
          ))}
        </div>
        
        <div style={{ marginTop: '64px', display: 'flex', justifyContent: 'center' }}>
          <button 
            className="btn-primary" 
            style={{ height: '64px', fontSize: '20px', padding: '0 48px', width: 'auto' }} 
            onClick={async () => {
              const uid = localStorage.getItem('user_id') || 1;
              const mid = localStorage.getItem('current_module_id');
              await fetch('http://localhost:8000/modules/complete', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({user_id: parseInt(uid), module_id: mid})
              });
              
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
            }}
          >
            <CheckCircle size={24} style={{ marginRight: '12px' }} />
            Mark Module Complete
          </button>
        </div>
      </div>
    </div>
  );
}
