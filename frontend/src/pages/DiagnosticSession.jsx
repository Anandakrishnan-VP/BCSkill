import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, Stethoscope, AlertTriangle } from 'lucide-react';
import { speakText } from '../voiceUtils';

export default function DiagnosticSession() {
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem('user_id') || 1;
  const trade = "General Skills";
  const diagnosticQuestion = "Your company requires a skill assessment. Please explain step-by-step how you diagnose a major fault in your primary line of work, and what safety precautions you take.";

  const submitAssessment = async (overrideResult = null) => {
    setLoading(true);
    try {
      const tradeDomain = localStorage.getItem('trade_domain') || trade;
      
      const res = await fetch('http://localhost:8000/evaluate_gap_assessment', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          user_id: parseInt(userId),
          trade: tradeDomain,
          transcript: transcript || "DEV MODE",
          override_result: overrideResult
        })
      });
      const data = await res.json();
      
      if (data.status === 'success') {
        if (data.passed) {
          localStorage.setItem('cert_id', data.cert_id);
          navigate('/certificate');
        } else {
          if (data.weak_topics && data.weak_topics.length > 0) {
            await fetch('http://localhost:8000/generate_remedial_modules', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                user_id: parseInt(userId),
                domain: tradeDomain,
                failed_topics: data.weak_topics
              })
            });
          }
          navigate('/worker/dashboard');
        }
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="page-content content-center animate-fade-in" style={{minHeight: '100vh'}}>
      <div className="loader-container">
        <div className="neon-spinner" style={{width: '64px', height: '64px', borderWidth: '6px', borderColor: 'var(--primary) transparent transparent transparent'}}></div>
        <p style={{color: 'var(--primary)', fontSize: '24px', fontWeight: '600', marginTop: '24px'}}>Analyzing your skills and generating a custom learning path...</p>
      </div>
    </div>
  );

  return (
    <div className="main-content-area animate-fade-in" style={{padding: '48px', minHeight: '100vh', background: 'var(--bg)'}}>
      <div style={{maxWidth: '800px', margin: '0 auto', width: '100%'}}>
        
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px'}}>
          <h1 className="title-large" style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
            <Stethoscope size={40} color="var(--primary)" />
            Diagnostic Assessment
          </h1>
          <div style={{display: 'flex', gap: '12px'}}>
            <button onClick={() => submitAssessment('pass')} style={{background: 'var(--success)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'}}>Dev: Auto Pass</button>
            <button onClick={() => submitAssessment('fail')} style={{background: 'var(--error)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'}}>Dev: Auto Fail</button>
          </div>
        </div>

        <div style={{
          background: 'var(--glass-bg)', backdropFilter: 'blur(24px)', border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-xl)', padding: '48px', marginBottom: '48px',
          borderLeft: '4px solid var(--warning)', display: 'flex', gap: '24px', alignItems: 'flex-start'
        }}>
          <AlertTriangle size={48} color="var(--warning)" style={{flexShrink: 0}} />
          <div>
            <div style={{color: 'var(--warning)', fontWeight: 'bold', marginBottom: '16px', letterSpacing: '1px', textTransform: 'uppercase'}}>Corporate Requirement</div>
            <h2 style={{fontSize: '28px', lineHeight: '1.5', color: 'white', fontWeight: '500'}}>{diagnosticQuestion}</h2>
          </div>
        </div>
        
        <div style={{
          background: 'var(--glass-bg)', backdropFilter: 'blur(24px)', border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-xl)', padding: '48px', display: 'flex', flexDirection: 'column'
        }}>
           <div style={{color: 'white', fontWeight: 'bold', marginBottom: '24px', letterSpacing: '1px'}}>YOUR DETAILED ANSWER</div>
           
           <textarea
             style={{
               width: '100%', minHeight: '250px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--glass-border)',
               borderRadius: 'var(--radius-md)', padding: '24px', color: 'var(--text-main)', fontSize: '20px', lineHeight: '1.6',
               marginBottom: '32px', resize: 'vertical', boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.5)'
             }}
             placeholder="Type your diagnostic procedure and safety precautions here..."
             value={transcript}
             onChange={e => setTranscript(e.target.value)}
           />
           
           <button 
             onClick={() => submitAssessment()} 
             disabled={!transcript.trim()} 
             className="btn-primary" 
             style={{width: '100%', padding: '24px', fontSize: '22px', fontWeight: 'bold', opacity: transcript.trim() ? 1 : 0.5}}
           >
             Submit Diagnostic
           </button>
        </div>
      </div>
    </div>
  );
}
