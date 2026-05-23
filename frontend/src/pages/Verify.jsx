import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';

export default function Verify() {
  const { id } = useParams();
  const [cert, setCert] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCert = async () => {
      try {
        const res = await fetch(`http://localhost:8000/verify/${id}`);
        if (res.ok) {
          const data = await res.json();
          setCert(data.certificate);
        } else {
          setError(true);
        }
      } catch (e) {
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCert();
  }, [id]);

  if (loading) return (
    <div className="page-content content-center" style={{ minHeight: '100vh', background: 'var(--bg-void)' }}>
      <div className="loader-container">
        <div className="neon-spinner" style={{ width: '64px', height: '64px', borderWidth: '6px' }}></div>
      </div>
    </div>
  );

  if (error || !cert) {
    return (
      <div className="page-content content-center" style={{ minHeight: '100vh', background: 'var(--bg-void)', padding: '24px' }}>
        <div style={{
          background: '#FFFFFF',
          border: '4px solid #000000',
          borderRadius: 'var(--radius-md)',
          padding: '48px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-main)',
          maxWidth: '480px',
          width: '100%'
        }}>
          <div style={{
            background: 'var(--danger)',
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-md)',
            border: '3px solid #000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '2px 2px 0px #000000'
          }}>
            <XCircle size={36} color="#FFFFFF" />
          </div>
          <h2 className="title-large" style={{ color: '#000000', fontSize: '32px', marginBottom: '8px', textTransform: 'uppercase' }}>Invalid Certificate</h2>
          <p style={{ color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>This certificate could not be verified.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content content-center" style={{ minHeight: '100vh', background: 'var(--bg-void)', padding: '24px' }}>
      <div style={{
        background: '#FFFFFF',
        border: '4px solid #000000',
        borderRadius: 'var(--radius-lg)',
        padding: '48px',
        textAlign: 'center',
        boxShadow: 'var(--shadow-main)',
        maxWidth: '540px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          background: 'var(--success)',
          width: '80px',
          height: '80px',
          borderRadius: 'var(--radius-md)',
          border: '3px solid #000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          boxShadow: '3px 3px 0px #000000'
        }}>
          <CheckCircle size={48} color="#000000" />
        </div>
        <h2 className="title-large" style={{ color: '#000000', fontSize: '32px', marginBottom: '40px', textTransform: 'uppercase' }}>Verified Worker</h2>
        
        <div style={{
          width: '100%', 
          background: 'var(--bg-void)', 
          padding: '32px', 
          borderRadius: 'var(--radius-md)', 
          border: '3px solid #000000',
          boxShadow: '4px 4px 0px #000000',
          textAlign: 'left'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '4px' }}>Name</p>
            <p style={{ fontSize: '20px', fontWeight: '900', color: '#000000', textTransform: 'uppercase' }}>{cert.name || "Worker"}</p>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '4px' }}>Trade</p>
            <p style={{ fontSize: '20px', fontWeight: '900', color: '#000000', textTransform: 'uppercase' }}>{cert.trade}</p>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '4px' }}>Score</p>
            <p style={{ fontSize: '20px', fontWeight: '900', color: 'var(--success)' }}>{cert.score}%</p>
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '4px' }}>Date Certified</p>
            <p style={{ fontSize: '18px', fontWeight: '900', color: '#000000' }}>{new Date(cert.date_certified).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
