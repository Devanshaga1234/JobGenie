// Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '/Users/aaryangusain/JobGenie_Draft/job-genie-frontend/src/JOB_Genie_LOGO.jpg'; 

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-white bg-gradient-to-br from-slate-900 to-slate-950">
      <div className="container mx-auto text-center max-w-4xl">
        
        {/* Logo */}
        <img 
          src={logo} 
          alt="Job Genie Logo" 
          className="w-32 h-32 mx-auto mb-6"
        />

        {/* Title */}
        <h1 className="text-6xl font-extrabold mb-6 text-center">Job Genie</h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-300 mb-10 text-center max-w-2xl mx-auto">
          Your AI-powered career companion. Upload your resume and let the magic begin.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-6 justify-center">
          <Link to="/signup" className="bg-indigo-500 hover:bg-indigo-600 text-white py-4 px-8 rounded-xl text-lg font-semibold shadow-lg transition">
            Get Started
          </Link>
          <Link to="/upload" className="bg-indigo-700 hover:bg-indigo-800 text-white py-4 px-8 rounded-xl text-lg font-semibold shadow-lg transition">
            Upload Resume
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Home;
