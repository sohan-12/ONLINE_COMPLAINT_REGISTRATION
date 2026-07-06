import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Radio, MessageSquare, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  // Route determining helper based on role
  const getDashboardRoute = () => {
    if (!user) return '/login';
    if (user.role === 'Admin') return '/admin';
    if (user.role === 'Agent') return '/agent';
    return '/dashboard'; // Ordinary User
  };

  return (
    <div className="fade-in" style={{ padding: '4rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Hero Section */}
      <section style={{ textAlign: 'center', marginBottom: '5rem', position: 'relative' }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 800,
          lineHeight: 1.2,
          marginBottom: '1.5rem',
          background: 'var(--gradient-radiant)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-1px'
        }}>
          Resolving Citizen Complaints <br />
          With Speed & Transparency
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: 'var(--text-muted)',
          maxWidth: '700px',
          margin: '0 auto 2.5rem auto'
        }}>
          Log issues, track resolutions in real-time, and chat directly with assigned officers to get fast, transparent service for your community.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          {user ? (
            <Link to={getDashboardRoute()} className="btn-primary">
              Go to Dashboard <ArrowRight size={18} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-primary">
                Login to Portal <ArrowRight size={18} />
              </Link>
              <Link to="/signup" className="btn-secondary">
                Register Account
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Roles Breakdown */}
      <section style={{ marginBottom: '5rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '3rem', fontWeight: 700 }}>
          Three-Way Collaboration Hub
        </h2>
        <div className="grid-3">
          
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              background: 'rgba(0, 242, 254, 0.1)',
              color: 'var(--accent-primary)',
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-neon-blue)'
            }}>
              <Users size={24} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Citizens (Ordinary)</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              File complaints with addresses, descriptions, and categories. Track resolution timelines and chat directly with assigned officers.
            </p>
          </div>

          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              background: 'rgba(127, 0, 255, 0.1)',
              color: 'var(--accent-violet)',
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-neon-violet)'
            }}>
              <Radio size={24} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Officers (Agents)</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Access a custom dashboard to manage assigned complaints, update progress statuses, and answer citizen inquiries live.
            </p>
          </div>

          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              background: 'rgba(255, 0, 127, 0.1)',
              color: 'var(--accent-magenta)',
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(255, 0, 127, 0.35)'
            }}>
              <Shield size={24} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Administrators</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Oversee the entire platform, verify and approve officer accounts, assign open complaints, and monitor resolution compliance.
            </p>
          </div>

        </div>
      </section>

      {/* Platform Features Section */}
      <section className="glass-card" style={{
        padding: '3rem',
        background: 'linear-gradient(135deg, rgba(8, 12, 20, 0.8) 0%, rgba(17, 24, 39, 0.8) 100%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Core Modules Built In</h2>
          <p style={{ color: 'var(--text-muted)' }}>Everything you need for a modern, secure complaint system</p>
        </div>

        <div className="grid-2" style={{ marginTop: '1rem' }}>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ color: 'var(--accent-primary)', flexShrink: 0 }}>
              <Shield size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Secure Sign-up & Verification</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                All user accounts are protected via bcrypt hashing, and officers must be explicitly verified by admins before logging in.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ color: 'var(--accent-primary)', flexShrink: 0 }}>
              <MessageSquare size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Real-time Chat Engine</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Powered by Socket.io, users and officers can communicate immediately inside a secure chat room for each complaint.
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
