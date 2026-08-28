import React, { useState } from 'react';
import { createTransaction } from '../services/api.js';

export default function NewTransaction({ onCancel, onSuccess }) {
  const [type, setType] = useState('credit');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('2025-05-24');
  const [status, setStatus] = useState('pending');
  const [refId, setRefId] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (!type) {
      setError('Transaction type is required.');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError('Amount must be a positive number.');
      return;
    }
    if (!description.trim()) {
      setError('Description is required.');
      return;
    }
    if (description.length > 200) {
      setError('Description cannot exceed 200 characters.');
      return;
    }

    setLoading(true);

    try {
      // Backend only supports type, amount, description
      const createdTx = await createTransaction({
        type,
        amount: parseFloat(amount),
        description: description.trim()
      });
      
      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(createdTx);
        }
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to create transaction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-tx-page">
      {/* Header Row */}
      <div className="new-tx-header">
        <div>
          <h1 className="new-tx-title">New Transaction</h1>
          <p className="new-tx-subtitle">Create a new credit or debit transaction</p>
        </div>
        <button className="new-tx-back-btn" onClick={onCancel} type="button">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Transactions
        </button>
      </div>

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="new-tx-card">
        {error && (
          <div className="new-tx-alert error">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="new-tx-alert success">
            <span className="alert-icon">✓</span>
            <span>Transaction created successfully! Return to ledger...</span>
          </div>
        )}

        <div className="new-tx-grid">
          {/* Left Column */}
          <div className="new-tx-col">
            {/* Transaction Type */}
            <div className="new-tx-group">
              <label className="new-tx-label">Transaction Type <span className="required">*</span></label>
              <div className="new-tx-type-toggle">
                <button
                  type="button"
                  className={`new-tx-toggle-btn credit ${type === 'credit' ? 'active' : ''}`}
                  onClick={() => setType('credit')}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="19" x2="12" y2="5"></line>
                    <polyline points="5 12 12 5 19 12"></polyline>
                  </svg>
                  Credit
                </button>
                <button
                  type="button"
                  className={`new-tx-toggle-btn debit ${type === 'debit' ? 'active' : ''}`}
                  onClick={() => setType('debit')}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <polyline points="19 12 12 19 5 12"></polyline>
                  </svg>
                  Debit
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="new-tx-group">
              <label className="new-tx-label">Description <span className="required">*</span></label>
              <textarea
                className="new-tx-textarea"
                placeholder="Enter description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={200}
                required
              />
              <div className="new-tx-char-count">{description.length}/200</div>
            </div>

            {/* Transaction Date */}
            <div className="new-tx-group">
              <label className="new-tx-label">Transaction Date <span className="required">*</span></label>
              <div className="new-tx-input-wrapper">
                <svg viewBox="0 0 24 24" width="16" height="16" className="input-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <input
                  type="date"
                  className="new-tx-input with-icon"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Reference ID */}
            <div className="new-tx-group">
              <label className="new-tx-label">Reference ID</label>
              <input
                type="text"
                className="new-tx-input"
                placeholder="Enter reference ID (e.g. TRN-2025-0001)"
                value={refId}
                onChange={(e) => setRefId(e.target.value)}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="new-tx-col">
            {/* Amount */}
            <div className="new-tx-group">
              <label className="new-tx-label">Amount <span className="required">*</span></label>
              <div className="new-tx-amount-group">
                <span className="currency-symbol">₹</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="new-tx-input amount-input"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
                <span className="amount-suffix">0.00</span>
              </div>
            </div>

            {/* Category */}
            <div className="new-tx-group">
              <label className="new-tx-label">Category</label>
              <div className="new-tx-select-wrapper">
                <select
                  className="new-tx-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select category...</option>
                  <option value="operations">Operations</option>
                  <option value="marketing">Marketing</option>
                  <option value="payroll">Payroll</option>
                  <option value="sales">Sales</option>
                  <option value="investments">Investments</option>
                  <option value="taxes">Taxes</option>
                </select>
                <span className="select-arrow">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="new-tx-group">
              <label className="new-tx-label">Status <span className="required">*</span></label>
              <div className="new-tx-select-wrapper">
                <div className={`status-dot-indicator ${status}`} />
                <select
                  className="new-tx-select has-status-dot"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
                <span className="select-arrow">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              </div>
            </div>

            {/* Notes */}
            <div className="new-tx-group">
              <label className="new-tx-label">Notes (Optional)</label>
              <textarea
                className="new-tx-textarea"
                placeholder="Add any additional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={500}
              />
              <div className="new-tx-char-count">{notes.length}/500</div>
            </div>
          </div>
        </div>

        {/* Bottom Actions Row */}
        <div className="new-tx-actions">
          <button className="new-tx-btn cancel" onClick={onCancel} type="button" disabled={loading}>
            Cancel
          </button>
          <button className="new-tx-btn submit" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Transaction'}
          </button>
        </div>
      </form>
    </div>
  );
}
