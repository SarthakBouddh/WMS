import React, { useState } from 'react';
import { Menu, Bell, ChevronDown, LogOut, User, ShieldCheck } from 'lucide-react';

export default function Header({ currentUser, activeTab, onToggleMobile, onLogout }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getTitle = () => {
    if (activeTab === 'home') {
      if (!currentUser) return 'Dashboard';
      if (currentUser.role === 'ROLE_ADMIN') return 'Admin Dashboard';
      if (currentUser.role === 'ROLE_MANAGER') return 'Manager Dashboard';
      if (currentUser.role === 'ROLE_SALES_REP') return 'Sales Rep Dashboard';
      if (currentUser.role === 'ROLE_DISPATCH_MANAGER') return 'Dispatch Operations Dashboard';
      return 'Dashboard';
    }
    const tabTitles = {
      shops: 'Shops Directory',
      orders: 'Orders Management',
      dispatch: 'Dispatch Tracker',
      reports: 'Analytics & Reports',
      profile: 'User Profile & Roles',
      stock: 'Inventory Catalog'
    };
    return tabTitles[activeTab] || 'Dashboard';
  };

  const getRoleDisplayName = (role) => {
    if (!role) return 'Authorized User';
    if (role === 'ROLE_ADMIN') return 'Admin';
    if (role === 'ROLE_MANAGER') return 'Manager';
    if (role === 'ROLE_SALES_REP') return 'Sales Rep';
    if (role === 'ROLE_DISPATCH_MANAGER') return 'Dispatch Mgr';
    if (role === 'ROLE_DRIVER') return 'Driver';
    return role.replace('ROLE_', '');
  };

  const firstName = currentUser?.fullName
    ? currentUser.fullName.split(' ')[0]
    : (currentUser?.username || 'User');

  const initial = currentUser?.fullName
    ? currentUser.fullName.charAt(0).toUpperCase()
    : (currentUser?.username ? currentUser.username.charAt(0).toUpperCase() : 'U');

  return (
    <header className="dms-header">
      <div className="header-left">
        <button className="menu-toggle-btn" onClick={onToggleMobile} title="Toggle Navigation Menu">
          <Menu size={20} />
        </button>
        <div className="header-title-group">
          <div className="greeting-text">Hello, {firstName} 👋</div>
          <h1 className="page-main-title">{getTitle()}</h1>
        </div>
      </div>

      <div className="header-right">
        {/* Notifications Icon with Badge */}
        <div style={{ position: 'relative' }}>
          <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
            <Bell size={18} />
            <span className="notification-badge">3</span>
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '48px',
              width: '280px',
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              padding: '12px',
              zIndex: 200
            }}>
              <div style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '8px', color: '#0f172a' }}>System Alerts (3)</div>
              <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ padding: '6px', background: '#fff7ed', borderRadius: '4px', borderLeft: '3px solid #f25c05' }}>
                  <strong>High-Speed Wireless Router</strong> is at low stock (12 units left).
                </div>
                <div style={{ padding: '6px', background: '#f0fdf4', borderRadius: '4px', borderLeft: '3px solid #22c55e' }}>
                  Order <strong>ORD-SD-904</strong> delivered to Modern Mart.
                </div>
                <div style={{ padding: '6px', background: '#eff6ff', borderRadius: '4px', borderLeft: '3px solid #3b82f6' }}>
                  New order from <strong>Apex Electronics & Mart</strong>.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge */}
        <div style={{ position: 'relative' }}>
          <div className="user-profile-badge" onClick={() => setShowUserMenu(!showUserMenu)}>
            <div className="user-avatar">{initial}</div>
            <div className="user-details">
              <span className="user-name">{currentUser?.fullName || currentUser?.username || 'User'}</span>
              <span className="user-role-label">{getRoleDisplayName(currentUser?.role)}</span>
            </div>
            <ChevronDown size={14} color="#94a3b8" />
          </div>

          {showUserMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '52px',
              width: '220px',
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              padding: '8px',
              zIndex: 200
            }}>
              <div style={{ padding: '8px', borderBottom: '1px solid #f1f5f9', fontSize: '0.8rem' }}>
                <div style={{ fontWeight: 700 }}>{currentUser?.fullName || currentUser?.username || 'User'}</div>
                <div style={{ color: '#64748b', fontSize: '0.725rem', marginTop: '2px' }}>
                  {getRoleDisplayName(currentUser?.role)}
                </div>
                {currentUser?.companyName && (
                  <div style={{ color: '#f25c05', fontSize: '0.7rem', fontWeight: 700, marginTop: '2px' }}>
                    {currentUser.companyName}
                  </div>
                )}
              </div>
              <button
                onClick={onLogout}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#dc2626',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  marginTop: '4px'
                }}
              >
                <LogOut size={14} /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
