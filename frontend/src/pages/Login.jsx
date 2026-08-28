import React, { useState } from 'react';
import buildingBg from '../assets/building.png';
import { login, signup } from '../services/api';

export default function Login({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  
  // Login form states
  const [loginName, setLoginName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginCompany, setLoginCompany] = useState('');
  const [loginShowPassword, setLoginShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register form states
  const [regName, setRegName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regCompanyName, setRegCompanyName] = useState('');
  const [regShowPassword, setRegShowPassword] = useState(false);
  const [regShowConfirmPassword, setRegShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const data = await login({ name: loginName, password: loginPassword, companyName: loginCompany });
      if (data.token) localStorage.setItem('token', data.token);
      if (onLoginSuccess) onLoginSuccess();
    } catch (error) {
      setLoginError(error.message);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');
    if (regPassword !== regConfirmPassword) {
      setRegisterError('Passwords do not match');
      return;
    }
    try {
      await signup({ name: regName, password: regPassword, companyName: regCompanyName });
      setIsRegister(false);
      setLoginName(regName);
      setLoginCompany(regCompanyName);
      setRegPassword('');
      setRegConfirmPassword('');
    } catch (error) {
      setRegisterError(error.message);
    }
  };

  return (
    <div className="auth-container">
      {/* Left Panel */}
      <div className="auth-left" style={{ backgroundImage: `url(${buildingBg})` }}>
        <div className="auth-left-overlay"></div>
        <div className="auth-left-content">
          {/* Logo */}
          <div className="logo-container">
            <svg className="logo-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="logo-text">LedgerGuard</span>
          </div>

          {/* Marketing Content */}
          <div className="branding-container">
            <h1 className="branding-title">Secure Enterprise Finance</h1>
            <p className="branding-subtitle">
              Institutional grade security for your organizational ledgers. Precision engineered for control and compliance.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="form-card">
          {!isRegister ? (
            /* SIGN IN FORM */
            <form onSubmit={handleLoginSubmit} className="auth-form">
              <h2 className="form-title">Sign In</h2>
              <p className="form-subtitle">Enter your credentials to access your workspace.</p>

              {/* Name Field */}
              <div className="form-group">
                <label className="form-label">Username</label>
                <div className="input-wrapper">
                  <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="14" rx="2" ry="2" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input
                  type="text"
                  required
                  placeholder="Enter your username"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  className="form-input"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label className="form-label">PASSWORD</label>
                <div className="input-wrapper">
                  <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    type={loginShowPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="form-input"
                  />
                  <button
                    type="button"
                    onClick={() => setLoginShowPassword(!loginShowPassword)}
                    className="visibility-toggle"
                    aria-label="Toggle password visibility"
                  >
                    {loginShowPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Company Name Field */}
              <div className="form-group">
                <label className="form-label">COMPANY NAME</label>
                <div className="input-wrapper">
                  <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                    <line x1="9" y1="22" x2="9" y2="16" />
                    <line x1="15" y1="22" x2="15" y2="16" />
                    <line x1="9" y1="16" x2="15" y2="16" />
                    <path d="M8 6h.01" />
                    <path d="M16 6h.01" />
                    <path d="M8 10h.01" />
                    <path d="M16 10h.01" />
                  </svg>
                  <input
                    type="text"
                    required
                    placeholder="Enter Your Comapny Name"
                    value={loginCompany}
                    onChange={(e) => setLoginCompany(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Connection Status & Submit Button */}
              <div className="button-container">
                <button type="submit" className="submit-btn">
                  <span>Sign In</span>
                  <svg className="btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
              {loginError && <p className="auth-error" role="alert">{loginError}</p>}

              {/* Toggle Switch */}
              <p className="toggle-text">
                Don't have an account?{' '}
                <button type="button" onClick={() => setIsRegister(true)} className="toggle-btn-link">
                  Create Account
                </button>
              </p>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="auth-form">
              <h2 className="form-title">Create Account</h2>
              <p className="form-subtitle">Register to access your organizational workspace.</p>

              {/* Name Field */}
              <div className="form-group">
                <label className="form-label">NAME</label>
                <div className="input-wrapper">
                  <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    type="text"
                    required
                    placeholder="Aman Gupta"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
                    <div className="form-group">
  <label className="form-label">COMPANY NAME</label>
  <div className="input-wrapper">
    <input
      type="text"
      required
      placeholder="e.g. Infotact Solutions"
      value={regCompanyName}
      onChange={(e) => setRegCompanyName(e.target.value)}
      className="form-input"
    />
  </div>
</div>


              {/* Password Field */}
              <div className="form-group">
                <label className="form-label">PASSWORD</label>
                <div className="input-wrapper">
                  <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    type={regShowPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="form-input"
                  />
                  <button
                    type="button"
                    onClick={() => setRegShowPassword(!regShowPassword)}
                    className="visibility-toggle"
                    aria-label="Toggle password visibility"
                  >
                    {regShowPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="form-group">
                <label className="form-label">CONFIRM PASSWORD</label>
                <div className="input-wrapper">
                  <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    type={regShowConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="form-input"
                  />
                  <button
                    type="button"
                    onClick={() => setRegShowConfirmPassword(!regShowConfirmPassword)}
                    className="visibility-toggle"
                    aria-label="Toggle password visibility"
                  >
                    {regShowConfirmPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="button-container">
                <button type="submit" className="submit-btn">
                  <span>Create Account</span>
                  <svg className="btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
              {registerError && <p className="auth-error" role="alert">{registerError}</p>}

              {/* Toggle Switch */}
              <p className="toggle-text">
                Already have an account?{' '}
                <button type="button" onClick={() => setIsRegister(false)} className="toggle-btn-link">
                  Sign In
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
