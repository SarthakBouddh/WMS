import React from 'react';
import { LayoutGrid, Store, FileText, Truck, BarChart3, User, Package } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab, userRole }) {
  const isDriver = userRole === 'ROLE_DRIVER';

  // Customize bottom nav items based on role
  let navItems = [
    { id: 'home', label: 'HOME', icon: LayoutGrid },
    { id: 'shops', label: 'SHOPS', icon: Store },
    { id: 'orders', label: 'ORDERS', icon: FileText },
    { id: 'dispatch', label: 'DISPATCH', icon: Truck },
    { id: 'reports', label: 'REPORTS', icon: BarChart3 },
    { id: 'profile', label: 'PROFILE', icon: User },
  ];

  if (isDriver) {
    navItems = [
      { id: 'stock', label: 'STOCK', icon: Package },
      { id: 'dispatch', label: 'DISPATCH', icon: Truck },
      { id: 'profile', label: 'PROFILE', icon: User },
    ];
  }

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
