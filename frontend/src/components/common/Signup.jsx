import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Ordinary');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register, user } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, redirect them
  useEffect(() => {
    if (user) {
      if (user.role === 'Admin') navigate('/admin');
      else if (user.role === 'Agent') navigate('/agent');
      else navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name || !email || !password || !phone) {
      setErrorMsg('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }

    if (isNaN(Number(phone))) {
      setErrorMsg('Please enter a valid phone number (digits only)');
      return;
    }

    setSubmitting(true);
    const result = await register(name, email, password, phone, role);
    setSubmitting(false);

    if (result.success) {
      if (result.pendingApproval) {
        setSuccessMsg('Agent registration successful! Your account is pending administrator approval before you can sign in.');
        // Clear fields
        setName('');
        setEmail('');
        setPassword('');
        setPhone('');
        setRole('Ordinary');
      }
      // If citizen/admin, they are logged in automatically and redirected via useEffect
    } else {
      setErrorMsg(result.error);
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem 1rem' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '480px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Register <span style={{
              background: 'var(--gradient-radiant)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Account</span>
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Create a secure online complaint portal account</p>
        </div>

        {errorMsg && (
          <div style={{
            background: 'rgba(255, 78, 80, 0.15)',
            border: '1px solid rgba(255, 78, 80, 0.3)',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1.5rem',
            color: '#ff4e50',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.95rem'
          }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            background: 'rgba(0, 255, 135, 0.15)',
            border: '1px solid rgba(0, 255, 135, 0.3)',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1.5rem',
            color: '#00ff87',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.95rem'
          }}>
            <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input
              type="email"
              className="input-field"
              placeholder="e.g. user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Phone Number</label>
            <input
              type="tel"
              className="input-field"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="grid-2" style={{ gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="min. 6 chars"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Account Role</label>
              <select
                className="select-field"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Ordinary">Ordinary (Citizen)</option>
                <option value="Agent">Agent (Officer)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
            disabled={submitting}
          >
            {submitting ? 'Registering...' : (
              <>
                Create Account <UserPlus size={18} />
              </>
            )}
          </button>

        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{
            color: 'var(--accent-primary)',
            fontWeight: '600',
            textDecoration: 'none'
          }}>
            Login Here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Signup;
