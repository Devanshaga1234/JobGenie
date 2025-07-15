  import { useState } from 'react';
  import axios from 'axios';

  const JobMatches = () => {
    const [email, setEmail] = useState('');
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState('');

    const handleFetchJobs = async () => {
      if (!email) {
        alert('Please enter your email');
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5050/recommended-jobs/${email}`);
        setJobs(res.data);
        setError('');
      } catch (err) {
        console.error(err);
        setJobs([]);
        setError(err.response?.data?.error || 'Failed to fetch recommended jobs');
      }
    };

    const handleApply = async (jobId) => {
      try {
        await axios.post('http://localhost:5050/apply', {
          email: email,
          jobId: jobId
        });
        alert('Applied successfully!');
      } catch (err) {
        console.error(err);
        alert('Failed to apply.');
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 py-10 px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-6 text-white text-center">Recommended Jobs</h2>

          <div className="flex flex-col items-center mb-8">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="p-3 rounded text-black w-full max-w-md mb-4"
            />
            <button
              onClick={handleFetchJobs}
              className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded transition text-white"
            >
              Fetch Matches
            </button>
          </div>

          {error && <p className="text-red-400 text-center">{error}</p>}

          {jobs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map(job => (
                <div key={job.JobID} className="bg-white text-black rounded p-6 shadow flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{job.Title}</h3>
                    <p className="text-gray-700 mb-1"><strong>Company:</strong> {job.Company}</p>
                    <p className="text-gray-700 mb-1"><strong>Location:</strong> {job.Location}</p>
                  </div>
                  <button
                    onClick={() => handleApply(job.JobID)}
                    className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
                  >
                    Apply
                  </button>
                </div>
              ))}
            </div>
          )}

          {jobs.length === 0 && !error && (
            <p className="text-gray-400 text-center text-lg mt-10">
              You will see job matches here after fetching.
            </p>
          )}
        </div>
      </div>
    );
  };

  export default JobMatches;

