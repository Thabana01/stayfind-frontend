import React from 'react';

const GDPR = () => {
  return (
    <div>
      <h1>Privacy and GDPR Compliance</h1>
      
      <div className="grid" style={{ marginTop: '20px' }}>
        <div className="stat-card" style={{ borderTopColor: 'green' }}>
          <h3>Compliant</h3>
          <p>Data Encryption at Rest</p>
        </div>
        <div className="stat-card" style={{ borderTopColor: 'orange' }}>
          <h3>Needs Review</h3>
          <p>Data Retention Policy</p>
        </div>
        <div className="stat-card" style={{ borderTopColor: 'red' }}>
          <h3>Not Implemented</h3>
          <p>Automated Data Deletion</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '30px' }}>
        <h2>Your Privacy Rights</h2>
        <p>As a user, you have the right to access, correct, or delete your data.</p>
        <button className="btn btn-primary" style={{ marginTop: '15px' }}>Download My Data (JSON)</button>
        <button className="btn btn-danger" style={{ marginTop: '15px', marginLeft: '10px' }}>Request Account Deletion</button>
      </div>
    </div>
  );
};

export default GDPR;