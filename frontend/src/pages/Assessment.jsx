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
    <div className="page-content content-center animate-fade-in" style={{ minHeight: '100vh', background: 'var(--bg-void)' }}>
      <div className="loader-container">
        <div className="neon-spinner" style={{ width: '64px', height: '64px', borderWidth: '6px' }}></div>
        <p style={{ color: '#000000', fontSize: '24px', fontWeight: '900', marginTop: '24px', textTransform: 'uppercase' }}>Generating Exam...</p>
      </div>
    </div>
  );

  if (evaluating) return (
    <div className="page-content content-center animate-fade-in" style={{ minHeight: '100vh', background: 'var(--bg-void)' }}>
      <div className="loader-container">
        <div className="neon-spinner" style={{ width: '64px', height: '64px', borderWidth: '6px' }}></div>
        <p style={{ color: '#000000', fontSize: '24px', fontWeight: '900', marginTop: '24px', textTransform: 'uppercase' }}>AI is evaluating your answer...</p>
      </div>
    </div>
  );

  if (isCompleted) {
    const passed = score >= 90;
    return (
      <div className="main-content-area content-center animate-fade-in" style={{ padding: '48px', minHeight: '100vh', background: 'var(--bg-void)' }}>
        <div style={{
          background: '#FFFFFF', 
          border: '4px solid #000000',
          borderRadius: 'var(--radius-md)', 
          padding: '64px', 
          textAlign: 'center', 
          maxWidth: '600px', 
          width: '100%',
          boxShadow: 'var(--shadow-main)'
        }}>
          {passed ? (
            <div style={{
              background: 'var(--success)',
              width: '96px',
              height: '96px',
              borderRadius: 'var(--radius-md)',
              border: '3px solid #000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 32px',
              boxShadow: '3px 3px 0px #000000'
            }}>
              <CheckCircle size={54} color="#000000" />
            </div>
          ) : (
            <div style={{
              background: 'var(--danger)',
              width: '96px',
              height: '96px',
              borderRadius: 'var(--radius-md)',
              border: '3px solid #000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 32px',
              boxShadow: '3px 3px 0px #000000'
            }}>
              <AlertTriangle size={54} color="#FFFFFF" />
            </div>
          )}
          <h1 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '16px', color: '#000000', textTransform: 'uppercase' }}>
            {passed ? "Pass" : "Fail"}
          </h1>
          <p style={{ fontSize: '24px', color: 'var(--text-muted)', marginBottom: '48px', fontWeight: '800' }}>
            Score: {score}% (90% Required)
          </p>
          
          {passed ? (
            <button className="btn-primary" style={{ width: '100%', padding: '24px', fontSize: '20px', height: '64px' }} onClick={() => navigate('/certificate')}>
              Get Certified
            </button>
          ) : (
            <button className="btn-secondary" style={{ width: '100%', padding: '24px', fontSize: '20px', height: '64px' }} onClick={() => navigate('/worker/dashboard')}>
              Return to Targeted Training
            </button>
          )}
        </div>
      </div>
    );
  }

  const q = assessmentData?.questions[currentQuestion];

  return (
    <div className="main-content-area animate-fade-in" style={{ padding: '48px', minHeight: '100vh', background: 'var(--bg-void)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
          <h1 className="title-large" style={{ margin: 0 }}>{assessmentData?.title || 'Final Assessment'}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <button 
              onClick={() => finishAssessment(100, [])}
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
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#000000', textTransform: 'uppercase' }}>
              {currentQuestion + 1} / {assessmentData?.questions?.length || 10}
            </div>
          </div>
        </div>

        <div style={{
          background: '#FFFFFF', 
          border: '4px solid #000000',
          borderRadius: 'var(--radius-md)', 
          padding: '48px', 
          marginBottom: '48px',
          boxShadow: 'var(--shadow-main)'
        }}>
          <div style={{ color: 'var(--tertiary)', fontWeight: '900', marginBottom: '16px', letterSpacing: '1px', textTransform: 'uppercase' }}>AI ASSESSOR</div>
          <h2 style={{ fontSize: '32px', lineHeight: '1.4', color: '#000000', fontWeight: '800' }}>{q?.question}</h2>
        </div>
        
        <div style={{
          background: '#FFFFFF', 
          border: '4px solid #000000',
          borderRadius: 'var(--radius-md)', 
          padding: '48px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          boxShadow: 'var(--shadow-main)'
        }}>
           <div style={{ color: '#000000', fontWeight: '900', marginBottom: '32px', letterSpacing: '1px', alignSelf: 'flex-start', textTransform: 'uppercase' }}>YOUR ANSWER</div>
           
           <textarea
             style={{
               width: '100%', 
               minHeight: '150px', 
               background: 'var(--bg-void)', 
               border: '3px solid #000000',
               borderRadius: 'var(--radius-md)', 
               padding: '24px', 
               color: '#000000', 
               fontSize: '18px',
               marginBottom: '32px', 
               resize: 'vertical',
               fontWeight: '700',
               outline: 'none'
             }}
             placeholder="Type your answer here..."
             value={userAnswer}
             onChange={e => setUserAnswer(e.target.value)}
           />
           
           <button 
             onClick={submitAnswer} 
             disabled={!userAnswer.trim()} 
             className="btn-primary" 
             style={{
               width: '100%', 
               padding: '20px', 
               fontSize: '20px', 
               height: '64px',
               fontWeight: '900',
               background: userAnswer.trim() ? 'var(--primary)' : '#E5E7EB',
               borderColor: userAnswer.trim() ? '#000000' : '#9CA3AF',
               boxShadow: userAnswer.trim() ? 'var(--shadow-main)' : 'none',
               cursor: userAnswer.trim() ? 'pointer' : 'not-allowed'
             }}
           >
             Submit Answer
           </button>
        </div>
      </div>
    </div>
  );
}