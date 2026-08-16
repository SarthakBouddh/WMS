import React, { useState, useEffect } from 'react';
import SuperAdminLogin from './components/SuperAdminLogin';
import SuperAdminDashboard from './components/SuperAdminDashboard';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('superadmin_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.role === 'ROLE_SUPER_ADMIN') {
          setUser(parsed);
        } else {
          localStorage.removeItem('superadmin_user');
          localStorage.removeItem('superadmin_token');
        }
      } catch {
        localStorage.removeItem('superadmin_user');
      }
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('superadmin_user');
    localStorage.removeItem('superadmin_token');
    setUser(null);
  };

  if (!user) {
    return <SuperAdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return <SuperAdminDashboard user={user} onLogout={handleLogout} />;
}
