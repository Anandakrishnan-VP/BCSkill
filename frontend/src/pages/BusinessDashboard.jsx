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
    <div style={{minHeight: '100vh', backgroundColor: 'var(--secondary)', padding: '48px'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px'}}>
          <div>
            <h1 className="title-large" style={{marginBottom: '8px'}}>{companyName}</h1>
            <p style={{color: 'var(--text-muted)', fontSize: '18px'}}>Workforce Readiness Dashboard</p>
          </div>
          
          <div style={{display: 'flex', gap: '24px'}}>
             <MetricCard title="Total Employees" value={metrics.total_employees} icon={<Users />} color="var(--primary)" />
             <MetricCard title="Certified" value={metrics.certified} icon={<CheckCircle />} color="var(--success)" />
             <MetricCard title="In Training" value={metrics.in_training} icon={<TrendingUp />} color="var(--warning)" />
             <MetricCard title="Avg Score" value={`${metrics.avg_score}%`} icon={<AlertTriangle />} color={metrics.avg_score > 80 ? 'var(--success)' : 'var(--danger)'} />
          </div>
        </div>
        
        <div style={{background: 'white', borderRadius: 'var(--radius-lg)', padding: '32px', boxShadow: 'var(--shadow-sm)', marginBottom: '32px'}}>
          <h3 style={{marginBottom: '24px', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px'}}>
             <Users size={24} color="var(--primary)" />
             Employee Roster
          </h3>
          
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Trade</th>
                <th>Status</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, i) => (
                <tr key={i}>
                  <td style={{fontFamily: 'monospace'}}>{emp.employee_id}</td>
                  <td style={{fontWeight: '500'}}>{emp.name}</td>
                  <td>{emp.role}</td>
                  <td>{emp.trade_domain}</td>
                  <td>
                    {emp.status === 'Certified' && <span className="badge" style={{background: 'var(--success)'}}>Certified</span>}
                    {emp.status === 'In Training' && <span className="badge" style={{background: 'var(--warning)'}}>In Training</span>}
                    {emp.status === 'Pending Diagnostic' && <span className="badge" style={{background: 'var(--danger)'}}>Pending</span>}
                  </td>
                  <td>{emp.latest_score ? `${emp.latest_score}%` : '-'}</td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr><td colSpan="6" style={{textAlign: 'center', padding: '24px', color: 'var(--text-muted)'}}>No employees assigned.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{background: 'var(--bg)', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)'}}>
          <h4 style={{marginBottom: '24px', fontSize: '20px'}}>Add Employee to Assessment Program</h4>
          <form onSubmit={handleAddEmployee} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
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
              <option value="hi">Hindi</option>
              <option value="mr">Marathi</option>
            </select>
            
            <button type="submit" className="btn-primary" style={{gridColumn: 'span 2', height: '56px', background: 'var(--warning)', color: 'var(--text-main)', fontWeight: 'bold'}}>
              Create Employee Profile
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
}

const inputStyle = { marginBottom: 0, height: '48px', fontSize: '16px', letterSpacing: 'normal', textAlign: 'left' };

const MetricCard = ({ title, value, icon, color }) => (
  <div style={{background: 'white', padding: '16px 24px', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: 'var(--shadow-md)', minWidth: '180px'}}>
    <div style={{width: '48px', height: '48px', borderRadius: '50%', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color}}>
       {icon}
    </div>
    <div>
      <p style={{color: 'var(--text-muted)', fontSize: '14px', margin: '0 0 4px 0'}}>{title}</p>
      <h2 style={{fontSize: '28px', color: 'var(--text-main)', margin: 0}}>{value}</h2>
    </div>
  </div>
);
