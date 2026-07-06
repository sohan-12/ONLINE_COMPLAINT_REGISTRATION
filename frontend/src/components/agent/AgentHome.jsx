import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import ChatWindow from '../common/ChatWindow';
import { CheckCircle2, Clock, Shield, Phone, MapPin, User, MessageCircle } from 'lucide-react';

const AgentHome = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const { API_URL } = useAuth();

  const fetchAssigned = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/complaints/assigned`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setComplaints(res.data.data);
        // Automatically select the first complaint if none is selected
        if (res.data.data.length > 0 && !selectedComplaint) {
          setSelectedComplaint(res.data.data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching assigned complaints', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssigned();
  }, [API_URL]);

  const handleStatusChange = async (newStatus) => {
    if (!selectedComplaint) return;
    setStatusUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `${API_URL}/complaints/${selectedComplaint._id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        // Update local complaint list
        setComplaints((prev) =>
          prev.map((c) => (c._id === selectedComplaint._id ? { ...c, status: newStatus } : c))
        );
        setSelectedComplaint((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Error updating status', error);
    } finally {
      setStatusUpdating(false);
    }
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
        Loading Officer Console...
      </div>
    );
  }

  return (
    <div className="container fade-in" style={{ maxWidth: '1200px' }}>
      
      {/* Header bar */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Officer Portal</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your assigned cases and communicate with citizens</p>
      </div>

      {complaints.length === 0 ? (
        <div className="glass-card" style={{
          textAlign: 'center',
          padding: '5rem',
          color: 'var(--text-muted)'
        }}>
          <CheckCircle2 size={48} style={{ color: '#00ff87', opacity: 0.8, marginBottom: '1.5rem' }} />
          <h3>All caught up!</h3>
          <p style={{ marginTop: '0.5rem' }}>You currently do not have any complaints assigned to you.</p>
        </div>
      ) : (
        <div className="grid-3" style={{ gridTemplateColumns: '1.2fr 1.8fr', gap: '2rem' }}>
          
          {/* Left Panel: Assigned Complaints List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '750px', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Assigned Worklist ({complaints.length})
            </h3>
            {complaints.map((comp) => {
              const isSelected = selectedComplaint?._id === comp._id;
              return (
                <div
                  key={comp._id}
                  onClick={() => setSelectedComplaint(comp)}
                  className="glass-card"
                  style={{
                    padding: '1.25rem',
                    cursor: 'pointer',
                    borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-glass)',
                    background: isSelected ? 'rgba(0, 242, 254, 0.04)' : 'var(--bg-glass)',
                    transition: 'var(--transition)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, flex: 1, paddingRight: '0.5rem', color: isSelected ? 'var(--accent-primary)' : 'var(--text-main)' }}>
                      {comp.name}
                    </h4>
                    {getStatusBadge(comp.status)}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {comp.comment}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>City: {comp.city}</span>
                    <span>{new Date(comp.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Panel: Selected Case Detail & Communication */}
          {selectedComplaint && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Case Details Card */}
              <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{selectedComplaint.name}</h2>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {selectedComplaint._id}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    
                    {/* Status change actions */}
                    <select
                      className="select-field"
                      value={selectedComplaint.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      disabled={statusUpdating}
                      style={{ padding: '0.5rem 1rem', width: 'auto', fontSize: '0.85rem' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    
                  </div>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div>
                    <h5 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem' }}>Description</h5>
                    <p style={{ fontSize: '0.92rem', whiteSpace: 'pre-wrap' }}>{selectedComplaint.comment}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', paddingTop: '0.75rem', borderTop: '1px solid var(--border-glass)' }}>
                    <MapPin size={14} style={{ color: 'var(--accent-primary)' }} />
                    <span>{selectedComplaint.address}, {selectedComplaint.city}, {selectedComplaint.state} - {selectedComplaint.pincode}</span>
                  </div>
                </div>

                {/* Complainant profile info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(0, 242, 254, 0.1)',
                    color: 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <User size={18} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Registered Complainant</span>
                    <h5 style={{ fontWeight: 700, fontSize: '0.9rem' }}>{selectedComplaint.name}</h5>
                  </div>
                </div>

              </div>

              {/* Chat Support Window */}
              <ChatWindow complaintId={selectedComplaint._id} />

            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default AgentHome;
