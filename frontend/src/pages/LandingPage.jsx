import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Volume2, Mic, CheckCircle, Users, 
  ArrowRight, Sparkles, Cpu, Zap, Building, BookOpen
} from 'lucide-react';
import { speakText, stopSpeaking } from '../voiceUtils';

export default function LandingPage() {
  const navigate = useNavigate();
  const [speaking, setSpeaking] = useState(false);

  const handleSpeakIntro = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    speakText(
      "Welcome to SkillVoice AI, the voice-first vocational training app. We use state-of-the-art conversational AI to help you learn skilled trades, get certified, and secure high-paying jobs using just your voice. Choose your portal below to get started.",
      'en-US',
      () => setSpeaking(false)
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-void)', overflowX: 'hidden', color: '#000000' }}>
      
      {/* Decorative top border */}
      <div style={{ height: '12px', background: 'var(--primary)', borderBottom: '4px solid #000000', width: '100%' }}></div>

      {/* Navigation Header */}
      <header style={{
        padding: '24px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1440px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 10,
        borderBottom: '4px solid #000000',
        background: '#FFFFFF',
        marginTop: '20px',
        boxShadow: 'var(--shadow-main)',
        borderRadius: 'var(--radius-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{
            width: '44px',
            height: '44px',
            background: 'var(--tertiary)',
            border: '3px solid #000000',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: '900',
            fontSize: '20px',
            boxShadow: '3px 3px 0px #000000'
          }}>
            SV
          </div>
          <span style={{
            fontFamily: 'Archivo',
            fontSize: '28px',
            fontWeight: '900',
            color: '#000000',
            letterSpacing: '-1.5px',
            textTransform: 'uppercase'
          }}>
            SkillVoice <span style={{ color: 'var(--tertiary)' }}>AI</span>
          </span>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <a href="#portals" style={{ color: '#000000', textDecoration: 'none', fontWeight: '800', fontSize: '16px', textTransform: 'uppercase', borderBottom: '2px solid transparent' }} onMouseOver={e => e.target.style.borderBottom = '2px solid #000000'} onMouseOut={e => e.target.style.borderBottom = '2px solid transparent'}>Access Portals</a>
          <a href="#simulator" style={{ color: '#000000', textDecoration: 'none', fontWeight: '800', fontSize: '16px', textTransform: 'uppercase', borderBottom: '2px solid transparent' }} onMouseOver={e => e.target.style.borderBottom = '2px solid #000000'} onMouseOut={e => e.target.style.borderBottom = '2px solid transparent'}>Interactive Demo</a>
          <button 
            onClick={() => navigate('/roles')} 
            className="btn-primary" 
            style={{ 
              height: '46px', 
              padding: '0 24px', 
              fontSize: '15px', 
              width: 'auto',
              boxShadow: '3px 3px 0px #000000'
            }}
          >
            Choose Portal <ArrowRight size={16} />
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '80px 48px 80px',
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '64px',
        alignItems: 'center',
        zIndex: 5
      }}>
        {/* Left Hero Details */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            background: 'var(--secondary)',
            border: '3px solid #000000',
            borderRadius: 'var(--radius-full)',
            color: '#000000',
            fontSize: '13px',
            fontWeight: '900',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: '28px',
            boxShadow: '3px 3px 0px #000000'
          }}>
            <Sparkles size={14} /> Voice-First Vocational Learning & Hiring
          </div>

          <h1 style={{
            fontFamily: 'Archivo',
            fontSize: '68px',
            lineHeight: '1.05',
            fontWeight: '900',
            color: '#000000',
            letterSpacing: '-3px',
            marginBottom: '24px',
            textTransform: 'uppercase'
          }}>
            Upskill by <span style={{
              background: 'var(--primary)',
              padding: '0 8px',
              border: '4px solid #000000',
              boxShadow: '4px 4px 0px #000000',
              display: 'inline-block',
              transform: 'rotate(-2deg)'
            }}>Voice</span>. <br />
            Certified by <span style={{
              background: 'var(--tertiary)',
              color: '#FFFFFF',
              padding: '0 8px',
              border: '4px solid #000000',
              boxShadow: '4px 4px 0px #000000',
              display: 'inline-block',
              transform: 'rotate(1.5deg)'
            }}>AI</span>.
          </h1>

          <p style={{
            color: 'var(--text-muted)',
            fontSize: '20px',
            lineHeight: '1.6',
            maxWidth: '560px',
            marginBottom: '48px',
            fontWeight: '600'
          }}>
            SkillVoice AI bridges the literacy gap by letting workers speak to learn. Converse with our AI tutor to master trades, take safety assessments, and unlock verified employment credentials instantly.
          </p>

          <div style={{ display: 'flex', gap: '20px', width: '100%', maxWidth: '520px' }}>
            <a href="#portals" style={{ flex: 1, textDecoration: 'none' }}>
              <button 
                className="btn-primary" 
                style={{ width: '100%', height: '56px', fontSize: '16px' }}
              >
                Access Portals <ArrowRight size={18} />
              </button>
            </a>
            <button 
              onClick={() => navigate('/roles')} 
              className="btn-secondary"
              style={{
                flex: 1,
                height: '56px',
                fontSize: '16px'
              }}
            >
              <Users size={18} /> Choose Role
            </button>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '24px', 
            marginTop: '56px',
            background: '#FFFFFF',
            border: '3px solid #000000',
            boxShadow: 'var(--shadow-main)',
            padding: '16px 24px',
            borderRadius: 'var(--radius-md)'
          }}>
            <button 
              className={`btn-speaker ${speaking ? 'speaking' : ''}`}
              onClick={handleSpeakIntro}
              style={{ width: '60px', height: '60px', flexShrink: 0 }}
              title="Listen to introduction"
            >
              <Volume2 size={24} />
            </button>
            <div>
              <span style={{ fontSize: '12px', fontWeight: '900', color: 'var(--tertiary)', display: 'block', letterSpacing: '0.05em', textTransform: 'uppercase' }}>TAP TO LISTEN</span>
              <p style={{ fontSize: '14px', color: '#000000', margin: 0, fontWeight: '700' }}>Hear our AI assistant explain how SkillVoice AI will transform your career.</p>
            </div>
          </div>
        </div>

        {/* Right Hero Interactive Simulator Box */}
        <div id="simulator" style={{
          background: '#FFFFFF',
          border: '4px solid #000000',
          borderRadius: 'var(--radius-xl)',
          padding: '40px',
          position: 'relative',
          boxShadow: '8px 8px 0px #000000'
        }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--danger)', border: '2px solid #000000' }}></div>
              <span style={{ fontSize: '13px', fontWeight: '900', color: '#000000', letterSpacing: '0.05em', textTransform: 'uppercase' }}>CONVERSATIONAL SIMULATOR</span>
            </div>
            <span style={{ fontSize: '12px', color: '#000000', background: 'var(--primary)', border: '2px solid #000000', padding: '4px 10px', fontWeight: '800', borderRadius: 'var(--radius-full)' }}>Interactive Demo</span>
          </div>

          {/* Chat Simulator Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* AI Speech Bubble */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #000000', color: '#000000', flexShrink: 0 }}>
                <Cpu size={18} />
              </div>
              <div style={{ background: '#F9F6EE', border: '3px solid #000000', padding: '16px 20px', borderRadius: '0px 12px 12px 12px', flex: 1, boxShadow: '4px 4px 0px #000000' }}>
                <span style={{ fontSize: '11px', color: 'var(--tertiary)', fontWeight: '900', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>INSTRUCTOR (AI)</span>
                <p style={{ fontSize: '15px', color: '#000000', margin: 0, lineHeight: '1.5', fontWeight: '700' }}>
                  "To service the AC compressor, what is the very first safety protocol you must execute before removing the outer access panel?"
                </p>
              </div>
            </div>

            {/* Simulated Voice wave */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', margin: '16px 0' }}>
              {[16, 32, 24, 40, 20, 14].map((h, i) => (
                <span key={i} style={{ 
                  width: '6px', 
                  height: `${h}px`, 
                  background: i % 2 === 0 ? 'var(--tertiary)' : 'var(--secondary)', 
                  border: '2px solid #000000', 
                  borderRadius: '3px' 
                }}></span>
              ))}
            </div>

            {/* Worker Speech Bubble */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexDirection: 'row-reverse' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #000000', color: '#000000', flexShrink: 0 }}>
                <Mic size={18} />
              </div>
              <div style={{ background: '#F9F6EE', border: '3px solid #000000', padding: '16px 20px', borderRadius: '12px 0px 12px 12px', flex: 1, boxShadow: '-4px 4px 0px #000000' }}>
                <span style={{ fontSize: '11px', color: '#000000', fontWeight: '900', display: 'block', marginBottom: '4px', textAlign: 'right', textTransform: 'uppercase' }}>WORKER (YOU)</span>
                <p style={{ fontSize: '15px', color: '#000000', margin: 0, lineHeight: '1.5', fontStyle: 'italic', textAlign: 'right', fontWeight: '700' }}>
                  "I will cut off the main isolator switch, execute lockout-tagout on the breaker box, and verify the circuit has zero voltage using my multimeter."
                </p>
              </div>
            </div>

            {/* Evaluation Result */}
            <div style={{
              background: 'var(--success)',
              border: '3px solid #000000',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              boxShadow: '4px 4px 0px #000000',
              marginTop: '10px'
            }}>
              <CheckCircle size={24} style={{ color: '#000000' }} />
              <div>
                <span style={{ fontSize: '13px', fontWeight: '900', color: '#000000', display: 'block', textTransform: 'uppercase' }}>AUTOMATED GRADING: 96% PROFICIENCY</span>
                <p style={{ fontSize: '13px', color: '#000000', margin: 0, fontWeight: '700' }}>Excellent answer. Demonstrates safe lockout-tagout and proper voltage verification protocols.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Access Portals Grid */}
      <section id="portals" style={{
        padding: '120px 48px',
        maxWidth: '1440px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 5
      }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <span style={{ fontSize: '14px', fontWeight: '900', color: 'var(--tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
            GET STARTED NOW
          </span>
          <h2 style={{ fontFamily: 'Archivo', fontSize: '52px', fontWeight: '900', color: '#000000', letterSpacing: '-1.5px', textTransform: 'uppercase' }}>
            Choose Your Access Portal
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '18px', maxWidth: '640px', margin: '16px auto 0', fontWeight: '600' }}>
            Select the appropriate option below to begin learning, managing your workforce, or sourcing verified, certified trade talent.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
          
          {/* Card 1: Learner Portal */}
          <div className="card-select" onClick={() => navigate('/worker')} style={{ padding: '48px 40px', alignItems: 'center', cursor: 'pointer', textAlign: 'center' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: 'var(--radius-md)', background: 'var(--secondary)', border: '3px solid #000000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000000', marginBottom: '24px', boxShadow: '3px 3px 0px #000000' }}>
              <BookOpen size={36} />
            </div>
            <h3 style={{ fontFamily: 'Archivo', fontSize: '28px', fontWeight: '900', color: '#000000', marginBottom: '12px', textTransform: 'uppercase' }}>Learner Login</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6', marginBottom: '32px', minHeight: '72px', fontWeight: '700' }}>
              Access your personalized voice training lessons, speak to complete active study modules, take diagnostic assessments, and claim your cryptographic trade credentials.
            </p>
            <button className="btn-primary" style={{ height: '52px', fontSize: '15px' }}>
              Start Learning <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 2: Company Portal */}
          <div className="card-select" onClick={() => navigate('/business/login')} style={{ padding: '48px 40px', alignItems: 'center', cursor: 'pointer', textAlign: 'center' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: 'var(--radius-md)', background: 'var(--tertiary)', border: '3px solid #000000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', marginBottom: '24px', boxShadow: '3px 3px 0px #000000' }}>
              <Building size={36} />
            </div>
            <h3 style={{ fontFamily: 'Archivo', fontSize: '28px', fontWeight: '900', color: '#000000', marginBottom: '12px', textTransform: 'uppercase' }}>Company Login</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6', marginBottom: '32px', minHeight: '72px', fontWeight: '700' }}>
              Manage your corporate dashboard, assign baseline skills assessments to employees, verify trade diagnostics, track upskilling records, and minimize field accidents.
            </p>
            <button className="btn-primary" style={{ height: '52px', fontSize: '15px', background: 'var(--tertiary)', color: '#FFFFFF' }}>
              Access Dashboard <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 3: Employer Hiring */}
          <div className="card-select" onClick={() => navigate('/admin')} style={{ padding: '48px 40px', alignItems: 'center', cursor: 'pointer', textAlign: 'center' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: 'var(--radius-md)', background: 'var(--success)', border: '3px solid #000000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000000', marginBottom: '24px', boxShadow: '3px 3px 0px #000000' }}>
              <Users size={36} />
            </div>
            <h3 style={{ fontFamily: 'Archivo', fontSize: '28px', fontWeight: '900', color: '#000000', marginBottom: '12px', textTransform: 'uppercase' }}>Employer Hiring</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6', marginBottom: '32px', minHeight: '72px', fontWeight: '700' }}>
              Source qualified candidates directly from a verified talent pool. Instantly validate worker proficiency grades, view actual audio testing records, and verify QR certificates.
            </p>
            <button className="btn-primary" style={{ height: '52px', fontSize: '15px', background: 'var(--success)' }}>
              Hire Trade Talent <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </section>

      {/* Simplified Descriptive Banner */}
      <section style={{
        background: 'var(--primary)',
        borderTop: '4px solid #000000',
        borderBottom: '4px solid #000000',
        padding: '80px 48px',
        zIndex: 5
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontFamily: 'Archivo', fontSize: '42px', fontWeight: '900', color: '#000000', letterSpacing: '-1.5px', marginBottom: '20px', textTransform: 'uppercase' }}>
              A Voice-First Bridge To Employment
            </h2>
            <p style={{ color: '#000000', fontSize: '18px', lineHeight: '1.6', marginBottom: '0', fontWeight: '700' }}>
              SkillVoice AI is a complete EdTech and recruitment ecosystem designed to remove the hurdles of traditional text-heavy assessment systems. By letting individuals learn using conversational speech and verifying their skills transparently, we guarantee safety, accuracy, and upward economic mobility for workers and industrial firms alike.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ background: '#FFFFFF', padding: '28px', borderRadius: 'var(--radius-lg)', border: '3px solid #000000', boxShadow: '4px 4px 0px #000000' }}>
              <span style={{ fontFamily: 'Archivo', fontSize: '36px', fontWeight: '900', color: 'var(--tertiary)' }}>100%</span>
              <span style={{ color: '#000000', fontSize: '16px', fontWeight: '800', display: 'block', marginTop: '4px', textTransform: 'uppercase' }}>Vocal Training</span>
              <p style={{ color: '#333333', fontSize: '13px', margin: '4px 0 0', fontWeight: '700' }}>Perfect for individuals wanting hands-free, screen-free learning.</p>
            </div>
            <div style={{ background: '#FFFFFF', padding: '28px', borderRadius: 'var(--radius-lg)', border: '3px solid #000000', boxShadow: '4px 4px 0px #000000' }}>
              <span style={{ fontFamily: 'Archivo', fontSize: '36px', fontWeight: '900', color: 'var(--secondary)' }}>Zero</span>
              <span style={{ color: '#000000', fontSize: '16px', fontWeight: '800', display: 'block', marginTop: '4px', textTransform: 'uppercase' }}>Paperwork Overhead</span>
              <p style={{ color: '#333333', fontSize: '13px', margin: '4px 0 0', fontWeight: '700' }}>Verifiable cryptographic records stored in the cloud.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section banner */}
      <section style={{
        padding: '100px 48px',
        maxWidth: '1440px',
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative',
        zIndex: 5
      }}>
        <h2 style={{ fontFamily: 'Archivo', fontSize: '48px', fontWeight: '900', color: '#000000', letterSpacing: '-1.5px', marginBottom: '20px', textTransform: 'uppercase' }}>
          Ready to unlock your true career potential?
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '20px', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6', fontWeight: '700' }}>
          Join industrial firms and thousands of vocational professionals testing, upskilling, and hiring entirely by voice.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <a href="#portals" style={{ textDecoration: 'none' }}>
            <button 
              className="btn-primary" 
              style={{ width: 'auto', padding: '0 40px', height: '56px', fontSize: '16px' }}
            >
              Select Your Portal <Zap size={18} />
            </button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '4px solid #000000',
        padding: '48px 48px',
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 5,
        background: '#FFFFFF',
        boxShadow: '0px -4px 0px #000000',
        marginTop: '60px',
        borderRadius: 'var(--radius-md) var(--radius-md) 0 0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'var(--tertiary)',
            border: '2px solid #000000',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: '900',
            fontSize: '14px',
            boxShadow: '2px 2px 0px #000000'
          }}>
            SV
          </div>
          <span style={{ fontSize: '15px', color: '#000000', fontWeight: '800', textTransform: 'uppercase' }}>
            &copy; 2026 SkillVoice AI. All rights reserved.
          </span>
        </div>

        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="#" style={{ color: '#000000', textDecoration: 'none', fontSize: '14px', fontWeight: '800', textTransform: 'uppercase' }} onMouseOver={e => e.target.style.color = 'var(--tertiary)'} onMouseOut={e => e.target.style.color = '#000000'}>Privacy Policy</a>
          <a href="#" style={{ color: '#000000', textDecoration: 'none', fontSize: '14px', fontWeight: '800', textTransform: 'uppercase' }} onMouseOver={e => e.target.style.color = 'var(--tertiary)'} onMouseOut={e => e.target.style.color = '#000000'}>Terms of Service</a>
          <a href="#" style={{ color: '#000000', textDecoration: 'none', fontSize: '14px', fontWeight: '800', textTransform: 'uppercase' }} onMouseOver={e => e.target.style.color = 'var(--tertiary)'} onMouseOut={e => e.target.style.color = '#000000'}>Support</a>
        </div>
      </footer>

    </div>
  );
}
