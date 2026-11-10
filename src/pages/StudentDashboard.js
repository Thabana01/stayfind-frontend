import React, { useState, useEffect, useContext, useMemo } from 'react';
import axios from 'axios';
import { generateRecommendations } from '../utils/aiEngine';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaMapMarkerAlt, FaBed, FaInfoCircle, FaCreditCard, FaCommentDots, FaTimes, FaCheckCircle } from 'react-icons/fa';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  
  const [bookings, setBookings] = useState([]);
  const [availableProperties, setAvailableProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [prefs, setPrefs] = useState({ budget: 1000, preferredArea: 'Roma', preferredType: 'Room' });

  // PAYMENT MODAL STATES
  const [payingBooking, setPayingBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('M-Pesa (Vodacom)');
  const [receipt, setReceipt] = useState(null);

  const fetchBookings = () => {
    if (!user) return;
    axios.get(`https://stayfind-backend-etba.onrender.com/api/bookings/student/${user.id}`)
      .then(res => setBookings(res.data))
      .catch(err => console.error("Bookings fetch failed:", err));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!user) return;
    fetchBookings();
    axios.get('https://stayfind-backend-etba.onrender.com/api/properties')
      .then(res => {
        setAvailableProperties(res.data);
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, [user]);

  const recommendations = useMemo(() => {
    if (!availableProperties || availableProperties.length === 0) return [];
    return generateRecommendations(prefs, availableProperties);
  }, [availableProperties, prefs]);

  // Process the payment from the modal
  const processPayment = (e) => {
    e.preventDefault();
    axios.post(`https://stayfind-backend-etba.onrender.com/api/bookings/pay/${payingBooking.id}`, {
      payment_method: paymentMethod,
      amount: payingBooking.price
    })
    .then(res => {
      setReceipt({
        reference: res.data.reference,
        amount: payingBooking.price,
        method: paymentMethod,
        title: payingBooking.title,
        date: new Date().toLocaleString()
      });
      setPayingBooking(null); // Close payment form
      fetchBookings(); // Refresh list to show PAID status
    })
    .catch(() => alert('❌ Payment failed'));
  };

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading Dashboard...</h2>;

  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'Confirmed').length;
  const paidCount = bookings.filter(b => b.status === 'Paid').length;

  return (
    <div>
      {/* WELCOME */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0 }}>Welcome back, {user.name}</h1> 
          <p style={{ margin: '5px 0 0 0' }}>Verification Status: <span className="badge badge-green">Verified</span></p>
        </div>
      </div>

      {/* TOP SECTION */}
      <div className="dashboard-layout" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginBottom: '40px' }}>
        
        {/* LEFT COLUMN: Stats & Bookings */}
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px' }}>
            <div className="stat-card"><h2>0</h2><p>Saved</p></div>
            <div className="stat-card"><h2>{pendingCount}</h2><p>Pending</p></div>
            <div className="stat-card"><h2>{confirmedCount + paidCount}</h2><p>Confirmed</p></div>
          </div>

          <div className="card">
            <h2>My Booking Requests</h2>
            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <h3 style={{ color: 'var(--text-muted)' }}>You have no bookings yet.</h3>
                <p style={{ marginTop: '10px' }}>
                  Go to <Link to="/search" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Find Accommodation</Link> to find your perfect student home.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                {bookings.map(b => (
                  <div key={b.id} style={{ display: 'flex', flexDirection: 'column', background: '#f8fafc', padding: '15px 20px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: 0, color: 'var(--text-main)' }}>{b.title}</h4>
                        <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          📍 {b.location} | M{b.price} / month
                        </p>
                      </div>
                      <span className={`badge ${
                        b.status === 'Confirmed' || b.status === 'Paid' ? 'badge-green' : 'badge-yellow'
                      }`} style={{ fontSize: '0.9rem', padding: '6px 12px' }}>
                        {b.status.toUpperCase()}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px', alignItems: 'center' }}>
                      
                      {/* PAY NOW: ONLY shows if the status is Confirmed (waiting for payment) */}
                      {b.status === 'Confirmed' && (
                        <button onClick={() => setPayingBooking(b)} className="btn btn-primary" style={{ padding: '8px 15px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <FaCreditCard /> Pay Now (M{b.price})
                        </button>
                      )}
                      
                      {/* MESSAGE LANDLORD: Shows for Confirmed OR Paid */}
                      {(b.status === 'Confirmed' || b.status === 'Paid') && (
                        <Link to={`/messages/${b.landlord_id || 3}`}>
                          <button className="btn btn-outline" style={{ padding: '8px 15px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <FaCommentDots /> Message Landlord
                          </button>
                        </Link>
                      )}

                      {/* PENDING STATE */}
                      {b.status === 'Pending' && (
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          Waiting for landlord to accept the booking...
                        </p>
                      )}

                      {/* PAID STATE (Receipt indicator) */}
                      {b.status === 'Paid' && (
                        <span style={{ fontSize: '0.85rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
                          <FaCheckCircle /> Payment Complete
                        </span>
                      )}

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: AI Preferences */}
        <div>
          <div className="card" style={{ background: '#e0f2fe', border: '1px solid #bae6fd', height: 'fit-content' }}>
            <h3>AI Preferences</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Max Budget (M)</label>
                <input type="number" value={prefs.budget} onChange={(e) => setPrefs({...prefs, budget: parseInt(e.target.value) || 0})} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Preferred Area</label>
                <select value={prefs.preferredArea} onChange={(e) => setPrefs({...prefs, preferredArea: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }}>
                  <option value="Maseru">Maseru</option>
                  <option value="Roma">Roma</option>
                  <option value="Mafeteng">Mafeteng</option>
                  <option value="Leribe">Leribe</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Property Type</label>
                <select value={prefs.preferredType} onChange={(e) => setPrefs({...prefs, preferredType: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }}>
                  <option value="Room">Room</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: AI Recommendations */}
      <div>
        <h2 style={{ marginBottom: '20px' }}>Your AI Recommendations</h2>
        {recommendations.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {recommendations.map(rec => (
              <div key={rec.id} className="card" style={{ border: '2px solid var(--accent)', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>{rec.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 10px 0' }}>
                  <FaMapMarkerAlt /> {rec.location} | <FaBed /> {rec.bedrooms} Beds
                </p>
                <p className="price" style={{ margin: '0 0 15px 0', fontSize: '1.3rem' }}>M{rec.price} / month</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--accent)', background: '#f0fdfa', padding: '10px', borderRadius: '5px', margin: '0 0 15px 0', flex: 1 }}>
                  💡 {rec.aiReasons.join(' and ')}.
                </p>
                <Link to={`/property/${rec.id}`}>
                  <button className="btn btn-outline" style={{ width: '100%', padding: '10px' }}>View Property</button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <FaInfoCircle style={{ fontSize: '2rem', color: 'var(--text-muted)', marginBottom: '15px' }} />
            <h3 style={{ color: 'var(--text-main)', marginBottom: '10px' }}>No properties match these filters</h3>
            <p style={{ color: 'var(--text-muted)' }}>We couldn't find a <strong>{prefs.preferredType}</strong> in <strong>{prefs.preferredArea}</strong> under <strong>M{prefs.budget}</strong>.</p>
          </div>
        )}
      </div>

      {/* PAYMENT MODAL */}
      {payingBooking && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '450px', position: 'relative' }}>
            <button onClick={() => setPayingBooking(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}><FaTimes /></button>
            <h2 style={{ marginBottom: '5px' }}>Complete Payment</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Paying for: <strong>{payingBooking.title}</strong></p>
            
            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Monthly Rent</span>
                <span>M{payingBooking.price}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Service Fee</span>
                <span>M0.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ccc', paddingTop: '10px', marginTop: '10px', fontWeight: 'bold' }}>
                <span>Total Amount</span>
                <span>M{payingBooking.price}</span>
              </div>
            </div>

            <form onSubmit={processPayment}>
              <div className="form-group">
                <label>Select Payment Method</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={{ padding: '12px' }}>
                  <option value="M-Pesa (Vodacom)">M-Pesa (Vodacom)</option>
                  <option value="EcoCash (Econet)">EcoCash (Econet)</option>
                  <option value="Credit/Debit Card">Credit/Debit Card</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Phone Number / Card Number</label>
                <input type="text" required placeholder={paymentMethod.includes('Card') ? "1234 5678 9012 3456" : "+266 5000 0000"} />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', marginTop: '10px' }}>
                Confirm Payment of M{payingBooking.price}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* RECEIPT MODAL */}
      {receipt && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '450px', position: 'relative', textAlign: 'center' }}>
            <button onClick={() => setReceipt(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}><FaTimes /></button>
            
            <div style={{ background: '#dcfce7', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <FaCheckCircle size={50} color="#16a34a" />
            </div>
            
            <h2 style={{ color: '#16a34a', marginBottom: '5px' }}>Payment Successful!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '25px' }}>Your booking is now fully confirmed.</p>
            
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px dashed #ccc', textAlign: 'left', marginBottom: '20px' }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#666' }}><strong>Transaction Receipt</strong></p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.9rem' }}><span>Property:</span> <strong>{receipt.title}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.9rem' }}><span>Amount:</span> <strong>M{receipt.amount}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.9rem' }}><span>Method:</span> <strong>{receipt.method}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.9rem' }}><span>Date:</span> <strong>{receipt.date}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #ccc', fontSize: '0.9rem' }}><span>Receipt Ref:</span> <strong style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>{receipt.reference}</strong></div>
            </div>

            <button onClick={() => setReceipt(null)} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentDashboard;