import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Briefcase, BookOpen, Building } from 'lucide-react';

export default function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="app-container content-center animate-fade-in" style={{ paddingBottom: '64px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '1200px', padding: '48px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '64px' }}>
          <div style={{ 
            background: 'var(--primary)', 
            padding: '16px', 
            borderRadius: 'var(--radius-lg)', 
            border: '3px solid #000000',
            boxShadow: '4px 4px 0px #000000'
          }}>
            <BookOpen size={48} color="#000000" />
          </div>
          <h1 className="title-large" style={{ fontSize: '64px', margin: 0, padding: 0 }}>SkillVoice</h1>
        </div>
        
        <h2 className="subtitle" style={{ marginBottom: '64px', textTransform: 'uppercase', fontWeight: '900', color: '#000000' }}>Select your portal to continue</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', width: '100%' }}>
          
          <div className="card-select" onClick={() => navigate('/worker')} style={{ flexDirection: 'column', gap: '16px', padding: '48px' }}>
            <div className="card-icon-wrapper" style={{ background: 'var(--secondary)', color: '#000000', border: '3px solid #000000', boxShadow: '3px 3px 0px #000000' }}>
              <UserCircle size={64} />
            </div>
            <h2 style={{ fontSize: '28px', color: '#000000', fontWeight: '900', marginTop: '16px', textTransform: 'uppercase' }}>Individual Learner</h2>
            <p style={{ fontSize: '16px', color: 'var(--text-muted)', textAlign: 'center', fontWeight: '700' }}>Login to start your training and earn your certificate.</p>
          </div>

          <div className="card-select" onClick={() => navigate('/business/login')} style={{ flexDirection: 'column', gap: '16px', padding: '48px' }}>
            <div className="card-icon-wrapper" style={{ background: 'var(--tertiary)', color: '#FFFFFF', border: '3px solid #000000', boxShadow: '3px 3px 0px #000000' }}>
              <Building size={64} />
            </div>
            <h2 style={{ fontSize: '28px', color: '#000000', fontWeight: '900', marginTop: '16px', textTransform: 'uppercase' }}>Company</h2>
            <p style={{ fontSize: '16px', color: 'var(--text-muted)', textAlign: 'center', fontWeight: '700' }}>Manage existing employees, assess gaps, and upskill them.</p>
          </div>
          
          <div className="card-select" onClick={() => navigate('/admin')} style={{ flexDirection: 'column', gap: '16px', padding: '48px' }}>
            <div className="card-icon-wrapper" style={{ background: 'var(--success)', color: '#000000', border: '3px solid #000000', boxShadow: '3px 3px 0px #000000' }}>
              <Briefcase size={64} />
            </div>
            <h2 style={{ fontSize: '28px', color: '#000000', fontWeight: '900', marginTop: '16px', textTransform: 'uppercase' }}>Employer</h2>
            <p style={{ fontSize: '16px', color: 'var(--text-muted)', textAlign: 'center', fontWeight: '700' }}>Hire talent from a verified pool of certified workers.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
