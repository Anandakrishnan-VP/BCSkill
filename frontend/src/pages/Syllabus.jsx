import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Circle, Play } from 'lucide-react';

export default function Syllabus() {
  const [modules, setModules] = useState([]);
  const navigate = useNavigate();
  const uid = localStorage.getItem('user_id') || 1;

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    const res = await fetch(`http://localhost:8000/worker/dashboard/${uid}`);
    const d = await res.json();
    if (d.status === 'success') {
      setModules(d.modules);
    }
  };

  const markComplete = async (moduleId) => {
    await fetch('http://localhost:8000/modules/complete', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({user_id: parseInt(uid), module_id: moduleId})
    });
    fetchModules();
  };

  if (!modules.length) return <div className="app-container"><div className="split-right" style={{width: '100%'}}>Loading Syllabus...</div></div>;

  return (
    <div className="main-content-area" style={{padding: '48px'}}>
      <div style={{maxWidth: '800px', margin: '0 auto', width: '100%'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px'}}>
          <h1 className="title-large">Training Syllabus</h1>
          <button className="btn-secondary" onClick={() => navigate('/worker/dashboard')}>Back to Dashboard</button>
        </div>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
          {modules.map((m, index) => {
            const isCompleted = m.is_completed;
            const isLocked = index > 0 && !modules[index - 1].is_completed;
            
            return (
              <div key={m.id} className="card" style={{
                display: 'flex', 
                alignItems: 'center', 
                gap: '24px',
                opacity: isLocked ? 0.5 : 1,
                border: isCompleted ? '2px solid var(--success)' : '1px solid var(--border)'
              }}>
                <div>
                  {isCompleted ? (
                    <CheckCircle size={32} color="var(--success)" />
                  ) : (
                    <Circle size={32} color="var(--border)" />
                  )}
                </div>
                
                <div style={{flex: 1}}>
                  <h3 style={{fontSize: '20px', fontWeight: 'bold'}}>{m.title}</h3>
                  <p style={{fontSize: '16px', opacity: 0.7}}>Module {index + 1}</p>
                </div>
                
                {!isLocked && !isCompleted && (
                  <div style={{display: 'flex', gap: '16px'}}>
                    <button className="btn-secondary" style={{padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px'}}
                            onClick={() => navigate('/training')}>
                      <Play size={20} /> Start
                    </button>
                    <button className="btn-primary" style={{padding: '12px 24px'}}
                            onClick={() => markComplete(m.module_id)}>
                      Mark Complete
                    </button>
                  </div>
                )}
                {isCompleted && (
                  <div style={{color: 'var(--success)', fontWeight: 'bold', fontSize: '16px'}}>Completed ✓</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
