import React from 'react';
import { Link } from 'react-router-dom';

const SecurityDashboard = () => {
  return (
    <div style={{ background: '#0f172a', color: 'white', minHeight: '100vh', margin: '-20px', padding: '40px' }}>
      
      {/* SIMULATED DOMAIN HEADER */}
      <div style={{ borderBottom: '1px solid #334155', paddingBottom: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0, color: '#ef4444' }}>🛡️ StayFind Security Portal</h1>
        <span style={{ color: '#94a3b8' }}>Domain: security.stayfind.co.ls (Simulated)</span>
      </div>

      <p style={{ color: '#94a3b8', marginBottom: '30px' }}>
        ⚠️ <strong>RESTRICTED ACCESS:</strong> This module must be hosted on a separate domain in production to isolate security configuration from the main application.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        
        {/* ROLE-BASED ACCESS CONFIGURATION */}
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ color: '#38bdf8', marginTop: 0 }}>Role-Based Access Control (RBAC)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
            <thead>
              <tr style={{ color: '#94a3b8', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Module</th>
                <th style={{ padding: '10px' }}>Student</th>
                <th style={{ padding: '10px' }}>Landlord</th>
                <th style={{ padding: '10px' }}>Admin</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #334155' }}>
                <td style={{ padding: '10px' }}>Properties</td>
                <td style={{ padding: '10px', color: '#22c55e' }}>Read</td>
                <td style={{ padding: '10px', color: '#f59e0b' }}>Read/Write</td>
                <td style={{ padding: '10px', color: '#f59e0b' }}>Read/Write</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #334155' }}>
                <td style={{ padding: '10px' }}>Identity Documents</td>
                <td style={{ padding: '10px', color: '#ef4444' }}>Deny</td>
                <td style={{ padding: '10px', color: '#ef4444' }}>Deny</td>
                <td style={{ padding: '10px', color: '#22c55e' }}>Read</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #334155' }}>
                <td style={{ padding: '10px' }}>System Settings</td>
                <td style={{ padding: '10px', color: '#ef4444' }}>Deny</td>
                <td style={{ padding: '10px', color: '#ef4444' }}>Deny</td>
                <td style={{ padding: '10px', color: '#f59e0b' }}>Configure</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SECURITY LOGS */}
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ color: '#38bdf8', marginTop: 0 }}>Security Activity Logs</h3>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '15px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
            <li style={{ padding: '8px 0', borderBottom: '1px solid #334155' }}>✅ [INFO] Admin logged in from IP 192.168.1.5</li>
            <li style={{ padding: '8px 0', borderBottom: '1px solid #334155' }}>❌ [WARN] Failed login attempt for user: landlord@test.com</li>
            <li style={{ padding: '8px 0', borderBottom: '1px solid #334155' }}>✅ [INFO] Database backup completed successfully</li>
            <li style={{ padding: '8px 0', borderBottom: '1px solid #334155' }}>⚠️ [ALERT] Unauthorized access attempt to /admin route by User ID 6</li>
          </ul>
        </div>

      </div>

      <div style={{ marginTop: '40px' }}>
        <Link to="/" style={{ color: '#38bdf8', textDecoration: 'none' }}>← Return to Main App</Link>
      </div>
    </div>
  );
};

export default SecurityDashboard;