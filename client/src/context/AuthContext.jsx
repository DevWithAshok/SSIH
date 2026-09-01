import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('instantps_token') || null);
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch available personas
  const fetchPersonas = async () => {
    try {
      const res = await fetch('/api/personas');
      const data = await res.json();
      if (data.personas) {
        setPersonas(data.personas);
        // Default to first student persona if not logged in
        if (!token && data.personas.length > 0) {
          switchPersona(data.personas[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load personas:', err);
    } finally {
      setLoading(false);
    }
  };

  // Switch persona quick login
  const switchPersona = async (personaId) => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personaId })
      });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('instantps_token', data.token);
      }
    } catch (err) {
      console.error('Error switching persona:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update preferences
  const updatePreferences = async (newPrefs) => {
    if (!token) return;
    try {
      const res = await fetch('/api/auth/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newPrefs)
      });
      const data = await res.json();
      if (data.user) {
        setUser(prev => ({ ...prev, ...data.user }));
      }
      return data;
    } catch (err) {
      console.error('Failed to update preferences:', err);
    }
  };

  // Restore current user if token exists
  useEffect(() => {
    fetchPersonas();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      personas,
      loading,
      switchPersona,
      updatePreferences,
      refreshUser: fetchPersonas
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
