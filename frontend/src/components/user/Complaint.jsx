import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FileText, ArrowLeft, AlertCircle } from 'lucide-react';

const Complaint = () => {
  const { user, API_URL } = useAuth();
  
  const [name, setName] = useState(user ? user.name : '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [comment, setComment] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name || !address || !city || !state || !pincode || !comment) {
      setErrorMsg('Please fill in all fields');
      return;
    }

    if (isNaN(Number(pincode))) {
      setErrorMsg('Pincode must be a valid number');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_URL}/complaints`,
        {
          name,
          address,
          city,
          state,
          pincode: Number(pincode),
          comment
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Error submitting complaint. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container fade-in" style={{ maxWidth: '700px' }}>
      
      {/* Back button */}
      <Link to="/dashboard" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: 'var(--text-muted)',
        textDecoration: 'none',
        fontWeight: '600',
        marginBottom: '2rem',
        fontSize: '0.95rem'
      }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="glass-card">
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <div style={{
            background: 'var(--gradient-radiant)',
            color: 'var(--text-dark)',
            width: '45px',
            height: '45px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-neon-blue)'
          }}>
            <FileText size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Lodge A Complaint</h2>
            <p style={{ color: 'var(--text-muted)' }}>Provide details of the issue you want to report</p>
          </div>
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

        <form onSubmit={handleSubmit}>
          
          <div className="input-group">
            <label className="input-label">Complainant Full Name</label>
            <input
              type="text"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Site Address / Incident Location</label>
            <input
              type="text"
              className="input-field"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Street name, Landmark, House No."
              required
            />
          </div>

          <div className="grid-3" style={{ gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">City</label>
              <input
                type="text"
                className="input-field"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Mumbai"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">State</label>
              <input
                type="text"
                className="input-field"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Maharashtra"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Pincode</label>
              <input
                type="text"
                className="input-field"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="e.g. 400001"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Detailed Comments / Description</label>
            <textarea
              className="input-field"
              rows="5"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe the issue in detail. If this is a leakage, power outage, or security issue, please state clearly."
              style={{ resize: 'vertical' }}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem' }}
            disabled={submitting}
          >
            {submitting ? 'Submitting Lodge...' : 'Submit Complaint'}
          </button>

        </form>

      </div>
    </div>
  );
};

export default Complaint;
