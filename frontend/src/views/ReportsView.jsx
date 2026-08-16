import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { BarChart3, TrendingUp, DollarSign, Package, CheckCircle2, Clock } from 'lucide-react';

export default function ReportsView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSummary()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="dms-card" style={{ padding: '40px', textAlign: 'center' }}>Loading metrics...</div>;
  if (!data) return <div className="dms-card" style={{ padding: '40px', textAlign: 'center' }}>Failed to load summary.</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="dms-card" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#ffffff' }}>
        <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 800 }}>
          Total Revenue Processed
        </div>
        <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#22c55e', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
          ₹{data.totalRevenue.toLocaleString('en-IN')}
        </div>
        <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginTop: '4px' }}>
          Across {data.totalOrders} total distribution sales orders
        </div>
      </div>

      <div className="dms-card">
        <div className="dms-card-header">
          <h2 className="dms-card-title">Order Breakdown By Status</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ background: '#fffbe6', padding: '18px', border: '1px solid #f59e0b', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 800 }}>PENDING</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#d97706', fontFamily: 'var(--font-heading)' }}>{data.pendingOrders}</div>
          </div>
          <div style={{ background: '#eff6ff', padding: '18px', border: '1px solid #3b82f6', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 800 }}>DISPATCHED</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#2563eb', fontFamily: 'var(--font-heading)' }}>{data.dispatchedOrders}</div>
          </div>
          <div style={{ background: '#f0f9ff', padding: '18px', border: '1px solid #0284c7', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: '#0369a1', fontWeight: 800 }}>IN TRANSIT</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0369a1', fontFamily: 'var(--font-heading)' }}>{data.inTransitOrders}</div>
          </div>
          <div style={{ background: '#f0fdf4', padding: '18px', border: '1px solid #22c55e', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 800 }}>DELIVERED</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#16a34a', fontFamily: 'var(--font-heading)' }}>{data.deliveredOrders}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
