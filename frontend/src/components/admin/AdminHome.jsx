import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Accordion from './Accordion';
import { Shield, Users, Radio, FileText, CheckCircle2, Clock, Award, MapPin } from 'lucide-react';

const AdminHome = () => {
  const [complaints, setComplaints] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState(null);
  
  // Selected agent IDs map for each complaint (e.g. { complaintId: agentUserId })
  const [selectedAgentForComp, setSelectedAgentForComp] = useState({});
  const { API_URL } = useAuth();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const complaintsRes = await axios.get(`${API_URL}/complaints`, { headers });
      const agentsRes = await axios.get(`${API_URL}/admin/agents`, { headers });

      if (complaintsRes.data.success) {
        setComplaints(complaintsRes.data.data);
      }
      if (agentsRes.data.success) {
        // Keep only approved agents for assignment dropdowns
        setAgents(agentsRes.data.data.filter(agent => agent.is_approved));
      }
    } catch (error) {
      console.error('Error fetching admin data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [API_URL]);

  const handleAssignAgent = async (complaintId) => {
    const agentUserId = selectedAgentForComp[complaintId];
    if (!agentUserId) return;

    setAssigningId(complaintId);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_URL}/complaints/${complaintId}/assign`,
        { agentUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        // Refresh data to reflect assignment status
        await fetchData();
      }
    } catch (error) {
      console.error('Error assigning agent', error);
    } finally {
      setAssigningId(null);
    }
  };

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `${API_URL}/complaints/${complaintId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        // Refresh data to reflect status changes
        await fetchData();
      }
    } catch (error) {
      console.error('Error updating status', error);
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

  // Stats helper
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    progress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
        Loading Admin Console...
      </div>
    );
  }

  return (
    <div className="container fade-in">
      
      {/* Title Hub & Side navigations */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '3rem',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Admin Console</h1>
          <p style={{ color: 'var(--text-muted)' }}>Monitor system activity, verify agents, and route tickets</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/admin/agents" className="btn-secondary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}>
            <Radio size={16} /> Manage Agents
          </Link>
          <Link to="/admin/users" className="btn-secondary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}>
            <Users size={16} /> Complainant Registry
          </Link>
        </div>
      </div>

      {/* Admin Stats Counter Panels */}
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
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>System Submissions</p>
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
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Active Cases</p>
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
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Closed Resolutions</p>
          </div>
        </div>

      </div>

      {/* Accordion List of all Complaints */}
      <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '2rem' }}>Complaints Database Queue</h2>
      
      {complaints.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          No complaints registered in the system database yet.
        </div>
      ) : (
        complaints.map((comp) => {
          const isPending = comp.status === 'Pending';
          const titleElement = (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingRight: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <span>{comp.name} ({comp.city})</span>
              {getStatusBadge(comp.status)}
            </div>
          );

          return (
            <Accordion key={comp._id} title={titleElement}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Details layout */}
                <div className="grid-2" style={{ gap: '2rem' }}>
                  
                  <div>
                    <h5 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>complainant details</h5>
                    <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>{comp.name}</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      Email: {comp.userId ? comp.userId.email : 'Deleted User'} | Phone: {comp.userId ? comp.userId.phone : 'N/A'}
                    </p>
                    
                    <h5 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '1.5rem', marginBottom: '0.5rem' }}>location address</h5>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                      <MapPin size={14} style={{ color: 'var(--accent-primary)' }} />
                      <span>{comp.address}, {comp.city}, {comp.state} - {comp.pincode}</span>
                    </div>
                  </div>

                  <div>
                    <h5 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>description comment</h5>
                    <p style={{ fontSize: '0.95rem', background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-glass)', whiteSpace: 'pre-wrap' }}>
                      {comp.comment}
                    </p>
                  </div>

                </div>

                {/* Assignment Controls */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '1.25rem',
                  borderTop: '1px solid var(--border-glass)',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  
                  {/* Left: Agent status */}
                  <div>
                    <h5 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>assignment status</h5>
                    {comp.assignedAgent ? (
                      <div style={{ fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Award size={16} style={{ color: 'var(--accent-primary)' }} />
                        <span>Assigned to: <strong>{comp.assignedAgent.name}</strong> ({comp.assignedAgent.phone})</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.92rem', color: '#ff4e50', fontWeight: '600' }}>Not Assigned</span>
                    )}
                  </div>

                  {/* Right: Assignment Dropdown Form */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    
                    {/* Status Update manually */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Change Status:</span>
                      <select
                        className="select-field"
                        value={comp.status}
                        onChange={(e) => handleStatusChange(comp._id, e.target.value)}
                        style={{ padding: '0.4rem 0.85rem', width: 'auto', fontSize: '0.85rem' }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    {/* Agent Assignment Selection */}
                    {isPending || !comp.assignedAgent ? (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <select
                          className="select-field"
                          value={selectedAgentForComp[comp._id] || ''}
                          onChange={(e) => setSelectedAgentForComp({
                            ...selectedAgentForComp,
                            [comp._id]: e.target.value
                          })}
                          style={{ padding: '0.4rem 0.85rem', width: '200px', fontSize: '0.85rem' }}
                        >
                          <option value="">Select Officer...</option>
                          {agents.map((agent) => (
                            <option key={agent._id} value={agent._id}>
                              {agent.name}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleAssignAgent(comp._id)}
                          className="btn-primary"
                          style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', borderRadius: '12px' }}
                          disabled={assigningId === comp._id || !selectedAgentForComp[comp._id]}
                        >
                          {assigningId === comp._id ? 'Routing...' : 'Assign'}
                        </button>
                      </div>
                    ) : null}

                  </div>

                </div>

              </div>
            </Accordion>
          );
        })
      )}

    </div>
  );
};

export default AdminHome;
