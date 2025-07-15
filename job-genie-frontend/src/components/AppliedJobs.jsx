import { useState } from 'react';
import axios from 'axios';

const AppliedJobs = () => {
  const [email, setEmail] = useState('');
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [error, setError] = useState('');

  const handleFetchAppliedJobs = async () => {
    if (!email) {
      alert('Please enter your email');
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5050/applied-jobs/${email}`);
      setAppliedJobs(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      setAppliedJobs([]);
      setError(err.response?.data?.error || 'Failed to fetch applied jobs');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 py-10 px-6">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold mb-6 text-white text-center">Applied Jobs</h2>

        <div className="flex flex-col items-center mb-8">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="p-3 rounded text-black w-full max-w-md mb-4"
          />
          <button
            onClick={handleFetchAppliedJobs}
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded transition text-white"
          >
            Fetch Applications
          </button>
        </div>

        {error && <p className="text-red-400 text-center">{error}</p>}

        {appliedJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {appliedJobs.map(job => (
              <div key={job.JobID} className="bg-white text-black rounded p-6 shadow">
                <h3 className="text-2xl font-bold mb-2">{job.Title}</h3>
                <p className="text-gray-700 mb-1"><strong>Company:</strong> {job.Company}</p>
                <p className="text-gray-700 mb-1"><strong>Location:</strong> {job.Location}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center text-lg mt-10">
            No applications found. Try fetching using your email!
          </p>
        )}
      </div>
    </div>
  );
};

export default AppliedJobs;
