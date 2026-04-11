import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../data/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check localStorage on load (simulating persistent session)
  useEffect(() => {
    const saved = localStorage.getItem('creatorfund-user');
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    try {
      // Connects to our dummy API service
      const res = await api.login(email, password, role);
      setUser(res.user);
      localStorage.setItem('creatorfund-user', JSON.stringify(res.user));
      localStorage.setItem('creatorfund-token', res.token);
    } catch (err) {
      console.error(err);
      throw new Error('Login failed');
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const res = await api.register(name, email, password, role);
      setUser(res.user);
      localStorage.setItem('creatorfund-user', JSON.stringify(res.user));
      localStorage.setItem('creatorfund-token', res.token);
    } catch (err) {
      console.error(err);
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('creatorfund-user');
    localStorage.removeItem('creatorfund-token');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
