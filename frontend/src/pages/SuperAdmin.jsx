import { useState } from 'react';
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
    <div className="page-content" style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1, padding: '48px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
        <div style={{
          background: 'var(--primary)',
          border: '3px solid #000000',
          borderRadius: 'var(--radius-md)',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '3px 3px 0px #000000'
        }}>
          <Settings size={36} color="#000000" />
        </div>
        <h1 className="title-large" style={{ margin: 0, color: '#000000' }}>Super Admin</h1>
      </div>

      <div style={{ 
        background: '#FFFFFF', 
        padding: '48px', 
        borderRadius: 'var(--radius-md)', 
        border: '4px solid #000000',
        boxShadow: 'var(--shadow-main)'
      }}>
        <h2 style={{ fontSize: '28px', fontFamily: 'Archivo', fontWeight: '900', marginBottom: '8px', color: '#000000', textTransform: 'uppercase' }}>AI Course Generator</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '16px', fontWeight: '700' }}>Upload a PDF master manual. The AI will autonomously build the 5-module syllabus and vector database.</p>

        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '900', marginBottom: '12px', color: '#000000', textTransform: 'uppercase', fontSize: '14px' }}>Course Name (Trade Domain)</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. Advanced Plumbing, HVAC Tech" 
              value={courseName}
              onChange={e => setCourseName(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '900', marginBottom: '12px', color: '#000000', textTransform: 'uppercase', fontSize: '14px' }}>Master PDF Manual</label>
            <div style={{ 
              border: '3px dashed #000000', 
              borderRadius: 'var(--radius-md)', 
              padding: '48px', 
              textAlign: 'center',
              background: 'var(--bg-void)',
              cursor: 'pointer'
            }}>
              <UploadCloud size={48} color="#000000" style={{ marginBottom: '16px' }} />
              <input 
                type="file" 
                accept="application/pdf"
                onChange={e => setPdfFile(e.target[0] || e.target.files[0])}
                style={{ display: 'block', margin: '0 auto', color: '#000000', fontWeight: '700' }}
                required
              />
              <p style={{ marginTop: '16px', color: 'var(--text-muted)', fontWeight: '700' }}>Upload the official textbook or manual</p>
            </div>
          </div>

          {isGenerating ? (
            <div className="loader-container" style={{ minHeight: '80px', marginTop: '16px' }}>
              <div className="neon-spinner" style={{ width: '48px', height: '48px', borderWidth: '5px' }}></div>
              <p style={{ color: '#000000', fontWeight: '900', textTransform: 'uppercase' }}>AI is generating your course curriculum...</p>
            </div>
          ) : (
            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', height: '64px', fontSize: '20px' }}>
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
            background: success ? 'var(--success)' : 'var(--danger)',
            border: '3px solid #000000',
            boxShadow: '3px 3px 0px #000000',
            color: success ? '#000000' : '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            {success ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
            <span style={{ fontWeight: '900', textTransform: 'uppercase' }}>{status}</span>
          </div>
        )}
      </div>
    </div>
  );
}
