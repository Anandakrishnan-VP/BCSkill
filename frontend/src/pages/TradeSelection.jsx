import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Zap, Droplet, PenTool, Factory, BookOpen } from 'lucide-react';
import { speakText } from '../voiceUtils';

export default function TradeSelection() {
  const navigate = useNavigate();
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchCoursesList = async () => {
      try {
        const res = await fetch('http://localhost:8000/courses');
        const data = await res.json();
        if (active && data.status === 'success') {
          const mapped = data.courses.map(name => {
            let icon = <BookOpen size={40} />;
            const lowerName = name.toLowerCase();
            if (lowerName.includes('ac ') || lowerName.includes('air conditioning') || lowerName.includes('hvac')) {
              icon = <Wrench size={40} />;
            } else if (lowerName.includes('electr')) {
              icon = <Zap size={40} />;
            } else if (lowerName.includes('plumb')) {
              icon = <Droplet size={40} />;
            } else if (lowerName.includes('weld')) {
              icon = <PenTool size={40} />;
            } else if (lowerName.includes('factory') || lowerName.includes('operator') || lowerName.includes('machin')) {
              icon = <Factory size={40} />;
            }
            return { name, icon };
          });
          setTrades(mapped);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchCoursesList();
    return () => { active = false; };
  }, []);

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
      console.error("Syllabus initial check failed", e);
    }
    
    setTimeout(() => {
      navigate('/worker/dashboard');
    }, 1000);
  };

  if (loading) return (
    <div className="app-container content-center animate-fade-in" style={{ minHeight: '100vh', padding: '24px' }}>
      <div className="loader-container">
        <div className="neon-spinner" style={{ width: '64px', height: '64px', borderWidth: '6px' }}></div>
        <p style={{ color: '#000000', fontSize: '24px', fontWeight: '900', marginTop: '24px', textTransform: 'uppercase' }}>Loading Trades...</p>
      </div>
    </div>
  );

  return (
    <div className="app-container content-center animate-fade-in" style={{ minHeight: '100vh', padding: '24px' }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '1000px', 
        background: '#FFFFFF', 
        border: '4px solid #000000', 
        boxShadow: 'var(--shadow-lg)', 
        borderRadius: 'var(--radius-lg)',
        padding: '48px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 className="title-large" style={{ fontSize: '42px', marginBottom: '8px' }}>Select Your Trade</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '18px', fontWeight: '700', textTransform: 'uppercase' }}>Choose the domain you want to upskill in today.</p>
        </div>

        <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
          {trades.map((t, idx) => (
            <div 
              key={t.name} 
              className="card-select" 
              onClick={() => selectTrade(t.name)} 
              style={{ padding: '32px 24px', gap: '16px' }}
            >
              <div className="card-icon-wrapper" style={{ 
                background: idx % 3 === 0 ? 'var(--primary)' : idx % 3 === 1 ? 'var(--secondary)' : 'var(--tertiary)',
                color: idx % 3 === 2 ? '#FFFFFF' : '#000000'
              }}>
                {t.icon}
              </div>
              <h3 className="card-text" style={{ fontSize: '20px', textTransform: 'uppercase' }}>{t.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}