import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Accordion = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div style={{
      border: '1px solid var(--border-glass)',
      borderRadius: '12px',
      background: 'rgba(255, 255, 255, 0.01)',
      marginBottom: '1rem',
      overflow: 'hidden',
      transition: 'var(--transition)'
    }}>
      
      {/* Title / Trigger header bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.5rem',
          cursor: 'pointer',
          background: isOpen ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
          borderBottom: isOpen ? '1px solid var(--border-glass)' : 'none',
          transition: 'var(--transition)'
        }}
      >
        <span style={{ fontWeight: 700, fontSize: '0.98rem' }}>{title}</span>
        {isOpen ? <ChevronUp size={18} style={{ color: 'var(--accent-primary)' }} /> : <ChevronDown size={18} />}
      </div>

      {/* Accordion Content Panel */}
      {isOpen && (
        <div style={{
          padding: '1.5rem',
          background: 'rgba(0, 0, 0, 0.2)',
          animation: 'fadeInUp 0.3s ease forwards'
        }}>
          {children}
        </div>
      )}

    </div>
  );
};

export default Accordion;
