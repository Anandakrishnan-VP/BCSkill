import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Briefcase, BookOpen, Building } from 'lucide-react';

export default function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="app-container" style={{background: 'var(--bg)', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '1200px', padding: '48px'}}>
        
        <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '64px'}}>
          <BookOpen size={64} color="var(--primary)" />
          <h1 style={{fontSize: '64px', fontWeight: 'bold', color: 'var(--text-main)'}}>SkillVoice</h1>
        </div>
        
        <h2 style={{fontSize: '32px', color: 'var(--text-muted)', marginBottom: '48px'}}>Select your portal to continue</h2>
        
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px', width: '100%'}}>
          <div 
            onClick={() => navigate('/worker')}
            style={{
              background: 'white', 
              padding: '48px', 
              borderRadius: 'var(--radius-lg)', 
              boxShadow: 'var(--shadow-md)', 
              cursor: 'pointer', 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              border: '2px solid transparent',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseOut={e => e.currentTarget.style.borderColor = 'transparent'}
          >
            <UserCircle size={80} color="var(--primary)" style={{marginBottom: '24px'}} />
            <h2 style={{fontSize: '28px', marginBottom: '16px', textAlign: 'center'}}>Individual Learner</h2>
            <p style={{fontSize: '16px', color: 'var(--text-muted)', textAlign: 'center'}}>Login to start your training and earn your certificate.</p>
          </div>

          <div 
            onClick={() => navigate('/business/login')}
            style={{
              background: 'white', 
              padding: '48px', 
              borderRadius: 'var(--radius-lg)', 
              boxShadow: 'var(--shadow-md)', 
              cursor: 'pointer', 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              border: '2px solid transparent',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.borderColor = 'var(--warning)'}
            onMouseOut={e => e.currentTarget.style.borderColor = 'transparent'}
          >
            <Building size={80} color="var(--warning)" style={{marginBottom: '24px'}} />
            <h2 style={{fontSize: '28px', marginBottom: '16px', textAlign: 'center'}}>Company</h2>
            <p style={{fontSize: '16px', color: 'var(--text-muted)', textAlign: 'center'}}>Manage existing employees, assess gaps, and upskill them.</p>
          </div>
          
          <div 
            onClick={() => navigate('/admin')}
            style={{
              background: 'white', 
              padding: '48px', 
              borderRadius: 'var(--radius-lg)', 
              boxShadow: 'var(--shadow-md)', 
              cursor: 'pointer', 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              border: '2px solid transparent',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.borderColor = 'var(--success)'}
            onMouseOut={e => e.currentTarget.style.borderColor = 'transparent'}
          >
            <Briefcase size={80} color="var(--success)" style={{marginBottom: '24px'}} />
            <h2 style={{fontSize: '28px', marginBottom: '16px', textAlign: 'center'}}>Employer</h2>
            <p style={{fontSize: '16px', color: 'var(--text-muted)', textAlign: 'center'}}>Hire talent from a verified pool of certified workers.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
