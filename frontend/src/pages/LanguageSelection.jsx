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
    <div className="app-container content-center animate-fade-in" style={{ minHeight: '100vh', padding: '24px' }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '800px', 
        background: '#FFFFFF', 
        border: '4px solid #000000', 
        boxShadow: 'var(--shadow-lg)', 
        borderRadius: 'var(--radius-lg)',
        padding: '48px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 className="title-large" style={{ fontSize: '42px', marginBottom: '8px' }}>Select Language</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '18px', fontWeight: '700', textTransform: 'uppercase' }}>Choose your preferred learning language.</p>
        </div>
        
        <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="card-select" onClick={() => selectLanguage('en', 'English')} style={{ padding: '32px' }}>
            <span className="card-text" style={{ fontSize: '28px', textTransform: 'uppercase' }}>English</span>
          </div>
          
          <div className="card-select" onClick={() => selectLanguage('hi', 'Hindi')} style={{ padding: '32px' }}>
            <span className="card-text" style={{ fontSize: '28px', textTransform: 'uppercase' }}>हिंदी</span>
          </div>
          
          <div className="card-select" onClick={() => selectLanguage('ml', 'Malayalam')} style={{ padding: '32px' }}>
            <span className="card-text" style={{ fontSize: '28px', textTransform: 'uppercase' }}>മലയാളം</span>
          </div>
        </div>
      </div>
    </div>
  );
}
