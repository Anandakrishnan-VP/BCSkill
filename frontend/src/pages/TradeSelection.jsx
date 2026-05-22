import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Zap, Droplet, Car, PenTool, Factory } from 'lucide-react';
import { speakText } from '../voiceUtils';

export default function TradeSelection() {
  const navigate = useNavigate();

  const selectTrade = async (tradeName) => {
    localStorage.setItem('preferred_language', 'en');
    localStorage.setItem('trade_domain', tradeName);
    
    speakText(tradeName, 'en-US');
    
    try {
      await fetch('http://localhost:8000/modules/mock', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          user_id: parseInt(localStorage.getItem('user_id') || 1),
          domain: tradeName,
          language: 'en'
        })
      });
    } catch (e) {
      console.error("Mock syllabus gen failed", e);
    }
    
    setTimeout(() => {
      navigate('/worker/dashboard');
    }, 1000);
  };

  const trades = [
    { name: 'AC Technician', icon: <Wrench size={48} color="var(--primary)" /> },
    { name: 'Electrician', icon: <Zap size={48} color="var(--primary)" /> },
    { name: 'Plumber', icon: <Droplet size={48} color="var(--primary)" /> },
    { name: 'Welder', icon: <PenTool size={48} color="var(--primary)" /> },
    { name: 'Factory Operator', icon: <Factory size={48} color="var(--primary)" /> },
  ];

  return (
    <div className="page-content animate-fade-in">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px'}}>
         <div>
            <h2 className="title-large" style={{marginBottom: '8px'}}>Select Your Trade</h2>
            <p style={{color: 'var(--text-muted)', fontSize: '18px'}}>Choose the domain you want to upskill in today.</p>
         </div>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: '64px'}}>
        <div className="grid-cards">
          {trades.map((t) => (
            <div key={t.name} className="card" onClick={() => selectTrade(t.name)} style={{cursor: 'pointer'}}>
              <div style={{marginBottom: '24px'}}>{t.icon}</div>
              <h3 style={{fontSize: '24px', fontWeight: '600'}}>{t.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}