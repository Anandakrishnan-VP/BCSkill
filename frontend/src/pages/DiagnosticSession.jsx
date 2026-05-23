import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, AlertTriangle } from 'lucide-react';

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
    <div className="page-content content-center animate-fade-in" style={{ minHeight: '100vh', background: 'var(--bg-void)' }}>
      <div className="loader-container">
        <div className="neon-spinner" style={{ width: '64px', height: '64px', borderWidth: '6px' }}></div>
        <p style={{ color: '#000000', fontSize: '22px', fontWeight: '900', marginTop: '24px', textTransform: 'uppercase', textAlign: 'center', maxWidth: '480px' }}>Analyzing your skills and generating a custom learning path...</p>
      </div>
    </div>
  );

  return (
    <div className="main-content-area animate-fade-in" style={{ padding: '48px', minHeight: '100vh', background: 'var(--bg-void)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
          <h1 className="title-large" style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: 0 }}>
            <div style={{
              background: 'var(--primary)',
              border: '3px solid #000000',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '3px 3px 0px #000000'
            }}>
              <Stethoscope size={36} color="#000000" />
            </div>
            Diagnostic Assessment
          </h1>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button 
              onClick={() => submitAssessment('pass')} 
              style={{
                background: 'var(--success)', 
                color: '#000000', 
                border: '3px solid #000000', 
                padding: '8px 16px', 
                borderRadius: 'var(--radius-md)', 
                fontWeight: '900', 
                cursor: 'pointer',
                boxShadow: '3px 3px 0px #000000',
                textTransform: 'uppercase'
              }}
            >
              Dev: Auto Pass
            </button>
            <button 
              onClick={() => submitAssessment('fail')} 
              style={{
                background: 'var(--danger)', 
                color: '#FFFFFF', 
                border: '3px solid #000000', 
                padding: '8px 16px', 
                borderRadius: 'var(--radius-md)', 
                fontWeight: '900', 
                cursor: 'pointer',
                boxShadow: '3px 3px 0px #000000',
                textTransform: 'uppercase'
              }}
            >
              Dev: Auto Fail
            </button>
          </div>
        </div>

        <div style={{
          background: '#FFFFFF', 
          border: '4px solid #000000',
          borderRadius: 'var(--radius-md)', 
          padding: '48px', 
          marginBottom: '48px',
          display: 'flex', 
          gap: '24px', 
          alignItems: 'flex-start',
          boxShadow: 'var(--shadow-main)'
        }}>
          <div style={{
            background: 'var(--warning)',
            padding: '12px',
            border: '3px solid #000000',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '2px 2px 0px #000000'
          }}>
            <AlertTriangle size={36} color="#000000" />
          </div>
          <div>
            <div style={{ color: 'var(--warning)', fontWeight: '900', marginBottom: '16px', letterSpacing: '1px', textTransform: 'uppercase' }}>Corporate Requirement</div>
            <h2 style={{ fontSize: '24px', lineHeight: '1.5', color: '#000000', fontWeight: '800' }}>{diagnosticQuestion}</h2>
          </div>
        </div>
        
        <div style={{
          background: '#FFFFFF', 
          border: '4px solid #000000',
          borderRadius: 'var(--radius-md)', 
          padding: '48px', 
          display: 'flex', 
          flexDirection: 'column',
          boxShadow: 'var(--shadow-main)'
        }}>
           <div style={{ color: '#000000', fontWeight: '900', marginBottom: '24px', letterSpacing: '1px', textTransform: 'uppercase' }}>YOUR DETAILED ANSWER</div>
           
           <textarea
             style={{
               width: '100%', 
               minHeight: '250px', 
               background: 'var(--bg-void)', 
               border: '3px solid #000000',
               borderRadius: 'var(--radius-md)', 
               padding: '24px', 
               color: '#000000', 
               fontSize: '20px', 
               lineHeight: '1.6',
               marginBottom: '32px', 
               resize: 'vertical',
               fontWeight: '700',
               outline: 'none'
             }}
             placeholder="Type your diagnostic procedure and safety precautions here..."
             value={transcript}
             onChange={e => setTranscript(e.target.value)}
           />
           
           <button 
             onClick={() => submitAssessment()} 
             disabled={!transcript.trim()} 
             className="btn-primary" 
             style={{
               width: '100%', 
               padding: '24px', 
               fontSize: '22px', 
               fontWeight: '900',
               height: '72px',
               cursor: transcript.trim() ? 'pointer' : 'not-allowed',
               background: transcript.trim() ? 'var(--primary)' : '#E5E7EB',
               borderColor: transcript.trim() ? '#000000' : '#9CA3AF',
               boxShadow: transcript.trim() ? 'var(--shadow-main)' : 'none'
             }}
           >
             Submit Diagnostic
           </button>
        </div>
      </div>
    </div>
  );
}
