import { useState } from 'react';
import { useAuth } from '../context/useAuth';

export default function LoginPage({ onSwitchToSignup }) {
  const { login } = useAuth();
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password, role);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="card login-card">
        <h2>CreatorFund Login</h2>
        {error && <div style={{ color: '#d32f2f', marginBottom: '15px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px', border: '1px solid #ffcdd2', fontSize: '0.9rem' }}>{error}</div>}
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
