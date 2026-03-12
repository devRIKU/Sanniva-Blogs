import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'motion/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      login(data.user);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-[var(--surface)] p-8 rounded-2xl border border-[var(--border)] shadow-xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-[var(--text)] mb-2">Admin Login</h1>
          <p className="text-[var(--secondary)] font-body">Sign in to manage your blogs.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[var(--accent)]/10 border border-[var(--accent)] text-[var(--accent)] rounded-lg text-sm font-mono text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-mono text-[var(--secondary)] uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] text-[var(--text)] font-body transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-mono text-[var(--secondary)] uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] text-[var(--text)] font-body transition-colors"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)] bg-[var(--bg)]"
            />
            <label htmlFor="remember" className="ml-2 text-sm font-body text-[var(--secondary)]">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[var(--accent)] text-white rounded-lg font-display font-bold text-lg hover:bg-opacity-90 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
