import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, CheckCircle, Book, Lock, Award, BookOpen, TrendingUp, AlertTriangle } from 'lucide-react';
import { getLangText } from '../translations';

export default function WorkerDashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const lang = localStorage.getItem('preferred_language') || 'en';

  useEffect(() => {
    const fetchDashboard = async () => {
      const uid = localStorage.getItem('user_id') || 1;
      const res = await fetch(`http://localhost:8000/worker/dashboard/${uid}?t=${Date.now()}`);
      const d = await res.json();
      if (d.status === 'success') {
        setData(d);
      }
    };
    fetchDashboard();
  }, []);

  if (!data) return (
    <div className="page-content content-center animate-fade-in" style={{minHeight: '100vh'}}>
      <div className="loader-container">
        <div className="neon-spinner" style={{width: '64px', height: '64px', borderWidth: '6px'}}></div>
        <p style={{color: 'var(--primary)', fontSize: '24px', fontWeight: '600', marginTop: '24px'}}>{getLangText(lang, 'loadingDashboard')}</p>
      </div>
    </div>
  );

  const progressPercent = data.modules_total > 0 ? Math.round((data.modules_completed / data.modules_total) * 100) : 0;
  const allCompleted = data.modules_total > 0 && data.modules_completed === data.modules_total;
  
  const isRemedial = data.modules && data.modules.some(m => m.module_id.startsWith('r') || m.module_id === 'final_retest');

  if (allCompleted) {
    localStorage.setItem('all_modules_completed', 'true');
  } else {
    localStorage.removeItem('all_modules_completed');
  }

  // --- REMEDIAL / FAILED DASHBOARD UI ---
  if (isRemedial) {
    return (
      <div className="main-content-area animate-fade-in" style={{padding: '48px', minHeight: '100vh'}}>
        <div style={{maxWidth: '800px', margin: '0 auto', width: '100%'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px'}}>
             <AlertTriangle size={40} color="var(--error)" />
             <h1 className="title-large" style={{margin: 0, color: 'var(--error)'}}>Targeted Remedial Path</h1>
          </div>
          
          <p style={{fontSize: '20px', color: 'var(--text-muted)', marginBottom: '48px', lineHeight: '1.5'}}>
            You did not pass the diagnostic assessment. To become certified, you must complete the specific training modules below tailored to your skill gaps.
          </p>

          <div style={{
            background: 'var(--glass-bg)', backdropFilter: 'blur(24px)', border: '1px solid var(--error)',
            borderRadius: 'var(--radius-xl)', padding: '32px', marginBottom: '48px',
            boxShadow: '0 20px 40px -10px rgba(244, 63, 94, 0.2)'
          }}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '16px'}}>
              <span style={{fontFamily: 'Outfit', fontSize: '20px', fontWeight: '600', color: 'white'}}>Remedial Progress</span>
              <span style={{fontFamily: 'Outfit', fontSize: '20px', fontWeight: '600', color: 'var(--error)'}}>{progressPercent}%</span>
            </div>
            <div style={{width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: 'var(--radius-full)', overflow: 'hidden'}}>
              <div style={{width: `${progressPercent}%`, height: '100%', background: 'var(--error)', transition: 'width 0.5s ease', boxShadow: '0 0 10px var(--error)'}}></div>
            </div>
          </div>

          <h2 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '24px'}}>Required Topics to Learn</h2>
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '48px'}}>
            {data.modules.map((mod, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: mod.is_completed ? 'rgba(16, 185, 129, 0.1)' : 'var(--glass-bg)',
                border: `1px solid ${mod.is_completed ? 'var(--success)' : 'var(--glass-border)'}`,
                padding: '24px', borderRadius: 'var(--radius-lg)'
              }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                  {mod.is_completed ? <CheckCircle size={28} color="var(--success)" /> : <BookOpen size={28} color="var(--text-muted)" />}
                  <span style={{fontSize: '20px', color: mod.is_completed ? 'white' : 'var(--text-main)'}}>{mod.title}</span>
                </div>
                {!mod.is_completed && mod.module_id !== 'final_retest' && (
                  <button onClick={() => navigate('/syllabus')} className="btn-secondary" style={{padding: '8px 16px', fontSize: '16px'}}>Study Now</button>
                )}
              </div>
            ))}
          </div>

          <button 
            className={allCompleted ? "btn-primary" : "btn-secondary"}
            disabled={!allCompleted}
            onClick={() => navigate('/assessment')}
            style={{
              width: '100%', padding: '24px', fontSize: '24px', fontWeight: 'bold',
              opacity: allCompleted ? 1 : 0.5, cursor: allCompleted ? 'pointer' : 'not-allowed',
              background: allCompleted ? 'var(--success)' : 'transparent',
              borderColor: allCompleted ? 'var(--success)' : 'var(--glass-border)'
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'}}>
               {allCompleted ? <CheckCircle size={28} /> : <Lock size={28} />}
               Retake Certification Exam
            </div>
          </button>
        </div>
      </div>
    );
  }

  // --- STANDARD DASHBOARD UI ---
  return (
    <div className="main-content-area" style={{padding: '48px'}}>
      <div style={{maxWidth: '800px', margin: '0 auto', width: '100%'}}>
        <h1 className="title-large" style={{marginBottom: '32px'}}>{getLangText(lang, 'dashboard')}</h1>
        
        {/* Streak & Progress */}
        <div style={{display: 'flex', gap: '32px', marginBottom: '48px'}}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: '24px',
            background: 'var(--glass-bg)', backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)', border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-xl)', padding: '32px',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{background: 'linear-gradient(135deg, var(--warning), #f97316)', padding: '24px', borderRadius: '50%', color: 'white', boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)'}}>
              <Flame size={48} />
            </div>
            <div>
              <div style={{fontFamily: 'Outfit', fontSize: '48px', fontWeight: '700', color: 'white', lineHeight: '1.2'}}>{data.streak_days}</div>
              <div style={{fontSize: '18px', color: 'var(--text-muted)'}}>Streak</div>
            </div>
          </div>
          
          <div style={{
            flex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center',
            background: 'var(--glass-bg)', backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)', border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-xl)', padding: '32px',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '16px'}}>
              <span style={{fontFamily: 'Outfit', fontSize: '24px', fontWeight: '600', color: 'white'}}>{getLangText(lang, 'courseProgress')}</span>
              <span style={{fontFamily: 'Outfit', fontSize: '24px', fontWeight: '600', color: 'var(--primary)'}}>{progressPercent}%</span>
            </div>
            <div style={{width: '100%', height: '12px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: 'var(--radius-full)', overflow: 'hidden'}}>
              <div style={{width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', transition: 'width 0.5s ease', boxShadow: '0 0 10px var(--primary)'}}></div>
            </div>
            <div style={{marginTop: '16px', fontSize: '16px', color: 'var(--text-muted)'}}>
              {data.modules_completed} / {data.modules_total} {getLangText(lang, 'modulesCompleted')}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{display: 'flex', gap: '32px'}}>
          <div style={{
            flex: 1, cursor: 'pointer', border: '1px solid var(--glass-border)',
            background: 'var(--glass-bg)', backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)', borderRadius: 'var(--radius-xl)', padding: '48px 32px',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.5)', transition: 'all 0.3s ease'
          }} onClick={() => navigate('/syllabus')}
             onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary)'}
             onMouseOut={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}>
            <Book size={48} style={{color: 'var(--primary)', marginBottom: '24px', filter: 'drop-shadow(0 0 12px rgba(0, 242, 255, 0.4))'}} />
            <h2 style={{fontFamily: 'Outfit', fontSize: '28px', fontWeight: '600', marginBottom: '16px', color: 'white'}}>{getLangText(lang, 'trainingSyllabus')}</h2>
            <p style={{fontSize: '16px', color: 'var(--text-muted)'}}>{getLangText(lang, 'viewSyllabus')}</p>
          </div>
          
          <div style={{
            flex: 1, 
            cursor: allCompleted ? 'pointer' : 'not-allowed', 
            opacity: allCompleted ? 1 : 0.6,
            border: '1px solid var(--glass-border)',
            background: 'var(--glass-bg)', backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)', borderRadius: 'var(--radius-xl)', padding: '48px 32px',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.5)', transition: 'all 0.3s ease'
          }} 
               onClick={() => {
                 if (data.has_certificate) {
                   navigate('/certificate');
                 } else if (allCompleted) {
                   navigate('/assessment');
                 }
               }}
               onMouseOver={e => { if(allCompleted) e.currentTarget.style.borderColor = 'var(--primary)'; }}
               onMouseOut={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
               >
            {data.has_certificate ? (
              <Award size={48} style={{color: 'var(--success)', marginBottom: '24px', filter: 'drop-shadow(0 0 12px rgba(16, 185, 129, 0.4))'}} />
            ) : allCompleted ? (
              <CheckCircle size={48} style={{color: 'var(--success)', marginBottom: '24px', filter: 'drop-shadow(0 0 12px rgba(16, 185, 129, 0.4))'}} />
            ) : (
              <Lock size={48} style={{color: 'var(--text-muted)', marginBottom: '24px'}} />
            )}
            
            <h2 style={{fontFamily: 'Outfit', fontSize: '28px', fontWeight: '600', marginBottom: '16px', color: 'white'}}>{getLangText(lang, 'finalAssessment')}</h2>
            <p style={{fontSize: '16px', color: 'var(--text-muted)'}}>
              {data.has_certificate ? getLangText(lang, 'certificate') : 
               allCompleted ? getLangText(lang, 'takeFinalAssessment') : 
               getLangText(lang, 'finalAssessment')}
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
}
