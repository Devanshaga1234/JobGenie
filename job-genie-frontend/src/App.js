// src/App.js
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import UserSignup from './components/UserSignup';
import AboutUs from './components/AboutUs';
import ResumeUpload from './components/ResumeUpload';
import JobMatches from './components/JobMatches';
import AppliedJobs from './components/AppliedJobs';
import ViewResume from './components/ViewResume';

function App() {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 bg-slate-900 text-white pl-20 md:pl-64 transition-all">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<UserSignup />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/upload" element={<ResumeUpload />} />
          <Route path="/recommended" element={<JobMatches />} />
          <Route path="/applied" element={<AppliedJobs />} />
          <Route path="/resume" element={<ViewResume />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
