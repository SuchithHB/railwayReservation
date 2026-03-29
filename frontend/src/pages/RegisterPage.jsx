import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) { setError('Name, email and password are required'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card card-elevated">
        <h2>Create Account</h2>
        <p>Join RailReserve and start booking tickets</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input className="form-control" name="name" placeholder="John Doe"
              value={form.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input className="form-control" name="email" type="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-control" name="password" type="password" placeholder="Min. 6 characters"
              value={form.password} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Phone (Optional)</label>
            <input className="form-control" name="phone" placeholder="9876543210"
              value={form.phone} onChange={handleChange} />
          </div>
          <button className="btn btn-primary btn-block btn-lg" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <div className="auth-link">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
