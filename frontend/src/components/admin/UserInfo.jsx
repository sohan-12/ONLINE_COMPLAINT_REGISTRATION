import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Users, Mail, Phone, Calendar } from 'lucide-react';

const UserInfo = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { API_URL } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/complaints/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setUsers(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching users', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [API_URL]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
        Loading user database...
      </div>
    );
  }

  return (
    <div className="container fade-in">
      
      {/* Back link */}
      <Link to="/admin" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: 'var(--text-muted)',
        textDecoration: 'none',
        fontWeight: '600',
        marginBottom: '2rem',
        fontSize: '0.95rem'
      }}>
        <ArrowLeft size={16} /> Back to Console
      </Link>

      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.3rem', fontWeight: 800 }}>Citizen Registry</h1>
        <p style={{ color: 'var(--text-muted)' }}>View contact information and registered profiles for all complainants</p>
      </div>

      {users.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          No registered citizens found in the system database.
        </div>
      ) : (
        <div className="grid-2">
          {users.map((citizen) => (
            <div key={citizen._id} className="glass-card" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              padding: '1.5rem 2rem'
            }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                <div style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '12px',
                  background: 'rgba(0, 242, 254, 0.05)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1rem',
                  border: '1px solid var(--border-glass)'
                }}>
                  <Users size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{citizen.name}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600 }}>Ordinary Citizen</span>
                </div>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                fontSize: '0.88rem',
                color: 'var(--text-muted)',
                paddingTop: '0.85rem',
                borderTop: '1px solid var(--border-glass)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={14} style={{ color: 'var(--text-muted)', opacity: 0.8 }} />
                  <span>{citizen.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={14} style={{ color: 'var(--text-muted)', opacity: 0.8 }} />
                  <span>{citizen.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={14} style={{ color: 'var(--text-muted)', opacity: 0.8 }} />
                  <span>Registered: {new Date(citizen.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default UserInfo;
