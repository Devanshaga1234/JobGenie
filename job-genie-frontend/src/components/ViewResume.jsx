import { useState } from 'react';
import axios from 'axios';

const ViewResume = () => {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [newResume, setNewResume] = useState('');

  const handleFetch = async () => {
    try {
      const res = await axios.get(`http://localhost:5050/users/${email}`);
      setUser(res.data);
      setNewResume(res.data.Resume || '');
      setError('');
    } catch (err) {
      setUser(null);
      setNewResume('');
      setError(' Could not find user.');
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5050/users/${email}`, { resume: newResume });
      setUser({ ...user, Resume: newResume });
      setError('');
      alert('Resume updated!');
    } catch (err) {
      console.error(err);
      alert(' Failed to update resume.');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5050/users/${email}`);
      setUser({ ...user, Resume: null });
      setNewResume('');
      alert(' Resume deleted.');
    } catch (err) {
      console.error(err);
      alert(' Failed to delete resume.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-slate-900 px-4">
      <h2 className="text-3xl font-bold mb-4">Resume</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="mb-4 p-3 rounded text-black w-full max-w-md"
      />
      <button
        onClick={handleFetch}
        className="bg-indigo-600 px-6 py-2 rounded hover:bg-indigo-700 transition"
      >
        Fetch Resume
      </button>

      {error && <p className="text-red-400 mt-4">{error}</p>}

      {user && (
        <div className="mt-8 bg-white text-black rounded p-6 max-w-xl w-full shadow space-y-4">
          <h3 className="text-2xl font-semibold">{user.Name}</h3>
          <p><strong>Email:</strong> {user.Email}</p>
          <p><strong>Preferences:</strong> {user.Preferences}</p>

          <div>
            <h4 className="text-lg font-medium">Edit Resume:</h4>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2 mt-2"
              rows={5}
              value={newResume}
              onChange={(e) => setNewResume(e.target.value)}
              placeholder="Update your resume here..."
            />
          </div>

          <div className="flex justify-between space-x-4">
            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Update Resume
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewResume;
