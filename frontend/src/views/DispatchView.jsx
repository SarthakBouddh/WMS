import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { ArrowRight, Truck, CheckCircle2, Clock, MapPin, Trash2, X } from 'lucide-react';

export default function DispatchView({ currentUser }) {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [dispatches, setDispatches] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dispatch Modal state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [vehicleNumber, setVehicleNumber] = useState('MH01AB1234');
  const [transportProvider, setTransportProvider] = useState('TEST_TRANSPORT');
  const [driverId, setDriverId] = useState('');
  const [processing, setProcessing] = useState(false);

  const isAdmin = currentUser?.role === 'ROLE_ADMIN';

  const fetchData = async () => {
    try {
      setLoading(true);
      const orders = await api.getOrders('PENDING');
      const disps = await api.getDispatches();
      setPendingOrders(orders);
      setDispatches(disps);
    } catch (err) {
      console.error("Failed to load dispatch data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    api.getUsers('ROLE_DRIVER').then(setDrivers).catch(console.error);
  }, []);

  const handleDeleteDispatch = async (dispatchId) => {
    if (!window.confirm("Are you sure you want to delete this dispatch record?")) return;
    try {
      await api.deleteDispatch(dispatchId);
      fetchData();
    } catch (err) {
      alert("Failed to delete dispatch: " + err.message);
    }
  };

  const handleOpenDispatchModal = (order) => {
    setSelectedOrder(order);
    if (drivers.length > 0) {
      setDriverId(drivers[0].id);
    }
  };

  const handleConfirmDispatch = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      setProcessing(true);
      await api.createDispatch(
        selectedOrder.id,
        vehicleNumber,
        transportProvider,
        driverId ? String(driverId) : null
      );
      setSelectedOrder(null);
      fetchData();
    } catch (err) {
      alert("Dispatch failed: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateStatus = async (dispatchId, nextStatus) => {
    try {
      await api.updateDispatchStatus(dispatchId, nextStatus);
      fetchData();
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  const canManageDispatch = currentUser && ['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_DISPATCH_MANAGER', 'ROLE_DRIVER'].includes(currentUser.role);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* PENDING DISPATCH QUEUE */}
      <div className="dms-card">
        <div className="dms-card-header">
          <div>
            <h2 className="dms-card-title">Pending Dispatch Queue</h2>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{pendingOrders.length} Orders awaiting transit vehicle assignment</span>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>Loading dispatch queue...</div>
        ) : pendingOrders.length === 0 ? (
          <div style={{ padding: '20px', color: '#64748b', fontSize: '0.85rem' }}>
            No pending orders waiting for dispatch.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {pendingOrders.map((ord) => (
              <div key={ord.id} style={{ border: '1px solid #f25c05', borderRadius: '8px', padding: '16px', background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#94a3b8' }}>{ord.orderNumber}</span>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: '#0f172a', marginTop: '2px' }}>
                      {ord.shop ? ord.shop.name : 'Store'}
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '4px' }}>
                      {ord.totalItems} ITEMS · ₹{ord.totalAmount.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {canManageDispatch && (
                  <button
                    onClick={() => handleOpenDispatchModal(ord)}
                    style={{
                      marginTop: '12px',
                      width: '100%',
                      background: '#f25c05',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 14px',
                      borderRadius: '6px',
                      fontWeight: '800',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <ArrowRight size={16} /> DISPATCH ORDER
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ACTIVE DISPATCH LOG */}
      <div className="dms-card">
        <div className="dms-card-header">
          <div>
            <h2 className="dms-card-title">Active Dispatch Logs</h2>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Track live transit status & deliveries</span>
          </div>
        </div>

        {dispatches.length === 0 ? (
          <div style={{ color: '#64748b', fontSize: '0.85rem', padding: '10px 0' }}>
            No dispatches logged yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {dispatches.map((dsp) => {
              const step = dsp.status === 'DISPATCHED' ? 1 : dsp.status === 'IN_TRANSIT' ? 2 : 3;
              return (
                <div key={dsp.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '18px', background: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>{dsp.dispatchNumber}</span>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: '#0f172a', marginTop: '2px' }}>
                        {dsp.order && dsp.order.shop ? dsp.order.shop.name : 'Shop Store'}
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                        Carrier: <strong>{dsp.transportProvider || 'TEST_TRANSPORT'}</strong>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ fontSize: '0.65rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Vehicle Reg</div>
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteDispatch(dsp.id)}
                            className="p-1 text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded cursor-pointer transition-colors"
                            title="Delete Dispatch Record (Admin Only)"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                      <div style={{ border: '1px solid #f25c05', color: '#0f172a', padding: '2px 8px', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 800, fontFamily: 'monospace' }}>
                        {dsp.vehicleNumber}
                      </div>
                    </div>
                  </div>

                  {/* Step Tracker */}
                  <div className="step-tracker">
                    <div className="step-node">1</div>
                    <div className="step-node" style={{ background: step >= 2 ? '#f25c05' : '#cbd5e1' }}>2</div>
                    <div className="step-node" style={{ background: step === 3 ? '#22c55e' : '#cbd5e1' }}>3</div>
                  </div>
                  <div className="step-labels">
                    <span style={{ color: step >= 1 ? '#f25c05' : '#94a3b8' }}>DISPATCHED</span>
                    <span style={{ color: step >= 2 ? '#f25c05' : '#94a3b8' }}>IN TRANSIT</span>
                    <span style={{ color: step === 3 ? '#22c55e' : '#94a3b8' }}>DELIVERED</span>
                  </div>

                  {/* Step Actions */}
                  {canManageDispatch && step < 3 && (
                    <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                      {step === 1 && (
                        <button
                          onClick={() => handleUpdateStatus(dsp.id, 'IN_TRANSIT')}
                          style={{
                            background: '#0284c7',
                            color: '#fff',
                            border: 'none',
                            padding: '6px 14px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '800',
                            cursor: 'pointer'
                          }}
                        >
                          Set In Transit (Step 2)
                        </button>
                      )}
                      {step === 2 && (
                        <button
                          onClick={() => handleUpdateStatus(dsp.id, 'DELIVERED')}
                          style={{
                            background: '#22c55e',
                            color: '#fff',
                            border: 'none',
                            padding: '6px 14px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '800',
                            cursor: 'pointer'
                          }}
                        >
                          Mark Delivered (Step 3)
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Dispatch Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/75 p-5 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-gray-900/95 p-8 text-slate-100 shadow-2xl shadow-black/50">

            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
                  <Truck size={22} className="text-white" />
                </div>

                <div>
                  <h2 className="text-xl font-extrabold tracking-tight text-slate-50">
                    Dispatch Order
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Order #{selectedOrder.orderNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Information */}
            <div className="mb-6 rounded-xl border border-slate-700/80 bg-slate-800/80 p-4">
              <div className="flex items-center justify-between gap-4">

                <div>
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Store
                  </p>

                  <p className="text-sm font-semibold text-slate-100">
                    {selectedOrder.shop?.name || 'N/A'}
                  </p>
                </div>

                <div className="text-right">
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Amount
                  </p>

                  <p className="text-base font-extrabold text-violet-400">
                    ₹{selectedOrder.totalAmount}
                  </p>
                </div>

              </div>
            </div>

            <form onSubmit={handleConfirmDispatch}>

              {/* Vehicle Registration Number */}
              <div className="mb-[18px]">
                <label className="mb-2 block text-xs font-bold text-slate-300">
                  Vehicle Registration Number
                </label>

                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  placeholder="e.g. MH01AB1234"
                  required
                  disabled={processing}
                  className="w-full rounded-[10px] border-[1.5px] border-slate-700 bg-slate-800 px-3.5 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* Transport Provider */}
              <div className="mb-[18px]">
                <label className="mb-2 block text-xs font-bold text-slate-300">
                  Transport Provider
                </label>

                <input
                  type="text"
                  value={transportProvider}
                  onChange={(e) => setTransportProvider(e.target.value)}
                  placeholder="e.g. TEST_TRANSPORT"
                  required
                  disabled={processing}
                  className="w-full rounded-[10px] border-[1.5px] border-slate-700 bg-slate-800 px-3.5 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* Assign Driver */}
              <div className="mb-6">
                <label className="mb-2 block text-xs font-bold text-slate-300">
                  Assign Driver
                </label>

                <select
                  value={driverId}
                  onChange={(e) => setDriverId(e.target.value)}
                  disabled={processing}
                  className="w-full cursor-pointer rounded-[10px] border-[1.5px] border-slate-700 bg-slate-800 px-3.5 py-3 text-sm text-slate-100 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">-- Select Driver --</option>

                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.fullName} ({d.phone})
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="mt-5 flex gap-3">

                {/* Cancel */}
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  disabled={processing}
                  className="flex-1 rounded-[10px] border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-bold text-slate-300 transition-all duration-200 hover:bg-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                {/* Confirm */}
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-[1.5] flex items-center justify-center gap-2 rounded-[10px] bg-gradient-to-br from-indigo-500 to-violet-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {processing ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <span>Confirm Dispatch</span>
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>

              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
