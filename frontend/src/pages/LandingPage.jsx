import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Volume2, Mic, CheckCircle, Shield, Award, Users, 
  ArrowRight, Globe, Sparkles, Cpu, Briefcase, Zap, Building, BookOpen
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
    <div style={{ minHeight: '100vh', background: 'var(--bg-void)', overflowX: 'hidden' }}>
      
      {/* Decorative top gradient bar */}
      <div style={{ height: '4px', background: 'linear-gradient(90deg, var(--primary), var(--secondary), var(--tertiary))', width: '100%' }}></div>

      {/* Navigation Header */}
      <header style={{
        padding: '24px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1440px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{
            width: '44px',
            height: '44px',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--bg-void)',
            fontWeight: '900',
            fontSize: '20px',
            boxShadow: '0 0 20px rgba(0, 242, 255, 0.4)'
          }}>
            SV
          </div>
          <span style={{
            fontFamily: 'Outfit',
            fontSize: '26px',
            fontWeight: '800',
            background: 'linear-gradient(90deg, #ffffff, #c7d2fe)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px'
          }}>
            SkillVoice <span style={{ color: 'var(--primary)', fontWeight: '500', fontSize: '18px' }}>AI</span>
          </span>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <a href="#portals" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '500', fontSize: '16px', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = 'var(--text-muted)'}>Access Portals</a>
          <a href="#simulator" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '500', fontSize: '16px', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = 'var(--text-muted)'}>Interactive Demo</a>
          <button 
            onClick={() => navigate('/roles')} 
            className="btn-primary" 
            style={{ 
              height: '46px', 
              padding: '0 24px', 
              fontSize: '15px', 
              width: 'auto',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 4px 15px rgba(0, 242, 255, 0.2)'
            }}
          >
            Choose Portal <ArrowRight size={16} />
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '100px 48px 80px',
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
            padding: '6px 16px',
            background: 'rgba(0, 242, 255, 0.05)',
            border: '1px solid rgba(0, 242, 255, 0.15)',
            borderRadius: 'var(--radius-full)',
            color: 'var(--primary)',
            fontSize: '13px',
            fontWeight: '700',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '28px'
          }}>
            <Sparkles size={14} /> Voice-First Vocational Learning & Hiring
          </div>

          <h1 style={{
            fontFamily: 'Outfit',
            fontSize: '64px',
            lineHeight: '1.1',
            fontWeight: '800',
            color: '#fff',
            letterSpacing: '-2px',
            marginBottom: '24px'
          }}>
            Upskill by <span style={{
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 15px rgba(0,242,255,0.2))'
            }}>Voice</span>. <br />
            Certified by <span style={{
              background: 'linear-gradient(135deg, var(--secondary), #d946ef)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>AI</span>.
          </h1>

          <p style={{
            color: 'var(--text-muted)',
            fontSize: '20px',
            lineHeight: '1.6',
            maxWidth: '560px',
            marginBottom: '48px'
          }}>
            SkillVoice AI bridges the literacy gap by letting workers speak to learn. Converse with our AI tutor to master trades, take safety assessments, and unlock verified employment credentials instantly.
          </p>

          <div style={{ display: 'flex', gap: '20px', width: '100%', maxWidth: '520px' }}>
            <a href="#portals" style={{ flex: 1, textDecoration: 'none' }}>
              <button 
                className="btn-primary" 
                style={{ width: '100%', height: '56px', fontSize: '16px', borderRadius: 'var(--radius-md)' }}
              >
                Access Portals <ArrowRight size={18} />
              </button>
            </a>
            <button 
              onClick={() => navigate('/roles')} 
              style={{
                flex: 1,
                height: '56px',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseOver={e => {
                e.currentTarget.style.borderColor = 'var(--glass-border-hover)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = 'var(--glass-border)';
                e.currentTarget.style.background = 'var(--glass-bg)';
              }}
            >
              <Users size={18} /> Choose Role
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '56px' }}>
            <button 
              className={`btn-speaker ${speaking ? 'speaking' : ''}`}
              onClick={handleSpeakIntro}
              style={{ width: '60px', height: '60px', flexShrink: 0 }}
              title="Listen to introduction"
            >
              <Volume2 size={24} />
            </button>
            <div>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary)', display: 'block', letterSpacing: '0.05em' }}>TAP TO LISTEN</span>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>Hear our AI assistant explain how SkillVoice AI will transform your career.</p>
            </div>
          </div>
        </div>

        {/* Right Hero Interactive Simulator Box */}
        <div id="simulator" style={{
          background: 'rgba(15, 23, 42, 0.4)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '40px',
          backdropFilter: 'blur(24px)',
          position: 'relative',
          boxShadow: '0 30px 60px -15px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)'
        }}>
          {/* Decorative neon line */}
          <div style={{ position: 'absolute', top: '-1px', left: '40px', right: '40px', height: '1px', background: 'linear-gradient(90deg, transparent, var(--primary), transparent)' }}></div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f43f5e', boxShadow: '0 0 10px #f43f5e' }}></div>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>CONVERSATIONAL SIMULATOR</span>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--primary)', background: 'rgba(0, 242, 255, 0.05)', border: '1px solid rgba(0, 242, 255, 0.15)', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>Interactive Demo</span>
          </div>

          {/* Chat Simulator Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* AI Speech Bubble */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0,242,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,242,255,0.2)', color: 'var(--primary)' }}>
                <Cpu size={16} />
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--glass-border)', padding: '16px 20px', borderRadius: '0px 16px 16px 16px', flex: 1 }}>
                <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '700', display: 'block', marginBottom: '4px' }}>INSTRUCTOR (AI)</span>
                <p style={{ fontSize: '15px', color: '#fff', margin: 0, lineHeight: '1.5' }}>
                  "To service the AC compressor, what is the very first safety protocol you must execute before removing the outer access panel?"
                </p>
              </div>
            </div>

            {/* Simulated Voice wave */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', margin: '16px 0' }}>
              <span style={{ width: '4px', height: '16px', background: 'var(--primary)', borderRadius: '2px', animation: 'spin 1.2s ease-in-out infinite alternate' }}></span>
              <span style={{ width: '4px', height: '32px', background: 'var(--primary)', borderRadius: '2px', animation: 'spin 0.8s ease-in-out infinite alternate-reverse' }}></span>
              <span style={{ width: '4px', height: '24px', background: 'var(--primary)', borderRadius: '2px', animation: 'spin 1s ease-in-out infinite alternate' }}></span>
              <span style={{ width: '4px', height: '40px', background: 'var(--secondary)', borderRadius: '2px', animation: 'spin 0.6s ease-in-out infinite alternate-reverse' }}></span>
              <span style={{ width: '4px', height: '20px', background: 'var(--primary)', borderRadius: '2px', animation: 'spin 1.1s ease-in-out infinite alternate' }}></span>
              <span style={{ width: '4px', height: '14px', background: 'var(--primary)', borderRadius: '2px', animation: 'spin 0.9s ease-in-out infinite alternate-reverse' }}></span>
            </div>

            {/* Worker Speech Bubble */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexDirection: 'row-reverse' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(176,38,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(176,38,255,0.2)', color: 'var(--secondary)' }}>
                <Mic size={16} />
              </div>
              <div style={{ background: 'linear-gradient(135deg, rgba(0, 242, 255, 0.03), rgba(176, 38, 255, 0.03))', border: '1px solid rgba(0,242,255,0.15)', padding: '16px 20px', borderRadius: '16px 0px 16px 16px', flex: 1 }}>
                <span style={{ fontSize: '11px', color: 'var(--secondary)', fontWeight: '700', display: 'block', marginBottom: '4px', textAlign: 'right' }}>WORKER (YOU)</span>
                <p style={{ fontSize: '15px', color: 'var(--text-main)', margin: 0, lineHeight: '1.5', fontStyle: 'italic', textAlign: 'right' }}>
                  "I will cut off the main isolator switch, execute lockout-tagout on the breaker box, and verify the circuit has zero voltage using my multimeter."
                </p>
              </div>
            </div>

            {/* Evaluation Result */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.04)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              display: 'flex',
              gap: '12px',
              alignItems: 'center'
            }}>
              <CheckCircle size={20} style={{ color: 'var(--success)' }} />
              <div>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--success)', display: 'block' }}>AUTOMATED GRADING: 96% PROFICIENCY</span>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Excellent answer. Demonstrates safe lockout-tagout and proper voltage verification protocols.</p>
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
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
            GET STARTED NOW
          </span>
          <h2 style={{ fontFamily: 'Outfit', fontSize: '48px', fontWeight: '800', color: '#fff', letterSpacing: '-1px' }}>
            Choose Your Access Portal
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '18px', maxWidth: '640px', margin: '16px auto 0' }}>
            Select the appropriate option below to begin learning, managing your workforce, or sourcing verified, certified trade talent.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          
          {/* Card 1: Learner Portal */}
          <div className="card-select animate-fade-in" onClick={() => navigate('/worker')} style={{ padding: '48px 40px', alignItems: 'center', cursor: 'pointer', textAlign: 'center' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(0, 242, 255, 0.08)', border: '1px solid rgba(0, 242, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '24px' }}>
              <BookOpen size={36} />
            </div>
            <h3 style={{ fontFamily: 'Outfit', fontSize: '26px', fontWeight: '800', color: '#fff', marginBottom: '12px' }}>Learner Login</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6', marginBottom: '32px', minHeight: '72px' }}>
              Access your personalized voice training lessons, speak to complete active study modules, take diagnostic assessments, and claim your cryptographic trade credentials.
            </p>
            <button className="btn-primary" style={{ height: '52px', fontSize: '15px', borderRadius: 'var(--radius-md)' }}>
              Start Learning <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 2: Company Portal */}
          <div className="card-select animate-fade-in" onClick={() => navigate('/business/login')} style={{ padding: '48px 40px', alignItems: 'center', cursor: 'pointer', textAlign: 'center' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(176, 38, 255, 0.08)', border: '1px solid rgba(176, 38, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)', marginBottom: '24px' }}>
              <Building size={36} />
            </div>
            <h3 style={{ fontFamily: 'Outfit', fontSize: '26px', fontWeight: '800', color: '#fff', marginBottom: '12px' }}>Company Login</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6', marginBottom: '32px', minHeight: '72px' }}>
              Manage your corporate dashboard, assign baseline skills assessments to employees, verify trade diagnostics, track upskilling records, and minimize field accidents.
            </p>
            <button className="btn-primary" style={{ height: '52px', fontSize: '15px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--secondary), var(--tertiary))', boxShadow: '0 8px 24px -8px rgba(176, 38, 255, 0.5)' }}>
              Access Dashboard <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 3: Employer Hiring */}
          <div className="card-select animate-fade-in" onClick={() => navigate('/admin')} style={{ padding: '48px 40px', alignItems: 'center', cursor: 'pointer', textAlign: 'center' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)', marginBottom: '24px' }}>
              <Users size={36} />
            </div>
            <h3 style={{ fontFamily: 'Outfit', fontSize: '26px', fontWeight: '800', color: '#fff', marginBottom: '12px' }}>Employer Hiring</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6', marginBottom: '32px', minHeight: '72px' }}>
              Source qualified candidates directly from a verified talent pool. Instantly validate worker proficiency grades, view actual audio testing records, and verify QR certificates.
            </p>
            <button className="btn-primary" style={{ height: '52px', fontSize: '15px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--success), #059669)', boxShadow: '0 8px 24px -8px rgba(16, 185, 129, 0.5)' }}>
              Hire Trade Talent <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </section>

      {/* Simplified Descriptive Banner */}
      <section style={{
        background: 'rgba(15, 23, 42, 0.2)',
        borderTop: '1px solid rgba(255, 255, 255, 0.03)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
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
            <h2 style={{ fontFamily: 'Outfit', fontSize: '36px', fontWeight: '800', color: '#fff', letterSpacing: '-1px', marginBottom: '20px' }}>
              A Voice-First Bridge To Employment
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '17px', lineHeight: '1.6', marginBottom: '0' }}>
              SkillVoice AI is a complete EdTech and recruitment ecosystem designed to remove the hurdles of traditional text-heavy assessment systems. By letting individuals learn using conversational speech and verifying their skills transparently, we guarantee safety, accuracy, and upward economic mobility for workers and industrial firms alike.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ background: 'var(--glass-bg)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
              <span style={{ fontFamily: 'Outfit', fontSize: '32px', fontWeight: '800', color: 'var(--primary)' }}>100%</span>
              <span style={{ color: '#fff', fontSize: '15px', fontWeight: '600', display: 'block', marginTop: '4px' }}>Vocal Training</span>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '4px 0 0' }}>Perfect for individuals wanting hands-free, screen-free learning.</p>
            </div>
            <div style={{ background: 'var(--glass-bg)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
              <span style={{ fontFamily: 'Outfit', fontSize: '32px', fontWeight: '800', color: 'var(--secondary)' }}>Zero</span>
              <span style={{ color: '#fff', fontSize: '15px', fontWeight: '600', display: 'block', marginTop: '4px' }}>Paperwork Overhead</span>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '4px 0 0' }}>Verifiable cryptographic records stored in the cloud.</p>
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
        {/* Radial glow background */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '250px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(176,38,255,0.12) 0%, transparent 70%)',
          zIndex: -1,
          filter: 'blur(40px)'
        }}></div>

        <h2 style={{ fontFamily: 'Outfit', fontSize: '44px', fontWeight: '800', color: '#fff', letterSpacing: '-1.5px', marginBottom: '20px' }}>
          Ready to unlock your true career potential?
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '18px', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}>
          Join industrial firms and thousands of vocational professionals testing, upskilling, and hiring entirely by voice.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <a href="#portals" style={{ textDecoration: 'none' }}>
            <button 
              className="btn-primary" 
              style={{ width: 'auto', padding: '0 40px', height: '56px', fontSize: '16px', borderRadius: 'var(--radius-md)' }}
            >
              Select Your Portal <Zap size={18} />
            </button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.03)',
        padding: '48px 48px',
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 5
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--bg-void)',
            fontWeight: '900',
            fontSize: '14px'
          }}>
            SV
          </div>
          <span style={{ fontSize: '15px', color: 'var(--text-muted)', fontWeight: '600' }}>
            &copy; 2026 SkillVoice AI. All rights reserved.
          </span>
        </div>

        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = 'var(--text-muted)'}>Privacy Policy</a>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = 'var(--text-muted)'}>Terms of Service</a>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = 'var(--text-muted)'}>Support</a>
        </div>
      </footer>

    </div>
  );
}
