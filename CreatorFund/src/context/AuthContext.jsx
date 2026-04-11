import { useState } from 'react';
import { api } from '../data/api';
import { AuthContext } from './useAuth';

const getStoredUser = () => {
  const savedUser = localStorage.getItem('creatorfund-user');
  if (!savedUser) return null;

  try {
    return JSON.parse(savedUser);
  } catch {
    localStorage.removeItem('creatorfund-user');
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);

  const login = async (email, password, role) => {
    try {
      const user = await api.login(email, password, role);
      setUser(user);
      localStorage.setItem('creatorfund-user', JSON.stringify(user));
    } catch (err) {
      console.error(err);
      throw new Error('Login failed. Please check your credentials.');
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const user = await api.register(name, email, password, role);
      setUser(user);
      localStorage.setItem('creatorfund-user', JSON.stringify(user));
    } catch (err) {
      console.error(err);
      throw new Error('Registration failed. Email may already be in use.');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('creatorfund-user');
    localStorage.removeItem('creatorfund-token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
