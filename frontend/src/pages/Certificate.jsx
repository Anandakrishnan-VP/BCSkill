import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Volume2, Award } from 'lucide-react';
import { speakText } from '../voiceUtils';

export default function Certificate() {
  const [speaking, setSpeaking] = useState(false);
  const certId = localStorage.getItem('cert_id') || 'DEMO-123';
  const domain = localStorage.getItem('trade_domain') || 'AC Technician';
  
  const verifyUrl = `http://localhost:5173/verify/${certId}`;

  const handleSpeak = () => {
    setSpeaking(true);
    speakText("Congratulations! You have passed the assessment. Here is your certificate.", 'en-US', () => setSpeaking(false));
  };

  useEffect(() => {
    handleSpeak();
  }, []);

  return (
    <div className="page-content content-center" style={{backgroundColor: 'var(--bg)'}}>
      <div style={{background: 'var(--primary)', color: 'white', padding: '64px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '800px', position: 'relative'}}>
         <button className={`btn-speaker ${speaking ? 'speaking' : ''}`} style={{position: 'absolute', top: '24px', right: '24px', background: 'white'}} onClick={handleSpeak}>
           <Volume2 size={24} />
         </button>
         
         <Award size={100} color="var(--success)" style={{marginBottom: '24px', background: 'white', borderRadius: '50%', padding: '16px'}} />
         <h1 style={{fontSize: '48px', fontWeight: 'bold', marginBottom: '8px'}}>CERTIFICATE OF COMPLETION</h1>
         <p style={{fontSize: '24px', marginBottom: '48px', opacity: 0.9}}>{domain} Certification</p>
         
         <div style={{background: 'white', padding: '32px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 'var(--shadow-sm)'}}>
           <QRCodeSVG value={verifyUrl} size={200} />
           <p style={{color: 'var(--text-muted)', marginTop: '16px', fontSize: '14px'}}>Scan to verify</p>
           <p style={{color: 'var(--text-main)', fontWeight: 'bold', marginTop: '8px', letterSpacing: '2px'}}>{certId}</p>
         </div>
      </div>
    </div>
  );
}
