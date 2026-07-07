import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Send, MessageSquare } from 'lucide-react';

const ChatWindow = ({ complaintId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);
  const { user, API_URL } = useAuth();

  // Load message logs & initialize socket
  useEffect(() => {
    // 1. Fetch historical messages
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/complaints/${complaintId}/messages`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setMessages(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching chat messages', error);
      }
    };

    fetchMessages();

    // 2. Setup socket connection
    socketRef.current = io('https://complaint-backend-qwim.onrender.com');
    
    // Join the specific room for this complaint
    socketRef.current.emit('join_room', complaintId);

    // Listen for incoming messages
    socketRef.current.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [complaintId, API_URL]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      // Post to DB (this also broadcasts via socket io on the backend)
      await axios.post(
        `${API_URL}/complaints/${complaintId}/messages`,
        { message: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  return (
    <div className="glass-card" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '450px',
      padding: '1.5rem',
      borderRadius: 'var(--radius)',
      background: 'rgba(10, 15, 26, 0.7)'
    }}>
      
      {/* Chat Title bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border-glass)',
        marginBottom: '1rem'
      }}>
        <div style={{
          background: 'rgba(0, 242, 254, 0.1)',
          color: 'var(--accent-primary)',
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <MessageSquare size={18} />
        </div>
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Resolution Support Chat</h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)' }}>Secure Room Channel</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        paddingRight: '0.5rem',
        marginBottom: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        {messages.length === 0 ? (
          <div style={{
            margin: 'auto',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
            opacity: 0.7
          }}>
            No chat logs found. Send a message to start communicating.
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.name === user?.name;
            return (
              <div
                key={msg._id}
                style={{
                  alignSelf: isOwn ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isOwn ? 'flex-end' : 'flex-start'
                }}
              >
                {/* Sender Name */}
                <span style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  marginBottom: '0.15rem',
                  paddingLeft: isOwn ? '0' : '0.5rem',
                  paddingRight: isOwn ? '0.5rem' : '0'
                }}>
                  {msg.name}
                </span>
                
                {/* Message Bubble */}
                <div style={{
                  background: isOwn ? 'var(--gradient-radiant)' : 'rgba(255, 255, 255, 0.05)',
                  color: isOwn ? 'var(--text-dark)' : 'var(--text-main)',
                  fontWeight: isOwn ? '600' : '500',
                  padding: '0.65rem 1rem',
                  borderRadius: isOwn ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                  fontSize: '0.92rem',
                  boxShadow: isOwn ? '0 2px 10px rgba(0, 242, 254, 0.15)' : 'none',
                  border: isOwn ? 'none' : '1px solid var(--border-glass)'
                }}>
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Message Input Box */}
      <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.75rem' }}>
        <input
          type="text"
          className="input-field"
          placeholder="Type your message here..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{ marginBottom: 0 }}
        />
        <button
          type="submit"
          className="btn-primary"
          style={{
            padding: '0 1.25rem',
            flexShrink: 0,
            borderRadius: '12px'
          }}
        >
          <Send size={18} />
        </button>
      </form>

    </div>
  );
};

export default ChatWindow;
