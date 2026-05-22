import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Circle, Play, ChevronDown, ChevronUp } from 'lucide-react';
import { getLangText } from '../translations';

export default function Syllabus() {
  const [modules, setModules] = useState([]);
  const [expandedModule, setExpandedModule] = useState(null);
  const navigate = useNavigate();
  const uid = localStorage.getItem('user_id') || 1;
  const lang = localStorage.getItem('preferred_language') || 'en';

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    const res = await fetch(`http://localhost:8000/worker/dashboard/${uid}?t=${Date.now()}`);
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

  if (!modules.length) return <div className="app-container"><div className="split-right" style={{width: '100%'}}><div className="loader-container"><div className="neon-spinner"></div><p>Loading Syllabus...</p></div></div></div>;

  const allCompleted = modules.length > 0 && modules.every(m => m.is_completed);
  if (allCompleted) {
    localStorage.setItem('all_modules_completed', 'true');
  }

  return (
    <div className="main-content-area animate-fade-in" style={{padding: '48px'}}>
      <div style={{maxWidth: '800px', margin: '0 auto', width: '100%'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px'}}>
          <h1 className="title-large">{getLangText(lang, 'trainingSyllabus')}</h1>
          <button className="btn-secondary" onClick={() => navigate('/worker/dashboard')}>{getLangText(lang, 'backToDashboard')}</button>
        </div>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
          {modules.map((m, index) => {
            const isCompleted = m.is_completed;
            const isLocked = index > 0 && !modules[index - 1].is_completed;
            const isExpanded = expandedModule === m.id;
            
            // Mock topics for the UI design requirement
            const topics = [
              "Core Concepts & Terminology",
              "Safety Guidelines & Best Practices",
              "Standard Operating Procedures",
              "Common Troubleshooting Scenarios"
            ];
            
            return (
              <div key={m.id} className="card" style={{
                display: 'flex', 
                flexDirection: 'column',
                gap: '0',
                opacity: isLocked ? 0.5 : 1,
                border: isCompleted ? '2px solid var(--success)' : (isExpanded ? '1px solid var(--primary)' : '1px solid var(--border)'),
                padding: '0',
                overflow: 'hidden',
                transition: 'all 0.3s'
              }}>
                <div 
                  style={{
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '24px', 
                    padding: '24px',
                    cursor: 'pointer',
                    background: isExpanded ? 'rgba(0, 242, 255, 0.05)' : 'transparent'
                  }}
                  onClick={() => !isLocked && setExpandedModule(isExpanded ? null : m.id)}
                >
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
                  
                  {!isLocked && (
                    <div>
                      {isExpanded ? <ChevronUp size={24} color="var(--text-muted)" /> : <ChevronDown size={24} color="var(--text-muted)" />}
                    </div>
                  )}
                </div>

                {/* Accordion Dropdown Content */}
                {isExpanded && !isLocked && (
                  <div style={{
                    padding: '24px', 
                    borderTop: '1px solid var(--border)',
                    background: 'rgba(0,0,0,0.2)'
                  }}>
                    <h4 style={{fontSize: '16px', color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px'}}>{getLangText(lang, 'topicsCovered')}</h4>
                    <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px'}}>
                      {topics.map((topic, i) => (
                        <li key={i} style={{display: 'flex', alignItems: 'center', gap: '12px', color: 'white'}}>
                          <div style={{width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)'}}></div>
                          {topic}
                        </li>
                      ))}
                    </ul>

                    <div style={{display: 'flex', gap: '16px', justifyContent: 'flex-end'}}>
                      {!isCompleted && (
                        <button className="btn-primary" style={{padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px'}}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  localStorage.setItem('current_module_id', m.module_id);
                                  navigate('/training');
                                }}>
                          <Play size={20} /> {getLangText(lang, 'startTrainingSession')}
                        </button>
                      )}
                      
                      {!isCompleted && (
                        <button className="btn-secondary" style={{padding: '12px 24px'}}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markComplete(m.module_id);
                                }}>
                          {getLangText(lang, 'markCompleteManually')}
                        </button>
                      )}
                      
                      {isCompleted && (
                        <div style={{color: 'var(--success)', fontWeight: 'bold', fontSize: '16px', padding: '12px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                          <CheckCircle size={20} /> {getLangText(lang, 'moduleCompleted')}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {allCompleted && (
          <div className="animate-fade-in" style={{marginTop: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px'}}>
            <p style={{color: 'var(--success)', fontSize: '18px', fontWeight: 'bold'}}>{getLangText(lang, 'completedAllModules')}</p>
            <button className="btn-primary" style={{height: '64px', fontSize: '20px', padding: '0 48px'}} onClick={() => navigate('/assessment')}>
              <CheckCircle size={24} style={{marginRight: '12px'}} />
              {getLangText(lang, 'takeFinalAssessment')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
