import React from 'react';
import { User, Shield, Phone, Mail, CheckCircle2, Lock } from 'lucide-react';

const PERMISSION_MATRIX = {
  ROLE_ADMIN: [
    'Complete SarthakDev System Overview & Admin Dashboard',
    'Manage All Managers & Sales Representatives',
    'Create & Manage All Distribution Sales Orders',
    'Process Dispatch Requests & Logistics Assignments',
    'Update Dispatch Transit & Delivery Status',
    'Manage Retail Outlets Directory & Credit Balances',
    'Update Product Stock Catalog & Low Stock Warnings',
    'View Financial Analytics & Reports'
  ],
  ROLE_MANAGER: [
    'View Manager Dashboard & Territory Sales Performance',
    'Oversee Sales Representatives & Operations',
    'Approve Sales Orders & Pending Dispatches',
    'View Low Stock Warnings & Inventory Catalog',
    'Manage Regional Retail Outlets'
  ],
  ROLE_SALES_REP: [
    'Create Sales Orders for Retail Outlets / Clients',
    'Track Personal Collections & Sales Targets',
    'Filter Orders by Status (Pending, Dispatched, Delivered)',
    'View Outlets Directory'
  ],
  ROLE_DISPATCH_MANAGER: [
    'View Dispatch Queue & Vehicle Assignments',
    'Assign Transport Vehicles & Drivers to Pending Orders',
    'Update Dispatch Status (Dispatched -> In Transit -> Delivered)',
    'View SarthakDev Cargo & Transport Logs'
  ]
};

export default function ProfileView({ currentUser, onLogout }) {
  if (!currentUser) return null;

  const permissions = PERMISSION_MATRIX[currentUser.role] || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="dms-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="user-avatar" style={{ width: '56px', height: '56px', fontSize: '1.5rem' }}>
            {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : (currentUser.username ? currentUser.username.charAt(0).toUpperCase() : 'U')}
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#0f172a' }}>
              {currentUser.fullName || currentUser.username}
            </h2>
            <div style={{
              display: 'inline-block',
              background: '#fff4ed',
              color: '#f25c05',
              padding: '2px 10px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 800,
              marginTop: '4px'
            }}>
              {currentUser.role ? currentUser.role.replace('ROLE_', '') : 'USER'} {currentUser.companyName ? `· ${currentUser.companyName}` : ''}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div>Username: <strong>{currentUser.username}</strong></div>
          <div>Email: <strong>{currentUser.email || `${currentUser.username}@company.com`}</strong></div>
          <div>Company: <strong>{currentUser.companyName || 'Enterprise Tenant'}</strong></div>
        </div>
      </div>

      <div className="dms-card">
        <div className="dms-card-header">
          <h2 className="dms-card-title">Role-Based Privileges (RBAC)</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {permissions.map((perm, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#334155' }}>
              <CheckCircle2 size={18} color="#f25c05" />
              <span>{perm}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '24px' }}>
          <button
            onClick={onLogout}
            style={{
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
