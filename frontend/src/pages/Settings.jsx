import React, { useState } from 'react';
import SettingsProfile from '../components/SettingsProfile.jsx';
import CompanySettings from '../components/CompanySettings.jsx';
import MultiTenantSettings from '../components/MultiTenantSettings.jsx';

const tabs = ['Profile', 'Company Info', 'Multi-Tenant'];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [profile, setProfile] = useState({ firstName: 'Admin', lastName: 'User', email: 'admin@ledgerguard.inc', role: 'Financial Controller (Admin)' });
  const [company, setCompany] = useState({ name: 'Acme Corp', slug: 'acme-corp' });
  const [saved, setSaved] = useState(false);

  const update = (setter) => (event) => { setter((current) => ({ ...current, [event.target.name]: event.target.value })); setSaved(false); };
  const save = () => { setSaved(true); window.setTimeout(() => setSaved(false), 2200); };

  return (
    <div className="settings-page">
      <div className="dash-title-row"><div><h1 className="dash-heading">Settings</h1><p className="dash-subtitle">Manage your settings and enterprise preferences.</p></div></div>
      <div className="settings-layout">
        <nav className="settings-tabs" aria-label="Settings sections">{tabs.map((tab) => <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>{tab}</button>)}</nav>
        <div className="settings-content">
          {activeTab === 'Profile' && <SettingsProfile profile={profile} onChange={update(setProfile)} onSave={save} />}
          {activeTab === 'Company Info' && <CompanySettings company={company} onChange={update(setCompany)} onSave={save} />}
          {activeTab === 'Multi-Tenant' && <MultiTenantSettings company={company} />}
          {saved && <div className="settings-saved">Changes saved</div>}
        </div>
      </div>
    </div>
  );
}
