import React, { useState, useEffect } from 'react';
import { LOCATION_DATA, STATES } from '../locationData';

export default function Admin() {
  const [workers, setWorkers] = useState([]);
  const [domainFilter, setDomainFilter] = useState('All');
  const [stateFilter, setStateFilter] = useState('All');
  const [districtFilter, setDistrictFilter] = useState('All');

  useEffect(() => {
    fetchWorkers();
  }, [domainFilter, stateFilter, districtFilter]);

  const fetchWorkers = async () => {
    try {
      const res = await fetch(`http://localhost:8000/admin/workers?domain=${domainFilter}&state=${stateFilter}&district=${districtFilter}`);
      const data = await res.json();
      setWorkers(data.workers);
    } catch (e) {
      console.error(e);
    }
  };

  const exportCsv = () => {
    if (workers.length === 0) return;
    const header = Object.keys(workers[0]).join(',');
    const rows = workers.map(w => Object.values(w).join(',')).join('\n');
    const csv = header + '\n' + rows;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'certified_workers.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="page-content" style={{minHeight: '100vh', padding: '48px'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto'}}>
        <h1 className="title-large" style={{textAlign: 'left', marginBottom: '8px', color: 'var(--primary)'}}>Hire Talent</h1>
        <p style={{color: 'var(--text-muted)', marginBottom: '48px', fontSize: '20px'}}>Verified & Certified Professionals Ready for Work</p>
        
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '24px', marginBottom: '48px', 
          background: 'var(--glass-bg)', padding: '32px', borderRadius: 'var(--radius-xl)', 
          border: '1px solid var(--glass-border)', alignItems: 'flex-end'
        }}>
          <div style={{flex: '1', minWidth: '200px'}}>
            <label style={{display: 'block', marginBottom: '12px', fontWeight: '500', color: 'var(--text-main)'}}>Domain Expertise</label>
            <select 
              value={domainFilter} 
              onChange={(e) => setDomainFilter(e.target.value)}
              style={{
                width: '100%', padding: '16px', borderRadius: 'var(--radius-md)', 
                background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', color: 'white', fontSize: '16px'
              }}
            >
              <option value="All">All Domains</option>
              <option value="AC Technician">AC Technician</option>
              <option value="Electrician">Electrician</option>
              <option value="Plumber">Plumber</option>
              <option value="Fitter">Fitter</option>
              <option value="Welder">Welder</option>
              <option value="Mason">Mason</option>
            </select>
          </div>
          
          <div style={{flex: '1', minWidth: '200px'}}>
            <label style={{display: 'block', marginBottom: '12px', fontWeight: '500', color: 'var(--text-main)'}}>State / Region</label>
            <select 
              value={stateFilter} 
              onChange={(e) => { setStateFilter(e.target.value); setDistrictFilter('All'); }}
              style={{
                width: '100%', padding: '16px', borderRadius: 'var(--radius-md)', 
                background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', color: 'white', fontSize: '16px'
              }}
            >
              <option value="All">All States</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div style={{flex: '1', minWidth: '200px'}}>
            <label style={{display: 'block', marginBottom: '12px', fontWeight: '500', color: 'var(--text-main)'}}>District / City</label>
            <select 
              value={districtFilter} 
              onChange={(e) => setDistrictFilter(e.target.value)}
              disabled={stateFilter === 'All'}
              style={{
                width: '100%', padding: '16px', borderRadius: 'var(--radius-md)', 
                background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', color: 'white', fontSize: '16px',
                opacity: stateFilter === 'All' ? 0.5 : 1
              }}
            >
              <option value="All">All Districts</option>
              {stateFilter !== 'All' && LOCATION_DATA[stateFilter].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          
          <button 
            className="btn-primary" 
            style={{padding: '0 32px', height: '54px', fontSize: '16px'}}
            onClick={exportCsv}
          >
            Export List (CSV)
          </button>
        </div>
        
        <div style={{
          background: 'var(--glass-bg)', borderRadius: 'var(--radius-xl)', 
          padding: '40px', border: '1px solid var(--glass-border)'
        }}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px'}}>
             <h3 style={{fontSize: '28px', color: 'var(--text-main)'}}>Certified Talent Pool</h3>
             <span style={{background: 'var(--primary)', color: 'var(--bg)', padding: '8px 24px', borderRadius: '50px', fontWeight: 'bold'}}>
               {workers.length} Available
             </span>
          </div>
          
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'separate', borderSpacing: '0 16px', color: 'var(--text-main)'}}>
              <thead>
                <tr style={{color: 'var(--text-muted)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px'}}>
                  <th style={{padding: '0 24px', textAlign: 'left', fontWeight: '500'}}>Worker Name</th>
                  <th style={{padding: '0 24px', textAlign: 'left', fontWeight: '500'}}>Domain</th>
                  <th style={{padding: '0 24px', textAlign: 'left', fontWeight: '500'}}>Location</th>
                  <th style={{padding: '0 24px', textAlign: 'left', fontWeight: '500'}}>Readiness Score</th>
                  <th style={{padding: '0 24px', textAlign: 'left', fontWeight: '500'}}>Date Certified</th>
                  <th style={{padding: '0 24px', textAlign: 'center', fontWeight: '500'}}>Contact</th>
                </tr>
              </thead>
              <tbody>
                {workers.map((w, i) => (
                  <tr key={i} style={{background: 'rgba(0,0,0,0.2)', transition: 'all 0.2s', ':hover': {background: 'rgba(255,255,255,0.05)'}}}>
                    <td style={{padding: '24px', borderRadius: '16px 0 0 16px', fontWeight: '600', fontSize: '18px'}}>
                      {w.name || "Verified Worker"}
                      <div style={{fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'monospace'}}>
                        {w.cert_id}
                      </div>
                    </td>
                    <td style={{padding: '24px'}}>{w.trade}</td>
                    <td style={{padding: '24px'}}>{w.district && w.state ? `${w.district}, ${w.state}` : "Unknown"}</td>
                    <td style={{padding: '24px'}}>
                      <span style={{
                        background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', 
                        padding: '6px 16px', borderRadius: '50px', fontWeight: 'bold'
                      }}>
                        {w.score}%
                      </span>
                    </td>
                    <td style={{padding: '24px', color: 'var(--text-muted)'}}>{w.date_certified}</td>
                    <td style={{padding: '24px', borderRadius: '0 16px 16px 0', textAlign: 'center'}}>
                      <div style={{
                        background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
                        padding: '8px 16px', borderRadius: '8px', display: 'inline-block',
                        fontWeight: '500', color: 'var(--text-main)', letterSpacing: '1px'
                      }}>
                        {w.phone ? `+91 ${w.phone.slice(0,5)} ${w.phone.slice(5)}` : 'No Contact'}
                      </div>
                    </td>
                  </tr>
                ))}
                {workers.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{padding: '64px', textAlign: 'center', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', borderRadius: '16px'}}>
                      <div style={{fontSize: '24px', marginBottom: '8px'}}>No talent found</div>
                      <p>Try adjusting your domain or location filters.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
