import React, { useState } from 'react';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import './App.css';

function App() {
  const [page, setPage] = useState('login');

  if (page === 'dashboard') {
    return <Dashboard onLogout={() => setPage('login')} />;
  }

  return <Login onLoginSuccess={() => setPage('dashboard')} />;
}

export default App;
