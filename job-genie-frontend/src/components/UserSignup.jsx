import { useState } from 'react';
import axios from 'axios';

const UserSignup = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    resume: '',
    preferences: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const fullName = `${form.firstName} ${form.lastName}`.trim();
      const payload = {
        name: fullName,
        email: form.email,
        resume: form.resume,
        preferences: form.preferences
      };

      const res = await axios.post('http://localhost:5050/users', payload);
      setMessage(res.data.message || ' Successfully signed up!');
      setForm({ firstName: '', lastName: '', email: '', resume: '', preferences: '' });
    } catch (err) {
      if (err.response?.status === 409) {
        setError('This email is already registered.');
      } else {
        setError(' Signup failed. Please try again.');
      }
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 text-white px-4">
      <div className="container mx-auto max-w-xl">
        <div className="bg-white text-slate-900 rounded-2xl shadow-2xl w-full p-10 mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8">Create Your Account</h2>
          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="John"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="john.doe@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resume</label>
              <textarea
                name="resume"
                value={form.resume}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Paste your resume text here"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferences</label>
              <input
                type="text"
                name="preferences"
                value={form.preferences}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. Remote, Finance, Bangalore"
              />
            </div>
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="w-full py-3 text-lg bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition"
              >
                Sign Up
              </button>
            </div>
          </form>

          {/* Display message or error */}
          {message && <p className="text-center mt-6 font-semibold text-green-600">{message}</p>}
          {error && <p className="text-center mt-6 font-semibold text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
