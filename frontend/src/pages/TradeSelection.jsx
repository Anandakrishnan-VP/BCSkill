import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, Wrench, Zap, Droplet, Car, PenTool, Factory } from 'lucide-react';
import { speakText } from '../voiceUtils';

export default function TradeSelection() {
  const [speaking, setSpeaking] = useState(false);
  const navigate = useNavigate();

  const handleSpeak = () => {
    setSpeaking(true);
    speakText("Select your trade or job.", 'en-US', () => setSpeaking(false));
  };

  const selectTrade = async (tradeName) => {
    localStorage.setItem('trade_domain', tradeName);
    speakText(tradeName, 'en-US');
    
    // Call mock modules endpoint to generate the roadmap
    try {
      await fetch('http://localhost:8000/modules/mock', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          user_id: parseInt(localStorage.getItem('user_id') || 1),
          domain: tradeName,
          language: localStorage.getItem('preferred_language') || 'en'
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
    { name: 'Driver', icon: <Car size={48} color="var(--primary)" /> },
    { name: 'Welder', icon: <PenTool size={48} color="var(--primary)" /> },
    { name: 'Factory Operator', icon: <Factory size={48} color="var(--primary)" /> },
  ];

  return (
    <div className="page-content">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px'}}>
         <div>
            <h2 className="title-large" style={{marginBottom: '8px'}}>Select Your Trade</h2>
            <p style={{color: 'var(--text-muted)', fontSize: '18px'}}>Choose the domain you want to upskill in today.</p>
         </div>
         <button className={`btn-speaker ${speaking ? 'speaking' : ''}`} onClick={handleSpeak}>
           <Volume2 size={24} />
         </button>
      </div>
      
      <div className="grid-cards">
        {trades.map(trade => (
          <div key={trade.name} className="card-select" onClick={() => selectTrade(trade.name)}>
            {trade.icon}
            <span className="card-text">{trade.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
