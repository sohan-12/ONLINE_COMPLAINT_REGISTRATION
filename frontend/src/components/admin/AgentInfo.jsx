import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, UserCheck, Shield, Award, Phone, Mail, UserMinus } from 'lucide-react';

const AgentInfo = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const { API_URL } = useAuth();

  const fetchAgents = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/complaints/admin/agents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setAgents(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching agents list', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [API_URL]);

  const handleApproveAgent = async (agentId) => {
    setApprovingId(agentId);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `${API_URL}/complaints/admin/agents/${agentId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        // Refresh local list
        setAgents(prev =>
          prev.map(agent => (agent._id === agentId ? { ...agent, is_approved: true } : agent))
        );
      }
    } catch (error) {
      console.error('Error approving agent account', error);
    } finally {
      setApprovingId(null);
    }
  };

  const handleRejectAgent = async (agentId) => {
    if (!window.confirm('Are you sure you want to reject and delete this agent application?')) return;
    setRejectingId(agentId);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(
        `${API_URL}/complaints/admin/agents/${agentId}/reject`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        // Remove from list
        setAgents(prev => prev.filter(agent => agent._id !== agentId));
      }
    } catch (error) {
      console.error('Error rejecting agent account', error);
    } finally {
      setRejectingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
        Loading agent database...
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
        <h1 style={{ fontSize: '2.3rem', fontWeight: 800 }}>Manage Field Agents</h1>
        <p style={{ color: 'var(--text-muted)' }}>Approve pending agent applications and inspect officer profiles</p>
      </div>

      {agents.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          No agents found in the system database.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {agents.map((agent) => (
            <div key={agent._id} className="glass-card" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
              padding: '1.5rem 2rem'
            }}>
              
              {/* Agent Profile info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: agent.is_approved ? 'var(--gradient-radiant)' : 'rgba(255, 255, 255, 0.05)',
                  color: agent.is_approved ? 'var(--text-dark)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  boxShadow: agent.is_approved ? 'var(--shadow-neon-blue)' : 'none'
                }}>
                  {agent.name.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {agent.name}
                    {agent.is_approved ? (
                      <span className="badge badge-resolved" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>Active</span>
                    ) : (
                      <span className="badge badge-pending" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>Pending Approval</span>
                    )}
                  </h3>
                  
                  <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <Mail size={12} />
                      <span>{agent.email}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <Phone size={12} />
                      <span>{agent.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                {!agent.is_approved ? (
                  <>
                    <button
                      onClick={() => handleApproveAgent(agent._id)}
                      className="btn-primary"
                      style={{ padding: '0.55rem 1.25rem', fontSize: '0.88rem' }}
                      disabled={approvingId === agent._id || rejectingId === agent._id}
                    >
                      <UserCheck size={16} /> {approvingId === agent._id ? 'Approving...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleRejectAgent(agent._id)}
                      className="btn-secondary"
                      style={{
                        padding: '0.55rem 1.25rem',
                        fontSize: '0.88rem',
                        borderColor: '#ff4e50',
                        color: '#ff4e50',
                        background: 'rgba(255, 78, 80, 0.05)'
                      }}
                      disabled={approvingId === agent._id || rejectingId === agent._id}
                    >
                      <UserMinus size={16} /> {rejectingId === agent._id ? 'Rejecting...' : 'Reject'}
                    </button>
                  </>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#00ff87', fontWeight: 700, fontSize: '0.9rem' }}>
                    <Award size={18} /> Verified Official
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default AgentInfo;
