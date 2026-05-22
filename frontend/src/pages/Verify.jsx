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

  if (loading) return <div className="page-content" style={{alignItems: 'center', justifyContent: 'center'}}><div className="progress-ring playing"></div></div>;

  if (error || !cert) {
    return (
      <div className="page-content" style={{alignItems: 'center', justifyContent: 'center'}}>
        <XCircle size={80} color="var(--danger)" style={{marginBottom: '24px'}} />
        <h2 className="title-large" style={{color: 'var(--danger)'}}>Invalid Certificate</h2>
        <p>This certificate could not be verified.</p>
      </div>
    );
  }

  return (
    <div className="page-content" style={{alignItems: 'center'}}>
      <CheckCircle size={80} color="var(--success)" style={{marginTop: '48px', marginBottom: '24px'}} />
      <h2 className="title-large" style={{color: 'var(--success)', marginBottom: '48px'}}>Verified Worker</h2>
      
      <div style={{width: '100%', background: 'white', padding: '24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', borderTop: '4px solid var(--success)'}}>
        <div style={{marginBottom: '16px'}}>
          <p style={{color: 'var(--text-muted)', fontSize: '14px'}}>Name</p>
          <p style={{fontSize: '20px', fontWeight: 'bold'}}>{cert.name || "Worker"}</p>
        </div>
        <div style={{marginBottom: '16px'}}>
          <p style={{color: 'var(--text-muted)', fontSize: '14px'}}>Trade</p>
          <p style={{fontSize: '20px', fontWeight: 'bold'}}>{cert.trade}</p>
        </div>
        <div style={{marginBottom: '16px'}}>
          <p style={{color: 'var(--text-muted)', fontSize: '14px'}}>Score</p>
          <p style={{fontSize: '20px', fontWeight: 'bold', color: 'var(--success)'}}>{cert.score}/3</p>
        </div>
        <div>
          <p style={{color: 'var(--text-muted)', fontSize: '14px'}}>Date Certified</p>
          <p style={{fontSize: '16px', fontWeight: '500'}}>{cert.date_certified}</p>
        </div>
      </div>
    </div>
  );
}
