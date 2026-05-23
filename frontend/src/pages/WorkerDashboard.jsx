import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, CheckCircle, Book, Lock, Award, BookOpen, AlertTriangle } from 'lucide-react';
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
    <div className="page-content content-center animate-fade-in" style={{ minHeight: '100vh', background: 'var(--bg-void)' }}>
      <div className="loader-container">
        <div className="neon-spinner" style={{ width: '64px', height: '64px', borderWidth: '6px' }}></div>
        <p style={{ color: '#000000', fontSize: '24px', fontWeight: '900', marginTop: '24px', textTransform: 'uppercase' }}>{getLangText(lang, 'loadingDashboard')}</p>
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
      <div className="main-content-area animate-fade-in" style={{ padding: '48px', minHeight: '100vh', background: 'var(--bg-void)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
             <div style={{ 
               background: 'var(--danger)', 
               padding: '12px', 
               border: '3px solid #000000', 
               boxShadow: '3px 3px 0px #000000', 
               borderRadius: 'var(--radius-md)',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center'
             }}>
               <AlertTriangle size={40} color="#FFFFFF" />
             </div>
             <h1 className="title-large" style={{ margin: 0, color: '#000000', fontSize: '42px' }}>Targeted Remedial Path</h1>
          </div>
          
          <p style={{ fontSize: '20px', color: '#000000', marginBottom: '48px', lineHeight: '1.5', fontWeight: '800' }}>
            You did not pass the diagnostic assessment. To become certified, you must complete the specific training modules below tailored to your skill gaps.
          </p>

          <div style={{
            background: '#FFFFFF', 
            border: '4px solid #000000',
            borderRadius: 'var(--radius-md)', 
            padding: '32px', 
            marginBottom: '48px',
            boxShadow: 'var(--shadow-main)'
          }}>
            <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontFamily: 'Archivo', fontSize: '20px', fontWeight: '900', color: '#000000', textTransform: 'uppercase' }}>Remedial Progress</span>
              <span style={{ fontFamily: 'Archivo', fontSize: '20px', fontWeight: '900', color: 'var(--danger)' }}>{progressPercent}%</span>
            </div>
            <div style={{ width: '100%', height: '16px', background: '#FFFFFF', border: '3px solid #000000', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--danger)', transition: 'width 0.5s ease' }}></div>
            </div>
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '24px', color: '#000000', textTransform: 'uppercase' }}>Required Topics to Learn</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '48px' }}>
            {data.modules.map((mod, i) => (
              <div key={i} style={{
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                background: mod.is_completed ? 'var(--success)' : '#FFFFFF',
                border: '3px solid #000000',
                padding: '24px', 
                borderRadius: 'var(--radius-md)',
                boxShadow: '3px 3px 0px #000000'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {mod.is_completed ? <CheckCircle size={28} color="#000000" /> : <BookOpen size={28} color="#000000" />}
                  <span style={{ fontSize: '20px', color: '#000000', fontWeight: '900', textTransform: 'uppercase' }}>{mod.title}</span>
                </div>
                {!mod.is_completed && mod.module_id !== 'final_retest' && (
                  <button 
                    onClick={() => navigate('/syllabus')} 
                    className="btn-secondary" 
                    style={{ padding: '8px 16px', fontSize: '16px', height: 'auto', width: 'auto' }}
                  >
                    Study Now
                  </button>
                )}
              </div>
            ))}
          </div>

          <button 
            className="btn-primary"
            disabled={!allCompleted}
            onClick={() => navigate('/assessment')}
            style={{
              width: '100%', 
              padding: '24px', 
              fontSize: '24px', 
              height: '72px',
              fontWeight: '900',
              textTransform: 'uppercase',
              background: allCompleted ? 'var(--success)' : '#E5E7EB',
              color: allCompleted ? '#000000' : '#9CA3AF',
              borderColor: allCompleted ? '#000000' : '#9CA3AF',
              boxShadow: allCompleted ? 'var(--shadow-main)' : 'none',
              cursor: allCompleted ? 'pointer' : 'not-allowed'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
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
    <div className="main-content-area" style={{ padding: '48px', background: 'var(--bg-void)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <h1 className="title-large" style={{ marginBottom: '32px' }}>{getLangText(lang, 'dashboard')}</h1>
        
        {/* Streak & Progress */}
        <div style={{ display: 'flex', gap: '32px', marginBottom: '48px' }}>
          <div style={{
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            gap: '24px',
            background: '#FFFFFF', 
            border: '3px solid #000000',
            borderRadius: 'var(--radius-md)', 
            padding: '32px',
            boxShadow: 'var(--shadow-main)'
          }}>
            <div style={{ 
              background: 'var(--primary)', 
              padding: '20px', 
              borderRadius: 'var(--radius-md)', 
              color: '#000000', 
              border: '3px solid #000000',
              boxShadow: '2px 2px 0px #000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Flame size={48} />
            </div>
            <div>
              <div style={{ fontFamily: 'Archivo', fontSize: '48px', fontWeight: '900', color: '#000000', lineHeight: '1.2' }}>{data.streak_days}</div>
              <div style={{ fontSize: '18px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Streak</div>
            </div>
          </div>
          
          <div style={{
            flex: 2, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            background: '#FFFFFF', 
            border: '3px solid #000000',
            borderRadius: 'var(--radius-md)', 
            padding: '32px',
            boxShadow: 'var(--shadow-main)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontFamily: 'Archivo', fontSize: '24px', fontWeight: '900', color: '#000000', textTransform: 'uppercase' }}>{getLangText(lang, 'courseProgress')}</span>
              <span style={{ fontFamily: 'Archivo', fontSize: '24px', fontWeight: '900', color: 'var(--tertiary)' }}>{progressPercent}%</span>
            </div>
            <div style={{ width: '100%', height: '16px', background: '#FFFFFF', border: '3px solid #000000', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--secondary)', transition: 'width 0.5s ease' }}></div>
            </div>
            <div style={{ marginTop: '16px', fontSize: '16px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>
              {data.modules_completed} / {data.modules_total} {getLangText(lang, 'modulesCompleted')}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '32px' }}>
          
          {/* Syllabus Action Card */}
          <div style={{
            flex: 1, 
            cursor: 'pointer', 
            border: '3px solid #000000',
            background: '#FFFFFF', 
            borderRadius: 'var(--radius-md)', 
            padding: '48px 32px',
            boxShadow: 'var(--shadow-main)', 
            transition: 'all 0.15s ease'
          }} 
          onClick={() => navigate('/syllabus')}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'translate(-3px, -3px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            e.currentTarget.style.background = 'var(--primary)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = 'var(--shadow-main)';
            e.currentTarget.style.background = '#FFFFFF';
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'var(--secondary)',
              border: '3px solid #000000',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              boxShadow: '2px 2px 0px #000000'
            }}>
              <Book size={32} color="#000000" />
            </div>
            <h2 style={{ fontFamily: 'Archivo', fontSize: '28px', fontWeight: '900', marginBottom: '16px', color: '#000000', textTransform: 'uppercase' }}>{getLangText(lang, 'trainingSyllabus')}</h2>
            <p style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: '700' }}>{getLangText(lang, 'viewSyllabus')}</p>
          </div>
          
          {/* Assessment Action Card */}
          <div style={{
            flex: 1, 
            cursor: allCompleted ? 'pointer' : 'not-allowed', 
            border: '3px solid #000000',
            background: '#FFFFFF', 
            borderRadius: 'var(--radius-md)', 
            padding: '48px 32px',
            boxShadow: 'var(--shadow-main)', 
            transition: 'all 0.15s ease'
          }} 
          onClick={() => {
            if (data.has_certificate) {
              navigate('/certificate');
            } else if (allCompleted) {
              navigate('/assessment');
            }
          }}
          onMouseOver={e => { 
            if (allCompleted) {
              e.currentTarget.style.transform = 'translate(-3px, -3px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              e.currentTarget.style.background = 'var(--success)';
            }
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = 'var(--shadow-main)';
            e.currentTarget.style.background = '#FFFFFF';
          }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              background: data.has_certificate || allCompleted ? 'var(--success)' : '#E5E7EB',
              border: '3px solid #000000',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              boxShadow: '2px 2px 0px #000000'
            }}>
              {data.has_certificate ? (
                <Award size={32} color="#000000" />
              ) : allCompleted ? (
                <CheckCircle size={32} color="#000000" />
              ) : (
                <Lock size={32} color="#9CA3AF" />
              )}
            </div>
            
            <h2 style={{ fontFamily: 'Archivo', fontSize: '28px', fontWeight: '900', marginBottom: '16px', color: '#000000', textTransform: 'uppercase' }}>{getLangText(lang, 'finalAssessment')}</h2>
            <p style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: '700' }}>
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
