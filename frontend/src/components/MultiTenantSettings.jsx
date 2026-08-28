import React from 'react';

export default function MultiTenantSettings({ company }) {
  return (
    <section className="settings-card">
      <div className="settings-card-heading"><h2>Multi-tenant Organization</h2></div>
      <div className="settings-tenant-grid">
        <div><span>Current Organization</span><strong>{company.name}</strong><small>Organization workspace</small></div>
        <div><span>Current Plan</span><b className="settings-badge blue">Enterprise</b><small>Organization workspace</small></div>
        <div><span>Tenant Status</span><b className="settings-badge green">Not provided</b><small>Not available from the current backend</small></div>
      </div>
    </section>
  );
}
