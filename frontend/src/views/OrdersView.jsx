import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Plus, Filter, ShoppingBag, CheckCircle, AlertCircle, FileText, Store, Trash2, X } from 'lucide-react';

export default function OrdersView({ currentUser }) {
  const [orders, setOrders] = useState([]);
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Order Form state
  const [selectedShopId, setSelectedShopId] = useState('');
  const [orderItems, setOrderItems] = useState([{ productId: '', quantity: 1 }]);
  const [discountType, setDiscountType] = useState('FIXED'); // 'FIXED' or 'PERCENT'
  const [discountValue, setDiscountValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await api.getOrders(filter === 'ALL' ? null : filter);
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  useEffect(() => {
    api.getShops().then(setShops).catch(console.error);
    api.getProducts().then(setProducts).catch(console.error);
  }, []);

  // Dynamic order subtotal & discount calculation
  const subtotal = orderItems.reduce((acc, item) => {
    if (!item.productId || item.quantity === '' || item.quantity === null || item.quantity === undefined) return acc;
    const prod = products.find(p => String(p.id) === String(item.productId));
    const unitPrice = prod ? (Number(prod.price) || 0) : 0;
    const qty = Math.max(0, Number(item.quantity) || 0);
    return acc + (unitPrice * qty);
  }, 0);

  const rawDiscount = Math.max(0, Number(discountValue) || 0);
  const discountAmount = discountType === 'PERCENT'
    ? (subtotal * Math.min(100, rawDiscount)) / 100
    : Math.min(subtotal, rawDiscount);

  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!selectedShopId) return alert('Please select a shop');
    const validItems = orderItems.filter(i => i.productId && Number(i.quantity) > 0);
    if (validItems.length === 0) return alert('Please add at least 1 valid product item');

    try {
      setSubmitting(true);
      await api.createOrder(
        String(selectedShopId),
        validItems.map(i => ({ productId: String(i.productId), quantity: parseInt(i.quantity, 10) })),
        discountAmount
      );
      setShowCreateModal(false);
      setSelectedShopId('');
      setDiscountValue('');
      setDiscountType('FIXED');
      setOrderItems([{ productId: '', quantity: 1 }]);
      fetchOrders();
    } catch (err) {
      alert("Error creating order: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddItemRow = () => {
    setOrderItems([...orderItems, { productId: '', quantity: 1 }]);
  };

  const handleRemoveItemRow = (index) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...orderItems];
    newItems[index][field] = value;
    setOrderItems(newItems);
  };

  const canCreateOrder = currentUser && ['ROLE_ADMIN', 'ROLE_SALES_REP', 'ROLE_MANAGER'].includes(currentUser.role);

  const isAdmin = currentUser?.role === 'ROLE_ADMIN';

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to permanently delete this order?")) return;
    try {
      await api.deleteOrder(orderId);
      fetchOrders();
    } catch (err) {
      alert("Failed to delete order: " + err.message);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await api.updateOrderStatus(orderId, 'CANCELLED');
      fetchOrders();
    } catch (err) {
      alert("Failed to cancel order: " + err.message);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-300';
      case 'DISPATCHED':
      case 'IN_TRANSIT':
        return 'bg-sky-50 text-sky-700 border-sky-300';
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-300';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-700 border-rose-300';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="dms-content">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sales Orders</h2>
          <p className="text-xs text-slate-500 font-medium">Manage, approve, cancel, and track order fulfillment</p>
        </div>

        {canCreateOrder && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Plus size={18} /> Create Sales Order
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {['ALL', 'PENDING', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter === tab
                ? 'bg-orange-50 text-orange-600 border border-orange-400 font-extrabold shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="p-10 text-center text-slate-400 font-medium">Loading sales orders...</div>
      ) : orders.length === 0 ? (
        <div className="p-10 text-center text-slate-500 font-medium">No orders found for this filter.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="manager-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Store / Shop</th>
                <th>Created By</th>
                <th>Items</th>
                <th>Total Amount</th>
                <th>Status</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr key={ord.id}>
                  <td className="font-extrabold text-slate-900">{ord.orderNumber}</td>
                  <td>
                    <div className="font-bold">{ord.shop ? ord.shop.name : 'Store'}</div>
                    <div className="text-[11px] text-slate-400 font-medium">{ord.shop?.city || 'Mumbai'}</div>
                  </td>
                  <td className="font-semibold text-slate-700">{ord.createdBy ? ord.createdBy.fullName : 'Sales Rep'}</td>
                  <td className="font-semibold text-slate-600">{ord.totalItems} Items</td>
                  <td className="font-extrabold text-orange-600">₹{ord.totalAmount ? ord.totalAmount.toLocaleString('en-IN') : 0}</td>
                  <td>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border ${getStatusBadgeClass(ord.status)}`}>
                      {ord.status.replace('_', ' ')}
                    </span>
                  </td>
                  {isAdmin && (
                    <td>
                      <div className="flex items-center gap-1.5">
                        {ord.status !== 'CANCELLED' && ord.status !== 'DELIVERED' && (
                          <button
                            onClick={() => handleCancelOrder(ord.id)}
                            className="px-2.5 py-1 text-[11px] font-extrabold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg cursor-pointer transition-colors"
                            title="Cancel Order (Admin Only)"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteOrder(ord.id)}
                          className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg cursor-pointer transition-colors"
                          title="Delete Order (Admin Only)"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                  Create New Sales Order
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Fill in shop details and order line items</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer p-1"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Select Target Shop / Store *
                </label>
                <select
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all cursor-pointer"
                  value={selectedShopId}
                  onChange={(e) => setSelectedShopId(e.target.value)}
                  required
                >
                  <option value="">-- Choose Shop --</option>
                  {shops.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.shopCode}) - {s.city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Order Line Items *
                  </label>
                  <span className="text-xs font-semibold text-slate-500">
                    {orderItems.length} {orderItems.length === 1 ? 'item row' : 'item rows'}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {orderItems.map((item, idx) => {
                    const selectedProd = products.find(p => String(p.id) === String(item.productId));
                    const unitPrice = selectedProd ? (Number(selectedProd.price) || 0) : 0;
                    const qty = Math.max(0, Number(item.quantity) || 0);
                    const rowTotal = unitPrice * qty;

                    return (
                      <div key={idx} className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="flex-1">
                          <select
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            value={item.productId}
                            onChange={(e) => handleItemChange(idx, 'productId', e.target.value)}
                            required
                          >
                            <option value="">-- Select Product --</option>
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name} (₹{p.price.toLocaleString('en-IN')})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="w-24">
                          <input
                            type="number"
                            min="1"
                            placeholder="Qty"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                            required
                          />
                        </div>

                        <div className="w-24 text-right font-extrabold text-orange-600 text-sm">
                          ₹{rowTotal.toLocaleString('en-IN')}
                        </div>

                        {orderItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItemRow(idx)}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                            title="Remove Item"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleAddItemRow}
                  className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-bold rounded-lg border border-orange-200 transition-colors cursor-pointer"
                >
                  <Plus size={14} /> Add Product Line
                </button>
              </div>

              {/* Discount Section */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Order Discount (Optional)
                </label>
                <div className="flex gap-2">
                  <div className="flex rounded-lg border border-slate-300 bg-slate-100 p-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setDiscountType('FIXED')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                        discountType === 'FIXED'
                          ? 'bg-white text-orange-600 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      ₹ Flat
                    </button>
                    <button
                      type="button"
                      onClick={() => setDiscountType('PERCENT')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                        discountType === 'PERCENT'
                          ? 'bg-white text-orange-600 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      % Percent
                    </button>
                  </div>

                  <input
                    type="number"
                    min="0"
                    max={discountType === 'PERCENT' ? 100 : undefined}
                    placeholder={discountType === 'PERCENT' ? "e.g. 10 (%)" : "e.g. 250 (₹)"}
                    className="flex-1 px-3.5 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                  />
                </div>
              </div>

              {/* Order Total Breakdown Card */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-xs font-bold text-emerald-600">
                    <span>Discount Applied ({discountType === 'PERCENT' ? `${discountValue}%` : 'Flat ₹'}):</span>
                    <span>- ₹{discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Net Total Payable:</span>
                  <span className="text-xl font-extrabold text-orange-600">
                    ₹{finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-sm border border-slate-300 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-[1.5] px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting Order...' : 'Confirm Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
