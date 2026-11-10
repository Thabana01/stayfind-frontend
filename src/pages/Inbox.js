import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaUserCircle, FaCommentDots, FaArrowRight } from 'react-icons/fa';

const Inbox = () => {
  const { user } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Log which user is logged in
    console.log("Frontend is fetching inbox for User ID:", user.id);

    axios.get(`https://stayfind-backend-etba.onrender.com/api/inbox/${user.id}`)
      .then(res => {
        // Log exactly what the backend sent back
        console.log("Data received from backend:", res.data);
        setContacts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching inbox:", err);
        setLoading(false);
      });
  }, [user]);

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading Inbox...</h2>;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <FaCommentDots size={28} color="var(--primary)" />
        <h2 style={{ margin: 0 }}>Your Messages</h2>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {contacts.length === 0 ? (
          <div style={{ padding: '50px 20px', textAlign: 'center' }}>
            <h3 style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>No messages yet</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              {user && user.role === 'student' 
                ? "Start a conversation by contacting a landlord from a property page." 
                : "Messages from students will appear here."}
            </p>
          </div>
        ) : (
          contacts.map(contact => (
            <Link to={`/messages/${contact.id}`} key={contact.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: '15px', padding: '20px', 
                borderBottom: '1px solid var(--border)', transition: 'background 0.2s'
              }} 
              onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                <FaUserCircle size={50} color="var(--primary)" />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)' }}>{contact.full_name}</h4>
                  <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                    {contact.role}
                  </p>
                </div>
                <div style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
                  Open Chat <FaArrowRight />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Inbox;