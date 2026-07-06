import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import ChatWindow from '../common/ChatWindow';
import { ArrowLeft, Clock, Shield, CheckCircle2, User, Phone, MapPin } from 'lucide-react';

const Status = () => {
  const { id } = useParams();
  const { API_URL } = useAuth();
  
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchComplaintDetail = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/complaints/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setComplaint(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching complaint details', error);
        setErrorMsg('Could not fetch complaint details. You might not have access.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaintDetail();
  }, [id, API_URL]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
        Loading complaint tracking data...
      </div>
    );
  }

  if (errorMsg || !complaint) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <h2 style={{ color: '#ff4e50', marginBottom: '1.5rem' }}>Error</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{errorMsg || 'Complaint not found.'}</p>
        <Link to="/dashboard" className="btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  // Progress Node status map helper
  const getTimelineStatus = () => {
    const current = complaint.status;
    return {
      isPending: true,
      isInProgress: current === 'In Progress' || current === 'Resolved' || current === 'Rejected',
      isCompleted: current === 'Resolved' || current === 'Rejected',
      isRejected: current === 'Rejected'
    };
  };

  const timeline = getTimelineStatus();

  return (
    <div className="container fade-in">
      
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        {/* Interactive Tracking Timeline */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Resolution Status Tracker
          </h3>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            maxWidth: '800px',
            margin: '0 auto 1.5rem auto',
            padding: '0 1rem'
          }}>
            {/* Connecting Bar */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '5%',
              right: '5%',
              height: '4px',
              background: 'rgba(255, 255, 255, 0.08)',
              zIndex: 1
            }} />
            
            {/* Active connection bars */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '5%',
              width: timeline.isCompleted ? '90%' : timeline.isInProgress ? '45%' : '0%',
              height: '4px',
              background: timeline.isRejected ? 'var(--gradient-warning)' : 'var(--gradient-radiant)',
              zIndex: 2,
              transition: 'all 0.5s ease'
            }} />

            {/* Node 1: Pending */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, position: 'relative' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: '#080c14',
                border: '3px solid #f9d423',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f9d423',
                boxShadow: '0 0 10px rgba(249, 212, 35, 0.4)'
              }}>
                <Clock size={20} />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '0.75rem', color: '#f9d423' }}>Submitted</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ticket Received</span>
            </div>

            {/* Node 2: In Progress */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, position: 'relative' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: '#080c14',
                border: `3px solid ${timeline.isInProgress ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.1)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: timeline.isInProgress ? 'var(--accent-primary)' : 'var(--text-muted)',
                boxShadow: timeline.isInProgress ? 'var(--shadow-neon-blue)' : 'none',
                transition: 'all 0.5s ease'
              }}>
                <User size={20} />
              </div>
              <span style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                marginTop: '0.75rem',
                color: timeline.isInProgress ? 'var(--accent-primary)' : 'var(--text-muted)',
                transition: 'all 0.5s ease'
              }}>Assigned</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Under Investigation</span>
            </div>

            {/* Node 3: Resolved / Rejected */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, position: 'relative' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: '#080c14',
                border: `3px solid ${timeline.isCompleted ? (timeline.isRejected ? '#ff4e50' : '#00ff87') : 'rgba(255, 255, 255, 0.1)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: timeline.isCompleted ? (timeline.isRejected ? '#ff4e50' : '#00ff87') : 'var(--text-muted)',
                boxShadow: timeline.isCompleted ? (timeline.isRejected ? '0 0 10px rgba(255,78,80,0.4)' : '0 0 10px rgba(0,255,135,0.4)') : 'none',
                transition: 'all 0.5s ease'
              }}>
                {timeline.isRejected ? <Shield size={20} /> : <CheckCircle2 size={20} />}
              </div>
              <span style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                marginTop: '0.75rem',
                color: timeline.isCompleted ? (timeline.isRejected ? '#ff4e50' : '#00ff87') : 'var(--text-muted)',
                transition: 'all 0.5s ease'
              }}>
                {timeline.isRejected ? 'Rejected' : 'Resolved'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Final Status</span>
            </div>

          </div>
        </div>

        {/* Details & Live Chat Split Layout */}
        <div className="grid-2">
          
          {/* Complaint Details Card */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                background: 'rgba(0, 242, 254, 0.1)',
                color: 'var(--accent-primary)',
                padding: '0.25rem 0.75rem',
                borderRadius: '50px',
                textTransform: 'uppercase'
              }}>
                Complaint ID: {complaint._id.substring(18)}
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.75rem', marginBottom: '0.5rem' }}>
                {complaint.name}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Filed on: {new Date(complaint.createdAt).toLocaleString()}
              </p>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-glass)',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div>
                <h5 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem' }}>Description Details</h5>
                <p style={{ fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>{complaint.comment}</p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: '0.9rem', color: 'var(--text-muted)', paddingTop: '0.75rem', borderTop: '1px solid var(--border-glass)' }}>
                <MapPin size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '0.1rem' }} />
                <span>{complaint.address}, {complaint.city}, {complaint.state} - {complaint.pincode}</span>
              </div>
            </div>

            {/* Assigned Agent Contact Information */}
            <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border-glass)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Assigned Officer Contact</h4>
              {complaint.assignment ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.2rem',
                  background: 'rgba(0, 242, 254, 0.03)',
                  border: '1px solid rgba(0, 242, 254, 0.1)',
                  borderRadius: '12px',
                  padding: '1rem'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--gradient-radiant)',
                    color: 'var(--text-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800'
                  }}>
                    {complaint.assignment.agentName.charAt(0)}
                  </div>
                  <div>
                    <h5 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{complaint.assignment.agentName}</h5>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      <Phone size={12} />
                      <span>{complaint.assignment.agentPhone}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: '1.25rem',
                  border: '1px dashed var(--border-glass)',
                  borderRadius: '12px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '0.9rem'
                }}>
                  Awaiting administrator assignment to a field officer.
                </div>
              )}
            </div>

          </div>

          {/* Chat Window Room */}
          <div>
            <ChatWindow complaintId={complaint._id} />
          </div>

        </div>

      </div>

    </div>
  );
};

export default Status;
