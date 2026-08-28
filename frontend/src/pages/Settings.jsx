import React, { useEffect, useState } from 'react';
import SettingsProfile from '../components/SettingsProfile.jsx';
import CompanySettings from '../components/CompanySettings.jsx';
import MultiTenantSettings from '../components/MultiTenantSettings.jsx';
import { fetchCurrentUser, updateCompany, updateProfile } from '../services/api.js';

const tabs = ['Profile', 'Company Info', 'Multi-Tenant'];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [profile, setProfile] = useState({ name: '', role: '' });
  const [company, setCompany] = useState({ name: '' });
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchCurrentUser()
      .then((data) => {
        setProfile({ name: data.user?.name || '', role: data.user?.role || '' });
        setCompany({ name: data.user?.company?.name || '' });
      })
      .catch((error) => setFeedback({ type: 'error', text: error.message || 'Unable to load settings' }));
  }, []);

  const update = (setter) => (event) => {
    setter((current) => ({ ...current, [event.target.name]: event.target.value }));
    setFeedback(null);
  };

  const saveProfile = async () => {
    try {
      const data = await updateProfile(profile.name);
      setProfile((current) => ({ ...current, name: data.user?.name || current.name, role: data.user?.role || current.role }));
      setFeedback({ type: 'success', text: 'Changes saved' });
    } catch (error) {
      setFeedback({ type: 'error', text: error.message || 'Unable to save profile' });
    }
  };

  const saveCompany = async () => {
    try {
      const data = await updateCompany(company.name);
      setCompany({ name: data.company?.name || company.name });
      setFeedback({ type: 'success', text: 'Changes saved' });
    } catch (error) {
      setFeedback({ type: 'error', text: error.message || 'Unable to save company' });
    }
  };

  return (
    <div className="settings-page">
      <div className="dash-title-row"><div><h1 className="dash-heading">Settings</h1><p className="dash-subtitle">Manage your settings and enterprise preferences.</p></div></div>
      <div className="settings-layout">
        <nav className="settings-tabs" aria-label="Settings sections">{tabs.map((tab) => <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>{tab}</button>)}</nav>
        <div className="settings-content">
          {activeTab === 'Profile' && <SettingsProfile profile={profile} onChange={update(setProfile)} onSave={saveProfile} />}
          {activeTab === 'Company Info' && <CompanySettings company={company} onChange={update(setCompany)} onSave={saveCompany} />}
          {activeTab === 'Multi-Tenant' && <MultiTenantSettings company={company} />}
          {feedback && <div className="settings-saved" style={feedback.type === 'error' ? { background: '#fef2f2', color: '#b91c1c', borderColor: '#fecaca' } : undefined}>{feedback.text}</div>}
        </div>
      </div>
    </div>
  );
}
