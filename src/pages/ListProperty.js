import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaArrowLeft } from 'react-icons/fa';

const ListProperty = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    location: 'Maseru',
    price: '',
    type: 'Room',
    bedrooms: 1,
    image_url: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Send to backend (along with the landlord's ID)
    axios.post('https://stayfind-backend-etba.onrender.com/api/properties', {
      ...formData,
      landlord_id: user.id 
    })
    .then(() => {
      alert('✅ Property successfully listed and is now live!');
      navigate('/landlord-dashboard');
    })
    .catch(err => {
      alert('❌ Failed to list property. ' + (err.response?.data?.error || ''));
    })
    .finally(() => setLoading(false));
  };

  return (
    <div className="full-screen-page">
      
      {/* LEFT SIDE: Image */}
      <div className="full-screen-left" style={{ 
        flex: '1', 
        backgroundImage: 'url("https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop")', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.7)' }}></div>
        
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '40px', color: 'white' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px', fontWeight: '800' }}>List Your Property.</h1>
          <p style={{ fontSize: '1.2rem', color: '#e2e8f0', maxWidth: '400px' }}>
            Join Lesotho's most trusted accommodation platform and reach thousands of students today.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Form */}
      <div style={{ 
        flex: '1', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'white',
        padding: '40px',
        position: 'relative',
        overflowY: 'auto' // Allows scrolling if the form is too long
      }}>
        
        {/* BACK BUTTON */}
        <Link to="/landlord-dashboard" style={{ 
          position: 'absolute', top: '30px', left: '30px', 
          display: 'flex', alignItems: 'center', gap: '8px', 
          color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '600' 
        }}>
          <FaArrowLeft /> Back to Dashboard
        </Link>

        <div style={{ width: '100%', maxWidth: '500px', marginTop: '40px' }}>
          
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '10px' }}>List a New Property</h2>
            <p style={{ color: 'var(--text-muted)' }}>Fill in the details below to publish your listing.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Property Title</label>
              <input type="text" name="title" required placeholder="e.g. Modern Room near NUL" onChange={handleChange} />
            </div>
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Location</label>
                <select name="location" onChange={handleChange} required>
                  <option value="Maseru">Maseru</option>
                  <option value="Roma">Roma</option>
                  <option value="Mafeteng">Mafeteng</option>
                  <option value="Leribe">Leribe</option>
                </select>
              </div>
              
              <div className="form-group" style={{ flex: 1 }}>
                <label>Property Type</label>
                <select name="type" onChange={handleChange} required>
                  <option value="Room">Room</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Monthly Rent (M)</label>
                <input type="number" name="price" required placeholder="e.g. 800" onChange={handleChange} />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label>Bedrooms</label>
                <input type="number" name="bedrooms" required placeholder="1" onChange={handleChange} min="1" />
              </div>
            </div>

            <div className="form-group">
              <label>Image URL</label>
              <input type="url" name="image_url" required placeholder="https://images.unsplash.com/..." onChange={handleChange} />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '5px' }}>Paste a link to a photo of the property.</p>
            </div>

            <button type="submit" className="btn btn-accent" style={{ width: '100%', padding: '15px', fontSize: '1.1rem', marginTop: '10px' }} disabled={loading}>
              {loading ? 'Publishing...' : 'Submit Listing'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default ListProperty;