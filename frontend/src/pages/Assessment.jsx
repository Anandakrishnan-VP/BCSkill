import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Volume2 } from 'lucide-react';
import { speakText, startListening, stopSpeaking } from '../voiceUtils';

export default function Assessment() {
  const [lesson, setLesson] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [recording, setRecording] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('current_lesson'));
    if (data) {
      setLesson(data);
      readQuestion(data.questions[0].question);
    } else {
      navigate('/training');
    }
    return () => {
      if (recognition) recognition.stop();
      stopSpeaking();
    };
  }, []);

  const readQuestion = (text) => {
    const langCode = localStorage.getItem('preferred_language') === 'hi' ? 'hi-IN' : 'en-US';
    speakText(text, langCode);
  };

  const handleMicClick = () => {
    if (recording) {
      if (recognition) recognition.stop();
      setRecording(false);
    } else {
      stopSpeaking();
      const langCode = localStorage.getItem('preferred_language') === 'hi' ? 'hi-IN' : 'en-US';
      const rec = startListening(langCode, (text) => {
        setTranscript(text);
        setRecording(false);
        submitAnswer(text);
      }, (err) => {
        console.error(err);
        setRecording(false);
      });
      setRecognition(rec);
      setRecording(true);
      setTranscript('Listening...');
    }
  };

  const [answers, setAnswers] = useState([]);

  const submitAnswer = async (ans) => {
    if (!ans || ans === 'Listening...') return;
    
    // Locally store answer
    const newAnswers = [...answers, ans];
    setAnswers(newAnswers);
    
    // Provide simple feedback locally (in reality we would still evaluate each step or just say "recorded")
    speakText("Answer recorded.", 'en-US');
    
    setTimeout(() => {
      if (currentQ < lesson.questions.length - 1) {
        setCurrentQ(currentQ + 1);
        setTranscript('');
        readQuestion(lesson.questions[currentQ + 1].question);
      } else {
        finishAssessment(newAnswers);
      }
    }, 2000);
  };

  const finishAssessment = async (allAnswers) => {
    setEvaluating(true);
    try {
      const user_id = localStorage.getItem('user_id') || 1;
      const domain = localStorage.getItem('trade_domain') || 'AC Technician';
      
      const res = await fetch(`http://localhost:8000/submit_final_assessment`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          user_id: parseInt(user_id),
          trade: domain,
          answers: allAnswers
        })
      });
      const data = await res.json();
      
      if (data.passed) {
        localStorage.setItem('cert_id', data.cert_id);
        speakText("Congratulations! You scored 90 percent and passed.", 'en-US');
        navigate('/certificate');
      } else {
        speakText("You scored below 90 percent. Assessment is locked for 7 days.", 'en-US');
        navigate('/worker/dashboard');
      }
    } catch(e) {
      console.error(e);
      navigate('/worker/dashboard');
    } finally {
      setEvaluating(false);
    }
  };

  if (!lesson) return null;

  return (
    <div className="page-content" style={{paddingBottom: '120px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px'}}>
         <h2 className="title-large" style={{marginBottom: 0}}>Assessment</h2>
         <div className="badge">Question {currentQ + 1} / {lesson.questions.length}</div>
      </div>
      
      <div className="split-pane">
         <div className="split-left" style={{justifyContent: 'center'}}>
            <div style={{background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '48px', boxShadow: 'var(--shadow-md)', position: 'relative'}}>
               <button className="btn-speaker" style={{position: 'absolute', top: '24px', right: '24px'}} onClick={() => readQuestion(lesson.questions[currentQ].question)}>
                 <Volume2 size={24} />
               </button>
               <h3 style={{fontSize: '32px', lineHeight: '1.4', marginTop: '24px', color: 'var(--text-main)'}}>
                  {lesson.questions[currentQ].question}
               </h3>
               
               {transcript && (
                  <div style={{marginTop: '48px', padding: '24px', background: 'var(--bg)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--primary)'}}>
                     <p style={{color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px'}}>Your Answer</p>
                     <p style={{fontSize: '20px', fontWeight: '500'}}>{transcript}</p>
                  </div>
               )}
            </div>
         </div>
         
         <div className="split-right" style={{alignItems: 'center', justifyContent: 'center'}}>
            {evaluating ? (
               <div className="progress-ring playing" style={{width: '160px', height: '160px', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', border: '8px solid #e2e8f0', borderTop: '8px solid var(--primary)'}}></div>
            ) : (
               <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px'}}>
                  <button className={`btn-circle-giant ${recording ? 'recording' : ''}`} onClick={handleMicClick}>
                     <Mic size={64} />
                  </button>
                  <p style={{fontSize: '20px', color: 'var(--text-muted)', fontWeight: '500'}}>
                     {recording ? 'Listening...' : 'Click to Speak'}
                  </p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
