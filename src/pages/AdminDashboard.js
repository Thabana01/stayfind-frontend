import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaLink, FaCheckCircle, FaChartBar, FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import AdminReports from '../components/AdminReports';

const AdminDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    Promise.all([
      axios.get('https://stayfind-backend-etba.onrender.com/api/admin/properties'),
      axios.get('https://stayfind-backend-etba.onrender.com/api/blockchain'),
      axios.get('https://stayfind-backend-etba.onrender.com/api/admin/users'),
      axios.get('https://stayfind-backend-etba.onrender.com/api/admin/analytics')
    ]).then(([propRes, blockRes, userRes, analyticsRes]) => {
      setProperties(propRes.data);
      setLedger(blockRes.data);
      setUsers(userRes.data);
      setAnalytics(analyticsRes.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproveUser = (userId) => {
    axios.put(`https://stayfind-backend-etba.onrender.com/api/admin/users/approve/${userId}`)
      .then(() => {
        alert("User Approved!");
        fetchData();
      })
      .catch(() => alert("Error approving user"));
  };

  // ✏️ EDITED: reads affectedProperties from backend and shows what happened
  const handleSuspendUser = (userId, currentStatus, role) => {
    const newStatus = currentStatus === 'Suspended' ? 'Active' : 'Suspended';
    const verb = newStatus === 'Suspended' ? 'suspend' : 'activate';

    let confirmMsg = `Are you sure you want to ${verb} this user?`;
    if (role === 'landlord') {
      confirmMsg = newStatus === 'Suspended'
        ? 'Are you sure? Suspending this landlord will BLOCK all their properties and cancel pending bookings.'
        : 'Reactivate this landlord? All their blocked properties will become Available again.';
    }

    if (!window.confirm(confirmMsg)) return;

    axios.put(
      `https://stayfind-backend-etba.onrender.com/api/admin/users/suspend/${userId}`,
      { status: newStatus }
    )
      .then((res) => {
        const affected = res.data?.affectedProperties;
        if (role === 'landlord' && typeof affected === 'number') {
          alert(
            newStatus === 'Suspended'
              ? `Landlord suspended. ${affected} propert${affected === 1 ? 'y' : 'ies'} blocked and hidden from students.`
              : `Landlord reactivated. ${affected} propert${affected === 1 ? 'y' : 'ies'} re-listed as Available.`
          );
        } else {
          alert(`User account is now ${newStatus}.`);
        }
        fetchData();
      })
      .catch((err) => {
        console.error(err);
        alert(err.response?.data?.error || 'Error updating user status');
      });
  };

  if (loading || !analytics) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading Real-Time Analytics...</h2>;

  const COLORS = ['#0ea5e9', '#14b8a6', '#f59e0b', '#ef4444'];

  return (
    <div>
      <h1>Administrator Dashboard</h1>

      {/* STATS SUMMARY */}
      <div className="grid" style={{ marginTop: '20px', gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card"><h2>{properties.length}</h2><p>Total Properties</p></div>
        <div className="stat-card"><h2>{users.length}</h2><p>Registered Users</p></div>
        <div className="stat-card"><h2>{ledger.length}</h2><p>Blockchain Tx</p></div>
        <div className="stat-card"><h2>{users.filter(u => u.verification_status === 'Pending').length}</h2><p>Pending Verifications</p></div>
      </div>

      {/* PART D: REAL-TIME ANALYTICS CHARTS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '40px' }}>
        
        <div className="card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaMoneyBillWave color="var(--primary)" /> Average Rent by Location</h3>
          <div style={{ height: 300, marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.avgPrice}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="location" />
                <YAxis />
                <Tooltip formatter={(value) => `M${value}`} />
                <Bar dataKey="avg_price" fill="#0ea5e9" radius={[5, 5, 0, 0]} name="Avg Rent (M)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaMapMarkerAlt color="var(--accent)" /> Property Type Distribution</h3>
          <div style={{ height: 300, marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={analytics.propertyTypes.map(item => ({ ...item, value: Number(item.value) }))} 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={100} 
                  fill="#8884d8" 
                  dataKey="value" 
                  label
                >
                  {analytics.propertyTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaChartBar color="#f59e0b" /> Booking Demand Over Time</h3>
          <div style={{ height: 300, marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.bookingTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="bookings" stroke="#f59e0b" strokeWidth={3} name="Total Bookings" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ✏️ EDITED: Colours 'Blocked' red, 'Occupied' amber, 'Available' teal */}
        <div className="card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaChartBar color="var(--primary)" /> Availability Status</h3>
          <div style={{ height: 300, marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.statusDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 5, 5, 0]} name="Properties">
                  {analytics.statusDistribution.map((entry, index) => {
                    const color =
                      entry.name === 'Blocked' ? '#ef4444'
                      : entry.name === 'Occupied' ? '#f59e0b'
                      : '#14b8a6';
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* USER VERIFICATION TABLE */}
      <div className="card" style={{ marginTop: '40px' }}>
        <h2>User Management & Verification</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Verification Details</th>
              <th>Verification</th>
              <th>Account Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>
                  {u.full_name}<br/>
                  <span style={{ fontSize: '0.8rem', color: '#666' }}>{u.email}</span>
                </td>
                <td style={{ textTransform: 'capitalize' }}>{u.role}</td>
                <td>
                  {u.role === 'student' && <span style={{ fontSize: '0.85rem' }}>ID: {u.student_number || 'N/A'}</span>}
                  {u.role === 'landlord' && <span style={{ fontSize: '0.85rem' }}>{u.property_details || 'N/A'}</span>}
                </td>
                <td>
                  <span className={`badge ${u.verification_status === 'Approved' ? 'badge-green' : 'badge-yellow'}`}>
                    {u.verification_status}
                  </span>
                </td>
                <td>
                  <span className={`badge ${u.account_status === 'Suspended' ? 'badge-red' : 'badge-green'}`}>
                    {u.account_status || 'Active'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {u.verification_status !== 'Approved' && (
                      <button onClick={() => handleApproveUser(u.id)} className="btn btn-accent" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>
                        Approve
                      </button>
                    )}
                    {/* ✏️ EDITED: pass role too so we can warn about property blocking */}
                    <button 
                      onClick={() => handleSuspendUser(u.id, u.account_status, u.role)} 
                      className={`btn ${u.account_status === 'Suspended' ? 'btn-primary' : 'btn-danger'}`} 
                      style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                    >
                      {u.account_status === 'Suspended' ? 'Activate' : 'Suspend'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🆕 SCAM REPORTS PANEL */}
      <AdminReports onRefreshDashboard={fetchData} />

      {/* BLOCKCHAIN LEDGER (CLICKABLE ROWS) */}
      <div className="card" style={{ marginTop: '30px', borderTop: '4px solid var(--accent)' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaLink color="var(--accent)" /> Latest Transactions (Block Explorer)
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
          Click any row to view the real Ethereum transaction on Sepolia Etherscan.
        </p>
        <table style={{ fontSize: '0.85rem' }}>
          <thead>
            <tr>
              <th>Txn Hash</th>
              <th>Method</th>
              <th>From (Student)</th>
              <th>To (Landlord)</th>
              <th>Value (LSL)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {ledger.length > 0 ? ledger.map((tx, index) => (
              <tr 
                key={tx.id} 
                style={{ 
                  borderBottom: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onClick={() => {
                  if (tx.transaction_hash) {
                    window.open(`https://sepolia.etherscan.io/tx/${tx.transaction_hash}`, '_blank');
                  }
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 'bold' }}>
                  {tx.transaction_hash ? `${tx.transaction_hash.substring(0, 10)}...${tx.transaction_hash.slice(-6)}` : '0x...'} ↗
                </td>
                <td>
                  <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', color: '#475569' }}>
                    {tx.action || 'ConfirmBooking'}
                  </span>
                </td>
                <td style={{ color: 'var(--text-main)' }}>
                  {tx.student_name || 'Unknown'} <br/>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Wallet: 0x{tx.property_id || 'ABC'}...</span>
                </td>
                <td style={{ color: 'var(--text-main)' }}>
                  {tx.property_title ? tx.property_title.split('(')[0] : 'Unknown'} <br/>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Contract: 0x...{tx.property_id}</span>
                </td>
                <td style={{ fontWeight: 'bold' }}>M{tx.amount || '0.00'}</td>
                <td>
                  <span className="badge badge-green" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                    <FaCheckCircle style={{ marginRight: '3px' }} /> Success
                  </span>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>No blockchain records yet.</td></tr>
            )}
          </tbody>
        </table>
        <p style={{ marginTop: '20px', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'right' }}>
          Viewing latest {ledger.length} transactions on the Sepolia Testnet.
        </p>
      </div>

    </div>
  );
};

export default AdminDashboard;