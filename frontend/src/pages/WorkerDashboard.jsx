import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, CheckCircle, Book, Lock, Award, AlertCircle } from 'lucide-react';

export default function WorkerDashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      const uid = localStorage.getItem('user_id') || 1;
      const res = await fetch(`http://localhost:8000/worker/dashboard/${uid}`);
      const d = await res.json();
      if (d.status === 'success') {
        setData(d);
      }
    };
    fetchDashboard();
  }, []);

  if (!data) return <div className="app-container"><div className="split-right" style={{width: '100%'}}>Loading...</div></div>;

  const progressPercent = data.modules_total > 0 ? Math.round((data.modules_completed / data.modules_total) * 100) : 0;
  const allCompleted = data.modules_total > 0 && data.modules_completed === data.modules_total;

  return (
    <div className="main-content-area" style={{padding: '48px'}}>
      <div style={{maxWidth: '800px', margin: '0 auto', width: '100%'}}>
        <h1 className="title-large" style={{marginBottom: '32px'}}>Your Learning Dashboard</h1>
        
        {/* Streak & Progress */}
        <div style={{display: 'flex', gap: '24px', marginBottom: '48px'}}>
          <div className="card" style={{flex: 1, display: 'flex', alignItems: 'center', gap: '24px'}}>
            <div style={{background: 'var(--warning)', padding: '24px', borderRadius: '50%', color: 'white'}}>
              <Flame size={48} />
            </div>
            <div>
              <div style={{fontSize: '36px', fontWeight: 'bold'}}>{data.streak_days} Days</div>
              <div style={{fontSize: '18px', opacity: 0.7}}>Learning Streak</div>
            </div>
          </div>
          
          <div className="card" style={{flex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '16px'}}>
              <span style={{fontSize: '20px', fontWeight: 'bold'}}>Course Progress</span>
              <span style={{fontSize: '20px', fontWeight: 'bold'}}>{progressPercent}%</span>
            </div>
            <div style={{width: '100%', height: '16px', background: 'var(--border)', borderRadius: '8px', overflow: 'hidden'}}>
              <div style={{width: `${progressPercent}%`, height: '100%', background: 'var(--success)', transition: 'width 0.5s ease'}}></div>
            </div>
            <div style={{marginTop: '16px', fontSize: '16px', opacity: 0.7}}>
              {data.modules_completed} of {data.modules_total} modules completed
            </div>
          </div>
        </div>

        {/* Cooldown Warning */}
        {data.cooldown_active && (
          <div className="card" style={{background: '#FEF2F2', borderColor: '#FCA5A5', marginBottom: '32px'}}>
            <div style={{display: 'flex', gap: '16px', color: '#DC2626', alignItems: 'flex-start'}}>
              <AlertCircle size={32} />
              <div>
                <h3 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '8px'}}>Assessment Cooldown Active</h3>
                <p style={{fontSize: '16px'}}>You recently did not pass the assessment. It is locked for 7 days.</p>
                <div style={{marginTop: '16px', padding: '16px', background: 'rgba(220, 38, 38, 0.1)', borderRadius: '8px'}}>
                  <p style={{fontWeight: 'bold', marginBottom: '8px'}}>AI Recommended Revision Topics:</p>
                  <p>{data.weak_topics}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{display: 'flex', gap: '24px'}}>
          <div className="card" style={{flex: 1, cursor: 'pointer', border: '2px solid transparent'}} onClick={() => navigate('/syllabus')}
               onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary)'}
               onMouseOut={e => e.currentTarget.style.borderColor = 'transparent'}>
            <Book size={48} style={{color: 'var(--primary)', marginBottom: '24px'}} />
            <h2 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '16px'}}>Training Syllabus</h2>
            <p style={{fontSize: '16px', opacity: 0.7}}>View your roadmap and continue learning.</p>
          </div>
          
          <div className="card" style={{flex: 1, cursor: allCompleted && !data.cooldown_active ? 'pointer' : 'not-allowed', opacity: allCompleted && !data.cooldown_active ? 1 : 0.6}} 
               onClick={() => {
                 if (data.has_certificate) {
                   navigate('/certificate');
                 } else if (allCompleted && !data.cooldown_active) {
                   navigate('/assessment');
                 }
               }}>
            {data.has_certificate ? (
              <Award size={48} style={{color: 'var(--success)', marginBottom: '24px'}} />
            ) : allCompleted && !data.cooldown_active ? (
              <CheckCircle size={48} style={{color: 'var(--success)', marginBottom: '24px'}} />
            ) : (
              <Lock size={48} style={{color: 'var(--border)', marginBottom: '24px'}} />
            )}
            
            <h2 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '16px'}}>Final Assessment</h2>
            <p style={{fontSize: '16px', opacity: 0.7}}>
              {data.has_certificate ? "You have already passed! Click to view certificate." : 
               allCompleted && !data.cooldown_active ? "You are ready! Take the test to earn your certificate." : 
               data.cooldown_active ? "Locked due to cooldown. Revise weak topics." :
               "Complete all modules to unlock the final assessment."}
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
}
