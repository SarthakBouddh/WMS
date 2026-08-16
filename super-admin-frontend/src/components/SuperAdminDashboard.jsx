import React, { useState, useEffect } from 'react';
import {
  Building2, Users, ShieldCheck, Plus, Search, CheckCircle2,
  XCircle, UserPlus, LogOut, RefreshCw, Key, Layers, Activity,
  Sliders, Shield, Briefcase
} from 'lucide-react';
import { api } from '../api';

export default function SuperAdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('clients'); // 'clients', 'users', 'access'
  const [stats, setStats] = useState({ totalClients: 0, activeClients: 0, suspendedClients: 0, totalUsers: 0 });
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('');

  // Modals
  const [showClientModal, setShowClientModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  // New Client Form
  const [newClient, setNewClient] = useState({
    companyName: '',
    code: '',
    contactEmail: '',
    contactPhone: '',
    subscriptionTier: 'ENTERPRISE',
    notes: ''
  });

  // New User Form
  const [newUser, setNewUser] = useState({
    companyId: '',
    fullName: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    role: 'ROLE_ADMIN'
  });

  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, clientsData, usersData] = await Promise.all([
        api.getStats(),
        api.getClients(),
        api.getUsers()
      ]);
      setStats(statsData);
      setClients(clientsData);
      setUsers(usersData);
      if (clientsData.length > 0 && !newUser.companyId) {
        setNewUser(prev => ({ ...prev, companyId: clientsData[0].id }));
      }
    } catch (err) {
      console.error('Error loading Super Admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Create Client Submit
  const handleCreateClient = async (e) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');
    try {
      const created = await api.createClient(newClient);
      setModalSuccess(`Successfully created client company: ${created.companyName}`);
      setShowClientModal(false);
      setNewClient({ companyName: '', code: '', contactEmail: '', contactPhone: '', subscriptionTier: 'ENTERPRISE', notes: '' });
      loadData();
    } catch (err) {
      setModalError(err.message || 'Failed to create client company');
    }
  };

  // Handle Toggle Client Status
  const handleToggleClientStatus = async (client) => {
    const newStatus = client.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await api.updateClientStatus(client.id, newStatus);
      loadData();
    } catch (err) {
      alert('Error updating client status: ' + err.message);
    }
  };

  // Handle Create User Submit
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');
    try {
      const created = await api.createClientUser(newUser);
      setModalSuccess(`Successfully created user ${created.username} for ${created.companyName}`);
      setShowUserModal(false);
      setNewUser({ companyId: clients[0]?.id || '', fullName: '', username: '', password: '', email: '', phone: '', role: 'ROLE_ADMIN' });
      loadData();
    } catch (err) {
      setModalError(err.message || 'Failed to create user');
    }
  };

  // Handle Toggle User Status
  const handleToggleUserStatus = async (u) => {
    try {
      await api.toggleUserStatus(u.id, !u.active);
      loadData();
    } catch (err) {
      alert('Error updating user status: ' + err.message);
    }
  };

  // Filtered Lists
  const filteredClients = clients.filter(c =>
    c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.contactEmail?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.companyName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCompany = !selectedCompanyFilter || u.companyId === selectedCompanyFilter;
    return matchesSearch && matchesCompany;
  });

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans">
      {/* Super Admin Navigation Header */}
      <header className="bg-slate-900 border-b border-slate-800/80 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-extrabold tracking-tight text-white">
                SUPER ADMIN PORTAL
              </h2>
              <span className="px-2.5 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-md text-[10px] font-extrabold uppercase tracking-wider">
                PLATFORM ROOT
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Global Multi-Tenant Organization & Access Control System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-100">
              {user?.fullName || user?.username || 'Super Admin'}
            </p>
            <p className="text-xs text-purple-400 font-mono">
              @{user?.username || 'admin'}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/80 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-slate-900/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl shadow-black/40">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Client Companies
              </span>
              <div className="w-10 h-10 bg-indigo-500/15 rounded-xl flex items-center justify-center">
                <Building2 size={20} className="text-indigo-400" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-100">{stats.totalClients}</div>
            <p className="text-xs text-emerald-400 mt-1 font-medium">Registered WMS Tenant Organizations</p>
          </div>

          <div className="bg-slate-900/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl shadow-black/40">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Active Tenants
              </span>
              <div className="w-10 h-10 bg-emerald-500/15 rounded-xl flex items-center justify-center">
                <Activity size={20} className="text-emerald-400" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-emerald-400">{stats.activeClients}</div>
            <p className="text-xs text-slate-400 mt-1 font-medium">Full Operational Privileges</p>
          </div>

          <div className="bg-slate-900/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl shadow-black/40">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Platform Users
              </span>
              <div className="w-10 h-10 bg-purple-500/15 rounded-xl flex items-center justify-center">
                <Users size={20} className="text-purple-400" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-purple-400">{stats.totalUsers}</div>
            <p className="text-xs text-slate-400 mt-1 font-medium">Provisioned Across All Clients</p>
          </div>

          <div className="bg-slate-900/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl shadow-black/40">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Suspended Clients
              </span>
              <div className="w-10 h-10 bg-red-500/15 rounded-xl flex items-center justify-center">
                <XCircle size={20} className="text-red-400" />
              </div>
            </div>
            <div className={`text-3xl font-extrabold ${stats.suspendedClients > 0 ? 'text-red-400' : 'text-slate-100'}`}>
              {stats.suspendedClients}
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">Temporarily Restricted Tenants</p>
          </div>
        </div>

        {/* Tab Navigation & Search Bar Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          {/* Navigation Tabs */}
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('clients')}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all duration-200 cursor-pointer ${activeTab === 'clients'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              <Building2 size={18} />
              <span>Client Companies</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">{clients.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all duration-200 cursor-pointer ${activeTab === 'users'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              <Users size={18} />
              <span>Client Employees</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">{users.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('access')}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all duration-200 cursor-pointer ${activeTab === 'access'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              <Shield size={18} />
              <span>Access Grants & Roles</span>
            </button>
          </div>

          {/* Action Buttons & Controls */}
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm font-medium text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder={activeTab === 'clients' ? "Search client companies..." : "Search employees..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {activeTab === 'clients' && (
              <button
                onClick={() => { setModalError(''); setModalSuccess(''); setShowClientModal(true); }}
                className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all duration-200 flex items-center gap-2 cursor-pointer h-10"
              >
                <Plus size={18} />
                <span>New Client Company</span>
              </button>
            )}

            {activeTab === 'users' && (
              <button
                onClick={() => { setModalError(''); setModalSuccess(''); setShowUserModal(true); }}
                className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all duration-200 flex items-center gap-2 cursor-pointer h-10"
              >
                <UserPlus size={18} />
                <span>Provision Employee</span>
              </button>
            )}

            <button
              onClick={loadData}
              className="w-10 h-10 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {/* TAB 1: CLIENT COMPANIES MANAGER */}
        {activeTab === 'clients' && (
          <div className="bg-slate-900/75 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-black/40">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800/80">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Company Details</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Slug Code</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Info</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Subscription</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Employees</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => {
                    const empCount = users.filter(u => u.companyId === client.id).length;
                    return (
                      <tr key={client.id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors duration-150">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3.5">
                            <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center font-extrabold text-base text-white shadow-md">
                              {client.companyName.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-slate-100 text-sm leading-snug">{client.companyName}</div>
                              <div className="text-xs text-slate-500 mt-0.5">Created {new Date(client.createdAt).toLocaleDateString()}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <code className="bg-slate-950 px-3 py-1.5 rounded-lg text-sky-400 text-xs font-mono font-semibold">
                            {client.code}
                          </code>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm text-slate-200 font-semibold">{client.contactEmail || 'No email registered'}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{client.contactPhone || 'No phone registered'}</div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="bg-purple-500/15 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-lg text-xs font-bold">
                            {client.subscriptionTier || 'ENTERPRISE'}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm font-bold text-slate-100">
                            {empCount} Users
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={client.status === 'ACTIVE'
                            ? 'px-3 py-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-extrabold uppercase tracking-wider'
                            : 'px-3 py-1 bg-red-500/15 text-red-400 border border-red-500/30 rounded-lg text-xs font-extrabold uppercase tracking-wider'}>
                            {client.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button
                            onClick={() => handleToggleClientStatus(client)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all duration-150 cursor-pointer ${client.status === 'ACTIVE'
                                ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                              }`}
                          >
                            {client.status === 'ACTIVE' ? 'Suspend Access' : 'Activate Access'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: CLIENT EMPLOYEES PROVISIONING */}
        {activeTab === 'users' && (
          <div>
            {/* Filter by Client Company dropdown */}
            <div className="flex items-center gap-3 mb-5">
              <label className="text-xs font-bold text-slate-400">Filter by Client Company:</label>
              <select
                className="w-72 h-10 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm font-medium text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={selectedCompanyFilter}
                onChange={(e) => setSelectedCompanyFilter(e.target.value)}
              >
                <option value="">All Client Companies</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.companyName}</option>
                ))}
              </select>
            </div>

            <div className="bg-slate-900/75 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-black/40">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950/80 border-b border-slate-800/80">
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Employee Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Username</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Company</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">App Role</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors duration-150">
                        <td className="px-6 py-5">
                          <div className="font-bold text-slate-100 text-sm leading-snug">{u.fullName || u.username}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{u.email || 'No email registered'}</div>
                        </td>
                        <td className="px-6 py-5">
                          <code className="bg-slate-950 px-3 py-1.5 rounded-lg text-purple-400 text-xs font-mono font-semibold">
                            {u.username}
                          </code>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm font-semibold text-slate-200">
                            {u.companyName || 'SarthakDev'}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="px-3 py-1 bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-extrabold uppercase tracking-wider">
                            {u.role ? u.role.replace('ROLE_', '') : 'ADMIN'}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className={u.active !== false
                            ? 'px-3 py-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-extrabold uppercase tracking-wider'
                            : 'px-3 py-1 bg-red-500/15 text-red-400 border border-red-500/30 rounded-lg text-xs font-extrabold uppercase tracking-wider'}>
                            {u.active !== false ? 'ACTIVE' : 'DISABLED'}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          {u.role !== 'ROLE_SUPER_ADMIN' && (
                            <button
                              onClick={() => handleToggleUserStatus(u)}
                              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all duration-150 cursor-pointer ${u.active !== false
                                  ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
                                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                                }`}
                            >
                              {u.active !== false ? 'Disable User' : 'Enable User'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ACCESS CONTROL & ROLES MATRIX */}
        {activeTab === 'access' && (
          <div className="bg-slate-900/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-xl shadow-black/40">
            <h3 className="text-xl font-extrabold text-white mb-2">
              Multi-Tenant Role Access Matrix
            </h3>
            <p className="text-slate-400 text-sm mb-8">
              Overview of authorized modules and capabilities granted to client employee roles across WMS tenants.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <ShieldCheck className="text-indigo-400" size={26} />
                  <h4 className="text-base font-bold text-white leading-tight">Client Admin (ROLE_ADMIN)</h4>
                </div>
                <ul className="space-y-3.5 text-sm text-slate-200">
                  <li className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl leading-relaxed">✅ Full Tenant Management & Overview</li>
                  <li className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl leading-relaxed">✅ Inventory & Product Catalog Control</li>
                  <li className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl leading-relaxed">✅ Create & Process Purchase/Sales Orders</li>
                  <li className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl leading-relaxed">✅ Dispatch Logistics Management</li>
                  <li className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl leading-relaxed">✅ Retail Outlet / Shop Accounts Setup</li>
                  <li className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl leading-relaxed">✅ Analytical Financial & Stock Reports</li>
                </ul>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <Briefcase className="text-sky-400" size={26} />
                  <h4 className="text-base font-bold text-white leading-tight">Warehouse Manager (ROLE_MANAGER)</h4>
                </div>
                <ul className="space-y-3.5 text-sm text-slate-200">
                  <li className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl leading-relaxed">✅ Inventory & Stock Quantity Updates</li>
                  <li className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl leading-relaxed">✅ View & Approve Sales Orders</li>
                  <li className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl leading-relaxed">✅ Monitor Dispatch Vehicles & Status</li>
                  <li className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl leading-relaxed">✅ Retail Shop Details Access</li>
                  <li className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl leading-relaxed text-red-400">❌ Cannot delete core system configurations</li>
                </ul>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <Users className="text-emerald-400" size={26} />
                  <h4 className="text-base font-bold text-white leading-tight">Sales Rep (ROLE_SALES_REP)</h4>
                </div>
                <ul className="space-y-3.5 text-sm text-slate-200">
                  <li className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl leading-relaxed">✅ Create New Sales Orders for Retailers</li>
                  <li className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl leading-relaxed">✅ View Catalog Stock Availability</li>
                  <li className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl leading-relaxed">✅ Track Customer Order Progress</li>
                  <li className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl leading-relaxed text-red-400">❌ No dispatch assignment access</li>
                </ul>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <Activity className="text-amber-400" size={26} />
                  <h4 className="text-base font-bold text-white leading-tight">Dispatch Manager (ROLE_DISPATCH_MANAGER)</h4>
                </div>
                <ul className="space-y-3.5 text-sm text-slate-200">
                  <li className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl leading-relaxed">✅ Fleet & Vehicle Dispatch Tracking</li>
                  <li className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl leading-relaxed">✅ Update Order Dispatch Status (In-Transit / Delivered)</li>
                  <li className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl leading-relaxed">✅ Assign Drivers & Logistics Route Details</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: CREATE NEW CLIENT COMPANY */}
      {showClientModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-8 shadow-2xl shadow-black/80 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-extrabold text-white">Register New Client Company</h3>
              <button
                onClick={() => setShowClientModal(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <XCircle size={24} />
              </button>
            </div>

            {modalError && (
              <div className="mb-4 p-3 bg-red-500/15 border border-red-500/30 text-red-400 rounded-xl text-xs font-semibold">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateClient} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Client Company Name *</label>
                <input
                  type="text"
                  style={{ background: '#1f293d', color: '#f8fafc', border: '1.5px solid #2b384e' }}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Jain Electronics"
                  value={newClient.companyName}
                  onChange={(e) => setNewClient({ ...newClient, companyName: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Company Code / Slug</label>
                <input
                  type="text"
                  style={{ background: '#1f293d', color: '#f8fafc', border: '1.5px solid #2b384e' }}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. jain_electronics (auto-generated if empty)"
                  value={newClient.code}
                  onChange={(e) => setNewClient({ ...newClient, code: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Contact Email</label>
                  <input
                    type="email"
                    style={{ background: '#1f293d', color: '#f8fafc', border: '1.5px solid #2b384e' }}
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="contact@jainelectronics.com"
                    value={newClient.contactEmail}
                    onChange={(e) => setNewClient({ ...newClient, contactEmail: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Contact Phone</label>
                  <input
                    type="text"
                    style={{ background: '#1f293d', color: '#f8fafc', border: '1.5px solid #2b384e' }}
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="+919811223344"
                    value={newClient.contactPhone}
                    onChange={(e) => setNewClient({ ...newClient, contactPhone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Subscription Tier</label>
                <select
                  style={{ background: '#1f293d', color: '#f8fafc', border: '1.5px solid #2b384e' }}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newClient.subscriptionTier}
                  onChange={(e) => setNewClient({ ...newClient, subscriptionTier: e.target.value })}
                >
                  <option value="ENTERPRISE">ENTERPRISE TIER</option>
                  <option value="PRO">PRO DISTRIBUTOR TIER</option>
                  <option value="STANDARD">STANDARD RETAIL TIER</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold cursor-pointer"
                  onClick={() => setShowClientModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 cursor-pointer">
                  Create Client Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PROVISION EMPLOYEE FOR CLIENT */}
      {showUserModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-8 shadow-2xl shadow-black/80 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-extrabold text-white">Provision Employee for Client</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <XCircle size={24} />
              </button>
            </div>

            {modalError && (
              <div className="mb-4 p-3 bg-red-500/15 border border-red-500/30 text-red-400 rounded-xl text-xs font-semibold">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Assign to Client Company *</label>
                <select
                  style={{ background: '#1f293d', color: '#f8fafc', border: '1.5px solid #2b384e' }}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newUser.companyId}
                  onChange={(e) => setNewUser({ ...newUser, companyId: e.target.value })}
                  required
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.companyName} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    style={{ background: '#1f293d', color: '#f8fafc', border: '1.5px solid #2b384e' }}
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Siddharth Jain"
                    value={newUser.fullName}
                    onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Assigned Role *</label>
                  <select
                    style={{ background: '#1f293d', color: '#f8fafc', border: '1.5px solid #2b384e' }}
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    required
                  >
                    <option value="ROLE_ADMIN">Client Admin (ROLE_ADMIN)</option>
                    <option value="ROLE_MANAGER">Warehouse Manager (ROLE_MANAGER)</option>
                    <option value="ROLE_SALES_REP">Sales Representative (ROLE_SALES_REP)</option>
                    <option value="ROLE_DISPATCH_MANAGER">Dispatch Manager (ROLE_DISPATCH_MANAGER)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Login Username *</label>
                  <input
                    type="text"
                    style={{ background: '#1f293d', color: '#f8fafc', border: '1.5px solid #2b384e' }}
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. jain_mgr"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Login Password *</label>
                  <input
                    type="password"
                    style={{ background: '#1f293d', color: '#f8fafc', border: '1.5px solid #2b384e' }}
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input
                    type="email"
                    style={{ background: '#1f293d', color: '#f8fafc', border: '1.5px solid #2b384e' }}
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="employee@client.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    style={{ background: '#1f293d', color: '#f8fafc', border: '1.5px solid #2b384e' }}
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="+919876543210"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold cursor-pointer"
                  onClick={() => setShowUserModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 cursor-pointer">
                  Provision Employee User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
