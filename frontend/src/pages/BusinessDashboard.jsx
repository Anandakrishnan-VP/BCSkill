import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

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
    <div style={{ minHeight: '100vh', padding: '48px', position: 'relative', zIndex: 1, background: 'var(--bg-void)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
          <div>
            <h1 className="title-large" style={{ marginBottom: '8px', color: '#000000', fontSize: '48px' }}>{companyName}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '18px', fontWeight: '800', textTransform: 'uppercase' }}>Workforce Readiness Dashboard</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '48px' }}>
           <MetricCard title="Total Employees" value={metrics.total_employees} icon={<Users size={28} />} color="var(--primary)" />
           <MetricCard title="Certified" value={metrics.certified} icon={<CheckCircle size={28} />} color="var(--success)" />
           <MetricCard title="In Training" value={metrics.in_training} icon={<TrendingUp size={28} />} color="var(--warning)" />
           <MetricCard title="Avg Score" value={`${metrics.avg_score}%`} icon={<AlertTriangle size={28} />} color={metrics.avg_score > 80 ? 'var(--success)' : 'var(--danger)'} />
        </div>
        
        <div style={{
          background: '#FFFFFF', 
          borderRadius: 'var(--radius-md)', 
          padding: '40px', 
          border: '4px solid #000000', 
          boxShadow: 'var(--shadow-main)', 
          marginBottom: '40px'
        }}>
          <h3 style={{ marginBottom: '32px', fontSize: '24px', fontFamily: 'Archivo', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '12px', color: '#000000', textTransform: 'uppercase' }}>
             <div style={{
               background: 'var(--primary)', 
               padding: '12px', 
               borderRadius: 'var(--radius-md)', 
               color: '#000000',
               border: '3px solid #000000',
               boxShadow: '2px 2px 0px #000000',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center'
             }}>
               <Users size={24} />
             </div>
             Employee Roster
          </h3>
          
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', color: '#000000' }}>
              <thead>
                <tr style={{ borderBottom: '3px solid #000000', textAlign: 'left', textTransform: 'uppercase', fontWeight: '900' }}>
                  <th style={{ padding: '16px', color: '#000000' }}>ID</th>
                  <th style={{ padding: '16px', color: '#000000' }}>Name</th>
                  <th style={{ padding: '16px', color: '#000000' }}>Role</th>
                  <th style={{ padding: '16px', color: '#000000' }}>Trade</th>
                  <th style={{ padding: '16px', color: '#000000' }}>Status</th>
                  <th style={{ padding: '16px', color: '#000000' }}>Score</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, i) => (
                  <tr key={i} style={{ borderBottom: '2px solid #000000', fontWeight: '700' }}>
                    <td style={{ padding: '16px', fontFamily: 'monospace', color: 'var(--tertiary)', fontWeight: '900' }}>{emp.employee_id}</td>
                    <td style={{ padding: '16px', fontWeight: '900', textTransform: 'uppercase' }}>{emp.name}</td>
                    <td style={{ padding: '16px', textTransform: 'uppercase' }}>{emp.role}</td>
                    <td style={{ padding: '16px', textTransform: 'uppercase' }}>{emp.trade}</td>
                    <td style={{ padding: '16px' }}>
                      {emp.status === 'Certified' && (
                        <span style={{
                          background: 'var(--success)', 
                          color: '#000000', 
                          padding: '6px 12px', 
                          borderRadius: 'var(--radius-md)', 
                          fontSize: '12px', 
                          fontWeight: '900',
                          border: '2px solid #000000',
                          boxShadow: '2px 2px 0px #000000',
                          display: 'inline-block'
                        }}>
                          CERTIFIED
                        </span>
                      )}
                      {emp.status === 'In Training' && (
                        <span style={{
                          background: 'var(--warning)', 
                          color: '#000000', 
                          padding: '6px 12px', 
                          borderRadius: 'var(--radius-md)', 
                          fontSize: '12px', 
                          fontWeight: '900',
                          border: '2px solid #000000',
                          boxShadow: '2px 2px 0px #000000',
                          display: 'inline-block'
                        }}>
                          IN TRAINING
                        </span>
                      )}
                      {emp.status === 'Pending Diagnostic' && (
                        <span style={{
                          background: 'var(--danger)', 
                          color: '#FFFFFF', 
                          padding: '6px 12px', 
                          borderRadius: 'var(--radius-md)', 
                          fontSize: '12px', 
                          fontWeight: '900',
                          border: '2px solid #000000',
                          boxShadow: '2px 2px 0px #000000',
                          display: 'inline-block'
                        }}>
                          PENDING
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '16px', fontFamily: 'Archivo', fontWeight: '900', fontSize: '18px' }}>{emp.score ? `${emp.score}%` : '-'}</td>
                  </tr>
                ))}
                {employees.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)', fontSize: '18px', fontWeight: '900', textTransform: 'uppercase' }}>
                      No employees assigned to the assessment program yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{
          background: '#FFFFFF', 
          borderRadius: 'var(--radius-md)', 
          padding: '40px', 
          border: '4px solid #000000', 
          boxShadow: 'var(--shadow-main)'
        }}>
          <h4 style={{ marginBottom: '32px', fontSize: '24px', fontFamily: 'Archivo', fontWeight: '900', color: '#000000', textTransform: 'uppercase' }}>Add Employee</h4>
          <form onSubmit={handleAddEmployee} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <input className="input-field" placeholder="Full Name" value={newEmp.name} onChange={e => updateField('name', e.target.value)} required />
            <input className="input-field" placeholder="Employee ID" value={newEmp.employee_id} onChange={e => updateField('employee_id', e.target.value)} required />
            <input className="input-field" placeholder="Password" type="password" value={newEmp.password} onChange={e => updateField('password', e.target.value)} required />
            <input className="input-field" placeholder="Phone Number" value={newEmp.phone} onChange={e => updateField('phone', e.target.value)} />
            <input className="input-field" placeholder="Role / Designation" value={newEmp.role} onChange={e => updateField('role', e.target.value)} required />
            <select className="input-field" value={newEmp.trade} onChange={e => updateField('trade', e.target.value)} required style={{ color: '#000000' }}>
              <option value="" disabled>Select Trade/Course</option>
              <option value="Electrician">Electrician</option>
              <option value="Plumber">Plumber</option>
              <option value="AC Technician">AC Technician</option>
              <option value="Welder">Welder</option>
            </select>
            <select className="input-field" value={newEmp.language} onChange={e => updateField('language', e.target.value)} style={{ color: '#000000' }}>
              <option value="en">English</option>
            </select>
            
            <button type="submit" className="btn-primary" style={{ gridColumn: 'span 2', height: '64px', fontSize: '20px' }}>
              Create Employee Profile
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
}

const MetricCard = ({ title, value, icon, color }) => (
  <div style={{
    background: '#FFFFFF',
    padding: '24px 32px', 
    borderRadius: 'var(--radius-md)', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '24px', 
    border: '3px solid #000000', 
    boxShadow: 'var(--shadow-main)', 
    minWidth: '240px'
  }}>
    <div style={{
      width: '64px', 
      height: '64px', 
      borderRadius: 'var(--radius-md)', 
      background: color, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      color: color === 'var(--danger)' ? '#FFFFFF' : '#000000', 
      border: '3px solid #000000',
      boxShadow: '2px 2px 0px #000000'
    }}>
       {icon}
    </div>
    <div>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '0 0 8px 0', fontWeight: '900', textTransform: 'uppercase' }}>{title}</p>
      <h2 style={{ fontSize: '32px', fontFamily: 'Archivo', fontWeight: '900', color: '#000000', margin: 0, lineHeight: '1' }}>{value}</h2>
    </div>
  </div>
);
