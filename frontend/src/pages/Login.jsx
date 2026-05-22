import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, BookOpen } from 'lucide-react';
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
  const [speaking, setSpeaking] = useState(false);
  const navigate = useNavigate();
  const [isEmployeeLogin, setIsEmployeeLogin] = useState(false);
  const [empId, setEmpId] = useState('');
  const [empPassword, setEmpPassword] = useState('');

  const handleSpeak = () => {
    setSpeaking(true);
    let text = "Please enter your phone number.";
    if (isEmployeeLogin) text = "Please enter your Employee ID and password.";
    else if (step === 2) text = "Please enter the OTP sent to your phone.";
    else if (step === 3) text = "Please enter your name, age, and gender to create your account.";
    speakText(text, 'en-US', () => setSpeaking(false));
  };

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

  const handleNext = async () => {
    if (step === 1 && phone.length === 10) {
      setStep(2);
      speakText("Enter OTP", 'en-US');
    } else if (step === 2 && otp.length === 4) {
      setStep(3);
      speakText("Enter your details", 'en-US');
    } else if (step === 3 && name && age && gender && selectedState && district) {
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
          navigate('/language');
        }
      } catch (e) {
        console.error(e);
        localStorage.setItem('user_id', '1');
        navigate('/language');
      }
    }
  };

  return (
    <div className="app-container" style={{background: 'white'}}>
      <div className="split-left" style={{background: 'var(--primary)', color: 'white', padding: '64px', justifyContent: 'center', alignItems: 'center'}}>
        <BookOpen size={120} style={{marginBottom: '32px'}} />
        <h1 style={{fontSize: '64px', fontWeight: 'bold', marginBottom: '16px'}}>SkillVoice</h1>
        <p style={{fontSize: '24px', opacity: 0.9, textAlign: 'center', maxWidth: '400px'}}>The Voice-First Upskilling Platform for the Next Billion Users</p>
      </div>
      
      <div className="split-right" style={{padding: '64px', alignItems: 'center', position: 'relative'}}>
        <div style={{position: 'absolute', top: '32px', right: '32px'}}>
          <button className={`btn-speaker ${speaking ? 'speaking' : ''}`} onClick={handleSpeak}>
            <Volume2 size={24} />
          </button>
        </div>
        
        <div style={{width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px'}}>
            <h2 className="title-large" style={{margin: 0}}>
              {isEmployeeLogin ? 'Employee Login' : step === 1 ? 'Login' : step === 2 ? 'Enter OTP' : 'Create Account'}
            </h2>
            <button 
              onClick={() => setIsEmployeeLogin(!isEmployeeLogin)}
              style={{background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline'}}
            >
              {isEmployeeLogin ? 'Learner Login' : 'Company Employee?'}
            </button>
          </div>
          
          {isEmployeeLogin ? (
            <form onSubmit={handleEmployeeLogin} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <input className="input-field" placeholder="Employee ID" value={empId} onChange={e => setEmpId(e.target.value)} style={{textAlign: 'left', letterSpacing: 'normal'}} required />
              <input className="input-field" type="password" placeholder="Password" value={empPassword} onChange={e => setEmpPassword(e.target.value)} style={{textAlign: 'left', letterSpacing: 'normal'}} required />
              <button type="submit" className="btn-primary" style={{marginTop: '16px'}}>Sign In</button>
            </form>
          ) : (
            <>
              {step === 1 && (
                <input className="input-field" placeholder="Phone Number" value={phone} readOnly />
              )}
              
              {step === 2 && (
                <input className="input-field" placeholder="OTP" value={otp} readOnly />
              )}
              
              {step === 3 && (
                <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                  <input className="input-field" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} style={{textAlign: 'left', letterSpacing: 'normal'}} />
                  <input className="input-field" type="number" placeholder="Age" value={age} onChange={e => setAge(e.target.value)} style={{textAlign: 'left', letterSpacing: 'normal'}} />
                  <select className="input-field" value={gender} onChange={e => setGender(e.target.value)} style={{textAlign: 'left', letterSpacing: 'normal'}}>
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <select className="input-field" value={selectedState} onChange={e => { setSelectedState(e.target.value); setDistrict(''); }} style={{textAlign: 'left', letterSpacing: 'normal'}}>
                    <option value="" disabled>Select State</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <select className="input-field" value={district} onChange={e => setDistrict(e.target.value)} disabled={!selectedState} style={{textAlign: 'left', letterSpacing: 'normal'}}>
                    <option value="" disabled>Select District</option>
                    {selectedState && LOCATION_DATA[selectedState].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              )}

              {step < 3 ? (
                <div className="numpad" style={{marginTop: '24px'}}>
                  {[1,2,3,4,5,6,7,8,9].map(n => (
                    <button key={n} className="numpad-btn" onClick={() => handleNumpad(n)}>{n}</button>
                  ))}
                  <button className="numpad-btn" onClick={handleBackspace}>⌫</button>
                  <button className="numpad-btn" onClick={() => handleNumpad(0)}>0</button>
                  <button className="numpad-btn" style={{ color: 'var(--success)' }} onClick={handleNext}>✓</button>
                </div>
              ) : (
                <button className="btn-primary" style={{marginTop: '32px'}} onClick={handleNext}>Complete Registration</button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
