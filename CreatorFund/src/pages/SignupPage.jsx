import { useState } from 'react';
import { useAuth } from '../context/useAuth';

export default function SignupPage({ onSwitchToLogin }) {
  const { register } = useAuth();
  const [role, setRole] = useState('creator');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(name, email, password, role);
  };

  return (
    <div className="login-container">
      <div className="card login-card">
        <h2>CreatorFund Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Sign Up As</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="creator">Creator</option>
              <option value="distributor">Distributor</option>
            </select>
          </div>
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Satoshi Nakamoto" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="user@example.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: 16}}>Create Account</button>
          
          <div style={{marginTop: 15, textAlign: 'center', fontSize: '0.9rem'}}>
            Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>Log in</a>
          </div>
        </form>
      </div>
    </div>
  );
}
