import React, { useState } from 'react';
import { ShieldCheck, Lock, User, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';
import { api } from '../api';

export default function SuperAdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('SarthakBouddh');
  const [password, setPassword] = useState('123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.loginSuperAdmin(username, password);
      onLoginSuccess(data);
    } catch (err) {
      setError(err.message || 'Invalid Super Admin Credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 0%, #1e1b4b 0%, #090d16 100%)',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: 'rgba(17, 24, 39, 0.95)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '40px 32px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
      }}>
        {/* Header Badge */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)'
          }}>
            <ShieldCheck size={36} color="#ffffff" />
          </div>
          <h1 className="text-gradient" style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
            SUPER ADMIN PORTAL
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            Global Multi-Tenant Control & Client Provisioning
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '12px 16px',
            borderRadius: '10px',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px'
          }}>
            <AlertCircle size={18} shrink={0} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label className="form-label">Super Admin Username</label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }} />
              <input
                type="text"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 44px',
                  background: '#1f293d',
                  border: '1.5px solid #2b384e',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  color: '#f8fafc',
                  outline: 'none'
                }}
                placeholder="Enter Super Admin Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Super Admin Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }} />
              <input
                type="password"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 44px',
                  background: '#1f293d',
                  border: '1.5px solid #2b384e',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  color: '#f8fafc',
                  outline: 'none'
                }}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full flex items-center justify-center gap-[10px] p-[14px] bg-gradient-to-br from-indigo-500 to-violet-500 border-0 rounded-[10px] text-white text-base font-bold ${loading ? 'cursor-not-allowed opacity-[0.65]' : 'cursor-pointer opacity-100'} shadow-[0_8px_20px_rgba(99,102,241,0.3)] transition-all duration-200`}
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Access Super Admin Portal</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Credentials Info Badge */}
        <div style={{
          marginTop: '28px',
          padding: '12px 14px',
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: '10px',
          fontSize: '0.8rem',
          color: '#cbd5e1',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <KeyRound size={16} color="#818cf8" shrink={0} />
          <div>
            <strong>Super Admin Credentials:</strong><br />
            Username: <code style={{ color: '#a78bfa' }}>SarthakBouddh</code> | Password: <code style={{ color: '#a78bfa' }}>123</code>
          </div>
        </div>
      </div>
    </div>
  );
}
