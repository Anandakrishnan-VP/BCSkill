import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building } from 'lucide-react';

export default function CompanyLogin() {
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!companyName || !password) {
      alert("Please enter company name and password");
      return;
    }
    try {
      const res = await fetch('http://localhost:8000/business/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({company_name: companyName, password: password})
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.detail || "Login failed");
        return;
      }
      localStorage.setItem('company_id', data.company_id);
      localStorage.setItem('company_name', companyName);
      navigate('/business/dashboard');
    } catch (e) {
      console.error(e);
      alert("Failed to connect to server.");
    }
  };

  return (
    <div className="app-container split-pane" style={{padding: 0, height: '100vh', overflow: 'hidden', background: 'var(--bg-void)'}}>
      <div className="split-left" style={{
        background: 'radial-gradient(circle at top left, var(--secondary), var(--bg-void))',
        borderRight: '1px solid var(--glass-border)',
        color: 'white',
        padding: '64px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}>
        {/* Glow backdrop */}
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(176, 38, 255, 0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
          top: '20%',
          left: '20%',
          zIndex: 1
        }}></div>

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--secondary), var(--tertiary))',
            padding: '24px',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 0 40px rgba(176, 38, 255, 0.25)',
            marginBottom: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Building size={72} color="white" style={{ strokeWidth: 2 }} />
          </div>
          
          <h1 style={{
            fontFamily: 'Outfit',
            fontSize: '56px',
            fontWeight: '800',
            marginBottom: '16px',
            letterSpacing: '-1.5px',
            background: 'linear-gradient(90deg, #ffffff, #c7d2fe)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center'
          }}>
            Company Portal
          </h1>
          
          <p style={{
            fontSize: '22px',
            color: 'var(--text-muted)',
            textAlign: 'center',
            maxWidth: '440px',
            lineHeight: 1.6,
            fontWeight: '500'
          }}>
            Enterprise-grade staff upskilling, safety verification, and live diagnostics management.
          </p>
        </div>
      </div>
      
      <div className="split-right content-center" style={{padding: '64px', position: 'relative', overflowY: 'auto'}}>
        <div style={{width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column'}}>
          <h2 className="title-large" style={{marginBottom: '48px', fontSize: '36px', textAlign: 'center'}}>Business Login</h2>
          
          <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
            <input 
              className="input-field" 
              placeholder="Company Name" 
              value={companyName} 
              onChange={e => setCompanyName(e.target.value)}
              style={{
                marginBottom: 0, 
                textAlign: 'left', 
                letterSpacing: 'normal',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                color: 'white'
              }}
            />
            <input 
              type="password"
              className="input-field" 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              style={{
                marginBottom: 0, 
                textAlign: 'left', 
                letterSpacing: 'normal',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                color: 'white'
              }}
            />
            <button type="submit" className="btn-primary" style={{
              background: 'linear-gradient(135deg, var(--secondary), var(--tertiary))',
              boxShadow: '0 8px 24px -8px rgba(176, 38, 255, 0.5)',
              marginTop: '24px'
            }}>
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
