import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Delete, ArrowRight, User, Building } from 'lucide-react';
import { speakText } from '../voiceUtils';
import { LOCATION_DATA, STATES } from '../locationData';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [district, setDistrict] = useState('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [isEmployeeLogin, setIsEmployeeLogin] = useState(false);
  const [empId, setEmpId] = useState('');
  const [empPassword, setEmpPassword] = useState('');

  const handleNumpad = (num) => {
    if (isEmployeeLogin) return;
    if (step === 1) {
      if (phone.length < 10) setPhone(p => p + num);
    } else if (step === 2) {
      if (otp.length < 4) setOtp(o => o + num);
    }
  };

  const handleBackspace = () => {
    if (isEmployeeLogin) return;
    if (step === 1) setPhone(p => p.slice(0, -1));
    else if (step === 2) setOtp(o => o.slice(0, -1));
  };

  const handleEmployeeLogin = async (e) => {
    e.preventDefault();
    if (!empId || !empPassword) return;
    try {
      const res = await fetch('http://localhost:8000/employee/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({employee_id: empId, password: empPassword})
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.detail || "Login failed");
        return;
      }
      localStorage.setItem('user_id', data.user_id);
      localStorage.setItem('trade_domain', data.trade_domain);
      localStorage.setItem('preferred_language', data.preferred_language || 'en');
      
      if (data.needs_diagnostic) {
        navigate('/diagnostic');
      } else {
        navigate('/worker/dashboard');
      }
    } catch(e) {
      console.error(e);
      alert("Server error");
    }
  };

  const [regError, setRegError] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  const handleNext = () => {
    if (step === 1 && phone.length === 10) {
      setStep(2);
    } else if (step === 2 && otp.length === 4) {
      setStep(3);
    }
  };

  const handleRegister = async () => {
    setRegError('');
    if (!name) { setRegError('Please enter your full name.'); return; }
    if (!age) { setRegError('Please enter your age.'); return; }
    if (!gender) { setRegError('Please select your gender.'); return; }
    if (!selectedState) { setRegError('Please select your state.'); return; }
    if (!district) { setRegError('Please select your district.'); return; }

    setRegLoading(true);
    try {
      const res = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          phone,
          name,
          age: parseInt(age),
          gender,
          state: selectedState,
          district: district
        })
      });
      const data = await res.json();
      localStorage.setItem('user_id', data.user_id);
      if (data.needs_diagnostic) {
        navigate('/diagnostic');
      } else {
        navigate('/trade');
      }
    } catch (e) {
      console.error(e);
      setRegError('Server error. Please try again.');
    } finally {
      setRegLoading(false);
    }
  };

  const formatPhone = (val) => {
    if (!val) return '';
    const match = val.match(/^(\d{0,5})(\d{0,5})$/);
    if (match) return [match[1], match[2]].filter(x => x).join('  ');
    return val;
  };

  return (
    <div className="app-container split-pane" style={{padding: 0, height: '100vh', overflow: 'hidden'}}>
      <div className="split-left" style={{
        background: 'radial-gradient(circle at top left, var(--tertiary), var(--bg-void))',
        borderRight: '1px solid var(--glass-border)',
        color: 'white',
        padding: '64px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}>
        {/* Glow backdrop */}
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(0, 242, 255, 0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
          top: '20%',
          left: '20%',
          zIndex: 1
        }}></div>

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            padding: '24px',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 0 40px rgba(0, 242, 255, 0.25)',
            marginBottom: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BookOpen size={72} color="var(--bg-void)" style={{ strokeWidth: 2.2 }} />
          </div>
          
          <h1 style={{
            fontFamily: 'Outfit',
            fontSize: '56px',
            fontWeight: '800',
            marginBottom: '16px',
            letterSpacing: '-1.5px',
            background: 'linear-gradient(90deg, #ffffff, #c7d2fe)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center'
          }}>
            SkillVoice <span style={{ color: 'var(--primary)' }}>AI</span>
          </h1>
          
          <p style={{
            fontSize: '22px',
            color: 'var(--text-muted)',
            textAlign: 'center',
            maxWidth: '440px',
            lineHeight: 1.6,
            fontWeight: '500'
          }}>
            Empowering trade professionals through low-latency conversational AI and verified career credentials.
          </p>
        </div>
      </div>
      
      <div className="split-right content-center" style={{padding: '48px', position: 'relative', overflowY: 'auto'}}>
        
        <div style={{width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column'}}>
          
          {/* Custom Segmented Control for Tabs */}
          <div style={{
            display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '6px', 
            borderRadius: '16px', marginBottom: '48px', position: 'relative'
          }}>
            <div style={{
              position: 'absolute', top: '6px', bottom: '6px', width: 'calc(50% - 6px)',
              background: 'var(--primary)', borderRadius: '12px', transition: 'transform 0.3s ease',
              transform: isEmployeeLogin ? 'translateX(100%)' : 'translateX(0)', zIndex: 0
            }} />
            
            <button 
              onClick={() => setIsEmployeeLogin(false)}
              style={{
                flex: 1, padding: '16px 0', border: 'none', background: 'transparent',
                color: !isEmployeeLogin ? 'white' : 'var(--text-muted)', fontWeight: 'bold', 
                fontSize: '16px', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'color 0.3s'
              }}
            >
              <User size={20} /> Learner
            </button>
            <button 
              onClick={() => setIsEmployeeLogin(true)}
              style={{
                flex: 1, padding: '16px 0', border: 'none', background: 'transparent',
                color: isEmployeeLogin ? 'white' : 'var(--text-muted)', fontWeight: 'bold', 
                fontSize: '16px', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'color 0.3s'
              }}
            >
              <Building size={20} /> Employee
            </button>
          </div>
          
          <div style={{textAlign: 'center', marginBottom: '40px'}}>
            <h2 style={{fontSize: '32px', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '8px'}}>
              {isEmployeeLogin ? 'Company Portal' : step === 1 ? 'Welcome Back' : step === 2 ? 'Verify Identity' : 'Create Account'}
            </h2>
            <p style={{color: 'var(--text-muted)'}}>
              {isEmployeeLogin ? 'Sign in with your corporate ID' : step === 1 ? 'Enter your 10-digit mobile number' : step === 2 ? 'Enter the 4-digit code sent to you' : 'Complete your profile to start'}
            </p>
          </div>
          
          {isEmployeeLogin ? (
            <form onSubmit={handleEmployeeLogin} style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
              <div>
                <label style={{display: 'block', color: 'var(--text-muted)', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase'}}>Employee ID</label>
                <input 
                  className="input-field" 
                  placeholder="e.g. EMP-1002" 
                  value={empId} 
                  onChange={e => setEmpId(e.target.value)} 
                  style={{textAlign: 'left', letterSpacing: '2px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)'}} 
                  required 
                />
              </div>
              <div>
                <label style={{display: 'block', color: 'var(--text-muted)', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase'}}>Password</label>
                <input 
                  className="input-field" 
                  type="password" 
                  placeholder="••••••••" 
                  value={empPassword} 
                  onChange={e => setEmpPassword(e.target.value)} 
                  style={{textAlign: 'left', letterSpacing: '4px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)'}} 
                  required 
                />
              </div>
              <button type="submit" className="btn-primary" style={{marginTop: '16px', height: '64px', fontSize: '20px'}}>Sign In to Training</button>
            </form>
          ) : (
            <>
              {/* LEARNER FLOW */}
              {step === 1 && (
                <div style={{
                  background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', 
                  borderRadius: 'var(--radius-xl)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px'
                }}>
                  <div style={{fontSize: '24px', color: 'var(--text-muted)', fontWeight: '300'}}>+91</div>
                  <div style={{width: '2px', height: '24px', background: 'var(--border)'}} />
                  <input 
                    style={{
                      background: 'transparent', border: 'none', color: 'white', fontSize: '24px', 
                      width: '100%', outline: 'none', letterSpacing: '4px', fontWeight: '500'
                    }}
                    placeholder="00000  00000" 
                    value={formatPhone(phone)} 
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (val.length <= 10) setPhone(val);
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && phone.length === 10) handleNext();
                    }}
                    autoFocus
                  />
                </div>
              )}
              
              {step === 2 && (
                <div style={{position: 'relative', display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '32px'}}>
                  <input 
                    style={{
                      position: 'absolute', opacity: 0, width: '100%', height: '100%', top: 0, left: 0, 
                      cursor: 'text', zIndex: 10
                    }}
                    value={otp}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (val.length <= 4) setOtp(val);
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && otp.length === 4) handleNext();
                    }}
                    autoFocus
                  />
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} style={{
                      width: '56px', height: '64px', background: 'rgba(0,0,0,0.3)', 
                      border: `2px solid ${otp.length === i ? 'var(--primary)' : 'var(--glass-border)'}`,
                      borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '32px', fontWeight: 'bold', color: 'white', transition: 'all 0.2s',
                      boxShadow: otp.length === i ? '0 0 20px rgba(0, 242, 255, 0.2)' : 'none'
                    }}>
                      {otp[i] || ''}
                    </div>
                  ))}
                </div>
              )}
              
              {step === 3 && (
                <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                  <input className="input-field" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} style={{textAlign: 'left', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)'}} />
                  <input className="input-field" type="number" placeholder="Age" value={age} onChange={e => setAge(e.target.value)} style={{textAlign: 'left', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)'}} />
                  <select className="input-field" value={gender} onChange={e => setGender(e.target.value)} style={{textAlign: 'left', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: gender ? 'white' : 'var(--text-muted)'}}>
                    <option value="" disabled style={{color: 'black'}}>Select Gender</option>
                    <option value="Male" style={{color: 'black'}}>Male</option>
                    <option value="Female" style={{color: 'black'}}>Female</option>
                    <option value="Other" style={{color: 'black'}}>Other</option>
                  </select>
                  <select className="input-field" value={selectedState} onChange={e => { setSelectedState(e.target.value); setDistrict(''); }} style={{textAlign: 'left', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: selectedState ? 'white' : 'var(--text-muted)'}}>
                    <option value="" disabled style={{color: 'black'}}>Select State</option>
                    {STATES.map(s => <option key={s} value={s} style={{color: 'black'}}>{s}</option>)}
                  </select>
                  <select className="input-field" value={district} onChange={e => setDistrict(e.target.value)} disabled={!selectedState} style={{textAlign: 'left', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: district ? 'white' : 'var(--text-muted)'}}>
                    <option value="" disabled style={{color: 'black'}}>Select District</option>
                    {selectedState && LOCATION_DATA[selectedState].map(d => <option key={d} value={d} style={{color: 'black'}}>{d}</option>)}
                  </select>
                  {regError && (
                    <div style={{
                      background: 'rgba(244, 63, 94, 0.15)', border: '1px solid var(--error)',
                      borderRadius: 'var(--radius-md)', padding: '12px 16px',
                      color: 'var(--error)', fontSize: '14px', marginTop: '8px'
                    }}>
                      {regError}
                    </div>
                  )}
                  <button 
                    className="btn-primary"
                    style={{ marginTop: '16px', height: '64px', fontSize: '20px', opacity: regLoading ? 0.7 : 1 }}
                    onClick={handleRegister}
                    disabled={regLoading}
                  >
                    {regLoading ? 'Registering...' : 'Complete Registration'}
                  </button>
                </div>
              )}

              {/* PROFESSIONAL NUMPAD */}
              {step < 3 && (
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', maxWidth: '280px', margin: '0 auto'
                }}>
                  {[1,2,3,4,5,6,7,8,9].map(n => (
                    <button 
                      key={n} 
                      onClick={() => handleNumpad(n)}
                      style={{
                        width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.05)', color: 'white', fontSize: '24px', fontWeight: '400',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.1s',
                        margin: '0 auto'
                      }}
                      onMouseDown={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                      onMouseUp={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    >
                      {n}
                    </button>
                  ))}
                  
                  {/* Delete Button */}
                  <button 
                    onClick={handleBackspace}
                    style={{
                      width: '64px', height: '64px', borderRadius: '50%', background: 'transparent',
                      border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      cursor: 'pointer', transition: 'all 0.1s', margin: '0 auto'
                    }}
                    onMouseDown={e => e.currentTarget.style.color = 'white'}
                    onMouseUp={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    <Delete size={24} />
                  </button>
                  
                  {/* Zero Button */}
                  <button 
                    onClick={() => handleNumpad(0)}
                    style={{
                      width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.05)', color: 'white', fontSize: '24px', fontWeight: '400',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.1s',
                      margin: '0 auto'
                    }}
                    onMouseDown={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseUp={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  >
                    0
                  </button>
                  
                  {/* Next / Submit Button */}
                  <button 
                    onClick={handleNext}
                    style={{
                      width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary)',
                      border: 'none', color: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      cursor: 'pointer', transition: 'all 0.1s', margin: '0 auto',
                      boxShadow: '0 0 15px rgba(0, 242, 255, 0.4)'
                    }}
                    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <ArrowRight size={24} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
