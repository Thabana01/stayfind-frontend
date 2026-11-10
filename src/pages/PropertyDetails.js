import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaTimes, FaCommentDots, FaCheckCircle } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext'; 

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Get the real logged-in user
  const { user } = useContext(AuthContext); 

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [myBookings, setMyBookings] = useState([]); // NEW: Store student's bookings

  // Form State - Pre-fill the name AND student_number from the logged-in user
  const [formData, setFormData] = useState({
    student_name: user ? user.name : '', 
    student_number: user ? user.student_number : '', 
    move_in_date: '',
    duration: '12 Months',
    message: ''
  });

  useEffect(() => {
    axios.get(`https://stayfind-backend-etba.onrender.com/api/properties/${id}`)
      .then(res => {
        setProperty(res.data);
        setLoading(false);
      })
      .catch(err => setLoading(false));
  }, [id]);

  // NEW: Fetch this student's existing bookings
  useEffect(() => {
    if (user && user.role === 'student') {
      axios.get(`https://stayfind-backend-etba.onrender.com/api/bookings/student/${user.id}`)
        .then(res => setMyBookings(res.data))
        .catch(err => console.error(err));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit the booking with the REAL user ID
  const submitBooking = (e) => {
    e.preventDefault();
    
    if (!user) {
      alert("Please login to book a property.");
      navigate('/login');
      return;
    }

    axios.post('https://stayfind-backend-etba.onrender.com/api/bookings/request', {
      property_id: property.id,
      student_id: user.id, 
      ...formData
    })
    .then(res => {
      alert('✅ Booking requested! Go to your Dashboard to track its status.');
      navigate('/student-dashboard');
    })
    .catch(err => {
      alert('❌ ' + (err.response?.data?.error || 'Could not request booking'));
    });
  };

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading property...</h2>;
  if (!property) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Property not found.</h2>;

  // NEW: Check if this student already has an active booking for this property
  const existingBooking = myBookings.find(b => 
    Number(b.property_id) === Number(property.id) && 
    ['Pending', 'Confirmed', 'Paid'].includes(b.status)
  );

  return (
    <div>
      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', marginTop: '30px' }}>
        
        {/* LEFT: Property Info */}
        <div>
          <img src={property.image_url} alt={property.title} style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '12px', marginBottom: '20px' }} />
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{property.title}</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>
            📍 {property.location} | {property.type} | {property.bedrooms} Bedroom(s)
          </p>
        </div>

        {/* RIGHT: Booking Card */}
        <div className="card" style={{ textAlign: 'center', height: 'fit-content' }}>
          <h3>Monthly Rent</h3>
          <p className="price" style={{ fontSize: '2rem' }}>M{property.price}</p>
          <p>
            <span className={`badge ${property.status === 'Available' ? 'badge-green' : 'badge-red'}`}>
              {property.status}
            </span>
          </p>
          <hr style={{ margin: '20px 0' }} />
          
          {/* ROLE-BASED BUTTON LOGIC */}
          
          {/* 1. If user is a STUDENT */}
          {user && user.role === 'student' && (
            <>
              {existingBooking ? (
                // Show "Already Booked" if they have an active request
                <div style={{ width: '100%' }}>
                  <button disabled className="btn btn-outline" style={{ width: '100%', padding: '15px', marginBottom: '10px', cursor: 'not-allowed', background: '#f1f5f9', color: '#166534', border: '1px solid #bbf7d0' }}>
                    <FaCheckCircle style={{ marginRight: '8px' }}/> Already Booked
                  </button>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                    Status: <strong>{existingBooking.status}</strong>
                  </p>
                </div>
              ) : property.status === 'Available' ? (
                <button onClick={() => setShowForm(true)} className="btn btn-primary" style={{ width: '100%', padding: '15px', marginBottom: '10px' }}>
                  Request Booking
                </button>
              ) : (
                <button disabled className="btn btn-outline" style={{ width: '100%', padding: '15px', marginBottom: '10px', cursor: 'not-allowed' }}>
                  Currently Occupied
                </button>
              )}
            </>
          )}

          {/* 2. If user is a GUEST (Not logged in) */}
          {!user && (
            <Link to="/login">
              <button className="btn btn-primary" style={{ width: '100%', padding: '15px', marginBottom: '10px' }}>
                Login to Book
              </button>
            </Link>
          )}

          {/* 3. If user is a LANDLORD or ADMIN */}
          {user && (user.role === 'landlord' || user.role === 'admin') && (
            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '10px' }}>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                You are logged in as a <strong>{user.role}</strong>. Booking is only available for students.
              </p>
            </div>
          )}

          {/* CONTACT LANDLORD BUTTON */}
          {user && user.role !== 'landlord' && (
            <Link to={`/messages/${property.landlord_id}`}>
              <button className="btn btn-outline" style={{ width: '100%', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <FaCommentDots /> Contact Landlord
              </button>
            </Link>
          )}

        </div>
      </div>

      {/* BOOKING FORM MODAL */}
      {showForm && user && user.role === 'student' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '500px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            
            <button onClick={() => setShowForm(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>
              <FaTimes />
            </button>
            
            <h2 style={{ marginBottom: '5px' }}>Complete Booking Request</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.9rem' }}>Provide your details for the landlord to review.</p>

            <form onSubmit={submitBooking}>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="student_name" 
                  value={formData.student_name} 
                  onChange={handleChange} 
                  required 
                  style={{ background: '#f8fafc' }}
                />
              </div>
              
              <div className="form-group">
                <label>Student Number</label>
                <input 
                  type="text" 
                  name="student_number" 
                  value={formData.student_number}
                  onChange={handleChange} 
                  required 
                  placeholder="e.g. 90100234" 
                  style={{ background: '#f8fafc', color: '#64748b' }} 
                  readOnly 
                />
              </div>

              <div className="form-group">
                <label>Preferred Move-in Date</label>
                <input type="date" name="move_in_date" onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Duration of Stay</label>
                <select name="duration" value={formData.duration} onChange={handleChange}>
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                  <option value="12 Months">12 Months (1 Year)</option>
                  <option value="24 Months">24 Months (2 Years)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Message to Landlord (Optional)</label>
                <textarea name="message" rows="3" placeholder="e.g. I am a quiet student..." onChange={handleChange}></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', marginTop: '10px' }}>
                Submit Request to Landlord
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;