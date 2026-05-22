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
    <div className="app-container" style={{background: 'white'}}>
      <div className="split-left" style={{background: 'var(--warning)', color: 'white', padding: '64px', justifyContent: 'center', alignItems: 'center'}}>
        <Building size={120} style={{marginBottom: '32px'}} />
        <h1 style={{fontSize: '48px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center'}}>Company Portal</h1>
        <p style={{fontSize: '24px', opacity: 0.9, textAlign: 'center', maxWidth: '400px'}}>Assess and upskill your workforce to perfection.</p>
      </div>
      
      <div className="split-right" style={{padding: '64px', alignItems: 'center', position: 'relative'}}>
        <div style={{width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column'}}>
          <h2 className="title-large" style={{marginBottom: '48px'}}>Business Login</h2>
          
          <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
            <input 
              className="input-field" 
              placeholder="Company Name" 
              value={companyName} 
              onChange={e => setCompanyName(e.target.value)}
              style={{marginBottom: 0, textAlign: 'left', letterSpacing: 'normal'}}
            />
            <input 
              type="password"
              className="input-field" 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              style={{marginBottom: 0, textAlign: 'left', letterSpacing: 'normal'}}
            />
            <button type="submit" className="btn-primary" style={{background: 'var(--warning)', marginTop: '24px'}}>
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
