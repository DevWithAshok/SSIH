import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { Dashboard } from './pages/Dashboard';

export function App() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
}

export default App;
