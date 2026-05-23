import { useState, useEffect } from 'react';
import { LOCATION_DATA, STATES } from '../locationData';

export default function Admin() {
  const [workers, setWorkers] = useState([]);
  const [domainFilter, setDomainFilter] = useState('All');
  const [stateFilter, setStateFilter] = useState('All');
  const [districtFilter, setDistrictFilter] = useState('All');

  useEffect(() => {
    let active = true;
    const fetchWorkers = async () => {
      try {
        const res = await fetch(`http://localhost:8000/admin/workers?domain=${domainFilter}&state=${stateFilter}&district=${districtFilter}`);
        const data = await res.json();
        if (active) {
          setWorkers(data.workers);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchWorkers();
    return () => { active = false; };
  }, [domainFilter, stateFilter, districtFilter]);

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
    <div className="page-content" style={{ minHeight: '100vh', padding: '48px', background: 'var(--bg-void)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 className="title-large" style={{ textAlign: 'left', marginBottom: '8px', color: '#000000', fontSize: '48px' }}>Hire Talent</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '48px', fontSize: '20px', fontWeight: '800', textTransform: 'uppercase' }}>Verified & Certified Professionals Ready for Work</p>
        
        <div style={{
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '24px', 
          marginBottom: '48px', 
          background: '#FFFFFF', 
          padding: '32px', 
          borderRadius: 'var(--radius-md)', 
          border: '4px solid #000000', 
          alignItems: 'flex-end',
          boxShadow: 'var(--shadow-main)'
        }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '900', color: '#000000', textTransform: 'uppercase', fontSize: '14px', letterSpacing: '1px' }}>Domain Expertise</label>
            <select 
              value={domainFilter} 
              onChange={(e) => setDomainFilter(e.target.value)}
              style={{
                width: '100%', padding: '16px', borderRadius: 'var(--radius-md)', 
                background: 'var(--bg-void)', border: '3px solid #000000', color: '#000000', fontSize: '16px', fontWeight: '700', outline: 'none'
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
          
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '900', color: '#000000', textTransform: 'uppercase', fontSize: '14px', letterSpacing: '1px' }}>State / Region</label>
            <select 
              value={stateFilter} 
              onChange={(e) => { setStateFilter(e.target.value); setDistrictFilter('All'); }}
              style={{
                width: '100%', padding: '16px', borderRadius: 'var(--radius-md)', 
                background: 'var(--bg-void)', border: '3px solid #000000', color: '#000000', fontSize: '16px', fontWeight: '700', outline: 'none'
              }}
            >
              <option value="All">All States</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '900', color: '#000000', textTransform: 'uppercase', fontSize: '14px', letterSpacing: '1px' }}>District / City</label>
            <select 
              value={districtFilter} 
              onChange={(e) => setDistrictFilter(e.target.value)}
              disabled={stateFilter === 'All'}
              style={{
                width: '100%', padding: '16px', borderRadius: 'var(--radius-md)', 
                background: 'var(--bg-void)', border: '3px solid #000000', color: '#000000', fontSize: '16px', fontWeight: '700', outline: 'none',
                opacity: stateFilter === 'All' ? 0.5 : 1
              }}
            >
              <option value="All">All Districts</option>
              {stateFilter !== 'All' && LOCATION_DATA[stateFilter].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          
          <button 
            className="btn-primary" 
            style={{ padding: '0 32px', height: '58px', fontSize: '16px', width: 'auto' }}
            onClick={exportCsv}
          >
            Export List (CSV)
          </button>
        </div>
        
        <div style={{
          background: '#FFFFFF', 
          borderRadius: 'var(--radius-md)', 
          padding: '40px', 
          border: '4px solid #000000',
          boxShadow: 'var(--shadow-main)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
             <h3 style={{ fontSize: '28px', color: '#000000', fontWeight: '900', textTransform: 'uppercase' }}>Certified Talent Pool</h3>
             <span style={{ 
               background: 'var(--tertiary)', 
               color: '#FFFFFF', 
               padding: '8px 24px', 
               borderRadius: 'var(--radius-full)', 
               fontWeight: '900',
               border: '2px solid #000000',
               boxShadow: '2px 2px 0px #000000',
               textTransform: 'uppercase'
             }}>
               {workers.length} Available
             </span>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#000000' }}>
              <thead>
                <tr style={{ color: '#000000', fontSize: '14px', textTransform: 'uppercase', borderBottom: '3px solid #000000' }}>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '900' }}>Worker Name</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '900' }}>Domain</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '900' }}>Location</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '900' }}>Readiness Score</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '900' }}>Date Certified</th>
                  <th style={{ padding: '16px 24px', textAlign: 'center', fontWeight: '900' }}>Contact</th>
                </tr>
              </thead>
              <tbody>
                {workers.map((w, i) => (
                  <tr key={i} style={{ borderBottom: '2px solid #000000', fontWeight: '700' }}>
                    <td style={{ padding: '24px', fontWeight: '900', fontSize: '18px' }}>
                      {w.name || "Verified Worker"}
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'monospace', fontWeight: '700' }}>
                        {w.cert_id}
                      </div>
                    </td>
                    <td style={{ padding: '24px', textTransform: 'uppercase' }}>{w.trade}</td>
                    <td style={{ padding: '24px', textTransform: 'uppercase' }}>{w.district && w.state ? `${w.district}, ${w.state}` : "Unknown"}</td>
                    <td style={{ padding: '24px' }}>
                      <span style={{
                        background: 'var(--success)', 
                        color: '#000000', 
                        padding: '6px 16px', 
                        borderRadius: 'var(--radius-md)', 
                        fontWeight: '900',
                        border: '2px solid #000000',
                        boxShadow: '2px 2px 0px #000000'
                      }}>
                        {w.score}%
                      </span>
                    </td>
                    <td style={{ padding: '24px', color: 'var(--text-muted)' }}>{new Date(w.date_certified).toLocaleDateString()}</td>
                    <td style={{ padding: '24px', textAlign: 'center' }}>
                      <div style={{
                        background: 'var(--primary)', 
                        border: '2px solid #000000',
                        padding: '8px 16px', 
                        borderRadius: 'var(--radius-md)', 
                        display: 'inline-block',
                        fontWeight: '900', 
                        color: '#000000', 
                        letterSpacing: '1px',
                        boxShadow: '2px 2px 0px #000000'
                      }}>
                        {w.phone ? `+91 ${w.phone.slice(0,5)} ${w.phone.slice(5)}` : 'No Contact'}
                      </div>
                    </td>
                  </tr>
                ))}
                {workers.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: '900', textTransform: 'uppercase' }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px', color: '#000000' }}>No talent found</div>
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
