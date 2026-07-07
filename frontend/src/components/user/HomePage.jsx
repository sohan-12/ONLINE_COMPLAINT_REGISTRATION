import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FileText, Plus, FileQuestion, CheckCircle2, Clock, MapPin } from 'lucide-react';

const HomePage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const { API_URL } = useAuth();

  useEffect(() => {
    const fetchMyComplaints = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/complaints/my`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setComplaints(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching complaints', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyComplaints();
  }, [API_URL]);

  // Count stats helper
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    progress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="badge badge-pending">Pending</span>;
      case 'In Progress':
        return <span className="badge badge-progress">In Progress</span>;
      case 'Resolved':
        return <span className="badge badge-resolved">Resolved</span>;
      case 'Rejected':
        return <span className="badge badge-rejected">Rejected</span>;
      default:
        return <span className="badge badge-pending">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
        Loading dashboard data...
      </div>
    );
  }

  return (
    <div className="container fade-in">
      
      {/* Title & Actions bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '3rem',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Citizen Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Lodge issues and monitor resolution timelines</p>
        </div>
        <Link to="/lodge-complaint" className="btn-primary">
          Lodge Complaint <Plus size={18} />
        </Link>
      </div>

      {/* Stats Counter Panels */}
      <div className="grid-3" style={{ marginBottom: '4rem' }}>
        
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid var(--accent-violet)' }}>
          <div style={{
            background: 'rgba(127, 0, 255, 0.1)',
            color: 'var(--accent-violet)',
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileText size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.total}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Lodge Files</p>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid #f9d423' }}>
          <div style={{
            background: 'rgba(249, 212, 35, 0.1)',
            color: '#f9d423',
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Clock size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.pending + stats.progress}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Active / Pending</p>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid #00ff87' }}>
          <div style={{
            background: 'rgba(0, 255, 135, 0.1)',
            color: '#00ff87',
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.resolved}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Resolved Complaints</p>
          </div>
        </div>

      </div>

      {/* Complaints Grid list */}
      <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '2rem' }}>Lodged Submissions</h2>
      
      {complaints.length === 0 ? (
        <div className="glass-card" style={{
          textAlign: 'center',
          padding: '4rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          <FileQuestion size={48} style={{ color: 'var(--text-muted)', opacity: 0.6 }} />
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No complaints filed yet</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '400px' }}>
              If you have any utility faults, service disruptions, or general concerns, click "Lodge Complaint" to file a ticket.
            </p>
          </div>
          <Link to="/lodge-complaint" className="btn-secondary">
            File Your First Complaint
          </Link>
        </div>
      ) : (
        <div className="grid-2">
          {complaints.map((comp) => (
            <div key={comp._id} className="glass-card" style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1.5rem'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, flex: 1, paddingRight: '1rem' }}>
                    {comp.name}
                  </h3>
                  {getStatusBadge(comp.status)}
                </div>

                <p style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.92rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  marginBottom: '1rem'
                }}>
                  {comp.comment}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)'
                }}>
                  <MapPin size={14} style={{ color: 'var(--accent-primary)' }} />
                  <span>{comp.city}, {comp.state} ({comp.pincode})</span>
                </div>

                {/* Assigned Officer Status Badge */}
                {comp.assignedAgent ? (
                  <div style={{
                    marginTop: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.82rem',
                    color: 'var(--accent-primary)',
                    background: 'rgba(0, 242, 254, 0.04)',
                    border: '1px solid rgba(0, 242, 254, 0.1)',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '8px',
                    width: 'fit-content'
                  }}>
                    <span style={{ fontWeight: 800 }}>Assigned Officer:</span> {comp.assignedAgent.name}
                  </div>
                ) : (
                  <div style={{
                    marginTop: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.82rem',
                    color: 'var(--text-muted)',
                    background: 'rgba(255, 255, 255, 0.01)',
                    border: '1px dashed var(--border-glass)',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '8px',
                    width: 'fit-content'
                  }}>
                    <span style={{ fontWeight: 600 }}>Assigned Officer:</span> Awaiting Assignment
                  </div>
                )}
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-glass)'
              }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Filed: {new Date(comp.createdAt).toLocaleDateString()}
                </span>
                <Link to={`/complaint/${comp._id}`} style={{
                  color: 'var(--accent-primary)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textDecoration: 'none'
                }}>
                  Track Resolution &rarr;
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default HomePage;
