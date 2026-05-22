import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { speakText, stopSpeaking } from '../voiceUtils';

export default function TrainingSession() {
  const [lesson, setLesson] = useState(null);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        // Check if there is a custom lesson from the diagnostic
        const customLessonStr = localStorage.getItem('custom_lesson');
        if (customLessonStr) {
          const customLesson = JSON.parse(customLessonStr);
          customLesson.lesson_id = "lesson_custom_123";
          setLesson(customLesson);
          localStorage.setItem('current_lesson', customLessonStr);
          setLoading(false);
          // Remove it so it doesn't loop next time they take a normal lesson
          localStorage.removeItem('custom_lesson');
          return;
        }

        const domain = localStorage.getItem('trade_domain') || 'AC Technician';
        const lang = localStorage.getItem('preferred_language') || 'en';
        const res = await fetch('http://localhost:8000/generate_lesson', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({domain, language: lang})
        });
        const data = await res.json();
        setLesson(data.lesson);
        localStorage.setItem('current_lesson', JSON.stringify(data.lesson));
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    };
    fetchLesson();
    return () => {
      stopSpeaking();
    };
  }, []);

  const togglePlay = () => {
    if (!lesson) return;
    
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      playChunk(currentChunk);
      setIsPlaying(true);
    }
  };

  const playChunk = (index) => {
    if (!lesson || index >= lesson.chunks.length) {
      setIsPlaying(false);
      return;
    }
    const text = lesson.chunks[index];
    const langCode = localStorage.getItem('preferred_language') === 'hi' ? 'hi-IN' : 'en-US';
    
    speakText(text, langCode, () => {
      if (index < lesson.chunks.length - 1) {
        setCurrentChunk(index + 1);
        playChunk(index + 1);
      } else {
        setIsPlaying(false);
      }
    });
  };

  const skip = (direction) => {
    stopSpeaking();
    const newIdx = Math.max(0, Math.min(lesson.chunks.length - 1, currentChunk + direction));
    setCurrentChunk(newIdx);
    if (isPlaying) {
      playChunk(newIdx);
    }
  };

  if (loading) {
    return <div className="page-content content-center">
      <div className="progress-ring playing" style={{width: '100px', height: '100px', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', border: '4px solid #e2e8f0', borderTop: '4px solid var(--primary)'}}></div>
      <p style={{fontSize: '20px', fontWeight: '600', marginTop: '16px'}}>Generating Lesson...</p>
    </div>;
  }

  const progress = ((currentChunk + 1) / lesson.chunks.length) * 100;

  return (
    <div className="page-content" style={{paddingBottom: '120px'}}>
      <h2 className="title-large" style={{marginBottom: '16px'}}>{lesson.title}</h2>
      
      <div className="split-pane">
        <div className="split-left" style={{background: 'var(--surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: '48px', alignItems: 'center'}}>
           <div style={{width: '240px', height: '240px', background: 'var(--bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isPlaying ? '0 0 0 20px rgba(37, 99, 235, 0.2)' : 'none', transition: 'all 0.3s'}}>
              <div style={{width: '180px', height: '180px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                 <span style={{color: 'white', fontSize: '64px'}}>🎧</span>
              </div>
           </div>
        </div>
        
        <div className="split-right" style={{justifyContent: 'flex-start', paddingTop: '24px'}}>
          <h3 style={{fontSize: '24px', marginBottom: '24px', color: 'var(--text-muted)'}}>Lesson Script</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            {lesson.chunks.map((chunk, idx) => (
               <div key={idx} style={{
                 padding: '24px', 
                 background: idx === currentChunk ? 'var(--surface)' : 'transparent',
                 border: idx === currentChunk ? '2px solid var(--primary)' : '1px solid var(--border)',
                 borderRadius: 'var(--radius-md)',
                 fontSize: '18px',
                 color: idx === currentChunk ? 'var(--text-main)' : 'var(--text-muted)',
                 transition: 'all 0.3s'
               }}>
                  {chunk}
               </div>
            ))}
          </div>
          
          {currentChunk === lesson.chunks.length - 1 && !isPlaying && (
            <button className="btn-primary" style={{marginTop: '32px', height: '64px'}} onClick={() => navigate('/syllabus')}>
              Finish Lesson ✓
            </button>
          )}
        </div>
      </div>

      <div className="control-bar">
        <div style={{display: 'flex', alignItems: 'center', gap: '24px'}}>
          <button className="btn-icon" onClick={() => skip(-1)}>
            <SkipBack size={32} />
          </button>
          
          <button style={{width: '56px', height: '56px', borderRadius: '50%', background: 'var(--primary)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-md)'}} onClick={togglePlay}>
            {isPlaying ? <Pause size={28} /> : <Play size={28} style={{marginLeft: '4px'}} />}
          </button>
          
          <button className="btn-icon" onClick={() => skip(1)}>
            <SkipForward size={32} />
          </button>
        </div>
        
        <div className="player-progress-container">
          <span style={{fontWeight: '500'}}>{currentChunk + 1} / {lesson.chunks.length}</span>
          <div className="player-progress-bar">
            <div className="player-progress-fill" style={{width: `${progress}%`}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
