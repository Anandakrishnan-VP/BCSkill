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
    <div style={{minHeight: '100vh', backgroundColor: 'var(--secondary)', padding: '32px'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto'}}>
        <h1 className="title-large" style={{textAlign: 'left', marginBottom: '8px'}}>SkillVoice Admin</h1>
        <p style={{color: 'var(--text-muted)', marginBottom: '32px'}}>Employer & Staffing Agency Dashboard</p>
        
        <div style={{display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'flex-end'}}>
          <div>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Domain</label>
            <select 
              value={domainFilter} 
              onChange={(e) => setDomainFilter(e.target.value)}
              style={{padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', minWidth: '200px'}}
            >
              <option value="All">All Domains</option>
              <option value="AC Technician">AC Technician</option>
              <option value="Electrician">Electrician</option>
              <option value="Plumber">Plumber</option>
            </select>
          </div>
          
          <div>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>State</label>
            <select 
              value={stateFilter} 
              onChange={(e) => { setStateFilter(e.target.value); setDistrictFilter('All'); }}
              style={{padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', minWidth: '200px'}}
            >
              <option value="All">All States</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>District</label>
            <select 
              value={districtFilter} 
              onChange={(e) => setDistrictFilter(e.target.value)}
              disabled={stateFilter === 'All'}
              style={{padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', minWidth: '200px'}}
            >
              <option value="All">All Districts</option>
              {stateFilter !== 'All' && LOCATION_DATA[stateFilter].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          
          <button 
            className="btn-primary" 
            style={{width: 'auto', padding: '0 24px', height: '46px'}}
            onClick={exportCsv}
          >
            Export CSV
          </button>
        </div>
        
        <div style={{background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)'}}>
          <h3 style={{marginBottom: '16px'}}>Certified Workers ({workers.length})</h3>
          
          <table className="data-table">
            <thead>
              <tr>
                <th>Certificate ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Trade</th>
                <th>Location</th>
                <th>Score</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((w, i) => (
                <tr key={i}>
                  <td style={{fontFamily: 'monospace'}}>{w.cert_id}</td>
                  <td>{w.name || "Worker"}</td>
                  <td>{w.phone}</td>
                  <td>{w.trade}</td>
                  <td>{w.district && w.state ? `${w.district}, ${w.state}` : "Unknown"}</td>
                  <td><span className="badge">{w.score}/3</span></td>
                  <td>{w.date_certified}</td>
                </tr>
              ))}
              {workers.length === 0 && (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center', color: 'var(--text-muted)'}}>No workers found for this filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
