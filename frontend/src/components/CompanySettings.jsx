import React from 'react';

export default function CompanySettings({ company, onChange, onSave }) {
  return (
    <section className="settings-card">
      <div className="settings-card-heading"><h2>Company Information</h2></div>
      <div className="settings-form-grid settings-company-form">
        <label className="settings-full">Company / Organization Name<input name="name" value={company.name} onChange={onChange} /></label>
        <label>Plan<input value="Enterprise" disabled /></label>
      </div>
      <p className="settings-help">Basic organization information for your LedgerGuard workspace.</p>
      <div className="settings-card-actions"><button className="settings-primary-btn" onClick={onSave}>Save Changes</button></div>
    </section>
  );
}
