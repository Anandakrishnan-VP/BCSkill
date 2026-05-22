import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, User, CheckCircle, Home, X, Award, LogOut } from 'lucide-react';
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
      <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px'}}>
        <div style={{width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold'}}>SV</div>
        <h2 style={{color: 'var(--primary)', fontSize: '24px'}}>SkillVoice</h2>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
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
                padding: '16px 24px', 
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                background: isActive ? 'linear-gradient(90deg, rgba(0, 242, 255, 0.2), transparent)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                borderLeft: isActive ? '4px solid var(--primary)' : '4px solid transparent',
                fontWeight: isActive ? '600' : '500',
                transition: 'all 0.3s'
              }}
            >
              {item.icon}
              <span style={{fontSize: '18px'}}>{item.name}</span>
            </div>
          )
        })}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 24px', 
          cursor: 'pointer', color: 'var(--error)', transition: 'all 0.3s'
        }} onClick={() => {
          localStorage.clear();
          navigate('/');
        }}>
          <LogOut size={24} />
          <span style={{fontSize: '18px', fontWeight: 'bold'}}>{getLangText(lang, 'logout')}</span>
        </div>
      </div>

      {/* Clean Centered Modal Popup */}
      {toastMsg && (
        <div className="animate-fade-in" style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          <div style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--primary)',
            boxShadow: '0 20px 40px -10px rgba(0, 242, 255, 0.2)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{background: 'rgba(255, 50, 50, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'}}>
              <X size={32} color="var(--error)" />
            </div>
            
            <h3 style={{color: 'white', fontSize: '24px', marginBottom: '16px', fontWeight: 'bold'}}>{getLangText(lang, 'accessDenied')}</h3>
            <p style={{color: 'var(--text-muted)', fontSize: '18px', lineHeight: '1.5', marginBottom: '32px'}}>
              {toastMsg}
            </p>
            
            <button 
              className="btn-primary" 
              style={{width: '100%', padding: '16px', fontSize: '18px'}} 
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
