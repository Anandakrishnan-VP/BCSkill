import React, { useState } from 'react';
import { UploadCloud, BookOpen, AlertCircle, CheckCircle, Settings } from 'lucide-react';

export default function SuperAdmin() {
  const [courseName, setCourseName] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('');
  const [success, setSuccess] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!courseName || !pdfFile) return alert("Please provide a course name and PDF file.");
    
    setIsGenerating(true);
    setStatus('Extracting text and running AI Syllabus Generation...');
    
    const formData = new FormData();
    formData.append('trade_domain', courseName);
    formData.append('file', pdfFile);

    try {
      const res = await fetch('http://localhost:8000/admin/upload_course', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok) {
        setSuccess(true);
        setStatus(`Success: ${data.message}`);
      } else {
        setStatus(`Error: ${data.detail}`);
      }
    } catch (err) {
      console.error(err);
      setStatus("Error: Failed to connect to backend.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="page-content" style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
        <Settings size={40} color="var(--primary)" style={{ filter: 'drop-shadow(0 0 12px rgba(0, 242, 255, 0.4))' }} />
        <h1 className="title-large" style={{ margin: 0 }}>Super Admin</h1>
      </div>

      <div style={{ 
        background: 'var(--glass-bg)', 
        padding: '48px', 
        borderRadius: 'var(--radius-xl)', 
        border: '1px solid var(--glass-border)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.5)'
      }}>
        <h2 style={{ fontSize: '28px', fontFamily: 'Outfit', fontWeight: '600', marginBottom: '8px', color: 'white' }}>AI Course Generator</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '16px' }}>Upload a PDF master manual. The AI will autonomously build the 5-module syllabus and vector database.</p>

        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '12px', color: 'var(--text-muted)' }}>Course Name (Trade Domain)</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. Advanced Plumbing, HVAC Tech" 
              value={courseName}
              onChange={e => setCourseName(e.target.value)}
              style={{ textAlign: 'left' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '12px', color: 'var(--text-muted)' }}>Master PDF Manual</label>
            <div style={{ 
              border: '2px dashed var(--glass-border)', 
              borderRadius: 'var(--radius-md)', 
              padding: '48px', 
              textAlign: 'center',
              background: 'rgba(0,0,0,0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
            >
              <UploadCloud size={48} color="var(--primary)" style={{ marginBottom: '16px', filter: 'drop-shadow(0 0 12px rgba(0, 242, 255, 0.4))' }} />
              <input 
                type="file" 
                accept="application/pdf"
                onChange={e => setPdfFile(e.target[0] || e.target.files[0])}
                style={{ display: 'block', margin: '0 auto', color: 'var(--text-muted)' }}
                required
              />
              <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Upload the official textbook or manual</p>
            </div>
          </div>

          {isGenerating ? (
            <div className="loader-container" style={{minHeight: '80px', marginTop: '16px'}}>
              <div className="neon-spinner"></div>
              <p style={{color: 'var(--primary)'}}>AI is generating your course curriculum...</p>
            </div>
          ) : (
            <button type="submit" className="btn-primary">
              <BookOpen size={24} />
              Generate AI Course
            </button>
          )}
        </form>

        {status && (
          <div style={{ 
            marginTop: '32px', 
            padding: '24px', 
            borderRadius: 'var(--radius-md)', 
            background: success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
            border: `1px solid ${success ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`,
            color: success ? 'var(--success)' : 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            {success ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
            <span style={{ fontWeight: '500' }}>{status}</span>
          </div>
        )}
      </div>
    </div>
  );
}
