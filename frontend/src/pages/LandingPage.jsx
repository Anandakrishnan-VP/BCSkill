import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Volume2, Mic, CheckCircle, Users, 
  ArrowRight, Sparkles, Cpu, Zap, Building, BookOpen, Award
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

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-void)', overflowX: 'hidden', color: '#000000' }}>
      
      {/* Top Accent line */}
      <div style={{ height: '12px', background: 'var(--primary)', borderBottom: '4px solid #000000', width: '100%' }}></div>

      {/* Main Header */}
      <header style={{
        padding: '20px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1440px',
        margin: '20px auto 0',
        borderBottom: '4px solid #000000',
        background: '#FFFFFF',
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
          <button onClick={() => scrollToSection('services')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#000000', fontWeight: '800', fontSize: '16px', textTransform: 'uppercase' }}>Services</button>
          <button onClick={() => scrollToSection('simulator')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#000000', fontWeight: '800', fontSize: '16px', textTransform: 'uppercase' }}>Interactive Demo</button>
          <button 
            onClick={() => scrollToSection('portals')} 
            className="btn-primary" 
            style={{ 
              height: '46px', 
              padding: '0 24px', 
              fontSize: '15px', 
              width: 'auto',
              boxShadow: '3px 3px 0px #000000'
            }}
          >
            Access Portals <ArrowRight size={16} />
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '80px 48px',
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '64px',
        alignItems: 'center'
      }}>
        {/* Hero Copy */}
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

          <div style={{ display: 'flex', gap: '20px', width: '100%', maxWidth: '320px' }}>
            <button 
              onClick={() => scrollToSection('portals')} 
              className="btn-primary" 
              style={{ width: '100%', height: '56px', fontSize: '16px' }}
            >
              Get Started <ArrowRight size={18} />
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

        {/* Hero Interactive Simulator */}
        <div id="simulator" style={{
          background: '#FFFFFF',
          border: '4px solid #000000',
          borderRadius: 'var(--radius-xl)',
          padding: '40px',
          boxShadow: '8px 8px 0px #000000'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--danger)', border: '2px solid #000000' }}></div>
              <span style={{ fontSize: '13px', fontWeight: '900', color: '#000000', letterSpacing: '0.05em', textTransform: 'uppercase' }}>CONVERSATIONAL SIMULATOR</span>
            </div>
            <span style={{ fontSize: '12px', color: '#000000', background: 'var(--primary)', border: '2px solid #000000', padding: '4px 10px', fontWeight: '800', borderRadius: 'var(--radius-full)' }}>Interactive Demo</span>
          </div>

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

            {/* Voice Wave */}
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

      {/* Services Section */}
      <section id="services" style={{
        padding: '120px 48px',
        maxWidth: '1440px',
        margin: '0 auto',
        borderTop: '4px solid #000000'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <span style={{ fontSize: '14px', fontWeight: '900', color: 'var(--tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
            WHAT WE DO
          </span>
          <h2 style={{ fontFamily: 'Archivo', fontSize: '52px', fontWeight: '900', color: '#000000', letterSpacing: '-1.5px', textTransform: 'uppercase' }}>
            Core Platform Services
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '18px', maxWidth: '640px', margin: '16px auto 0', fontWeight: '600' }}>
            We provide a modern, hands-free upskilling framework and an automated verified hiring pipeline for industries.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
          {/* Service 1 */}
          <div style={{ background: '#FFFFFF', padding: '36px', borderRadius: 'var(--radius-lg)', border: '3px solid #000000', boxShadow: '5px 5px 0px #000000' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', background: 'var(--primary)', border: '2px solid #000000', display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'center', color: '#000000', marginBottom: '24px', boxShadow: '2px 2px 0px #000000' }}>
              <Volume2 size={28} />
            </div>
            <h4 style={{ fontFamily: 'Archivo', fontSize: '20px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '12px' }}>Conversational Learning</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', margin: 0, fontWeight: '700' }}>
              Hands-free, voice-first learning modules in local languages. Workers can speak to interact with safety manuals, skipping rigid text boxes.
            </p>
          </div>

          {/* Service 2 */}
          <div style={{ background: '#FFFFFF', padding: '36px', borderRadius: 'var(--radius-lg)', border: '3px solid #000000', boxShadow: '5px 5px 0px #000000' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', background: 'var(--secondary)', border: '2px solid #000000', display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'center', color: '#000000', marginBottom: '24px', boxShadow: '2px 2px 0px #000000' }}>
              <Cpu size={28} />
            </div>
            <h4 style={{ fontFamily: 'Archivo', fontSize: '20px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '12px' }}>AI Safety Diagnostics</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', margin: 0, fontWeight: '700' }}>
              Natural language evaluations that dynamically measure safety compliance, troubleshooting reasoning, and practical trade knowledge.
            </p>
          </div>

          {/* Service 3 */}
          <div style={{ background: '#FFFFFF', padding: '36px', borderRadius: 'var(--radius-lg)', border: '3px solid #000000', boxShadow: '5px 5px 0px #000000' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', background: 'var(--success)', border: '2px solid #000000', display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'center', color: '#000000', marginBottom: '24px', boxShadow: '2px 2px 0px #000000' }}>
              <Award size={28} />
            </div>
            <h4 style={{ fontFamily: 'Archivo', fontSize: '20px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '12px' }}>QR Verified Credentials</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', margin: 0, fontWeight: '700' }}>
              Instant generation of verifiable trade certificates. Secure QR codes link directly to public validation cards for employers.
            </p>
          </div>

          {/* Service 4 */}
          <div style={{ background: '#FFFFFF', padding: '36px', borderRadius: 'var(--radius-lg)', border: '3px solid #000000', boxShadow: '5px 5px 0px #000000' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', background: 'var(--tertiary)', border: '2px solid #000000', display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'center', color: '#FFFFFF', marginBottom: '24px', boxShadow: '2px 2px 0px #000000' }}>
              <Building size={28} />
            </div>
            <h4 style={{ fontFamily: 'Archivo', fontSize: '20px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '12px' }}>Workforce Management</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', margin: 0, fontWeight: '700' }}>
              Corporate portals allowing enterprises to register workers, assign course paths, and track overall safety and readiness scores.
            </p>
          </div>
        </div>
      </section>

      {/* Access Portals Grid */}
      <section id="portals" style={{
        padding: '120px 48px',
        maxWidth: '1440px',
        margin: '0 auto',
        borderTop: '4px solid #000000'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <span style={{ fontSize: '14px', fontWeight: '900', color: 'var(--tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
            GET STARTED NOW
          </span>
          <h2 style={{ fontFamily: 'Archivo', fontSize: '52px', fontWeight: '900', color: '#000000', letterSpacing: '-1.5px', textTransform: 'uppercase' }}>
            Access Portals
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
            <h3 style={{ fontFamily: 'Archivo', fontSize: '28px', fontWeight: '900', color: '#000000', marginBottom: '12px', textTransform: 'uppercase' }}>Learner Portal</h3>
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
            <h3 style={{ fontFamily: 'Archivo', fontSize: '28px', fontWeight: '900', color: '#000000', marginBottom: '12px', textTransform: 'uppercase' }}>Company Portal</h3>
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

      {/* CTA section banner */}
      <section style={{
        padding: '100px 48px',
        maxWidth: '1440px',
        margin: '0 auto',
        textAlign: 'center',
        borderTop: '4px solid #000000'
      }}>
        <h2 style={{ fontFamily: 'Archivo', fontSize: '48px', fontWeight: '900', color: '#000000', letterSpacing: '-1.5px', marginBottom: '20px', textTransform: 'uppercase' }}>
          Ready to unlock your true career potential?
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '20px', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6', fontWeight: '700' }}>
          Join industrial firms and thousands of vocational professionals testing, upskilling, and hiring entirely by voice.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <button 
            onClick={() => scrollToSection('portals')} 
            className="btn-primary" 
            style={{ width: 'auto', padding: '0 40px', height: '56px', fontSize: '16px' }}
          >
            Select Your Portal <Zap size={18} />
          </button>
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
        background: '#FFFFFF',
        boxShadow: '0px -4px 0px #000000',
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
