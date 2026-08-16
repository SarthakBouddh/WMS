import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Store, MapPin, Phone, User, Plus, X, Trash2 } from 'lucide-react';

export default function ShopsView({ currentUser }) {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  const fetchShops = async () => {
    try {
      setLoading(true);
      const data = await api.getShops();
      setShops(data);
    } catch (err) {
      console.error("Failed to load shops", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const handleCreateShop = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.createShop({ name, ownerName, phone, address, city });
      setShowModal(false);
      setName(''); setOwnerName(''); setPhone(''); setAddress(''); setCity('');
      fetchShops();
    } catch (err) {
      alert("Failed to create shop: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const isAdmin = currentUser?.role === 'ROLE_ADMIN';

  const handleDeleteShop = async (shopId) => {
    if (!window.confirm("Are you sure you want to delete this shop?")) return;
    try {
      await api.deleteShop(shopId);
      fetchShops();
    } catch (err) {
      alert("Failed to delete shop: " + err.message);
    }
  };

  const canAddShop = currentUser && ['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_SALES_REP'].includes(currentUser.role);

  return (
    <div className="dms-card">
      <div className="dms-card-header flex-wrap gap-4">
        <div>
          <h2 className="dms-card-title">Shops Directory</h2>
          <span className="text-xs text-slate-400 font-semibold">{shops.length} Registered Retail Stores</span>
        </div>

        {canAddShop && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={16} /> Add Shop
          </button>
        )}
      </div>

      {loading ? (
        <div className="p-10 text-center text-slate-400 font-medium">Loading shop directory...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-3">
          {shops.map((s) => (
            <div key={s.id} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-extrabold text-orange-600">{s.shopCode}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-bold text-slate-700">
                      {s.city}
                    </span>
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteShop(s.id)}
                        className="p-1 text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded cursor-pointer transition-colors"
                        title="Delete Shop (Admin Only)"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
                <h3 className="font-heading font-extrabold text-base text-slate-900 mt-1">{s.name}</h3>
              </div>

              <div className="text-xs text-slate-600 mt-3 space-y-1">
                <div><User size={13} className="inline mr-1 text-slate-400" /> Owner: <strong>{s.ownerName}</strong></div>
                <div><Phone size={13} className="inline mr-1 text-slate-400" /> {s.phone}</div>
                <div><MapPin size={13} className="inline mr-1 text-slate-400" /> {s.address}</div>
                {s.dueAmount !== undefined && (
                  <div className="mt-2 text-xs font-extrabold text-red-600">
                    Due Balance: ₹{s.dueAmount.toLocaleString('en-IN')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Register New Shop
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer p-1"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateShop} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Shop Name *
                </label>
                <input
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Owner Name *
                </label>
                <input
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Phone Number *
                </label>
                <input
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Address *
                </label>
                <input
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  City *
                </label>
                <input
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-sm border border-slate-300 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-[1.5] px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving Shop...' : 'Save Shop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
