import { useState } from 'react';
import axios from 'axios';

const ResumeUpload = () => {
  const [email, setEmail] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !email) {
      alert('Please select a file and enter your email');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      await axios.post(`http://localhost:5050/upload-resume/${email}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Resume uploaded and parsed successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to upload resume');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-slate-900 px-4">
      <h2 className="text-3xl font-bold mb-6">Upload Your Resume</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4 p-3 rounded text-black w-full max-w-md"
      />
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="mb-4 p-3 rounded text-black w-full max-w-md"
      />
      <button
        onClick={handleUpload}
        className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded transition"
      >
        Upload Resume
      </button>
    </div>
  );
};

export default ResumeUpload;
