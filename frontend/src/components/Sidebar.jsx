import React from 'react';
import {
  LayoutDashboard,
  Store,
  FileText,
  Truck,
  BarChart3,
  User,
  Headphones,
  ShieldCheck,
  Package
} from 'lucide-react';

const ROLE_NAV_MAP = {
  ROLE_ADMIN: ['home', 'shops', 'orders', 'dispatch', 'reports', 'stock', 'profile'],
  ROLE_MANAGER: ['home', 'shops', 'orders', 'dispatch', 'reports', 'stock', 'profile'],
  ROLE_SALES_REP: ['home', 'shops', 'orders', 'stock', 'profile'],
  ROLE_DISPATCH_MANAGER: ['home', 'orders', 'dispatch', 'stock', 'profile']
};

export default function Sidebar({ activeTab, setActiveTab, currentUser, isOpen, onCloseMobile }) {
  const role = currentUser ? currentUser.role : 'ROLE_ADMIN';
  const allowedNavIds = ROLE_NAV_MAP[role] || ROLE_NAV_MAP.ROLE_ADMIN;

  const allNavItems = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'shops', label: 'Shops', icon: Store },
    { id: 'orders', label: 'Orders', icon: FileText },
    { id: 'dispatch', label: 'Dispatch', icon: Truck },
    { id: 'stock', label: 'Stock', icon: Package },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const visibleNavItems = allNavItems.filter(item => allowedNavIds.includes(item.id));

  const getRoleDisplayName = (r) => {
    if (r === 'ROLE_ADMIN') return 'System Admin';
    if (r === 'ROLE_MANAGER') return 'Manager';
    if (r === 'ROLE_SALES_REP') return 'Sales Rep';
    if (r === 'ROLE_DISPATCH_MANAGER') return 'Dispatch Manager';
    return r ? r.replace('ROLE_', '') : 'Authorized User';
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className={`mobile-sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onCloseMobile}
      />

      <aside className={`dms-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-icon">
            {currentUser?.companyName ? currentUser.companyName.substring(0, 2).toUpperCase() : 'WM'}
          </div>
          <div>
            <div className="brand-title">{currentUser?.companyName || 'WMS Portal'}</div>
            <div className="brand-subtitle">Distribution Management</div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item-btn ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id);
                  onCloseMobile();
                }}
              >
                <Icon size={18} color={isActive ? '#f25c05' : '#64748b'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Active Role Privilege Badge */}
        <div className="flex flex-col items-center justify-center p-2">
          <div className="mb-2 text-center text-xs font-bold tracking-wider text-orange-500 uppercase">
            ACTIVE ROLE
          </div>

          <div className="flex items-center justify-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1.5 text-sm font-semibold text-orange-500">
            <ShieldCheck size={14} className="text-orange-500" />
            <span>{getRoleDisplayName(role)}</span>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="flex flex-col items-center justify-center mt-3">
          <div className="mb-2 text-center text-sm font-bold tracking-wider text-orange-500 uppercase p-2" onClick={() => alert('Support Helpline: 1800-888-9999\nEmail: support@wms.com')}>
            <div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Need Help?</div>
              <div className="flex items-center gap-1 text-sm font-semibold text-orange-500">
                <Headphones size={16} color="#f25c05" />
                <div style={{ color: '#f25c05', fontWeight: 700 }}>Contact Support</div>
              </div>
            
            </div>
          </div>
          <div className='text-xs'>© {new Date().getFullYear()} WMS Portal. All rights reserved.</div>
        </div>
      </aside>
    </>
  );
}
