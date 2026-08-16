import React from 'react';
import { Shield, User, LogOut, CheckCircle2 } from 'lucide-react';

const DEMO_ACCOUNTS = [
  { label: 'Admin', username: 'admin', pass: 'admin123', role: 'ROLE_ADMIN' },
  { label: 'Sales Rep (Raj)', username: 'raj_kapoor', pass: 'raj123', role: 'ROLE_SALES_REP' },
  { label: 'Sales Rep (Sunil)', username: 'sunil_yadav', pass: 'sunil123', role: 'ROLE_SALES_REP' },
  { label: 'Dispatch Mgr', username: 'dispatch_mgr', pass: 'dispatch123', role: 'ROLE_DISPATCH_MANAGER' },
  { label: 'Driver (MH01)', username: 'driver_vikram', pass: 'driver123', role: 'ROLE_DRIVER' },
  { label: 'Shop Owner', username: 'sharma_owner', pass: 'sharma123', role: 'ROLE_SHOP_OWNER' },
];

export default function RoleBanner({ currentUser, onSwitchRole, onLogout }) {
  return (
    <div className="demo-role-banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Shield size={18} color="#f25c05" />
        <div>
          <span style={{ fontWeight: 800, fontSize: '0.8rem', color: '#f8fafc' }}>
            {currentUser ? currentUser.fullName : 'Guest'}
          </span>
          <span style={{ fontSize: '0.7rem', color: '#cbd5e1', marginLeft: '6px', opacity: 0.8 }}>
            ({currentUser ? currentUser.role.replace('ROLE_', '') : 'Not Logged In'})
          </span>
        </div>
      </div>

      <div className="role-switcher-group">
        <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Switch Role:
        </span>
        {DEMO_ACCOUNTS.map((acc) => {
          const isActive = currentUser && currentUser.username === acc.username;
          return (
            <button
              key={acc.username}
              className={`role-btn ${isActive ? 'active' : ''}`}
              onClick={() => onSwitchRole(acc.username, acc.pass)}
            >
              {isActive && <CheckCircle2 size={12} />}
              {acc.label}
            </button>
          );
        })}
        {currentUser && (
          <button className="role-btn" onClick={onLogout} style={{ background: '#ef4444', borderColor: '#dc2626' }}>
            <LogOut size={12} /> Logout
          </button>
        )}
      </div>
    </div>
  );
}
