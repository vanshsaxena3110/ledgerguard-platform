import TransactionType from "./TransactionType";

export default function TransactionFormFields({
  type,
  setType,
  amount,
  setAmount,
  description,
  setDescription,
  category,
  setCategory,
  date,
  setDate,
  status,
  setStatus,
  refId,
  setRefId,
  notes,
  setNotes,
}) {
  return (
    <div className="new-tx-grid">
      <div className="new-tx-col">
        <TransactionType type={type} setType={setType} />

        <div className="new-tx-group">
          <label className="new-tx-label">
            Description <span className="required">*</span>
          </label>

          <textarea
            className="new-tx-textarea"
            placeholder="Enter description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={200}
            required
          />

          <div className="new-tx-char-count">
            {description.length}/200
          </div>
        </div>

        <div className="new-tx-group">
          <label className="new-tx-label">
            Transaction Date <span className="required">*</span>
          </label>

          <div className="new-tx-input-wrapper">
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              className="input-icon"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
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

      <div className="new-tx-col">
        <div className="new-tx-group">
          <label className="new-tx-label">
            Amount <span className="required">*</span>
          </label>

          <div className="new-tx-amount-group">
            <span className="currency-symbol">$</span>

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

            <span className="select-arrow">⌄</span>
          </div>
        </div>

        <div className="new-tx-group">
          <label className="new-tx-label">
            Status <span className="required">*</span>
          </label>

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

            <span className="select-arrow">⌄</span>
          </div>
        </div>

        <div className="new-tx-group">
          <label className="new-tx-label">Notes (Optional)</label>

          <textarea
            className="new-tx-textarea"
            placeholder="Add any additional notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={500}
          />

          <div className="new-tx-char-count">
            {notes.length}/500
          </div>
        </div>
      </div>
    </div>
  );
}