import React, { useState } from 'react';
import axios from 'axios';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const API = 'https://stayfind-backend-etba.onrender.com';

const REASONS = [
  'Scam / Fraud',
  'Fake Listing',
  'Payment Not Returned',
  'Harassment / Threats',
  'Property Not As Described',
  'Identity Theft',
  'Other',
];

const ReportUserModal = ({ isOpen, onClose, reporterId, reportedUser, onSubmitted }) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !reportedUser) return null;

  const handleSubmit = async () => {
    setError('');
    if (!reason) return setError('Please select a reason.');
    if (description.trim().length < 20) return setError('Please describe the issue (20+ characters).');

    setSubmitting(true);
    try {
      await axios.post(`${API}/api/reports`, {
        reporter_id: reporterId,
        reported_id: reportedUser.id,
        reason,
        description,
        evidence_url: evidenceUrl,
      });
      onSubmitted?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 20,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 14, maxWidth: 520, width: '100%',
          padding: 28, position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 14, right: 14, background: 'transparent',
            border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#666',
          }}
        >
          <FaTimes />
        </button>

        <h2 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: 10, color: '#b42318' }}>
          <FaExclamationTriangle /> Report User
        </h2>

        <p style={{ color: '#475467', fontSize: '0.9rem', marginBottom: 20 }}>
          You are reporting <strong>{reportedUser.full_name}</strong> ({reportedUser.role}).
          Admin will review this and may suspend the account. False reports may get <em>you</em> suspended.
        </p>

        <label style={{ display: 'block', marginBottom: 6, fontWeight: 'bold', fontSize: '0.9rem' }}>
          Reason *
        </label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="form-control"
          style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #d0d5dd', marginBottom: 16 }}
        >
          <option value="">Select a reason...</option>
          {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>

        <label style={{ display: 'block', marginBottom: 6, fontWeight: 'bold', fontSize: '0.9rem' }}>
          What happened? *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what happened. Include dates, amounts, and any proof you have."
          rows={5}
          style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #d0d5dd', marginBottom: 16, resize: 'vertical' }}
        />

        <label style={{ display: 'block', marginBottom: 6, fontWeight: 'bold', fontSize: '0.9rem' }}>
          Evidence link (optional)
        </label>
        <input
          type="text"
          value={evidenceUrl}
          onChange={(e) => setEvidenceUrl(e.target.value)}
          placeholder="https://... (screenshot or document link)"
          style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #d0d5dd', marginBottom: 16 }}
        />

        {error && (
          <div style={{ background: '#fef2f2', color: '#b42318', padding: 10, borderRadius: 8, marginBottom: 12, fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            disabled={submitting}
            style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #d0d5dd', background: '#fff', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              padding: '10px 20px', borderRadius: 8, border: 'none',
              background: '#b42318', color: '#fff', cursor: submitting ? 'wait' : 'pointer',
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportUserModal;