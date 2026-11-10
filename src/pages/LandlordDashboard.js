import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaCheckCircle, FaHome, FaClipboardList, FaCommentDots, FaEdit, FaTrash, FaTimes, FaBan } from 'react-icons/fa';
import PropertyCard from '../components/PropertyCard'; 

const LandlordDashboard = () => {
  const { user } = useContext(AuthContext);
  const [properties, setProperties] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for Edit Modal
  const [editingProperty, setEditingProperty] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const fetchDashboardData = () => {
    if (!user) return;

    Promise.all([
      axios.get('https://stayfind-backend-etba.onrender.com/api/admin/properties'), 
      axios.get(`https://stayfind-backend-etba.onrender.com/api/bookings/landlord/${user.id}`) 
    ]).then(([propRes, bookRes]) => {
      const myProperties = propRes.data.filter(p => p.landlord_id === user.id);
      setProperties(myProperties);
      setPendingBookings(bookRes.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleAcceptBooking = (bookingId) => {
    if (window.confirm("Accept this booking? This will generate a blockchain hash.")) {
      axios.post(`https://stayfind-backend-etba.onrender.com/api/bookings/accept/${bookingId}`)
        .then(res => {
          alert('✅ ' + res.data.message);
          fetchDashboardData(); 
        })
        .catch(err => alert('❌ Failed to accept booking.'));
    }
  };

  // NEW: Reject Booking Function
  const handleRejectBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to decline this booking?")) {
      axios.post(`https://stayfind-backend-etba.onrender.com/api/bookings/reject/${bookingId}`)
        .then(res => {
          alert('✅ ' + res.data.message);
          fetchDashboardData(); 
        })
        .catch(err => alert('❌ Failed to reject booking.'));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      axios.delete(`https://stayfind-backend-etba.onrender.com/api/landlord/properties/${id}`)
        .then(() => {
          alert("Property deleted.");
          fetchDashboardData();
        })
        .catch(err => alert("Failed to delete. It may have active bookings."));
    }
  };

  const handleEditClick = (prop) => {
    setEditingProperty(prop.id);
    setEditFormData(prop);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios.put(`https://stayfind-backend-etba.onrender.com/api/landlord/properties/${editingProperty}`, editFormData)
      .then(() => {
        alert("Property updated successfully");
        setEditingProperty(null); 
        fetchDashboardData();
      })
      .catch(err => alert("Error updating property"));
  };

  const totalProps = properties.length;
  const availableProps = properties.filter(p => p.status === 'Available').length;
  const occupiedProps = properties.filter(p => p.status === 'Occupied').length;

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading Dashboard...</h2>;

  return (
    <div>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0 }}>Landlord Dashboard</h1>
          <p style={{ margin: '5px 0 0 0' }}>Verification Status: <span className="badge badge-green">Approved (Retained)</span></p>
        </div>
        <Link to="/list-property">
          <button className="btn btn-primary"><FaHome style={{ marginRight: '8px' }}/> + List a New Property</button>
        </Link>
      </div>
      
      {/* LIVE STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <div className="stat-card"><h2>{totalProps}</h2><p>Total Properties</p></div>
        <div className="stat-card"><h2>{availableProps}</h2><p>Available</p></div>
        <div className="stat-card"><h2>{pendingBookings.filter(b => b.status === 'Pending').length}</h2><p>Pending Requests</p></div>
        
        {/* HIGHLIGHTED OCCUPIED CARD */}
        <div className="stat-card" style={{ borderLeft: '4px solid #ef4444', background: '#fef2f2' }}>
          <h2 style={{ color: '#ef4444' }}>{occupiedProps}</h2>
          <p style={{ color: '#ef4444', fontWeight: '600' }}>Occupied</p>
        </div>
      </div>

      {/* 1. INCOMING REQUESTS (Full Width Top) */}
      <div className="card" style={{ borderTop: '4px solid var(--accent)', marginBottom: '40px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaClipboardList color="var(--accent)" /> Incoming Requests
        </h2>
        
        {pendingBookings.length === 0 ? (
          <p style={{ marginTop: '20px', color: 'var(--text-muted)' }}>No pending requests for your properties.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
            {pendingBookings.map(b => (
              <div key={b.id} style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                
                {/* Top Row: Name and Dynamic Status Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <strong>{b.student_name}</strong>
                  <span className={`badge ${b.status === 'Paid' ? 'badge-green' : 'badge-yellow'}`}>
                    {b.status.toUpperCase()}
                  </span>
                </div>

                <p style={{ fontSize: '0.85rem', margin: '0 0 5px 0' }}><strong>Property:</strong> {b.title}</p>
                <p style={{ fontSize: '0.85rem', margin: '0 0 5px 0' }}><strong>Move-in:</strong> {new Date(b.move_in_date).toLocaleDateString()} ({b.duration})</p>
                
                {/* Payment Receipt Info (Only shows if Paid) */}
                {b.status === 'Paid' && (
                  <div style={{ background: '#dcfce7', padding: '10px', borderRadius: '5px', margin: '10px 0', border: '1px solid #bbf7d0' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#166534', fontWeight: 'bold' }}>✅ Payment Received</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: '#166534' }}>
                      <strong>Method:</strong> {b.payment_method}<br/>
                      <strong>Amount:</strong> M{b.payment_amount}<br/>
                      <strong>Ref:</strong> <span style={{ fontFamily: 'monospace' }}>{b.payment_reference}</span>
                    </p>
                  </div>
                )}
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  {/* ACCEPT BUTTON: Only shows if Pending */}
                  {b.status === 'Pending' && (
                    <button onClick={() => handleAcceptBooking(b.id)} className="btn btn-accent" style={{ flex: 1, padding: '6px 12px', fontSize: '0.85rem' }}>
                      <FaCheckCircle /> Accept
                    </button>
                  )}

                  {/* NEW: REJECT BUTTON: Only shows if Pending */}
                  {b.status === 'Pending' && (
                    <button onClick={() => handleRejectBooking(b.id)} className="btn btn-danger" style={{ flex: 1, padding: '6px 12px', fontSize: '0.85rem' }}>
                      <FaBan /> Reject
                    </button>
                  )}
                  
                  {/* MESSAGE BUTTON: Always visible */}
                  <Link to={`/messages/${b.student_id}`} style={{ flex: 1 }}>
                    <button className="btn btn-outline" style={{ width: '100%', padding: '6px 12px', fontSize: '0.85rem' }}>
                      <FaCommentDots /> Message
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. MY PROPERTIES (3-Column Grid Below Requests) */}
      <div>
        <h2 style={{ marginBottom: '20px' }}>My Properties</h2>
        {properties.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-muted)' }}>You have not listed any properties yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px' }}>
            {properties.map(prop => (
              <div key={prop.id} style={{ 
                position: 'relative',
                // HIGHLIGHTED: Red border and pink background for occupied
                border: prop.status === 'Occupied' ? '2px solid #ef4444' : '2px solid transparent',
                borderRadius: '12px',
                padding: '5px',
                background: prop.status === 'Occupied' ? '#fef2f2' : 'transparent'
              }}>
                
                {/* OCCUPIED BANNER */}
                {prop.status === 'Occupied' && (
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#ef4444',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    zIndex: 10,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}>
                    🔴 OCCUPIED
                  </div>
                )}

                {/* Property Image Card */}
                <PropertyCard property={prop} />
                
                {/* CRUD Actions Underneath Card */}
                <div style={{ 
                  display: 'flex', 
                  gap: '10px', 
                  marginTop: '10px', 
                  background: 'white', 
                  padding: '10px', 
                  borderRadius: '8px',
                  border: '1px solid var(--border)'
                }}>
                  <button onClick={() => handleEditClick(prop)} className="btn btn-outline" style={{ flex: 1, padding: '8px', fontSize: '0.85rem', display: 'flex', justifyContent: 'center', gap: '5px' }}>
                    <FaEdit /> Edit
                  </button>
                  <button onClick={() => handleDelete(prop.id)} className="btn btn-danger" style={{ flex: 1, padding: '8px', fontSize: '0.85rem', display: 'flex', justifyContent: 'center', gap: '5px' }}>
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EDIT PROPERTY MODAL */}
      {editingProperty && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '500px', position: 'relative' }}>
            <button onClick={() => setEditingProperty(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>
              <FaTimes />
            </button>
            <h2 style={{ marginBottom: '20px' }}>Edit Property</h2>
            
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Title</label>
                <input type="text" value={editFormData.title} onChange={(e) => setEditFormData({...editFormData, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input type="text" value={editFormData.location} onChange={(e) => setEditFormData({...editFormData, location: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Price (M)</label>
                <input type="number" value={editFormData.price} onChange={(e) => setEditFormData({...editFormData, price: e.target.value})} required />
              </div>
              
              {/* ADDED: Image URL field so you can fix broken images */}
              <div className="form-group">
                <label>Image URL</label>
                <input type="url" value={editFormData.image_url} onChange={(e) => setEditFormData({...editFormData, image_url: e.target.value})} required />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select value={editFormData.status} onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}>
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordDashboard;