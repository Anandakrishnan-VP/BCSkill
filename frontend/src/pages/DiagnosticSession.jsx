import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Square, Loader, AlertCircle } from 'lucide-react';
import { speakText, startListening } from '../voiceUtils';

export default function DiagnosticSession() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem('user_id') || 1;
  const trade = "General Skills"; // We'd realistically have them select a trade before this, but let's assume it.
  
  const diagnosticQuestion = "Your company requires a skill assessment. Please explain step-by-step how you diagnose a major fault in your primary line of work, and what safety precautions you take.";

  useEffect(() => {
    // Read the question on load
    setTimeout(() => speakText(diagnosticQuestion, 'en-US'), 1000);
  }, []);

  const toggleRecording = () => {
    if (recording) {
      setRecording(false);
      setLoading(true);
      
      // Stop logic is handled inside voiceUtils for real apps, here we just simulate the end of speech
      setTimeout(() => {
        submitAssessment(transcript || "I check the power and then I use my tools to fix the motor.");
      }, 1000);
    } else {
      setRecording(true);
      startListening(
        (text) => setTranscript(prev => prev + ' ' + text),
        () => {
          setRecording(false);
          setLoading(true);
          submitAssessment(transcript || "I check the power and then I use my tools to fix the motor.");
        },
        'en-US'
      );
    }
  };

  const submitAssessment = async (finalTranscript) => {
    try {
      const tradeDomain = localStorage.getItem('trade_domain') || trade;
      const res = await fetch('http://localhost:8000/evaluate_gap_assessment', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          user_id: parseInt(userId),
          trade: tradeDomain,
          transcript: finalTranscript
        })
      });
      const data = await res.json();
      
      if (data.status === 'success') {
        if (data.passed) {
          localStorage.setItem('cert_id', data.cert_id);
          speakText("Congratulations! You scored above 90 percent and passed your diagnostic. Your certificate is ready.", 'en-US');
          setTimeout(() => navigate('/certificate'), 4000);
        } else {
          speakText(`You scored ${data.score} percent, which is below the 90 percent requirement. We have generated a custom training path for you. You can retest in 7 days.`, 'en-US');
          setTimeout(() => navigate('/worker/dashboard'), 8000);
        }
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div className="page-content split-pane" style={{padding: 0, height: '100vh', overflow: 'hidden'}}>
      {/* Left side: The diagnostic context */}
      <div className="split-left" style={{background: 'var(--warning)', color: 'var(--text-main)', padding: '64px', justifyContent: 'center'}}>
        <AlertCircle size={80} color="var(--text-main)" style={{marginBottom: '32px'}} />
        <h1 style={{fontSize: '48px', fontWeight: 'bold', marginBottom: '24px'}}>Diagnostic Assessment</h1>
        <p style={{fontSize: '32px', lineHeight: 1.5, background: 'rgba(255,255,255,0.2)', padding: '32px', borderRadius: 'var(--radius-lg)'}}>
          {diagnosticQuestion}
        </p>
      </div>
      
      {/* Right side: The Voice Input Interface */}
      <div className="split-right content-center" style={{padding: '64px', position: 'relative'}}>
        {loading ? (
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--primary)'}}>
            <Loader size={80} className="spin" style={{marginBottom: '24px'}} />
            <h2 style={{fontSize: '24px'}}>Analyzing your skills and generating a custom learning path...</h2>
          </div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '600px'}}>
            <h2 style={{fontSize: '24px', color: 'var(--text-muted)', marginBottom: '48px', textAlign: 'center'}}>
              Tap the microphone to begin answering. Speak clearly.
            </h2>
            
            <button 
              className={`mic-button ${recording ? 'recording' : ''}`}
              onClick={toggleRecording}
              style={{width: '200px', height: '200px', marginBottom: '64px', boxShadow: recording ? '0 0 0 20px rgba(239, 68, 68, 0.2)' : 'var(--shadow-lg)'}}
            >
              {recording ? <Square size={80} fill="currentColor" /> : <Mic size={80} />}
            </button>
            
            <div style={{background: 'var(--bg)', width: '100%', minHeight: '150px', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)'}}>
               <p style={{fontSize: '18px', color: transcript ? 'var(--text-main)' : 'var(--text-muted)'}}>
                 {transcript || "Your answer will appear here..."}
               </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
