import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, User, CheckCircle, Home } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: 'Dashboard', icon: <Home size={24} />, path: '/trade' },
    { name: 'Training', icon: <BookOpen size={24} />, path: '/training' },
    { name: 'Assessment', icon: <CheckCircle size={24} />, path: '/assessment' },
    { name: 'Certificate', icon: <User size={24} />, path: '/certificate' }
  ];

  return (
    <div className="sidebar">
      <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px'}}>
        <div style={{width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold'}}>SV</div>
        <h2 style={{color: 'var(--primary)', fontSize: '24px'}}>SkillVoice</h2>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
        {menu.map(item => {
          const active = location.pathname.includes(item.path);
          return (
            <div 
              key={item.name}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px', 
                padding: '16px', 
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                background: active ? 'var(--bg)' : 'transparent',
                color: active ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: active ? '600' : '500',
                transition: 'all 0.2s'
              }}
            >
              {item.icon}
              <span style={{fontSize: '18px'}}>{item.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  );
}
