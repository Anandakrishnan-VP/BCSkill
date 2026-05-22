import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';

export default function BusinessDashboard() {
  const [employees, setEmployees] = useState([]);
  const [metrics, setMetrics] = useState({
    total_employees: 0, certified: 0, pending: 0, in_training: 0, avg_score: 0, readiness_score: 0
  });
  
  const [newEmp, setNewEmp] = useState({
    name: '', phone: '', employee_id: '', password: '', role: '', trade: '', language: 'en'
  });
  
  const companyId = localStorage.getItem('company_id') || 1;
  const companyName = localStorage.getItem('company_name') || 'Your Company';

  const fetchDashboard = async () => {
    try {
      const res = await fetch(`http://localhost:8000/business/dashboard/${companyId}`);
      const data = await res.json();
      setEmployees(data.employees);
      setMetrics(data.metrics);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [companyId]);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!newEmp.name || !newEmp.employee_id) return;
    try {
      await fetch('http://localhost:8000/business/employees', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          company_id: parseInt(companyId),
          ...newEmp
        })
      });
      setNewEmp({name: '', phone: '', employee_id: '', password: '', role: '', trade: '', language: 'en'});
      fetchDashboard();
    } catch (e) {
      console.error(e);
    }
  };

  const updateField = (field, value) => setNewEmp(p => ({...p, [field]: value}));

  return (
    <div style={{minHeight: '100vh', padding: '48px', position: 'relative', zIndex: 1}}>
      <div style={{maxWidth: '1200px', margin: '0 auto'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px'}}>
          <div>
            <h1 className="title-large" style={{marginBottom: '8px'}}>{companyName}</h1>
            <p style={{color: 'var(--text-muted)', fontSize: '18px', letterSpacing: '0.5px'}}>Workforce Readiness Dashboard</p>
          </div>
          
          <div style={{display: 'flex', gap: '24px'}}>
             <MetricCard title="Total Employees" value={metrics.total_employees} icon={<Users size={28} />} color="var(--primary)" />
             <MetricCard title="Certified" value={metrics.certified} icon={<CheckCircle size={28} />} color="var(--success)" />
             <MetricCard title="In Training" value={metrics.in_training} icon={<TrendingUp size={28} />} color="var(--warning)" />
             <MetricCard title="Avg Score" value={`${metrics.avg_score}%`} icon={<AlertTriangle size={28} />} color={metrics.avg_score > 80 ? 'var(--success)' : 'var(--danger)'} />
          </div>
        </div>
        
        <div style={{
          background: 'var(--glass-bg)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 'var(--radius-xl)', padding: '40px', border: '1px solid var(--glass-border)', 
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.5)', marginBottom: '40px'
        }}>
          <h3 style={{marginBottom: '32px', fontSize: '24px', fontFamily: 'Outfit', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px'}}>
             <div style={{background: 'var(--primary)', padding: '12px', borderRadius: '12px', color: 'black'}}><Users size={24} /></div>
             Employee Roster
          </h3>
          
          <div style={{overflowX: 'auto'}}>
            <table className="data-table" style={{width: '100%', borderCollapse: 'collapse', color: 'white'}}>
              <thead>
                <tr style={{borderBottom: '2px solid var(--glass-border)', textAlign: 'left'}}>
                  <th style={{padding: '16px', color: 'var(--text-muted)'}}>ID</th>
                  <th style={{padding: '16px', color: 'var(--text-muted)'}}>Name</th>
                  <th style={{padding: '16px', color: 'var(--text-muted)'}}>Role</th>
                  <th style={{padding: '16px', color: 'var(--text-muted)'}}>Trade</th>
                  <th style={{padding: '16px', color: 'var(--text-muted)'}}>Status</th>
                  <th style={{padding: '16px', color: 'var(--text-muted)'}}>Score</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, i) => (
                  <tr key={i} style={{borderBottom: '1px solid var(--glass-border)', transition: 'background 0.3s ease'}} onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.05)'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
                    <td style={{padding: '16px', fontFamily: 'monospace', color: 'var(--primary)'}}>{emp.employee_id}</td>
                    <td style={{padding: '16px', fontWeight: '500'}}>{emp.name}</td>
                    <td style={{padding: '16px'}}>{emp.role}</td>
                    <td style={{padding: '16px'}}>{emp.trade}</td>
                    <td style={{padding: '16px'}}>
                      {emp.status === 'Certified' && <span style={{background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)', padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: 'bold'}}>CERTIFIED</span>}
                      {emp.status === 'In Training' && <span style={{background: 'rgba(245, 158, 11, 0.2)', color: 'var(--warning)', padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: 'bold'}}>IN TRAINING</span>}
                      {emp.status === 'Pending Diagnostic' && <span style={{background: 'rgba(244, 63, 94, 0.2)', color: 'var(--danger)', padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: 'bold'}}>PENDING</span>}
                    </td>
                    <td style={{padding: '16px', fontFamily: 'Outfit', fontWeight: 'bold', fontSize: '18px'}}>{emp.score ? `${emp.score}%` : '-'}</td>
                  </tr>
                ))}
                {employees.length === 0 && (
                  <tr><td colSpan="6" style={{textAlign: 'center', padding: '48px', color: 'var(--text-muted)', fontSize: '18px'}}>No employees assigned to the assessment program yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{
          background: 'var(--glass-bg)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 'var(--radius-xl)', padding: '40px', border: '1px solid var(--glass-border)', 
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.5)'
        }}>
          <h4 style={{marginBottom: '32px', fontSize: '24px', fontFamily: 'Outfit', fontWeight: '600'}}>Add Employee</h4>
          <form onSubmit={handleAddEmployee} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px'}}>
            <input className="input-field" style={inputStyle} placeholder="Full Name" value={newEmp.name} onChange={e => updateField('name', e.target.value)} required />
            <input className="input-field" style={inputStyle} placeholder="Employee ID" value={newEmp.employee_id} onChange={e => updateField('employee_id', e.target.value)} required />
            <input className="input-field" style={inputStyle} placeholder="Password" type="password" value={newEmp.password} onChange={e => updateField('password', e.target.value)} required />
            <input className="input-field" style={inputStyle} placeholder="Phone Number" value={newEmp.phone} onChange={e => updateField('phone', e.target.value)} />
            <input className="input-field" style={inputStyle} placeholder="Role / Designation" value={newEmp.role} onChange={e => updateField('role', e.target.value)} required />
            <select className="input-field" style={inputStyle} value={newEmp.trade} onChange={e => updateField('trade', e.target.value)} required>
              <option value="" disabled>Select Trade/Course</option>
              <option value="Electrician">Electrician</option>
              <option value="Plumber">Plumber</option>
              <option value="AC Technician">AC Technician</option>
              <option value="Welder">Welder</option>
            </select>
            <select className="input-field" style={inputStyle} value={newEmp.language} onChange={e => updateField('language', e.target.value)}>
              <option value="en">English</option>
            </select>
            
            <button type="submit" className="btn-primary" style={{gridColumn: 'span 2', height: '64px', fontSize: '20px', letterSpacing: '1px'}}>
              Create Employee Profile
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
}

const inputStyle = { marginBottom: 0, height: '56px', fontSize: '16px', letterSpacing: 'normal', textAlign: 'left', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)' };

const MetricCard = ({ title, value, icon, color }) => (
  <div style={{
    background: 'var(--glass-bg)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
    padding: '24px 32px', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', gap: '24px', 
    border: '1px solid var(--glass-border)', boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.5)', minWidth: '240px'
  }}>
    <div style={{width: '64px', height: '64px', borderRadius: '50%', background: `linear-gradient(135deg, ${color}, rgba(0,0,0,0))`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: `0 0 20px ${color}40`, border: `1px solid ${color}60`}}>
       {icon}
    </div>
    <div>
      <p style={{color: 'var(--text-muted)', fontSize: '16px', margin: '0 0 8px 0', letterSpacing: '0.5px'}}>{title}</p>
      <h2 style={{fontSize: '36px', fontFamily: 'Outfit', fontWeight: '700', color: 'white', margin: 0, lineHeight: '1'}}>{value}</h2>
    </div>
  </div>
);
