import React, { useState, useEffect } from 'react';
import { api, setAuthToken, getAuthToken } from './api';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoginView from './views/LoginView';

import HomeView from './views/HomeView';
import OrdersView from './views/OrdersView';
import DispatchView from './views/DispatchView';
import ShopsView from './views/ShopsView';
import StockView from './views/StockView';
import ReportsView from './views/ReportsView';
import ProfileView from './views/ProfileView';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const user = await api.getCurrentUser();
          setCurrentUser(user);
        } catch {
          setAuthToken(null);
          setCurrentUser(null);
        }
      } else {
        // No saved session: prompt user with Login screen
        setCurrentUser(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setActiveTab('home');
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#fff', fontFamily: 'sans-serif' }}>
        <h2>Starting DMS Distribution Management System...</h2>
      </div>
    );
  }

  // Render Login Page if user is not authenticated
  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="dms-layout">
      {/* Left Sidebar Navigation (Filtered strictly by role privileges) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        isOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="dms-main">
        <Header
          currentUser={currentUser}
          activeTab={activeTab}
          onToggleMobile={() => setMobileOpen(!mobileOpen)}
          onLogout={handleLogout}
        />

        <main className="dms-content-wrapper">
          {activeTab === 'home' && <HomeView currentUser={currentUser} onNavigate={setActiveTab} />}
          {activeTab === 'shops' && <ShopsView currentUser={currentUser} />}
          {activeTab === 'orders' && <OrdersView currentUser={currentUser} />}
          {activeTab === 'dispatch' && <DispatchView currentUser={currentUser} />}
          {activeTab === 'reports' && <ReportsView />}
          {activeTab === 'profile' && <ProfileView currentUser={currentUser} onLogout={handleLogout} />}
          {activeTab === 'stock' && <StockView currentUser={currentUser} />}
        </main>
      </div>
    </div>
  );
}
