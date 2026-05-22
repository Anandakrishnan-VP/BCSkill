import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Briefcase, BookOpen, Building } from 'lucide-react';

export default function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="app-container content-center animate-fade-in" style={{paddingBottom: '64px'}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '1200px', padding: '48px'}}>
        
        <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '64px'}}>
          <div style={{background: 'linear-gradient(135deg, var(--primary), var(--secondary))', padding: '16px', borderRadius: 'var(--radius-lg)', boxShadow: '0 0 30px rgba(0, 242, 255, 0.4)'}}>
            <BookOpen size={48} color="white" />
          </div>
          <h1 className="title-large" style={{fontSize: '64px', margin: 0, padding: 0}}>SkillVoice</h1>
        </div>
        
        <h2 className="subtitle" style={{marginBottom: '64px'}}>Select your portal to continue</h2>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', width: '100%'}}>
          
          <div className="card-select" onClick={() => navigate('/worker')} style={{flexDirection: 'column', gap: '16px', padding: '48px'}}>
            <div className="card-icon-wrapper">
              <UserCircle size={64} />
            </div>
            <h2 style={{fontSize: '28px', color: 'white', fontWeight: '600', marginTop: '16px'}}>Individual Learner</h2>
            <p style={{fontSize: '16px', color: 'var(--text-muted)', textAlign: 'center'}}>Login to start your training and earn your certificate.</p>
          </div>

          <div className="card-select" onClick={() => navigate('/business/login')} style={{flexDirection: 'column', gap: '16px', padding: '48px'}}>
            <div className="card-icon-wrapper" style={{background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', boxShadow: 'inset 0 0 20px rgba(245, 158, 11, 0.2)'}}>
              <Building size={64} />
            </div>
            <h2 style={{fontSize: '28px', color: 'white', fontWeight: '600', marginTop: '16px'}}>Company</h2>
            <p style={{fontSize: '16px', color: 'var(--text-muted)', textAlign: 'center'}}>Manage existing employees, assess gaps, and upskill them.</p>
          </div>
          
          <div className="card-select" onClick={() => navigate('/admin')} style={{flexDirection: 'column', gap: '16px', padding: '48px'}}>
            <div className="card-icon-wrapper" style={{background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', boxShadow: 'inset 0 0 20px rgba(16, 185, 129, 0.2)'}}>
              <Briefcase size={64} />
            </div>
            <h2 style={{fontSize: '28px', color: 'white', fontWeight: '600', marginTop: '16px'}}>Employer</h2>
            <p style={{fontSize: '16px', color: 'var(--text-muted)', textAlign: 'center'}}>Hire talent from a verified pool of certified workers.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
