import React from 'react';
import { useNavigate } from 'react-router-dom';
import { speakText } from '../voiceUtils';

export default function LanguageSelection() {
  const navigate = useNavigate();

  const selectLanguage = (langCode, langName) => {
    localStorage.setItem('preferred_language', langCode);
    speakText(`Selected ${langName}`, langCode === 'hi' ? 'hi-IN' : (langCode === 'ml' ? 'ml-IN' : 'en-US'));
    setTimeout(() => {
      navigate('/trade');
    }, 1500);
  };

  return (
    <div className="page-content">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px'}}>
         <div>
            <h2 className="title-large" style={{marginBottom: '8px'}}>Select Language</h2>
            <p style={{color: 'var(--text-muted)', fontSize: '18px'}}>Choose your preferred learning language.</p>
         </div>
      </div>
      
      <div className="grid-cards">
        <div className="card-select" onClick={() => selectLanguage('en', 'English')}>
          <span className="card-text" style={{fontSize: '32px'}}>English</span>
        </div>
        
        <div className="card-select" onClick={() => selectLanguage('hi', 'Hindi')}>
          <span className="card-text" style={{fontSize: '32px'}}>हिंदी</span>
        </div>
        
        <div className="card-select" onClick={() => selectLanguage('ml', 'Malayalam')}>
          <span className="card-text" style={{fontSize: '32px'}}>മലയാളം</span>
        </div>
      </div>
    </div>
  );
}
