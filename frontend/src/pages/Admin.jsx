import { useState, useEffect } from 'react';
import { LOCATION_DATA, STATES } from '../locationData';
import { CheckCircle, AlertTriangle, Upload, BookOpen, Users, FolderOpen } from 'lucide-react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('talent'); // 'talent' or 'courses'
  const [workers, setWorkers] = useState([]);
  const [domainFilter, setDomainFilter] = useState('All');
  const [stateFilter, setStateFilter] = useState('All');
  const [districtFilter, setDistrictFilter] = useState('All');

  // Course generation state
  const [tradeDomain, setTradeDomain] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [error, setError] = useState(null);
  const [coursesList, setCoursesList] = useState([]);

  useEffect(() => {
    let active = true;
    const fetchWorkers = async () => {
      try {
        const res = await fetch(`http://localhost:8000/admin/workers?domain=${domainFilter}&state=${stateFilter}&district=${districtFilter}`);
        const data = await res.json();
        if (active) {
          setWorkers(data.workers);
        }
      } catch (e) {
        console.error(e);
      }
    };
    if (activeTab === 'talent') {
      fetchWorkers();
    }
    return () => { active = false; };
  }, [domainFilter, stateFilter, districtFilter, activeTab]);

  const fetchCourses = async () => {
    try {
      const res = await fetch('http://localhost:8000/courses');
      const data = await res.json();
      if (data.status === 'success') {
        setCoursesList(data.courses);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleUploadCourse = async (e) => {
    e.preventDefault();
    if (!tradeDomain.trim() || !pdfFile) return;
    
    setUploading(true);
    setError(null);
    setUploadMessage('Reading manual and extracting text...');
    
    const formData = new FormData();
    formData.append('trade_domain', tradeDomain.trim());
    formData.append('file', pdfFile);
    
    let currentStep = 0;
    const stepInterval = setInterval(() => {
      currentStep += 1;
      if (currentStep === 1) {
        setUploadMessage('OCR running on manual pages...');
      } else if (currentStep === 2) {
        setUploadMessage('AI is designing curriculum modules & topics...');
      } else if (currentStep === 3) {
        setUploadMessage('Generating training lesson contents...');
      } else if (currentStep === 4) {
        setUploadMessage('Indexing questions & database sync...');
      }
    }, 8000);

    try {
      const res = await fetch('http://localhost:8000/admin/upload_course', {
        method: 'POST',
        body: formData
      });
      clearInterval(stepInterval);
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setUploadMessage('Course created successfully!');
        setTradeDomain('');
        setPdfFile(null);
        const fileInput = document.getElementById('pdf-upload-input');
        if (fileInput) fileInput.value = '';
        fetchCourses();
      } else {
        setError(data.detail || 'Course generation failed.');
      }
    } catch (err) {
      clearInterval(stepInterval);
      setError(err.message || 'An error occurred.');
    } finally {
      setUploading(false);
    }
  };

  const exportCsv = () => {
    if (workers.length === 0) return;
    const header = Object.keys(workers[0]).join(',');
    const rows = workers.map(w => Object.values(w).join(',')).join('\n');
    const csv = header + '\n' + rows;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'certified_workers.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="page-content" style={{ minHeight: '100vh', padding: '48px', background: 'var(--bg-void)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '48px' }}>
          <button 
            onClick={() => setActiveTab('talent')}
            style={{
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: '900',
              textTransform: 'uppercase',
              background: activeTab === 'talent' ? 'var(--primary)' : '#FFFFFF',
              color: '#000000',
              border: '4px solid #000000',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              boxShadow: activeTab === 'talent' ? 'var(--shadow-lg)' : 'var(--shadow-main)',
              transform: activeTab === 'talent' ? 'translate(-2px, -2px)' : 'none',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Users size={20} /> Hire Talent
          </button>
          <button 
            onClick={() => { setActiveTab('courses'); fetchCourses(); }}
            style={{
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: '900',
              textTransform: 'uppercase',
              background: activeTab === 'courses' ? 'var(--secondary)' : '#FFFFFF',
              color: '#000000',
              border: '4px solid #000000',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              boxShadow: activeTab === 'courses' ? 'var(--shadow-lg)' : 'var(--shadow-main)',
              transform: activeTab === 'courses' ? 'translate(-2px, -2px)' : 'none',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FolderOpen size={20} /> Course CMS & Agent
          </button>
        </div>

        {activeTab === 'talent' && (
          <div className="animate-fade-in">
            <h1 className="title-large" style={{ textAlign: 'left', marginBottom: '8px', color: '#000000', fontSize: '48px' }}>Hire Talent</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '48px', fontSize: '20px', fontWeight: '800', textTransform: 'uppercase' }}>Verified & Certified Professionals Ready for Work</p>
            
            <div style={{
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '24px', 
              marginBottom: '48px', 
              background: '#FFFFFF', 
              padding: '32px', 
              borderRadius: 'var(--radius-md)', 
              border: '4px solid #000000', 
              alignItems: 'flex-end',
              boxShadow: 'var(--shadow-main)'
            }}>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '900', color: '#000000', textTransform: 'uppercase', fontSize: '14px', letterSpacing: '1px' }}>Domain Expertise</label>
                <select 
                  value={domainFilter} 
                  onChange={(e) => setDomainFilter(e.target.value)}
                  style={{
                    width: '100%', padding: '16px', borderRadius: 'var(--radius-md)', 
                    background: 'var(--bg-void)', border: '3px solid #000000', color: '#000000', fontSize: '16px', fontWeight: '700', outline: 'none'
                  }}
                >
                  <option value="All">All Domains</option>
                  <option value="AC Technician">AC Technician</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Fitter">Fitter</option>
                  <option value="Welder">Welder</option>
                  <option value="Mason">Mason</option>
                </select>
              </div>
              
              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '900', color: '#000000', textTransform: 'uppercase', fontSize: '14px', letterSpacing: '1px' }}>State / Region</label>
                <select 
                  value={stateFilter} 
                  onChange={(e) => { setStateFilter(e.target.value); setDistrictFilter('All'); }}
                  style={{
                    width: '100%', padding: '16px', borderRadius: 'var(--radius-md)', 
                    background: 'var(--bg-void)', border: '3px solid #000000', color: '#000000', fontSize: '16px', fontWeight: '700', outline: 'none'
                  }}
                >
                  <option value="All">All States</option>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '900', color: '#000000', textTransform: 'uppercase', fontSize: '14px', letterSpacing: '1px' }}>District / City</label>
                <select 
                  value={districtFilter} 
                  onChange={(e) => setDistrictFilter(e.target.value)}
                  disabled={stateFilter === 'All'}
                  style={{
                    width: '100%', padding: '16px', borderRadius: 'var(--radius-md)', 
                    background: 'var(--bg-void)', border: '3px solid #000000', color: '#000000', fontSize: '16px', fontWeight: '700', outline: 'none',
                    opacity: stateFilter === 'All' ? 0.5 : 1
                  }}
                >
                  <option value="All">All Districts</option>
                  {stateFilter !== 'All' && LOCATION_DATA[stateFilter].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              
              <button 
                className="btn-primary" 
                style={{ padding: '0 32px', height: '58px', fontSize: '16px', width: 'auto' }}
                onClick={exportCsv}
              >
                Export List (CSV)
              </button>
            </div>
            
            <div style={{
              background: '#FFFFFF', 
              borderRadius: 'var(--radius-md)', 
              padding: '40px', 
              border: '4px solid #000000',
              boxShadow: 'var(--shadow-main)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                 <h3 style={{ fontSize: '28px', color: '#000000', fontWeight: '900', textTransform: 'uppercase' }}>Certified Talent Pool</h3>
                 <span style={{ 
                   background: 'var(--tertiary)', 
                   color: '#FFFFFF', 
                   padding: '8px 24px', 
                   borderRadius: 'var(--radius-full)', 
                   fontWeight: '900',
                   border: '2px solid #000000',
                   boxShadow: '2px 2px 0px #000000',
                   textTransform: 'uppercase'
                 }}>
                   {workers.length} Available
                 </span>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#000000' }}>
                  <thead>
                    <tr style={{ color: '#000000', fontSize: '14px', textTransform: 'uppercase', borderBottom: '3px solid #000000' }}>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '900' }}>Worker Name</th>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '900' }}>Domain</th>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '900' }}>Location</th>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '900' }}>Readiness Score</th>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '900' }}>Date Certified</th>
                      <th style={{ padding: '16px 24px', textAlign: 'center', fontWeight: '900' }}>Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workers.map((w, i) => (
                      <tr key={i} style={{ borderBottom: '2px solid #000000', fontWeight: '700' }}>
                        <td style={{ padding: '24px', fontWeight: '900', fontSize: '18px' }}>
                          {w.name || "Verified Worker"}
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'monospace', fontWeight: '700' }}>
                            {w.cert_id}
                          </div>
                        </td>
                        <td style={{ padding: '24px', textTransform: 'uppercase' }}>{w.trade}</td>
                        <td style={{ padding: '24px', textTransform: 'uppercase' }}>{w.district && w.state ? `${w.district}, ${w.state}` : "Unknown"}</td>
                        <td style={{ padding: '24px' }}>
                          <span style={{
                            background: 'var(--success)', 
                            color: '#000000', 
                            padding: '6px 16px', 
                            borderRadius: 'var(--radius-md)', 
                            fontWeight: '900',
                            border: '2px solid #000000',
                            boxShadow: '2px 2px 0px #000000'
                          }}>
                            {w.score}%
                          </span>
                        </td>
                        <td style={{ padding: '24px', color: 'var(--text-muted)' }}>{new Date(w.date_certified).toLocaleDateString()}</td>
                        <td style={{ padding: '24px', textAlign: 'center' }}>
                          <div style={{
                            background: 'var(--primary)', 
                            border: '2px solid #000000',
                            padding: '8px 16px', 
                            borderRadius: 'var(--radius-md)', 
                            display: 'inline-block',
                            fontWeight: '900', 
                            color: '#000000', 
                            letterSpacing: '1px',
                            boxShadow: '2px 2px 0px #000000'
                          }}>
                            {w.phone ? `+91 ${w.phone.slice(0,5)} ${w.phone.slice(5)}` : 'No Contact'}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {workers.length === 0 && (
                      <tr>
                        <td colSpan="6" style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: '900', textTransform: 'uppercase' }}>
                          <div style={{ fontSize: '24px', marginBottom: '8px', color: '#000000' }}>No talent found</div>
                          <p>Try adjusting your domain or location filters.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            <div style={{ textAlign: 'left' }}>
              <h1 className="title-large" style={{ margin: 0, fontSize: '48px' }}>Course CMS & Agent</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '20px', fontWeight: '800', textTransform: 'uppercase', marginTop: '8px' }}>
                Upload PDF manual to automatically generate structured syllabus, training lessons, and certification exams
              </p>
            </div>

            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
              {/* Left Form Column */}
              <div style={{
                flex: '1',
                minWidth: '400px',
                background: '#FFFFFF',
                border: '4px solid #000000',
                borderRadius: 'var(--radius-md)',
                padding: '40px',
                boxShadow: 'var(--shadow-main)'
              }}>
                <h3 style={{ fontSize: '28px', color: '#000000', fontWeight: '900', textTransform: 'uppercase', marginBottom: '24px' }}>
                  Generate New Course
                </h3>
                
                <form onSubmit={handleUploadCourse} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '12px', fontWeight: '900', color: '#000000', textTransform: 'uppercase', fontSize: '14px', letterSpacing: '1px' }}>
                      Course Name (Trade Domain)
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Solar Installer, AC Technician" 
                      value={tradeDomain}
                      onChange={(e) => setTradeDomain(e.target.value)}
                      disabled={uploading}
                      required
                      style={{
                        width: '100%', 
                        padding: '16px', 
                        borderRadius: 'var(--radius-md)', 
                        background: 'var(--bg-void)', 
                        border: '3px solid #000000', 
                        color: '#000000', 
                        fontSize: '16px', 
                        fontWeight: '700', 
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '12px', fontWeight: '900', color: '#000000', textTransform: 'uppercase', fontSize: '14px', letterSpacing: '1px' }}>
                      Training Manual (PDF)
                    </label>
                    <div style={{
                      border: '3px dashed #000000',
                      borderRadius: 'var(--radius-md)',
                      padding: '32px',
                      textAlign: 'center',
                      background: 'var(--bg-void)',
                      position: 'relative',
                      cursor: 'pointer'
                    }}>
                      <input 
                        type="file" 
                        id="pdf-upload-input"
                        accept=".pdf"
                        onChange={(e) => setPdfFile(e.target.files[0])}
                        disabled={uploading}
                        required
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          cursor: 'pointer'
                        }}
                      />
                      <Upload size={48} style={{ margin: '0 auto 16px', color: '#000000' }} />
                      <p style={{ fontWeight: '800', fontSize: '16px', color: '#000000' }}>
                        {pdfFile ? pdfFile.name : "DRAG & DROP OR CLICK TO UPLOAD MANUAL"}
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', marginTop: '8px' }}>
                        PDF format only (standard or scanned with images/text)
                      </p>
                    </div>
                  </div>

                  {error && (
                    <div style={{
                      background: '#FEE2E2',
                      border: '2px solid var(--danger)',
                      borderRadius: 'var(--radius-md)',
                      padding: '16px',
                      color: 'var(--danger)',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <AlertTriangle size={20} />
                      {error}
                    </div>
                  )}

                  {uploading && (
                    <div style={{
                      background: '#FEF3C7',
                      border: '2px solid var(--tertiary)',
                      borderRadius: 'var(--radius-md)',
                      padding: '24px',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '16px'
                    }}>
                      <div className="neon-spinner" style={{ width: '40px', height: '40px' }}></div>
                      <div>
                        <p style={{ fontWeight: '900', color: '#000000', textTransform: 'uppercase', fontSize: '14px', letterSpacing: '1px' }}>
                          Course Generation Agent Active
                        </p>
                        <p style={{ fontWeight: '700', color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
                          {uploadMessage}
                        </p>
                      </div>
                    </div>
                  )}

                  {!uploading && (
                    <button 
                      type="submit" 
                      className="btn-primary" 
                      style={{ padding: '20px', fontSize: '18px', width: '100%' }}
                    >
                      Generate Course & Syllabus
                    </button>
                  )}
                </form>
              </div>

              {/* Right List Column */}
              <div style={{
                flex: '1',
                minWidth: '400px',
                background: '#FFFFFF',
                border: '4px solid #000000',
                borderRadius: 'var(--radius-md)',
                padding: '40px',
                boxShadow: 'var(--shadow-main)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <h3 style={{ fontSize: '28px', color: '#000000', fontWeight: '900', textTransform: 'uppercase', marginBottom: '24px' }}>
                  Available Courses
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', maxHeight: '400px' }}>
                  {coursesList.map((course, idx) => (
                    <div key={course} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '3px solid #000000',
                      borderRadius: 'var(--radius-md)',
                      padding: '20px 24px',
                      background: 'var(--bg-void)',
                      boxShadow: '2px 2px 0px #000000'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                          background: idx % 3 === 0 ? 'var(--primary)' : idx % 3 === 1 ? 'var(--secondary)' : 'var(--tertiary)',
                          width: '48px',
                          height: '48px',
                          borderRadius: 'var(--radius-md)',
                          border: '2px solid #000000',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: idx % 3 === 2 ? '#FFFFFF' : '#000000'
                        }}>
                          <BookOpen size={24} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '18px', fontWeight: '900', color: '#000000', textTransform: 'uppercase', margin: 0 }}>{course}</h4>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>STATUS: LIVE</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {coursesList.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)', fontWeight: '800' }}>
                      No active courses in database.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
