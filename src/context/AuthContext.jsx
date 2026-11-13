import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('safelink_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('safelink_token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('safelink_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('safelink_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('safelink_token', token);
    } else {
      localStorage.removeItem('safelink_token');
    }
  }, [token]);

  const login = (userData, authToken = 'demo-token') => {
    setUser(userData);
    setToken(authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('safelink_user');
    localStorage.removeItem('safelink_token');
    localStorage.removeItem('safelink_contacts');
  };

  const updateUser = (data) => {
    setUser(prev => ({ ...prev, ...data }));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, setLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export default AuthContext;
