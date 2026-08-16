import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Package, AlertTriangle, Plus, Trash2 } from 'lucide-react';

export default function StockView({ currentUser }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    setLoading(true);
    api.getProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const isAdmin = currentUser?.role === 'ROLE_ADMIN';

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.deleteProduct(productId);
      fetchProducts();
    } catch (err) {
      alert("Failed to delete product: " + err.message);
    }
  };

  return (
    <div className="dms-card">
      <div className="dms-card-header">
        <div>
          <h2 className="dms-card-title">Stock Inventory Catalog</h2>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{products.length} Products listed</span>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading inventory catalog...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginTop: '12px' }}>
          {products.map((p) => {
            const isLow = p.stockQuantity <= p.minReorderLevel;
            return (
              <div key={p.id} style={{
                background: '#fff',
                border: isLow ? '1.5px solid #ef4444' : '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#64748b' }}>{p.sku}</span>
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1 text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded cursor-pointer transition-colors"
                        title="Delete Product (Admin Only)"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: '#0f172a', marginTop: '2px' }}>{p.name}</h3>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>Category: {p.category}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f25c05' }}>₹{p.price.toLocaleString('en-IN')}</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: isLow ? '#dc2626' : '#16a34a', marginTop: '2px' }}>
                    {p.stockQuantity} in stock
                  </div>
                  {isLow && (
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase', marginTop: '2px' }}>
                      Low Stock Warning
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
