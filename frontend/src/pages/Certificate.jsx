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

  if (loading) return (
    <div className="page-content content-center" style={{ background: 'var(--bg-void)' }}>
      <div className="loader-container">
        <div className="neon-spinner" style={{ width: '64px', height: '64px', borderWidth: '6px' }}></div>
      </div>
    </div>
  );

  if (!certData) return null;

  return (
    <div className="page-content content-center" style={{ backgroundColor: 'var(--bg-void)', padding: '48px' }}>
      <div style={{
        background: '#FFFFFF', 
        color: '#000000', 
        padding: '64px', 
        borderRadius: 'var(--radius-lg)', 
        border: '4px solid #000000',
        boxShadow: '10px 10px 0px #000000', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        width: '100%', 
        maxWidth: '800px', 
        position: 'relative'
      }}>
         
         <div style={{
           background: 'var(--tertiary)',
           borderRadius: 'var(--radius-md)',
           border: '3px solid #000000',
           padding: '16px',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           marginBottom: '24px',
           boxShadow: '3px 3px 0px #000000'
         }}>
           <Award size={64} color="#FFFFFF" />
         </div>
         
         <h1 style={{ fontSize: '42px', fontWeight: '900', marginBottom: '8px', textAlign: 'center', fontFamily: 'Archivo', textTransform: 'uppercase' }}>
           {getLangText(lang, 'certificateOfCompletion')}
         </h1>
         <p style={{ fontSize: '24px', marginBottom: '32px', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase' }}>
           {certData.trade} {getLangText(lang, 'certification')}
         </p>
         
         <div style={{
           background: 'var(--bg-void)', 
           width: '100%', 
           padding: '24px', 
           borderRadius: 'var(--radius-md)', 
           border: '3px solid #000000',
           boxShadow: '4px 4px 0px #000000',
           marginBottom: '48px', 
           textAlign: 'left'
         }}>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '18px', fontWeight: '800', textTransform: 'uppercase' }}>
             <div><strong style={{ color: 'var(--text-muted)' }}>{getLangText(lang, 'name')}:</strong> {certData.name}</div>
             <div><strong style={{ color: 'var(--text-muted)' }}>{getLangText(lang, 'dateCompleted')}:</strong> {new Date(certData.date_certified).toLocaleDateString()}</div>
             <div><strong style={{ color: 'var(--text-muted)' }}>{getLangText(lang, 'age')}:</strong> {certData.age}</div>
             <div><strong style={{ color: 'var(--text-muted)' }}>{getLangText(lang, 'sex')}:</strong> {certData.gender}</div>
             <div><strong style={{ color: 'var(--text-muted)' }}>{getLangText(lang, 'score')}:</strong> {certData.score}%</div>
             <div><strong style={{ color: 'var(--text-muted)' }}>{getLangText(lang, 'language')}:</strong> {certData.language === 'en' ? 'English' : certData.language === 'hi' ? 'Hindi' : 'Malayalam'}</div>
           </div>
         </div>
         
         <div style={{
           background: '#FFFFFF', 
           padding: '32px', 
           borderRadius: 'var(--radius-md)', 
           border: '3px solid #000000',
           boxShadow: '4px 4px 0px #000000',
           display: 'flex', 
           flexDirection: 'column', 
           alignItems: 'center'
         }}>
           <QRCodeSVG value={verifyUrl} size={150} />
           <p style={{ color: 'var(--text-muted)', marginTop: '16px', fontSize: '14px', fontWeight: '900', textTransform: 'uppercase' }}>{getLangText(lang, 'scanToVerify')}</p>
           <p style={{ color: '#000000', fontWeight: '900', marginTop: '8px', letterSpacing: '2px' }}>{certData.id}</p>
         </div>
      </div>
    </div>
  );
}
