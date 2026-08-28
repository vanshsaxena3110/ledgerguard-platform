import React from 'react';

export default function SettingsProfile({ profile, onChange, onSave }) {
  return (
    <section className="settings-card">
      <div className="settings-card-heading"><h2>Personal Information</h2></div>
      <div className="settings-profile-layout">
        <div className="settings-avatar">{profile.name?.charAt(0).toUpperCase() || '—'}</div>
        <div className="settings-form-grid">
          <label className="settings-full">Name<input name="name" value={profile.name} onChange={onChange} /></label>
          <label className="settings-full">Role<input value={profile.role} disabled /></label>
        </div>
      </div>
      <div className="settings-card-actions"><button className="settings-primary-btn" onClick={onSave}>Save Changes</button></div>
    </section>
  );
}
