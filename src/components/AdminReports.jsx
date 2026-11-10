import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaBan } from 'react-icons/fa';

const API = 'https://stayfind-backend-etba.onrender.com';

const AdminReports = ({ onRefreshDashboard }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Pending');

  const load = () => {
    axios.get(`${API}/api/admin/reports`)
      .then((res) => {
        setReports(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => { load(); }, []);

  const handleSuspend = async (report) => {
    const confirmMsg =
      `Suspend ${report.reported_name} (${report.reported_role})?\n\n` +
      (report.reported_role === 'landlord'
        ? 'All their properties will be BLOCKED and hidden from students.'
        : 'They will be unable to log in or make bookings.');
    if (!window.confirm(confirmMsg)) return;

    try {
      const suspendRes = await axios.put(
        `${API}/api/admin/users/suspend/${report.reported_id}`,
        { status: 'Suspended' }
      );

      await axios.put(`${API}/api/admin/reports/${report.id}/resolve`, {
        admin_note: `Suspended due to report: ${report.reason}. ${suspendRes.data.affectedProperties || 0} properties blocked.`,
      });

      alert(
        `User suspended.\n` +
        (suspendRes.data.affectedProperties
          ? `${suspendRes.data.affectedProperties} properties blocked.`
          : '')
      );
      load();
      onRefreshDashboard?.();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to suspend user.');
    }
  };

  const handleDismiss = async (report) => {
    const note = window.prompt('Reason for dismissing this report:', 'No scam evidence found.');
    if (note === null) return;
    try {
      await axios.put(`${API}/api/admin/reports/${report.id}/dismiss`, { admin_note: note });
      load();
    } catch (err) {
      alert('Failed to dismiss report.');
    }
  };

  const filtered = filter === 'All' ? reports : reports.filter((r) => r.status === filter);

  if (loading) return <p>Loading reports...</p>;

  return (
    <div className="card" style={{ marginTop: 40, borderTop: '4px solid #b42318' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <FaExclamationTriangle color="#b42318" /> Scam Reports
        <span
          style={{
            background: '#fef2f2', color: '#b42318', fontSize: '0.8rem',
            padding: '4px 10px', borderRadius: 999, marginLeft: 10,
          }}
        >
          {reports.filter((r) => r.status === 'Pending').length} pending
        </span>
      </h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['Pending', 'Resolved', 'Dismissed', 'All'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 14px', borderRadius: 999, cursor: 'pointer',
              border: '1px solid #d0d5dd',
              background: filter === f ? '#175cd3' : '#fff',
              color: filter === f ? '#fff' : '#344054',
              fontSize: '0.85rem',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: '#667085', textAlign: 'center', padding: 30 }}>
          No {filter.toLowerCase()} reports.
        </p>
      ) : (
        filtered.map((r) => (
          <div
            key={r.id}
            style={{
              border: '1px solid #e2e8f0', borderRadius: 10, padding: 16,
              marginBottom: 14,
              background: r.status === 'Pending' ? '#fffbeb' : '#f9fafb',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
              <div>
                <strong style={{ color: '#b42318' }}>{r.reason}</strong>
                <span
                  style={{
                    marginLeft: 10, fontSize: '0.75rem', padding: '3px 8px', borderRadius: 999,
                    background:
                      r.status === 'Pending' ? '#fef3c7'
                      : r.status === 'Resolved' ? '#dcfce7' : '#e5e7eb',
                    color:
                      r.status === 'Pending' ? '#92400e'
                      : r.status === 'Resolved' ? '#166534' : '#374151',
                  }}
                >
                  {r.status}
                </span>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#667085' }}>
                {new Date(r.created_at).toLocaleString()}
              </span>
            </div>

            <div style={{ fontSize: '0.9rem', marginBottom: 10 }}>
              <div>
                <strong>Reporter:</strong> {r.reporter_name} ({r.reporter_role})
              </div>
              <div>
                <strong>Reported:</strong> {r.reported_name} ({r.reported_role}) —{' '}
                <span style={{ color: r.reported_account_status === 'Suspended' ? '#b42318' : '#166534' }}>
                  {r.reported_account_status || 'Active'}
                </span>
              </div>
            </div>

            <div
              style={{
                background: '#fff', padding: 12, borderRadius: 8,
                fontSize: '0.9rem', color: '#344054', marginBottom: 10,
              }}
            >
              {r.description}
            </div>

            {r.evidence_url && (
              <div style={{ fontSize: '0.85rem', marginBottom: 10 }}>
                <strong>Evidence:</strong>{' '}
                <a href={r.evidence_url} target="_blank" rel="noreferrer">
                  {r.evidence_url}
                </a>
              </div>
            )}

            {r.admin_note && (
              <div style={{ fontSize: '0.85rem', color: '#667085', fontStyle: 'italic', marginBottom: 10 }}>
                Admin note: {r.admin_note}
              </div>
            )}

            {r.status === 'Pending' && (
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => handleSuspend(r)}
                  style={{
                    padding: '8px 14px', borderRadius: 8, border: 'none',
                    background: '#b42318', color: '#fff', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}
                >
                  <FaBan /> Suspend {r.reported_role}
                </button>
                <button
                  onClick={() => handleDismiss(r)}
                  style={{
                    padding: '8px 14px', borderRadius: 8,
                    border: '1px solid #d0d5dd', background: '#fff',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                  }}
                >
                  <FaTimesCircle /> Dismiss
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AdminReports;