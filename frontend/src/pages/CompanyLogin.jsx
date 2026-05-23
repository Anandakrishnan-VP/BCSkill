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
    <div className="app-container split-pane" style={{ padding: 0, height: '100vh', overflow: 'hidden' }}>
      <div className="split-left" style={{
        background: 'var(--primary)',
        borderRight: '4px solid #000000',
        color: '#000000',
        padding: '64px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}>
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            background: '#FFFFFF',
            padding: '24px',
            borderRadius: 'var(--radius-xl)',
            border: '3px solid #000000',
            boxShadow: '6px 6px 0px #000000',
            marginBottom: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Building size={72} color="#000000" style={{ strokeWidth: 2.2 }} />
          </div>
          
          <h1 style={{
            fontFamily: 'Archivo',
            fontSize: '56px',
            fontWeight: '900',
            marginBottom: '16px',
            letterSpacing: '-1.5px',
            color: '#000000',
            textAlign: 'center',
            textTransform: 'uppercase'
          }}>
            Company Portal
          </h1>
          
          <p style={{
            fontSize: '22px',
            color: '#000000',
            textAlign: 'center',
            maxWidth: '440px',
            lineHeight: 1.6,
            fontWeight: '800'
          }}>
            Enterprise-grade staff upskilling, safety verification, and live diagnostics management.
          </p>
        </div>
      </div>
      
      <div className="split-right content-center" style={{ padding: '64px', position: 'relative', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column' }}>
          <h2 className="title-large" style={{ marginBottom: '48px', fontSize: '36px', textAlign: 'center' }}>Business Login</h2>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <input 
              className="input-field" 
              placeholder="Company Name" 
              value={companyName} 
              onChange={e => setCompanyName(e.target.value)}
            />
            <input 
              type="password"
              className="input-field" 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
            />
            <button type="submit" className="btn-primary" style={{ marginTop: '24px', height: '64px', fontSize: '20px' }}>
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
