import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, CheckCircle, Home, X, Award, LogOut } from 'lucide-react';
import { getLangText } from '../translations';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const lang = localStorage.getItem('preferred_language') || 'en';

  const menu = [
    { name: getLangText(lang, 'dashboard'), icon: <Home size={24} />, path: '/worker/dashboard', internalId: 'Dashboard' },
    { name: getLangText(lang, 'syllabus'), icon: <BookOpen size={24} />, path: '/syllabus', internalId: 'Syllabus' },
    { name: getLangText(lang, 'training'), icon: <BookOpen size={24} />, path: '/training', internalId: 'Training' },
    { name: getLangText(lang, 'assessment'), icon: <CheckCircle size={24} />, path: '/assessment', internalId: 'Assessment' },
    { name: getLangText(lang, 'certificate'), icon: <Award size={24} />, path: '/certificate', internalId: 'Certificate' }
  ];

  return (
    <div className="sidebar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          background: 'var(--tertiary)', 
          border: '2px solid #000000', 
          borderRadius: 'var(--radius-md)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          color: 'white', 
          fontWeight: '900',
          boxShadow: '2px 2px 0px #000000'
        }}>
          SV
        </div>
        <h2 style={{ color: '#000000', fontSize: '24px', fontFamily: 'Archivo', fontWeight: '900', textTransform: 'uppercase' }}>SkillVoice</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {menu.map((item, idx) => {
          const isActive = location.pathname.includes(item.path);
          return (
            <div 
              key={idx}
              onClick={() => {
                if (item.internalId === 'Certificate') {
                  const certId = localStorage.getItem('cert_id');
                  if (!certId) {
                    showToast("Certificate can only be issued when the assessment is completed with a score of 90% or above.");
                    return;
                  }
                }
                if (item.internalId === 'Assessment') {
                  const allCompleted = localStorage.getItem('all_modules_completed');
                  if (!allCompleted) {
                    showToast("Assessment will unlock only after you complete all training modules.");
                    return;
                  }
                  navigate(item.path);
                } else {
                  navigate(item.path);
                }
              }}
              style={{
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px', 
                padding: '14px 20px', 
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                background: isActive ? 'var(--primary)' : 'transparent',
                color: '#000000',
                border: isActive ? '3px solid #000000' : '3px solid transparent',
                boxShadow: isActive ? '3px 3px 0px #000000' : 'none',
                fontWeight: '900',
                textTransform: 'uppercase',
                transition: 'all 0.1s ease'
              }}
            >
              {item.icon}
              <span style={{ fontSize: '16px' }}>{item.name}</span>
            </div>
          )
        })}
        
        <div style={{
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px', 
          padding: '14px 20px', 
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer', 
          color: '#000000', 
          border: '3px solid transparent',
          fontWeight: '900',
          textTransform: 'uppercase',
          transition: 'all 0.1s ease',
          marginTop: '20px'
        }} 
        onClick={() => {
          localStorage.clear();
          navigate('/');
        }}
        onMouseOver={e => {
          e.currentTarget.style.background = 'var(--danger)';
          e.currentTarget.style.borderColor = '#000000';
          e.currentTarget.style.boxShadow = '3px 3px 0px #000000';
        }}
        onMouseOut={e => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.borderColor = 'transparent';
          e.currentTarget.style.boxShadow = 'none';
        }}
        >
          <LogOut size={24} />
          <span style={{ fontSize: '16px' }}>{getLangText(lang, 'logout')}</span>
        </div>
      </div>

      {/* Clean Centered Modal Popup */}
      {toastMsg && (
        <div className="animate-fade-in" style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          <div style={{
            background: '#FFFFFF',
            border: '4px solid #000000',
            boxShadow: '8px 8px 0px #000000',
            borderRadius: 'var(--radius-lg)',
            padding: '32px',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{
              background: 'var(--danger)', 
              width: '64px', 
              height: '64px', 
              borderRadius: 'var(--radius-md)', 
              border: '3px solid #000000',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 24px',
              boxShadow: '3px 3px 0px #000000'
            }}>
              <X size={32} color="#FFFFFF" />
            </div>
            
            <h3 style={{ color: '#000000', fontSize: '24px', marginBottom: '16px', fontWeight: '900', textTransform: 'uppercase' }}>{getLangText(lang, 'accessDenied')}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.5', marginBottom: '32px', fontWeight: '700' }}>
              {toastMsg}
            </p>
            
            <button 
              className="btn-primary" 
              style={{ width: '100%', padding: '16px', fontSize: '18px' }} 
              onClick={() => setToastMsg(null)}
            >
              {getLangText(lang, 'understood')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
