import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { speakText } from '../voiceUtils';

export default function Assessment() {
  const [assessmentData, setAssessmentData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  
  const [userAnswer, setUserAnswer] = useState('');
  const [failedTopics, setFailedTopics] = useState([]);
  
  const navigate = useNavigate();
  const uid = localStorage.getItem('user_id') || 1;
  const domain = localStorage.getItem('trade_domain') || 'Electrician';

  useEffect(() => {
    generateAssessment();
  }, []);

  const generateAssessment = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8000/generate_final_assessment', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ user_id: parseInt(uid), domain, language: 'en' })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setAssessmentData(data.assessment);
        speakText(data.assessment.title + ". " + data.assessment.questions[0].question, 'en-US');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) return;
    setEvaluating(true);
    const q = assessmentData.questions[currentQuestion];
    try {
      const res = await fetch('http://localhost:8000/evaluate_answer', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          lesson_id: "final",
          question_id: q.id,
          user_answer: userAnswer
        })
      });
      const data = await res.json();
      const isCorrect = data.evaluation?.is_correct;
      
      handleAnswer(isCorrect, q.topic || 'General Concepts');
    } catch (e) {
      handleAnswer(true, q.topic); // default pass on error
    } finally {
      setEvaluating(false);
      setUserAnswer('');
    }
  };

  const handleAnswer = (isCorrect, topic) => {
    const finalScore = score + (isCorrect ? 10 : 0);
    setScore(finalScore);
    
    if (!isCorrect) {
      setFailedTopics(prev => {
        if (!prev.includes(topic)) return [...prev, topic];
        return prev;
      });
    }
    
    if (currentQuestion < assessmentData.questions.length - 1) {
      setCurrentQuestion(c => c + 1);
      speakText(assessmentData.questions[currentQuestion + 1].question, 'en-US');
    } else {
      finishAssessment(finalScore, !isCorrect ? [...failedTopics, topic] : failedTopics);
    }
  };

  const handleAssessmentComplete = async (finalScore, finalFailedTopics) => {
    setScore(finalScore);
    const passed = finalScore >= 90;
    
    try {
      const res = await fetch(`http://localhost:8000/generate_certificate?user_id=${uid}&domain=${domain}&score=${finalScore}&language=en`, { method: 'POST' });
      const data = await res.json();
      if (passed) {
        localStorage.setItem('cert_id', data.certificate_id);
      } else {
        // Generate remedial modules
        if (finalFailedTopics.length > 0) {
          await fetch('http://localhost:8000/generate_remedial_modules', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              user_id: parseInt(uid),
              domain: domain,
              failed_topics: finalFailedTopics
            })
          });
        }
      }
    } catch (e) {
      console.error("Failed to record score:", e);
    }
    
    setIsCompleted(true);
  };

  const finishAssessment = async (finalScore, finalFailedTopics) => {
    handleAssessmentComplete(finalScore, finalFailedTopics);
    if (finalScore >= 90) {
      speakText("Congratulations! You passed the assessment and earned your certificate.", 'en-US');
    } else {
      speakText(`You scored ${finalScore}%. You need 90% to pass. We have generated a remedial training path specifically for the areas you struggled with.`, 'en-US');
    }
  };

  if (loading) return (
    <div className="page-content content-center animate-fade-in" style={{minHeight: '100vh'}}>
      <div className="loader-container">
        <div className="neon-spinner" style={{width: '64px', height: '64px', borderWidth: '6px'}}></div>
        <p style={{color: 'var(--primary)', fontSize: '24px', fontWeight: '600', marginTop: '24px'}}>Generating Exam...</p>
      </div>
    </div>
  );

  if (evaluating) return (
    <div className="page-content content-center animate-fade-in" style={{minHeight: '100vh'}}>
      <div className="loader-container">
        <div className="neon-spinner" style={{width: '64px', height: '64px', borderWidth: '6px', borderColor: 'var(--success) transparent transparent transparent'}}></div>
        <p style={{color: 'var(--success)', fontSize: '24px', fontWeight: '600', marginTop: '24px'}}>AI is evaluating your answer...</p>
      </div>
    </div>
  );

  if (isCompleted) {
    const passed = score >= 90;
    return (
      <div className="main-content-area content-center animate-fade-in" style={{padding: '48px', minHeight: '100vh'}}>
        <div style={{
          background: 'var(--glass-bg)', backdropFilter: 'blur(24px)', border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-xl)', padding: '64px', textAlign: 'center', maxWidth: '600px', width: '100%',
          boxShadow: `0 20px 40px -10px ${passed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`
        }}>
          {passed ? <CheckCircle size={80} color="var(--success)" style={{margin: '0 auto 32px'}} /> : <AlertTriangle size={80} color="var(--error)" style={{margin: '0 auto 32px'}} />}
          <h1 style={{fontSize: '48px', fontWeight: 'bold', marginBottom: '16px', color: passed ? 'var(--success)' : 'var(--error)'}}>
            {passed ? "Pass" : "Fail"}
          </h1>
          <p style={{fontSize: '24px', color: 'var(--text-muted)', marginBottom: '48px'}}>
            Score: {score}% (90% Required)
          </p>
          
          {passed ? (
            <button className="btn-primary" style={{width: '100%', padding: '24px', fontSize: '20px'}} onClick={() => navigate('/certificate')}>
              Get Certified
            </button>
          ) : (
            <button className="btn-secondary" style={{width: '100%', padding: '24px', fontSize: '20px'}} onClick={() => navigate('/worker/dashboard')}>
              Return to Targeted Training
            </button>
          )}
        </div>
      </div>
    );
  }

  const q = assessmentData?.questions[currentQuestion];

  return (
    <div className="main-content-area animate-fade-in" style={{padding: '48px', minHeight: '100vh'}}>
      <div style={{maxWidth: '800px', margin: '0 auto', width: '100%'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px'}}>
          <h1 className="title-large">{assessmentData?.title || 'Final Assessment'}</h1>
          <div style={{display: 'flex', alignItems: 'center', gap: '24px'}}>
            <button 
              onClick={() => finishAssessment(100, [])}
              style={{background: 'var(--success)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'}}
            >
              Dev: Auto Pass
            </button>
            <div style={{fontSize: '24px', fontWeight: 'bold', color: 'var(--primary)'}}>
              {currentQuestion + 1} / {assessmentData?.questions?.length || 10}
            </div>
          </div>
        </div>

        <div style={{
          background: 'var(--glass-bg)', backdropFilter: 'blur(24px)', border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-xl)', padding: '48px', marginBottom: '48px',
          borderLeft: '4px solid var(--primary)'
        }}>
          <div style={{color: 'var(--primary)', fontWeight: 'bold', marginBottom: '16px', letterSpacing: '1px'}}>AI ASSESSOR</div>
          <h2 style={{fontSize: '32px', lineHeight: '1.4'}}>{q?.question}</h2>
        </div>
        
        <div style={{
          background: 'var(--glass-bg)', backdropFilter: 'blur(24px)', border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-xl)', padding: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center'
        }}>
           <div style={{color: 'white', fontWeight: 'bold', marginBottom: '32px', letterSpacing: '1px', alignSelf: 'flex-start'}}>YOUR ANSWER</div>
           
           <textarea
             style={{
               width: '100%', minHeight: '150px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)',
               borderRadius: 'var(--radius-md)', padding: '24px', color: 'var(--text-main)', fontSize: '18px',
               marginBottom: '32px', resize: 'vertical'
             }}
             placeholder="Type your answer here..."
             value={userAnswer}
             onChange={e => setUserAnswer(e.target.value)}
           />
           
           <button onClick={submitAnswer} disabled={!userAnswer.trim()} className="btn-primary" style={{width: '100%', padding: '20px', fontSize: '20px'}}>
             Submit Answer
           </button>
        </div>
      </div>
    </div>
  );
}