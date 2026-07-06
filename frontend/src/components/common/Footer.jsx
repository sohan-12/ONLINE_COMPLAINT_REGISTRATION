import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '2rem 1rem',
      marginTop: 'auto',
      borderTop: '1px solid var(--border-glass)',
      background: 'rgba(8, 12, 20, 0.9)',
      color: 'var(--text-muted)',
      fontSize: '0.9rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <p>&copy; {new Date().getFullYear()} <span style={{
          background: 'var(--gradient-radiant)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: '700'
        }}>Online Complaint Portal</span>. All rights reserved.</p>
        <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Secure Citizen Resolution System &bull; MERN Stack</p>
      </div>
    </footer>
  );
};

export default Footer;
