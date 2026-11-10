import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaArrowLeft, FaPaperPlane, FaUserCircle, FaFlag } from 'react-icons/fa';
import ReportUserModal from '../components/ReportUserModal';

const Messages = () => {
  const { user } = useContext(AuthContext);
  const { landlordId } = useParams(); // This is the ID of the OTHER person
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🆕 Report modal state
  const [showReport, setShowReport] = useState(false);
  
  const chatContainerRef = useRef(null);

  // 1. Fetch the other user's name
  useEffect(() => {
    if (!landlordId) return;
    axios.get(`https://stayfind-backend-etba.onrender.com/api/users/${landlordId}`)
      .then(res => {
        setOtherUser(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [landlordId]);

  // 2. Fetch messages securely
  const fetchMessages = () => {
    if (!user || !landlordId) return;
    axios.get(`https://stayfind-backend-etba.onrender.com/api/messages/${user.id}/${landlordId}`)
      .then(res => {
        setMessages(res.data);
        // Auto-scroll to the bottom of the chat box only
        setTimeout(() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          }
        }, 100);
      });
  };

   useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, landlordId]);

  // 3. Send a message
  const handleSend = (e) => {
    e.preventDefault();
    if(!newMessage.trim()) return;

    axios.post('https://stayfind-backend-etba.onrender.com/api/messages', {
      sender_id: user.id,
      receiver_id: landlordId,
      property_id: 1,
      content: newMessage
    }).then(() => {
      setNewMessage('');
      fetchMessages();
    });
  };

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading Chat...</h2>;
  if (!user) return null;

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column' }}>
      
      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        
        {/* CHAT HEADER */}
        <div style={{ padding: '15px 20px', borderBottom: '1px solid var(--border)', background: '#f8fafc', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link to="/inbox" style={{ color: 'var(--text-muted)' }}>
            <FaArrowLeft size={20} />
          </Link>
          <FaUserCircle size={40} color="var(--primary)" />
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
              {otherUser ? otherUser.full_name : 'Loading...'}
            </h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
              {otherUser ? otherUser.role : ''}
            </p>
          </div>

          {/* 🆕 Report button */}
          {otherUser && user && otherUser.id !== user.id && (
            <button
              onClick={() => setShowReport(true)}
              title="Report this user to admin"
              style={{
                background: 'transparent',
                border: '1px solid #fecaca',
                color: '#b42318',
                padding: '6px 12px',
                borderRadius: 8,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.85rem',
              }}
            >
              <FaFlag /> Report
            </button>
          )}
        </div>

        {/* CHAT HISTORY */}
        <div ref={chatContainerRef} style={{ flex: 1, overflowY: 'auto', padding: '20px', background: '#f8fafc' }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '30px', color: 'var(--text-muted)' }}>
              <p>No messages yet. Say hello!</p>
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} style={{
                display: 'flex',
                justifyContent: msg.sender_id === user.id ? 'flex-end' : 'flex-start',
                marginBottom: '15px'
              }}>
                <div style={{
                  background: msg.sender_id === user.id ? 'var(--primary)' : 'white',
                  color: msg.sender_id === user.id ? 'white' : 'var(--text-main)',
                  padding: '12px 18px',
                  borderRadius: msg.sender_id === user.id ? '20px 20px 0 20px' : '20px 20px 20px 0',
                  maxWidth: '70%',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  wordBreak: 'break-word',
                  fontSize: '0.95rem'
                }}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
        </div>

        {/* MESSAGE INPUT */}
        <div style={{ padding: '20px', borderTop: '1px solid var(--border)', background: 'white' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              value={newMessage} 
              onChange={(e) => setNewMessage(e.target.value)} 
              placeholder={`Message ${otherUser ? otherUser.full_name : ''}...`} 
              style={{ flex: 1, padding: '15px 20px', borderRadius: '30px', border: '1px solid #ccc', outline: 'none', fontSize: '1rem' }}
            />
            <button type="submit" className="btn btn-primary" style={{ borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaPaperPlane size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* 🆕 Report User Modal */}
      <ReportUserModal
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        reporterId={user ? user.id : null}
        reportedUser={otherUser}
        onSubmitted={() => alert('Report submitted. Admin will review it shortly.')}
      />
    </div>
  );
};

export default Messages;