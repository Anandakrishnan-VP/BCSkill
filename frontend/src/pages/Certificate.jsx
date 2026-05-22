import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Award } from 'lucide-react';
import { speakText } from '../voiceUtils';
import { getLangText } from '../translations';

export default function Certificate() {
  const [speaking, setSpeaking] = useState(false);
  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(true);
  const certId = localStorage.getItem('cert_id');
  const lang = localStorage.getItem('preferred_language') || 'en';
  const navigate = useNavigate();
  
  const verifyUrl = `http://localhost:5173/verify/${certId}`;

  const handleSpeak = () => {
    setSpeaking(true);
    speakText("Congratulations! You have passed the assessment. Here is your certificate.", 'en-US', () => setSpeaking(false));
  };

  useEffect(() => {
    if (!certId) {
      navigate('/worker/dashboard');
      return;
    }
    const fetchCert = async () => {
      try {
        const res = await fetch(`http://localhost:8000/verify/${certId}`);
        const data = await res.json();
        if (data.status === 'success') {
          setCertData(data.certificate);
          handleSpeak();
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCert();
  }, [certId, navigate]);

  if (loading) return <div className="page-content content-center"><div className="neon-spinner"></div></div>;
  if (!certData) return null;

  return (
    <div className="page-content content-center" style={{backgroundColor: 'var(--bg)'}}>
      <div style={{background: 'var(--primary)', color: 'white', padding: '64px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '800px', position: 'relative'}}>
         
         <Award size={100} color="var(--success)" style={{marginBottom: '24px', background: 'white', borderRadius: '50%', padding: '16px'}} />
         <h1 style={{fontSize: '48px', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center'}}>{getLangText(lang, 'certificateOfCompletion')}</h1>
         <p style={{fontSize: '24px', marginBottom: '32px', opacity: 0.9}}>{certData.trade} {getLangText(lang, 'certification')}</p>
         
         <div style={{background: 'rgba(255,255,255,0.1)', width: '100%', padding: '24px', borderRadius: 'var(--radius-md)', marginBottom: '48px', textAlign: 'left'}}>
           <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '18px'}}>
             <div><strong>{getLangText(lang, 'name')}:</strong> {certData.name}</div>
             <div><strong>{getLangText(lang, 'dateCompleted')}:</strong> {new Date(certData.date_certified).toLocaleDateString()}</div>
             <div><strong>{getLangText(lang, 'age')}:</strong> {certData.age}</div>
             <div><strong>{getLangText(lang, 'sex')}:</strong> {certData.gender}</div>
             <div><strong>{getLangText(lang, 'score')}:</strong> {certData.score}%</div>
             <div><strong>{getLangText(lang, 'language')}:</strong> {certData.language === 'en' ? 'English' : certData.language === 'hi' ? 'Hindi' : 'Malayalam'}</div>
           </div>
         </div>
         
         <div style={{background: 'white', padding: '32px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 'var(--shadow-sm)'}}>
           <QRCodeSVG value={verifyUrl} size={150} />
           <p style={{color: 'var(--text-muted)', marginTop: '16px', fontSize: '14px'}}>{getLangText(lang, 'scanToVerify')}</p>
           <p style={{color: 'var(--text-main)', fontWeight: 'bold', marginTop: '8px', letterSpacing: '2px'}}>{certData.id}</p>
         </div>
      </div>
    </div>
  );
}
