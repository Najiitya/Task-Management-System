import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! Now please log in.");
        navigate("/"); // Send them to the login page
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Server error. Is the backend running?");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl border-t-4 border-green-500">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Create Account</h2>
        
        {error && <p className="text-red-500 text-center mb-4 bg-red-100 p-2 rounded">{error}</p>}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input type="text" className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-green-500 outline-none" 
              value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-green-500 outline-none" 
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-green-500 outline-none" 
              value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-bold transition">
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link to="/" className="text-green-600 font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;