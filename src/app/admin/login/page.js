'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Successful login, route to dashboard
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="erp-login-wrapper flex items-center justify-center min-h-screen bg-[#ECEFF1] p-[5%]">
      <div className="erp-login-card bg-white rounded-lg shadow-lg border-t-[6px] border-[#0B3C5D] w-full max-w-[440px] p-8">
        <h2 className="erp-login-title font-serif text-[#0B3C5D] text-2xl font-bold text-center mb-1">
          Involynk EduCMS
        </h2>
        <p className="erp-login-subtitle text-xs text-slate-500 text-center mb-6">
          Website Content Management System Login
        </p>

        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded border border-red-200 text-xs flex items-start gap-2.5 mb-5">
            <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
          <div className="form-group flex flex-col gap-1.5">
            <label className="form-label text-xs font-semibold text-slate-500 flex items-center gap-1">
              <User size={13} /> Username
            </label>
            <input 
              type="text" 
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter administrator username" 
            />
          </div>

          <div className="form-group flex flex-col gap-1.5">
            <label className="form-label text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Lock size={13} /> Password
            </label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-blue-primary w-full justify-center py-3 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="login-help-text mt-5 text-[11px] text-slate-500 bg-[#328CC1]/10 p-3 rounded border-l-3 border-[#328CC1]">
          <strong>Developer Demo Credentials:</strong>
          <ul className="list-disc pl-4 mt-1 flex flex-col gap-0.5">
            <li>Username: <code className="bg-white px-1 py-0.5 rounded font-bold">admin</code></li>
            <li>Password: <code className="bg-white px-1 py-0.5 rounded font-bold">admin123</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
