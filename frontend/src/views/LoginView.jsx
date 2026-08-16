import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { api, setAuthToken } from '../api';

export default function LoginView({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter username and password');
      return;
    }

    setLoading(true);

    try {
      const res = await api.login(username, password);

      setAuthToken(res.token);

      onLoginSuccess({
        username: res.username,
        fullName: res.fullName,
        role: res.role,
        companyName: res.companyName,
        companyId: res.companyId
      });
    } catch (err) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(circle at 50% 0%, #1e1b4b 0%, #090d16 100%)',
        padding: '20px',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(17, 24, 39, 0.95)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '40px 32px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          boxSizing: 'border-box'
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '32px'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              background:
                'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)'
            }}
          >
            <ShieldCheck size={36} color="#ffffff" />
          </div>

          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              margin: '0 0 6px 0',
              background:
                'linear-gradient(90deg, #818cf8, #c084fc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            SARTHAKDEV
          </h1>

          <p
            style={{
              color: '#94a3b8',
              fontSize: '0.875rem',
              margin: 0
            }}
          >
            Distribution Management System
          </p>
        </div>

        {/* Login Error */}
        {error && (
          <div
            style={{
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
            }}
          >
            <AlertCircle
              size={18}
              style={{ flexShrink: 0 }}
            />

            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div
            style={{
              marginBottom: '18px'
            }}
          >
            <label
              style={{
                display: 'block',
                color: '#cbd5e1',
                fontSize: '0.8rem',
                fontWeight: 700,
                marginBottom: '8px'
              }}
            >
              USERNAME
            </label>

            <div
              style={{
                position: 'relative'
              }}
            >
              <User
                size={18}
                color="#94a3b8"
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  pointerEvents: 'none'
                }}
              />

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
                disabled={loading}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 44px',
                  background: '#1f293d',
                  border: '1.5px solid #2b384e',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  color: '#f8fafc',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366f1';
                  e.target.style.boxShadow =
                    '0 0 0 3px rgba(99, 102, 241, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#2b384e';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div
            style={{
              marginBottom: '24px'
            }}
          >
            <label
              style={{
                display: 'block',
                color: '#cbd5e1',
                fontSize: '0.8rem',
                fontWeight: 700,
                marginBottom: '8px'
              }}
            >
              PASSWORD
            </label>

            <div
              style={{
                position: 'relative'
              }}
            >
              <Lock
                size={18}
                color="#94a3b8"
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  pointerEvents: 'none'
                }}
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 44px',
                  background: '#1f293d',
                  border: '1.5px solid #2b384e',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  color: '#f8fafc',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366f1';
                  e.target.style.boxShadow =
                    '0 0 0 3px rgba(99, 102, 241, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#2b384e';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '14px',
              background:
                'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              border: 'none',
              borderRadius: '10px',
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.65 : 1,
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow =
                  '0 10px 25px rgba(99, 102, 241, 0.45)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow =
                '0 8px 20px rgba(99, 102, 241, 0.3)';
            }}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Security Information */}
        <div
          style={{
            marginTop: '28px',
            padding: '12px 14px',
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: '10px',
            fontSize: '0.8rem',
            color: '#cbd5e1',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            lineHeight: 1.5
          }}
        >
          <ShieldCheck
            size={16}
            color="#818cf8"
            style={{ flexShrink: 0 }}
          />

          <div>
            <strong style={{ color: '#e2e8f0' }}>
              Secure Access
            </strong>
            <br />
            Authorized personnel only. Access privileges are
            enforced according to your assigned role.
          </div>
        </div>
      </div>
    </div>
  );
}