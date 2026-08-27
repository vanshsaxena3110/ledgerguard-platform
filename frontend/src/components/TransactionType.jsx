export default function TransactionType({ type, setType }) {
  return (
    <div className="new-tx-group">
      <label className="new-tx-label">
        Transaction Type <span className="required">*</span>
      </label>

      <div className="new-tx-type-toggle">
        <button
          type="button"
          className={`new-tx-toggle-btn credit ${
            type === "credit" ? "active" : ""
          }`}
          onClick={() => setType("credit")}
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
          Credit
        </button>

        <button
          type="button"
          className={`new-tx-toggle-btn debit ${
            type === "debit" ? "active" : ""
          }`}
          onClick={() => setType("debit")}
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
          Debit
        </button>
      </div>
    </div>
  );
}