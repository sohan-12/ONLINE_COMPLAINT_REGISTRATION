import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import Components
import Home from './components/common/Home';
import Login from './components/common/Login';
import Signup from './components/common/Signup';
import Footer from './components/common/Footer';

// Citizens
import HomePage from './components/user/HomePage';
import Complaint from './components/user/Complaint';
import Status from './components/user/Status';

// Agents
import AgentHome from './components/agent/AgentHome';

// Admins
import AdminHome from './components/admin/AdminHome';
import AgentInfo from './components/admin/AgentInfo';
import UserInfo from './components/admin/UserInfo';

// Import Icons
import { LogOut, Home as HomeIcon, FileText, UserCheck, Shield, Users } from 'lucide-react';

// Route protection guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
        Verifying security clearance...
      </div>
    );
  }

  if (!user) {
    // Redirect to login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect role mismatch
    if (user.role === 'Admin') return <Navigate to="/admin" replace />;
    if (user.role === 'Agent') return <Navigate to="/agent" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Navbar Header Component
const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="nav-container">
      <Link to="/" className="nav-logo">
        🛡️ COMPLAINT PORTAL
      </Link>
      
      <ul className="nav-links">
        <li>
          <Link to="/" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <HomeIcon size={16} /> Home
          </Link>
        </li>
        <li>
          <Link to="/admin" className="nav-link" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(127, 0, 255, 0.1)',
            color: 'var(--accent-violet)',
            border: '1px solid rgba(127, 0, 255, 0.2)',
            padding: '0.35rem 0.85rem',
            borderRadius: '50px',
            fontSize: '0.85rem',
            fontWeight: '700',
            transition: 'var(--transition)'
          }}>
            <Shield size={14} /> Admin Portal
          </Link>
        </li>
        
        {user && (
          <>
            {user.role === 'Ordinary' && (
              <li>
                <Link to="/dashboard" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FileText size={16} /> Dashboard
                </Link>
              </li>
            )}
            {user.role === 'Agent' && (
              <li>
                <Link to="/agent" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <UserCheck size={16} /> Officer Console
                </Link>
              </li>
            )}
            {user.role === 'Admin' && (
              <li>
                <Link to="/admin" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Shield size={16} /> Admin panel
                </Link>
              </li>
            )}
          </>
        )}

        {user ? (
          <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Hello, <strong style={{ color: 'var(--accent-primary)' }}>{user.name}</strong>
            </span>
            <button
              onClick={logout}
              className="btn-secondary"
              style={{
                padding: '0.4rem 0.85rem',
                fontSize: '0.85rem',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <LogOut size={14} /> Logout
            </button>
          </li>
        ) : (
          <li style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/login" className="btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem', borderRadius: '8px' }}>
              Sign In
            </Link>
            <Link to="/signup" className="btn-primary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem', borderRadius: '8px', boxShadow: 'none' }}>
              Register
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

const AppContent = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Citizen Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['Ordinary']}>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lodge-complaint"
            element={
              <ProtectedRoute allowedRoles={['Ordinary']}>
                <Complaint />
              </ProtectedRoute>
            }
          />
          <Route
            path="/complaint/:id"
            element={
              <ProtectedRoute allowedRoles={['Ordinary']}>
                <Status />
              </ProtectedRoute>
            }
          />

          {/* Agent Routes */}
          <Route
            path="/agent"
            element={
              <ProtectedRoute allowedRoles={['Agent']}>
                <AgentHome />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/agents"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AgentInfo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <UserInfo />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
