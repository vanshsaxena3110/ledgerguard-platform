import React from 'react';

export default function SettingsProfile({ profile, onChange, onSave }) {
  return (
    <section className="settings-card">
      <div className="settings-card-heading"><h2>Personal Information</h2></div>
      <div className="settings-profile-layout">
        <div className="settings-avatar">A</div>
        <div className="settings-form-grid">
          <label>First Name<input name="firstName" value={profile.firstName} onChange={onChange} /></label>
          <label>Last Name<input name="lastName" value={profile.lastName} onChange={onChange} /></label>
          <label className="settings-full">Email Address<input name="email" type="email" value={profile.email} onChange={onChange} /></label>
          <label className="settings-full">Role<input value={profile.role} disabled /></label>
        </div>
      </div>
      <div className="settings-card-actions"><button className="settings-primary-btn" onClick={onSave}>Save Changes</button></div>
    </section>
  );
}
