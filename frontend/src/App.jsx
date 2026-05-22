import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import RoleSelection from './pages/RoleSelection';
import Login from './pages/Login';
import LanguageSelection from './pages/LanguageSelection';
import TradeSelection from './pages/TradeSelection';
import TrainingSession from './pages/TrainingSession';
import Assessment from './pages/Assessment';
import Certificate from './pages/Certificate';
import Verify from './pages/Verify';
import Admin from './pages/Admin';
import CompanyLogin from './pages/CompanyLogin';
import BusinessDashboard from './pages/BusinessDashboard';
import DiagnosticSession from './pages/DiagnosticSession';
import WorkerDashboard from './pages/WorkerDashboard';
import Syllabus from './pages/Syllabus';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/worker" element={<Login />} />
        <Route path="/worker/dashboard" element={<Layout><WorkerDashboard /></Layout>} />
        <Route path="/syllabus" element={<Layout><Syllabus /></Layout>} />
        
        <Route path="/language" element={<LanguageSelection />} />
        <Route path="/verify/:id" element={<Verify />} />
        <Route path="/admin" element={<Admin />} />
        
        <Route path="/business/login" element={<CompanyLogin />} />
        <Route path="/business/dashboard" element={<BusinessDashboard />} />
        
        <Route path="/diagnostic" element={<Layout><DiagnosticSession /></Layout>} />
        <Route path="/trade" element={<Layout><TradeSelection /></Layout>} />
        <Route path="/training" element={<Layout><TrainingSession /></Layout>} />
        <Route path="/assessment" element={<Layout><Assessment /></Layout>} />
        <Route path="/certificate" element={<Layout><Certificate /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
