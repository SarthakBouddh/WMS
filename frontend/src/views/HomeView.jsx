import React, { useState, useEffect } from 'react';
import { api } from '../api';
import {
  Wallet,
  Store,
  FileText,
  Truck,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Package,
  Plus,
  ShoppingBag,
  Briefcase
} from 'lucide-react';

export default function HomeView({ currentUser, onNavigate }) {
  const [summary, setSummary] = useState(null);
  const [managers, setManagers] = useState([]);
  const [shops, setShops] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [sumData, mgrData, shopData, ordData, prodData] = await Promise.all([
          api.getSummary(),
          api.getManagers(),
          api.getShops(),
          api.getOrders(),
          api.getProducts()
        ]);
        setSummary(sumData);
        setManagers(Array.isArray(mgrData) ? mgrData : []);
        setShops(Array.isArray(shopData) ? shopData : []);
        setOrders(Array.isArray(ordData) ? ordData : []);
        setProducts(Array.isArray(prodData) ? prodData : []);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [currentUser]);

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
        <h2>Loading Role Dashboard...</h2>
      </div>
    );
  }

  const role = currentUser ? currentUser.role : 'ROLE_ADMIN';

  // SVG Sparkline Wave Helper
  const Sparkline = ({ strokeColor, fillColor }) => (
    <svg className="metric-sparkline" viewBox="0 0 120 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 20 C 20 24, 40 8, 60 18 C 80 26, 100 12, 120 16"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );

  // Filter items for bottom lists
  const recentShops = shops.slice(0, 4);
  const recentOrders = orders.slice(0, 4);
  const pendingDispatches = orders.filter(o => o.status === 'PENDING').slice(0, 4);
  const lowStockProducts = products.filter(p => p.stockQuantity <= (p.minReorderLevel || 10)).slice(0, 2);

  return (
    <div className="dashboard-container">
      {/* 1. TOP METRIC CARDS ROW (6 Cards) */}
      <div className="dashboard-metrics-grid">
        {/* Card 1: Collected Today */}
        <div className="metric-card">
          <div className="metric-top">
            <div className="metric-icon-box" style={{ background: '#fff7ed', color: '#ea580c' }}>
              <Wallet size={20} />
            </div>
            <div className="metric-info">
              <span className="metric-label">Collected Today</span>
              <span className="metric-value">₹{summary?.collectedToday || 0}</span>
            </div>
          </div>
          <Sparkline strokeColor="#ea580c" />
        </div>

        {/* Card 2: Outstanding */}
        <div className="metric-card">
          <div className="metric-top">
            <div className="metric-icon-box" style={{ background: '#fff7ed', color: '#d97706' }}>
              <Wallet size={20} />
            </div>
            <div className="metric-info">
              <span className="metric-label">Outstanding</span>
              <span className="metric-value">₹{(summary?.outstandingTotal || 71008).toLocaleString('en-IN')}</span>
            </div>
          </div>
          <Sparkline strokeColor="#d97706" />
        </div>

        {/* Card 3: Shops */}
        <div className="metric-card">
          <div className="metric-top">
            <div className="metric-icon-box" style={{ background: '#eff6ff', color: '#3b82f6' }}>
              <Store size={20} />
            </div>
            <div className="metric-info">
              <span className="metric-label">Shops</span>
              <span className="metric-value">{summary?.totalShops || shops.length || 0}</span>
            </div>
          </div>
          <Sparkline strokeColor="#3b82f6" />
        </div>

        {/* Card 4: Orders */}
        <div className="metric-card">
          <div className="metric-top">
            <div className="metric-icon-box" style={{ background: '#f0fdf4', color: '#22c55e' }}>
              <FileText size={20} />
            </div>
            <div className="metric-info">
              <span className="metric-label">Orders</span>
              <span className="metric-value">{summary?.totalOrders || orders.length || 0}</span>
            </div>
          </div>
          <Sparkline strokeColor="#22c55e" />
        </div>

        {/* Card 5: In Transit */}
        <div className="metric-card">
          <div className="metric-top">
            <div className="metric-icon-box" style={{ background: '#faf5ff', color: '#a855f7' }}>
              <Truck size={20} />
            </div>
            <div className="metric-info">
              <span className="metric-label">In Transit</span>
              <span className="metric-value">{summary?.inTransit || 0}</span>
            </div>
          </div>
          <Sparkline strokeColor="#a855f7" />
        </div>

        {/* Card 6: Low Stock */}
        <div className="metric-card">
          <div className="metric-top">
            <div className="metric-icon-box" style={{ background: '#fef2f2', color: '#ef4444' }}>
              <AlertCircle size={20} />
            </div>
            <div className="metric-info">
              <span className="metric-label">Low Stock</span>
              <span className="metric-value">{summary?.lowStockCount || lowStockProducts.length || 0}</span>
            </div>
          </div>
          <Sparkline strokeColor="#ef4444" />
        </div>
      </div>

      {/* 2. MIDDLE SECTION (2 Columns) */}
      <div className="dashboard-middle-grid">
        {/* Left Column: Manager Performance Table */}
        <div className="dms-card">
          <div>
            <div className="dms-card-header">
              <h2 className="dms-card-title">
                {role === 'ROLE_SALES_REP' ? 'Sales Representative Performance' : 'Manager Performance'}
              </h2>
            </div>
            <table className="manager-table">
              <thead>
                <tr>
                  <th>Manager</th>
                  <th>Visits</th>
                  <th>Orders</th>
                  <th>Collected</th>
                </tr>
              </thead>
              <tbody>
                {managers.map((m, idx) => {
                  const displayName = m.fullName || m.name || m.username || `Manager ${idx + 1}`;
                  const initial = displayName.charAt(0).toUpperCase();
                  return (
                    <tr key={m.id || idx}>
                      <td>
                        <div className="manager-user-cell">
                          <div className="manager-initial-avatar">{initial}</div>
                          <span>{displayName}</span>
                        </div>
                      </td>
                      <td>{m.visits || 0}</td>
                      <td>{m.orders || 0}</td>
                      <td className="collected-amount">₹{m.collected ? m.collected.toLocaleString('en-IN') : 0}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '16px' }}>
            <span className="view-all-link" onClick={() => onNavigate('reports')}>
              View all managers <ArrowRight size={14} />
            </span>
          </div>
        </div>

        {/* Right Column: Low Stock Alerts */}
        <div className="dms-card">
          <div>
            <div className="dms-card-header">
              <h2 className="dms-card-title">Low Stock Alerts</h2>
            </div>

            <div>
              {lowStockProducts.map((p) => (
                <div key={p.id} className="low-stock-alert-item">
                  <div>
                    <div className="low-stock-name">{p.name}</div>
                    <div className="low-stock-sku">{p.sku}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="units-left-num">{p.stockQuantity}</div>
                    <div className="units-left-label">Units Left</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <span className="view-all-link" onClick={() => onNavigate('stock')}>
              View all low stock <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM SECTION (4 Columns Grid) */}
      <div className="dashboard-bottom-grid">
        {/* Column 1: Recent Shops */}
        <div className="dms-card">
          <div className="dms-card-header">
            <h2 className="dms-card-title">Recent Shops</h2>
            <span className="view-all-link" onClick={() => onNavigate('shops')}>View all</span>
          </div>

          <div>
            {recentShops.map((s) => (
              <div key={s.id} className="list-item-row">
                <div className="list-item-left">
                  <div className="list-icon-box"><Store size={16} /></div>
                  <div>
                    <div className="list-item-title">{s.name}</div>
                    <div className="list-item-sub">{s.area || s.city}</div>
                  </div>
                </div>
                <div className="due-badge">
                  ₹{(s.dueAmount || 0).toLocaleString('en-IN')}
                  <span className="due-label">DUE</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Recent Orders */}
        <div className="dms-card">
          <div className="dms-card-header">
            <h2 className="dms-card-title">Recent Orders</h2>
            <span className="view-all-link" onClick={() => onNavigate('orders')}>View all</span>
          </div>

          <div>
            {recentOrders.map((ord) => (
              <div key={ord.id} className="list-item-row">
                <div className="list-item-left">
                  <div className="list-icon-box"><FileText size={16} /></div>
                  <div>
                    <div className="list-item-title">{ord.orderNumber}</div>
                    <div className="list-item-sub">{ord.shop ? ord.shop.name : 'Store'}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>₹{(ord.totalAmount || 0).toLocaleString('en-IN')}</div>
                  <div style={{ marginTop: '2px' }}>
                    <span className={`badge-pill ${(ord.status || 'pending').toLowerCase()}`}>
                      {ord.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Pending Dispatch */}
        <div className="dms-card">
          <div className="dms-card-header">
            <h2 className="dms-card-title">Pending Dispatch</h2>
            <span className="view-all-link" onClick={() => onNavigate('dispatch')}>View all</span>
          </div>

          <div>
            {pendingDispatches.map((ord) => (
              <div key={ord.id} className="list-item-row" style={{ cursor: 'pointer' }} onClick={() => onNavigate('dispatch')}>
                <div className="list-item-left">
                  <div className="list-icon-box"><Truck size={16} /></div>
                  <div>
                    <div className="list-item-title">{ord.orderNumber}</div>
                    <div className="list-item-sub">{ord.shop ? ord.shop.name : 'Store'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>₹{(ord.totalAmount || 0).toLocaleString('en-IN')}</div>
                  <ArrowRight size={16} color="#f25c05" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 4: Today's Summary */}
        <div className="dms-card">
          <div>
            <div className="dms-card-header">
              <h2 className="dms-card-title">Today's Summary</h2>
            </div>

            <div>
              <div className="summary-stat-row">
                <span className="summary-stat-label">Daily Collection</span>
                <span className="summary-stat-val">₹{summary?.collectedToday || 0}</span>
              </div>
              <div className="summary-stat-row">
                <span className="summary-stat-label">Outstanding Total</span>
                <span className="summary-stat-val">₹{(summary?.outstandingTotal || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-stat-row">
                <span className="summary-stat-label">Orders Total</span>
                <span className="summary-stat-val">{summary?.totalOrders || orders.length || 0}</span>
              </div>
              <div className="summary-stat-row">
                <span className="summary-stat-label">Pending Dispatches</span>
                <span className="summary-stat-val">{pendingDispatches.length}</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <span className="view-all-link" onClick={() => onNavigate('reports')}>
              View full report <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
