import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ onSwitchToSignup }) {
  const { login } = useAuth();
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, 'dummy_password', role);
  };

  return (
    <div className="login-container">
      <div className="card login-card">
        <h2>CreatorFund Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Login As</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="admin">Administrator</option>
              <option value="creator">Creator</option>
              <option value="distributor">Distributor</option>
            </select>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="user@example.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: 16}}>Sign In</button>
          <div style={{marginTop: 15, textAlign: 'center', fontSize: '0.9rem'}}>
            Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToSignup(); }}>Sign up</a>
          </div>
        </form>
      </div>
    </div>
  );
}
